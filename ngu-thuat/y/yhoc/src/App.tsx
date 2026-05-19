import React, { useState, useCallback } from 'react';
import { interpretYhocAnswers, getQuestionLabel, type YhocAnswers } from './engine/yhocEngine';
import { QUESTIONS } from './data/yhoc/questions';
import { GLOSSARY } from './data/yhoc/glossary';
import { YHOC_FOUNDATIONS } from './data/yhoc/foundations';
import { SAFETY_WARNINGS } from './data/yhoc/safety';
import type { Question, GlossaryTerm, FoundationItem } from './data/yhoc/types';

type Screen = 'hero' | 'safety' | 'form' | 'result' | 'learn';

const FORM_QUESTIONS = QUESTIONS.filter((q) => q.id !== 'q_red_flags');

const GROUP_ORDER = ['general', 'sleep', 'energy', 'hot_cold', 'thirst', 'digestion', 'urination', 'body_feeling', 'emotion', 'pain', 'lifestyle', 'tongue'];
const GROUP_LABELS: Record<string, string> = {
  general: 'Thông tin chung',
  sleep: 'Giấc ngủ',
  energy: 'Năng lượng',
  hot_cold: 'Cảm giác hàn/nhiệt',
  thirst: 'Miệng & nước uống',
  digestion: 'Tiêu hóa',
  urination: 'Tiểu tiện',
  body_feeling: 'Cảm giác cơ thể',
  emotion: 'Tâm trạng',
  pain: 'Đau / căng tức',
  lifestyle: 'Sinh hoạt',
  tongue: 'Quan sát lưỡi',
};

const CONFIDENCE_LABEL: Record<string, string> = {
  low: 'Dữ liệu còn ít — kết quả mang tính gợi ý sơ bộ',
  medium: 'Dữ liệu vừa đủ — gợi ý có cơ sở nhưng chưa chắc chắn',
  fair: 'Dữ liệu khá đủ — gợi ý có độ tin cậy vừa phải',
};

