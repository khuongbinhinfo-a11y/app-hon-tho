import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { interpretYhocAnswers, getQuestionLabel } from './engine/yhocEngine';
import { QUESTIONS } from './data/yhoc/questions';
import { GLOSSARY } from './data/yhoc/glossary';
import { YHOC_FOUNDATIONS } from './data/yhoc/foundations';
import { SAFETY_WARNINGS } from './data/yhoc/safety';
const FORM_QUESTIONS = QUESTIONS.filter((q) => q.id !== 'q_red_flags');
const GROUP_ORDER = ['general', 'sleep', 'energy', 'hot_cold', 'thirst', 'digestion', 'urination', 'body_feeling', 'emotion', 'pain', 'lifestyle', 'tongue'];
const GROUP_LABELS = {
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
const CONFIDENCE_LABEL = {
    low: 'Dữ liệu còn ít — kết quả mang tính gợi ý sơ bộ',
    medium: 'Dữ liệu vừa đủ — gợi ý có cơ sở nhưng chưa chắc chắn',
    fair: 'Dữ liệu khá đủ — gợi ý có độ tin cậy vừa phải',
};
function QuestionItem({ question, value, onChange, }) {
    if (question.type === 'single') {
        return (_jsxs("div", { className: "q-item", children: [_jsx("div", { className: "q-label", children: question.label }), question.helperText && _jsx("div", { className: "q-helper", children: question.helperText }), _jsx("div", { className: "q-options", children: question.options?.map((opt) => (_jsx("button", { className: `q-opt${value === opt.value ? ' selected' : ''}`, onClick: () => onChange(question.id, opt.value), children: opt.label }, opt.id))) })] }));
    }
    if (question.type === 'multiple') {
        const arr = Array.isArray(value) ? value : [];
        return (_jsxs("div", { className: "q-item", children: [_jsx("div", { className: "q-label", children: question.label }), question.helperText && _jsx("div", { className: "q-helper", children: question.helperText }), _jsx("div", { className: "q-options", children: question.options?.map((opt) => {
                        const checked = arr.includes(String(opt.value));
                        return (_jsx("button", { className: `q-opt${checked ? ' selected' : ''}`, onClick: () => {
                                const v = String(opt.value);
                                const next = checked ? arr.filter((x) => x !== v) : [...arr, v];
                                onChange(question.id, next);
                            }, children: opt.label }, opt.id));
                    }) })] }));
    }
    if (question.type === 'scale') {
        const num = typeof value === 'number' ? value : question.min ?? 0;
        return (_jsxs("div", { className: "q-item", children: [_jsx("div", { className: "q-label", children: question.label }), _jsxs("div", { className: "q-scale-row", children: [_jsx("span", { className: "q-scale-min", children: question.min }), _jsx("input", { type: "range", min: question.min, max: question.max, step: question.step ?? 1, value: num, onChange: (e) => onChange(question.id, parseFloat(e.target.value)), className: "q-range" }), _jsx("span", { className: "q-scale-max", children: question.max }), _jsx("span", { className: "q-scale-val", children: num })] }), question.allowSkip && (_jsx("button", { className: "q-skip", onClick: () => onChange(question.id, null), children: "B\u1ECF qua c\u00E2u n\u00E0y" }))] }));
    }
    return null;
}
function HeroScreen({ onNext }) {
    return (_jsxs("div", { className: "screen hero-screen", children: [_jsx("div", { className: "hero-badge", children: "Y" }), _jsx("h1", { className: "hero-title", children: "Y h\u1ECDc c\u1ED5 h\u1ECDc tham kh\u1EA3o" }), _jsxs("p", { className: "hero-lead", children: ["T\u1EF1 quan s\u00E1t xu h\u01B0\u1EDBng th\u1EC3 tr\u1EA1ng theo ng\u00F4n ng\u1EEF y h\u1ECDc c\u1ED5 truy\u1EC1n.", _jsx("br", {}), _jsx("strong", { children: "Kh\u00F4ng ch\u1EA9n \u0111o\u00E1n. Kh\u00F4ng k\u00EA \u0111\u01A1n. Kh\u00F4ng li\u1EC1u l\u01B0\u1EE3ng." })] }), _jsxs("div", { className: "hero-note", children: [_jsx("p", { children: "App h\u1ECFi b\u1EA1n m\u1ED9t s\u1ED1 d\u1EA5u hi\u1EC7u t\u1EF1 quan s\u00E1t (ng\u1EE7, \u0103n, c\u1EA3m gi\u00E1c n\u00F3ng/l\u1EA1nh, l\u01B0\u1EE1i\u2026) r\u1ED3i g\u1EE3i \u00FD xu h\u01B0\u1EDBng th\u1EC3 tr\u1EA1ng theo khung c\u1ED5 h\u1ECDc \u0111\u1EC3 b\u1EA1n tham kh\u1EA3o v\u00E0 t\u1EF1 h\u1ECDc." }), _jsxs("p", { children: ["K\u1EBFt qu\u1EA3 ", _jsx("strong", { children: "ch\u1EC9 mang t\u00EDnh tham kh\u1EA3o" }), ", kh\u00F4ng thay th\u1EBF th\u0103m kh\u00E1m v\u00E0 t\u01B0 v\u1EA5n b\u00E1c s\u0129."] })] }), _jsx("button", { className: "btn-primary", onClick: onNext, children: "B\u1EAFt \u0111\u1EA7u \u2192" })] }));
}
function SafetyScreen({ onNext, onBack }) {
    const [selected, setSelected] = useState([]);
    const toggle = (id) => {
        if (id === 'none') {
            setSelected(['none']);
            return;
        }
        setSelected((prev) => {
            const without = prev.filter((x) => x !== 'none');
            return without.includes(id) ? without.filter((x) => x !== id) : [...without, id];
        });
    };
    const proceed = () => {
        const hasFlag = selected.length > 0 && !selected.includes('none');
        onNext(hasFlag, selected);
    };
    return (_jsxs("div", { className: "screen safety-screen", children: [_jsx("button", { className: "back-btn", onClick: onBack, children: "\u2190 Quay l\u1EA1i" }), _jsx("h2", { className: "section-title", children: "Ki\u1EC3m tra an to\u00E0n tr\u01B0\u1EDBc" }), _jsxs("p", { className: "safety-intro", children: ["N\u1EBFu b\u1EA1n \u0111ang c\u00F3 b\u1EA5t k\u1EF3 d\u1EA5u hi\u1EC7u n\u00E0o d\u01B0\u1EDBi \u0111\u00E2y, ", _jsx("strong", { children: "\u01B0u ti\u00EAn \u0111i kh\u00E1m ho\u1EB7c g\u1ECDi c\u1EA5p c\u1EE9u" }), " \u2014 app kh\u00F4ng th\u1EC3 x\u1EED l\u00FD t\u00ECnh hu\u1ED1ng y t\u1EBF c\u1EA5p b\u00E1ch."] }), _jsxs("div", { className: "safety-list", children: [SAFETY_WARNINGS.map((w) => (_jsxs("button", { className: `safety-item${selected.includes(w.id) ? ' selected' : ''} sev-${w.severity}`, onClick: () => toggle(w.id), children: [_jsx("span", { className: "safety-label", children: w.label }), selected.includes(w.id) && _jsx("span", { className: "safety-msg", children: w.message })] }, w.id))), _jsx("button", { className: `safety-item${selected.includes('none') ? ' selected' : ''}`, onClick: () => toggle('none'), children: _jsx("span", { className: "safety-label", children: "Kh\u00F4ng c\u00F3 d\u1EA5u hi\u1EC7u n\u00E0o \u1EDF tr\u00EAn" }) })] }), _jsx("button", { className: "btn-primary", onClick: proceed, disabled: selected.length === 0, children: "Ti\u1EBFp t\u1EE5c \u2192" })] }));
}
function FormScreen({ onSubmit, onBack }) {
    const [answers, setAnswers] = useState({});
    const [activeGroup, setActiveGroup] = useState(GROUP_ORDER[0]);
    const handleChange = useCallback((id, val) => {
        setAnswers((prev) => ({ ...prev, [id]: val }));
    }, []);
    const groups = GROUP_ORDER.filter((g) => FORM_QUESTIONS.some((q) => q.group === g));
    const currentGroupQs = FORM_QUESTIONS.filter((q) => q.group === activeGroup);
    const currentIndex = groups.indexOf(activeGroup);
    const isLast = currentIndex === groups.length - 1;
    const answeredInGroup = currentGroupQs.filter((q) => {
        const v = answers[q.id];
        return v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0);
    }).length;
    const next = () => {
        if (isLast) {
            onSubmit(answers);
            return;
        }
        setActiveGroup(groups[currentIndex + 1]);
        window.scrollTo(0, 0);
    };
    const prev = () => {
        if (currentIndex === 0) {
            onBack();
            return;
        }
        setActiveGroup(groups[currentIndex - 1]);
        window.scrollTo(0, 0);
    };
    return (_jsxs("div", { className: "screen form-screen", children: [_jsxs("div", { className: "form-progress", children: [_jsx("div", { className: "progress-bar", children: _jsx("div", { className: "progress-fill", style: { width: `${((currentIndex + 1) / groups.length) * 100}%` } }) }), _jsxs("span", { className: "progress-label", children: [currentIndex + 1, " / ", groups.length] })] }), _jsx("div", { className: "group-tabs", children: groups.map((g, i) => (_jsx("button", { className: `group-tab${activeGroup === g ? ' active' : ''}${i < currentIndex ? ' done' : ''}`, onClick: () => setActiveGroup(g), children: i < currentIndex ? '✓' : GROUP_LABELS[g] ?? g }, g))) }), _jsx("h2", { className: "group-title", children: GROUP_LABELS[activeGroup] ?? activeGroup }), _jsxs("p", { className: "group-answered", children: [answeredInGroup, "/", currentGroupQs.length, " c\u00E2u \u0111\u00E3 tr\u1EA3 l\u1EDDi"] }), _jsx("div", { className: "questions-list", children: currentGroupQs.map((q) => (_jsx(QuestionItem, { question: q, value: answers[q.id], onChange: handleChange }, q.id))) }), _jsxs("div", { className: "form-nav", children: [_jsx("button", { className: "btn-secondary", onClick: prev, children: "\u2190 Tr\u01B0\u1EDBc" }), _jsx("button", { className: "btn-primary", onClick: next, children: isLast ? 'Xem kết quả →' : 'Tiếp →' })] }), _jsx("p", { className: "form-note", children: "T\u1EA5t c\u1EA3 c\u00E2u h\u1ECFi \u0111\u1EC1u c\u00F3 th\u1EC3 b\u1ECF qua. App ch\u1EC9 tham kh\u1EA3o d\u1EEF li\u1EC7u b\u1EA1n cung c\u1EA5p." })] }));
}
function ResultScreen({ answers, onReset, onLearn }) {
    const result = interpretYhocAnswers(answers);
    if (result.emergencyFirst) {
        return (_jsxs("div", { className: "screen result-screen", children: [_jsxs("div", { className: "emergency-box", children: [_jsx("div", { className: "emergency-icon", children: "\u26A0\uFE0F" }), _jsx("h2", { children: "\u01AFu ti\u00EAn an to\u00E0n y t\u1EBF" }), _jsx("p", { children: "B\u1EA1n c\u00F3 d\u1EA5u hi\u1EC7u c\u1EA7n \u0111\u01B0\u1EE3c th\u0103m kh\u00E1m ho\u1EB7c x\u1EED l\u00FD y t\u1EBF. App kh\u00F4ng lu\u1EADn gi\u1EA3i c\u1ED5 h\u1ECDc trong tr\u01B0\u1EDDng h\u1EE3p n\u00E0y." }), _jsx("ul", { className: "emergency-list", children: result.safetyWarnings.map((w) => (_jsxs("li", { children: [_jsx("strong", { children: w.label }), _jsx("br", {}), _jsx("span", { children: w.action })] }, w.id))) }), result.generalCautions.map((c, i) => _jsx("p", { className: "caution-line", children: c }, i))] }), _jsx("button", { className: "btn-secondary", onClick: onReset, children: "L\u00E0m l\u1EA1i t\u1EEB \u0111\u1EA7u" })] }));
    }
    return (_jsxs("div", { className: "screen result-screen", children: [_jsx("h2", { className: "section-title", children: "K\u1EBFt qu\u1EA3 tham kh\u1EA3o" }), _jsx("div", { className: "disclaimer-bar", children: "K\u1EBFt qu\u1EA3 ch\u1EC9 mang t\u00EDnh tham kh\u1EA3o \u2014 kh\u00F4ng thay th\u1EBF b\u00E1c s\u0129. App kh\u00F4ng \u0111\u01B0a thu\u1ED1c, ph\u01B0\u01A1ng t\u1EC5 ho\u1EB7c li\u1EC1u l\u01B0\u1EE3ng." }), result.topPatterns.length === 0 && (_jsx("div", { className: "no-pattern-box", children: _jsx("p", { children: "D\u1EEF li\u1EC7u hi\u1EC7n ch\u01B0a \u0111\u1EE7 \u0111\u1EC3 g\u1EE3i \u00FD xu h\u01B0\u1EDBng th\u1EC3 tr\u1EA1ng r\u00F5 r\u00E0ng. B\u1EA1n c\u00F3 th\u1EC3 b\u1ED5 sung th\u00EAm d\u1EEF li\u1EC7u t\u1EF1 quan s\u00E1t." }) })), result.topPatterns.map((item, i) => (_jsxs("div", { className: `pattern-card rank-${i}`, children: [_jsxs("div", { className: "pattern-header", children: [_jsxs("span", { className: "pattern-rank", children: ["#", i + 1] }), _jsx("span", { className: "pattern-name", children: item.pattern.name }), _jsx("span", { className: "pattern-cat", children: item.pattern.classicalCategory })] }), _jsx("div", { className: "confidence-badge conf-{item.confidence}", children: CONFIDENCE_LABEL[item.confidence] }), _jsx("p", { className: "pattern-wording", children: item.wording }), _jsxs("div", { className: "pattern-signs", children: [_jsx("strong", { children: "D\u1EA5u hi\u1EC7u \u0111i\u1EC3n h\u00ECnh trong c\u1ED5 h\u1ECDc:" }), _jsx("ul", { children: item.pattern.signs.slice(0, 5).map((s, j) => _jsx("li", { children: s }, j)) })] }), item.pattern.supportiveCare.length > 0 && (_jsxs("div", { className: "pattern-care", children: [_jsx("strong", { children: "D\u01B0\u1EE1ng sinh tham kh\u1EA3o (kh\u00F4ng ph\u1EA3i \u0111i\u1EC1u tr\u1ECB):" }), _jsx("ul", { children: item.pattern.supportiveCare.map((c, j) => _jsx("li", { children: c }, j)) })] })), item.pattern.cautions.length > 0 && (_jsxs("div", { className: "pattern-caution", children: [_jsx("strong", { children: "L\u01B0u \u00FD:" }), _jsx("ul", { children: item.pattern.cautions.map((c, j) => _jsx("li", { children: c }, j)) })] }))] }, item.pattern.id))), result.contradictions.length > 0 && (_jsxs("div", { className: "contradiction-box", children: [_jsx("strong", { children: "D\u1EEF li\u1EC7u c\u00F3 m\u00E2u thu\u1EABn:" }), _jsx("ul", { children: result.contradictions.map((c, i) => _jsx("li", { children: c }, i)) })] })), result.missingQuestionIds.length > 0 && (_jsxs("div", { className: "missing-box", children: [_jsx("strong", { children: "D\u1EEF li\u1EC7u c\u00F2n thi\u1EBFu \u0111\u1EC3 g\u1EE3i \u00FD ch\u00EDnh x\u00E1c h\u01A1n:" }), _jsx("ul", { children: result.missingQuestionIds.map((id) => _jsx("li", { children: getQuestionLabel(id) }, id)) })] })), _jsx("div", { className: "general-cautions", children: result.generalCautions.map((c, i) => (_jsxs("p", { className: "caution-line", children: ["\u26A0 ", c] }, i))) }), _jsxs("div", { className: "result-actions", children: [_jsx("button", { className: "btn-secondary", onClick: onReset, children: "L\u00E0m l\u1EA1i" }), _jsx("button", { className: "btn-primary", onClick: onLearn, children: "T\u1EF1 h\u1ECDc / Glossary \u2192" })] })] }));
}
function LearnScreen({ onBack }) {
    const [tab, setTab] = useState('glossary');
    const [search, setSearch] = useState('');
    const filteredGlossary = GLOSSARY.filter((t) => !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.plain.toLowerCase().includes(search.toLowerCase()));
    const foundations = Object.values(YHOC_FOUNDATIONS);
    const filteredFound = foundations.filter((f) => !search || (f.title ?? '').toLowerCase().includes(search.toLowerCase()) || (f.summary ?? '').toLowerCase().includes(search.toLowerCase()));
    return (_jsxs("div", { className: "screen learn-screen", children: [_jsx("button", { className: "back-btn", onClick: onBack, children: "\u2190 Quay l\u1EA1i" }), _jsx("h2", { className: "section-title", children: "T\u1EF1 h\u1ECDc & Glossary" }), _jsx("p", { className: "learn-note", children: "N\u1ED9i dung mang t\u00EDnh gi\u00E1o d\u1EE5c tham kh\u1EA3o theo khung c\u1ED5 h\u1ECDc. Kh\u00F4ng d\u00F9ng \u0111\u1EC3 t\u1EF1 ch\u1EA9n \u0111o\u00E1n ho\u1EB7c \u0111i\u1EC1u tr\u1ECB." }), _jsxs("div", { className: "tab-row", children: [_jsx("button", { className: `tab-btn${tab === 'glossary' ? ' active' : ''}`, onClick: () => setTab('glossary'), children: "Thu\u1EADt ng\u1EEF" }), _jsx("button", { className: `tab-btn${tab === 'foundations' ? ' active' : ''}`, onClick: () => setTab('foundations'), children: "N\u1EC1n t\u1EA3ng" })] }), _jsx("input", { className: "search-input", type: "search", placeholder: "T\u00ECm ki\u1EBFm...", value: search, onChange: (e) => setSearch(e.target.value) }), tab === 'glossary' && (_jsx("div", { className: "glossary-list", children: filteredGlossary.map((t) => (_jsxs("div", { className: "glossary-item", children: [_jsx("div", { className: "glos-term", children: t.term }), _jsx("div", { className: "glos-short", children: t.short }), _jsx("div", { className: "glos-plain", children: t.plain }), t.appExample && _jsxs("div", { className: "glos-example", children: ["V\u00ED d\u1EE5 trong app: ", t.appExample] }), _jsxs("div", { className: "glos-caution", children: ["\u26A0 ", t.caution] })] }, t.id))) })), tab === 'foundations' && (_jsx("div", { className: "found-list", children: filteredFound.map((f) => (_jsxs("div", { className: "found-item", children: [_jsx("div", { className: "found-title", children: f.title }), _jsx("div", { className: "found-summary", children: f.summary }), f.appUse.length > 0 && (_jsxs("div", { className: "found-use", children: [_jsx("strong", { children: "\u1EE8ng d\u1EE5ng trong app:" }), _jsx("ul", { children: f.appUse.map((u, i) => _jsx("li", { children: u }, i)) })] })), _jsxs("div", { className: "found-caution", children: [_jsx("strong", { children: "Wording an to\u00E0n:" }), _jsx("ul", { children: f.safeWording.map((w, i) => _jsx("li", { children: w }, i)) })] })] }, f.id))) }))] }));
}
export default function App() {
    const [screen, setScreen] = useState('hero');
    const [answers, setAnswers] = useState({});
    const goHero = () => { setScreen('hero'); setAnswers({}); };
    const goSafety = () => setScreen('safety');
    const goForm = () => setScreen('form');
    const goLearn = () => setScreen('learn');
    const handleSafety = (hasFlag, selected) => {
        const merged = { ...answers, q_red_flags: selected };
        if (hasFlag) {
            setAnswers(merged);
            setScreen('result');
        }
        else {
            setAnswers(merged);
            goForm();
        }
    };
    const handleSubmit = (formAnswers) => {
        setAnswers((prev) => ({ ...prev, ...formAnswers }));
        setScreen('result');
    };
    return (_jsxs("div", { className: "yhoc-app", children: [_jsxs("header", { className: "app-header", children: [_jsx("a", { href: "/nguthuat", className: "header-back", children: "\u262F Ng\u0169 thu\u1EADt" }), _jsx("span", { className: "header-title", children: "Y \u2013 C\u1ED5 h\u1ECDc tham kh\u1EA3o" })] }), screen === 'hero' && _jsx(HeroScreen, { onNext: goSafety }), screen === 'safety' && _jsx(SafetyScreen, { onNext: handleSafety, onBack: goHero }), screen === 'form' && _jsx(FormScreen, { onSubmit: handleSubmit, onBack: goSafety }), screen === 'result' && _jsx(ResultScreen, { answers: answers, onReset: goHero, onLearn: goLearn }), screen === 'learn' && _jsx(LearnScreen, { onBack: () => setScreen(answers && Object.keys(answers).length > 0 ? 'result' : 'hero') }), _jsx("footer", { className: "app-footer", children: _jsx("span", { children: "Ch\u1EC9 mang t\u00EDnh tham kh\u1EA3o \u2013 kh\u00F4ng thay th\u1EBF b\u00E1c s\u0129 \u2013 n\u00EAn \u0111i kh\u00E1m n\u1EBFu c\u00F3 d\u1EA5u hi\u1EC7u b\u1EA5t th\u01B0\u1EDDng." }) })] }));
}