function QuestionItem({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: YhocAnswers[string];
  onChange: (id: string, val: YhocAnswers[string]) => void;
}) {
  if (question.type === 'single') {
    return (
      <div className="q-item">
        <div className="q-label">{question.label}</div>
        {question.helperText && <div className="q-helper">{question.helperText}</div>}
        <div className="q-options">
          {question.options?.map((opt) => (
            <button
              key={opt.id}
              className={`q-opt${value === opt.value ? ' selected' : ''}`}
              onClick={() => onChange(question.id, opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === 'multiple') {
    const arr = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="q-item">
        <div className="q-label">{question.label}</div>
        {question.helperText && <div className="q-helper">{question.helperText}</div>}
        <div className="q-options">
          {question.options?.map((opt) => {
            const checked = arr.includes(String(opt.value));
            return (
              <button
                key={opt.id}
                className={`q-opt${checked ? ' selected' : ''}`}
                onClick={() => {
                  const v = String(opt.value);
                  const next = checked ? arr.filter((x) => x !== v) : [...arr, v];
                  onChange(question.id, next);
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (question.type === 'scale') {
    const num = typeof value === 'number' ? value : question.min ?? 0;
    return (
      <div className="q-item">
        <div className="q-label">{question.label}</div>
        <div className="q-scale-row">
          <span className="q-scale-min">{question.min}</span>
          <input
            type="range"
            min={question.min}
            max={question.max}
            step={question.step ?? 1}
            value={num}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(question.id, parseFloat(e.target.value))}
            className="q-range"
          />
          <span className="q-scale-max">{question.max}</span>
          <span className="q-scale-val">{num}</span>
        </div>
        {question.allowSkip && (
          <button className="q-skip" onClick={() => onChange(question.id, null)}>
            Bỏ qua câu này
          </button>
        )}
      </div>
    );
  }

  return null;
}

function HeroScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="screen hero-screen">
      <div className="hero-badge">Y</div>
      <h1 className="hero-title">Y học cổ học tham khảo</h1>
      <p className="hero-lead">
        Tự quan sát xu hướng thể trạng theo ngôn ngữ y học cổ truyền.<br />
        <strong>Không chẩn đoán. Không kê đơn. Không liều lượng.</strong>
      </p>
      <div className="hero-note">
        <p>App hỏi bạn một số dấu hiệu tự quan sát (ngủ, ăn, cảm giác nóng/lạnh, lưỡi…) rồi gợi ý xu hướng thể trạng theo khung cổ học để bạn tham khảo và tự học.</p>
        <p>Kết quả <strong>chỉ mang tính tham khảo</strong>, không thay thế thăm khám và tư vấn bác sĩ.</p>
      </div>
      <button className="btn-primary" onClick={onNext}>Bắt đầu →</button>
    </div>
  );
}

function SafetyScreen({ onNext, onBack }: { onNext: (hasFlag: boolean, selected: string[]) => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (id === 'none') { setSelected(['none']); return; }
    setSelected((prev: string[]) => {
      const without = prev.filter((x: string) => x !== 'none');
      return without.includes(id) ? without.filter((x: string) => x !== id) : [...without, id];
    });
  };

  const proceed = () => {
    const hasFlag = selected.length > 0 && !selected.includes('none');
    onNext(hasFlag, selected);
  };

  return (
    <div className="screen safety-screen">
      <button className="back-btn" onClick={onBack}>← Quay lại</button>
      <h2 className="section-title">Kiểm tra an toàn trước</h2>
      <p className="safety-intro">
        Nếu bạn đang có bất kỳ dấu hiệu nào dưới đây, <strong>ưu tiên đi khám hoặc gọi cấp cứu</strong> — app không thể xử lý tình huống y tế cấp bách.
      </p>
      <div className="safety-list">
        {SAFETY_WARNINGS.map((w) => (
          <button
            key={w.id}
            className={`safety-item${selected.includes(w.id) ? ' selected' : ''} sev-${w.severity}`}
            onClick={() => toggle(w.id)}
          >
            <span className="safety-label">{w.label}</span>
            {selected.includes(w.id) && <span className="safety-msg">{w.message}</span>}
          </button>
        ))}
        <button
          className={`safety-item${selected.includes('none') ? ' selected' : ''}`}
          onClick={() => toggle('none')}
        >
          <span className="safety-label">Không có dấu hiệu nào ở trên</span>
        </button>
      </div>
      <button
        className="btn-primary"
        onClick={proceed}
        disabled={selected.length === 0}
      >
        Tiếp tục →
      </button>
    </div>
  );
}

function FormScreen({ onSubmit, onBack }: { onSubmit: (answers: YhocAnswers) => void; onBack: () => void }) {
  const [answers, setAnswers] = useState<YhocAnswers>({});
  const [activeGroup, setActiveGroup] = useState(GROUP_ORDER[0]);

  const handleChange = useCallback((id: string, val: YhocAnswers[string]) => {
    setAnswers((prev: YhocAnswers) => ({ ...prev, [id]: val }));
  }, []);

  const groups = GROUP_ORDER.filter((g) =>
    FORM_QUESTIONS.some((q) => q.group === g)
  );

  const currentGroupQs = FORM_QUESTIONS.filter((q) => q.group === activeGroup);
  const currentIndex = groups.indexOf(activeGroup);
  const isLast = currentIndex === groups.length - 1;

  const answeredInGroup = currentGroupQs.filter((q) => {
    const v = answers[q.id];
    return v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0);
  }).length;

  const next = () => {
    if (isLast) { onSubmit(answers); return; }
    setActiveGroup(groups[currentIndex + 1]);
    window.scrollTo(0, 0);
  };

  const prev = () => {
    if (currentIndex === 0) { onBack(); return; }
    setActiveGroup(groups[currentIndex - 1]);
    window.scrollTo(0, 0);
  };

  return (
    <div className="screen form-screen">
      <div className="form-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((currentIndex + 1) / groups.length) * 100}%` }} />
        </div>
        <span className="progress-label">{currentIndex + 1} / {groups.length}</span>
      </div>

      <div className="group-tabs">
        {groups.map((g, i) => (
          <button
            key={g}
            className={`group-tab${activeGroup === g ? ' active' : ''}${i < currentIndex ? ' done' : ''}`}
            onClick={() => setActiveGroup(g)}
          >
            {i < currentIndex ? '✓' : GROUP_LABELS[g] ?? g}
          </button>
        ))}
      </div>

      <h2 className="group-title">{GROUP_LABELS[activeGroup] ?? activeGroup}</h2>
      <p className="group-answered">{answeredInGroup}/{currentGroupQs.length} câu đã trả lời</p>

      <div className="questions-list">
        {currentGroupQs.map((q) => (
          <QuestionItem key={q.id} question={q} value={answers[q.id]} onChange={handleChange} />
        ))}
      </div>

      <div className="form-nav">
        <button className="btn-secondary" onClick={prev}>← Trước</button>
        <button className="btn-primary" onClick={next}>
          {isLast ? 'Xem kết quả →' : 'Tiếp →'}
        </button>
      </div>

      <p className="form-note">Tất cả câu hỏi đều có thể bỏ qua. App chỉ tham khảo dữ liệu bạn cung cấp.</p>
    </div>
  );
}

function ResultScreen({ answers, onReset, onLearn }: {
  answers: YhocAnswers;
  onReset: () => void;
  onLearn: () => void;
}) {
  const result = interpretYhocAnswers(answers);

  if (result.emergencyFirst) {
    return (
      <div className="screen result-screen">
        <div className="emergency-box">
          <div className="emergency-icon">⚠️</div>
          <h2>Ưu tiên an toàn y tế</h2>
          <p>Bạn có dấu hiệu cần được thăm khám hoặc xử lý y tế. App không luận giải cổ học trong trường hợp này.</p>
          <ul className="emergency-list">
            {result.safetyWarnings.map((w) => (
              <li key={w.id}>
                <strong>{w.label}</strong><br />
                <span>{w.action}</span>
              </li>
            ))}
          </ul>
          {result.generalCautions.map((c, i) => <p key={i} className="caution-line">{c}</p>)}
        </div>
        <button className="btn-secondary" onClick={onReset}>Làm lại từ đầu</button>
      </div>
    );
  }

  return (
    <div className="screen result-screen">
      <h2 className="section-title">Kết quả tham khảo</h2>

      <div className="disclaimer-bar">
        Kết quả chỉ mang tính tham khảo — không thay thế bác sĩ. App không đưa thuốc, phương tễ hoặc liều lượng.
      </div>

      {result.topPatterns.length === 0 && (
        <div className="no-pattern-box">
          <p>Dữ liệu hiện chưa đủ để gợi ý xu hướng thể trạng rõ ràng. Bạn có thể bổ sung thêm dữ liệu tự quan sát.</p>
        </div>
      )}

      {result.topPatterns.map((item, i) => (
        <div key={item.pattern.id} className={`pattern-card rank-${i}`}>
          <div className="pattern-header">
            <span className="pattern-rank">#{i + 1}</span>
            <span className="pattern-name">{item.pattern.name}</span>
            <span className="pattern-cat">{item.pattern.classicalCategory}</span>
          </div>
          <div className="confidence-badge conf-{item.confidence}">
            {CONFIDENCE_LABEL[item.confidence]}
          </div>
          <p className="pattern-wording">{item.wording}</p>
          <div className="pattern-signs">
            <strong>Dấu hiệu điển hình trong cổ học:</strong>
            <ul>{item.pattern.signs.slice(0, 5).map((s, j) => <li key={j}>{s}</li>)}
            </ul>
          </div>
          {item.pattern.supportiveCare.length > 0 && (
            <div className="pattern-care">
              <strong>Dưỡng sinh tham khảo (không phải điều trị):</strong>
              <ul>{item.pattern.supportiveCare.map((c, j) => <li key={j}>{c}</li>)}</ul>
            </div>
          )}
          {item.pattern.cautions.length > 0 && (
            <div className="pattern-caution">
              <strong>Lưu ý:</strong>
              <ul>{item.pattern.cautions.map((c, j) => <li key={j}>{c}</li>)}</ul>
            </div>
          )}
        </div>
      ))}

      {result.contradictions.length > 0 && (
        <div className="contradiction-box">
          <strong>Dữ liệu có mâu thuẫn:</strong>
          <ul>{result.contradictions.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </div>
      )}

      {result.missingQuestionIds.length > 0 && (
        <div className="missing-box">
          <strong>Dữ liệu còn thiếu để gợi ý chính xác hơn:</strong>
          <ul>{result.missingQuestionIds.map((id) => <li key={id}>{getQuestionLabel(id)}</li>)}</ul>
        </div>
      )}

      <div className="general-cautions">
        {result.generalCautions.map((c, i) => (
          <p key={i} className="caution-line">⚠ {c}</p>
        ))}
      </div>

      <div className="result-actions">
        <button className="btn-secondary" onClick={onReset}>Làm lại</button>
        <button className="btn-primary" onClick={onLearn}>Tự học / Glossary →</button>
      </div>
    </div>
  );
}

function LearnScreen({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<'glossary' | 'foundations'>('glossary');
  const [search, setSearch] = useState('');

  const filteredGlossary = (GLOSSARY as GlossaryTerm[]).filter((t: GlossaryTerm) =>
    !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.plain.toLowerCase().includes(search.toLowerCase())
  );

  const foundations = Object.values(YHOC_FOUNDATIONS) as unknown as FoundationItem[];
  const filteredFound = foundations.filter((f: FoundationItem) =>
    !search || (f.title ?? '').toLowerCase().includes(search.toLowerCase()) || (f.summary ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="screen learn-screen">
      <button className="back-btn" onClick={onBack}>← Quay lại</button>
      <h2 className="section-title">Tự học & Glossary</h2>
      <p className="learn-note">
        Nội dung mang tính giáo dục tham khảo theo khung cổ học. Không dùng để tự chẩn đoán hoặc điều trị.
      </p>

      <div className="tab-row">
        <button className={`tab-btn${tab === 'glossary' ? ' active' : ''}`} onClick={() => setTab('glossary')}>Thuật ngữ</button>
        <button className={`tab-btn${tab === 'foundations' ? ' active' : ''}`} onClick={() => setTab('foundations')}>Nền tảng</button>
      </div>

      <input
        className="search-input"
        type="search"
        placeholder="Tìm kiếm..."
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
      />

      {tab === 'glossary' && (
        <div className="glossary-list">
          {filteredGlossary.map((t: GlossaryTerm) => (
            <div key={t.id} className="glossary-item">
              <div className="glos-term">{t.term}</div>
              <div className="glos-short">{t.short}</div>
              <div className="glos-plain">{t.plain}</div>
              {t.appExample && <div className="glos-example">Ví dụ trong app: {t.appExample}</div>}
              <div className="glos-caution">⚠ {t.caution}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'foundations' && (
        <div className="found-list">
          {filteredFound.map((f: FoundationItem) => (
            <div key={f.id} className="found-item">
              <div className="found-title">{f.title}</div>
              <div className="found-summary">{f.summary}</div>
              {f.appUse.length > 0 && (
                <div className="found-use">
                  <strong>Ứng dụng trong app:</strong>
                  <ul>{f.appUse.map((u, i) => <li key={i}>{u}</li>)}</ul>
                </div>
              )}
              <div className="found-caution">
                <strong>Wording an toàn:</strong>
                <ul>{f.safeWording.map((w, i) => <li key={i}>{w}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('hero');
  const [answers, setAnswers] = useState<YhocAnswers>({});

  const goHero = () => { setScreen('hero'); setAnswers({}); };
  const goSafety = () => setScreen('safety');
  const goForm = () => setScreen('form');
  const goLearn = () => setScreen('learn');

  const handleSafety = (hasFlag: boolean, selected: string[]) => {
    const merged: YhocAnswers = { ...answers, q_red_flags: selected };
    if (hasFlag) {
      setAnswers(merged);
      setScreen('result');
    } else {
      setAnswers(merged);
      goForm();
    }
  };

  const handleSubmit = (formAnswers: YhocAnswers) => {
    setAnswers((prev: YhocAnswers) => ({ ...prev, ...formAnswers }));
    setScreen('result');
  };

  return (
    <div className="yhoc-app">
      <header className="app-header">
        <a href="/nguthuat" className="header-back">☯ Ngũ thuật</a>
        <span className="header-title">Y – Cổ học tham khảo</span>
      </header>

      {screen === 'hero' && <HeroScreen onNext={goSafety} />}
      {screen === 'safety' && <SafetyScreen onNext={handleSafety} onBack={goHero} />}
      {screen === 'form' && <FormScreen onSubmit={handleSubmit} onBack={goSafety} />}
      {screen === 'result' && <ResultScreen answers={answers} onReset={goHero} onLearn={goLearn} />}
      {screen === 'learn' && <LearnScreen onBack={() => setScreen(answers && Object.keys(answers).length > 0 ? 'result' : 'hero')} />}

      <footer className="app-footer">
        <span>Chỉ mang tính tham khảo – không thay thế bác sĩ – nên đi khám nếu có dấu hiệu bất thường.</span>
      </footer>
    </div>
  );
}
