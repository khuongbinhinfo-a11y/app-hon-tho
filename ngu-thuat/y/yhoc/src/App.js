import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import imgHeroBg from './assets/images/yhoc-hero-bg.png';
import imgCardAmduong from './assets/images/yhoc-card-amduong.png';
import imgCardTangphu from './assets/images/yhoc-card-tangphu.png';
import imgCardKhihuyet from './assets/images/yhoc-card-khihuyet.png';
import imgCardDuongsinh from './assets/images/yhoc-card-duongsinh.png';
import { interpretYhocAnswers, getQuestionLabel } from './engine/yhocEngine';
import { QUESTIONS } from './data/yhoc/questions';
import { GLOSSARY } from './data/yhoc/glossary';
import { YHOC_FOUNDATIONS } from './data/yhoc/foundations';
import { SAFETY_WARNINGS } from './data/yhoc/safety';
import { filterFolkCare, getRedFlags, suggestFolkCareByPattern } from './engine/folkCareEngine';
import { FOLK_CARE_CATEGORIES, ALL_CATEGORIES_ID, ALL_CATEGORIES_LABEL } from './data/yhoc/folkCareCategories';
import { SENSITIVE_GROUPS, SENSITIVE_GROUP_WARNING, EMERGENCY_MESSAGE } from './data/yhoc/folkCareSafety';
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
    low: 'Gợi ý sơ bộ – dữ liệu còn ít',
    medium: 'Gợi ý vừa – dữ liệu chưa đầy đủ',
    fair: 'Gợi ý khá – có cơ sở vừa phải',
};
const FEATURE_CARDS = [
    { img: imgCardAmduong, title: 'Âm dương', text: 'Nhận diện xu hướng thiên hàn, thiên nhiệt, thiếu nghỉ ngơi hoặc hao tổn năng lượng theo ngôn ngữ cổ học.' },
    { img: imgCardTangphu, title: 'Tạng phủ', text: 'Học hiểu Can, Tâm, Tỳ, Phế, Thận trong hệ quy chiếu Đông y, không đồng nhất máy móc với cơ quan hiện đại.' },
    { img: imgCardKhihuyet, title: 'Khí huyết', text: 'Gợi ý xu hướng như khí hư, huyết hư, khí trệ, đàm thấp, âm hư, dương hư ở mức tham khảo.' },
    { img: imgCardDuongsinh, title: 'Dưỡng sinh nhẹ', text: 'Đề xuất ngủ nghỉ, ăn uống, vận động, hơi thở và điều hòa cảm xúc, không thuốc, không liều lượng.' },
];
const SAFETY_RULES = [
    'Không chẩn đoán bệnh hoặc kết luận sức khỏe chắc chắn.',
    'Không kê đơn, không đưa liều dược liệu, không hướng dẫn tự dùng thuốc.',
    'Không thay thế bác sĩ, thầy thuốc hoặc điều trị đang theo.',
    'Luôn kiểm tra dấu hiệu nguy hiểm trước khi luận giải cổ học.',
];
function QuestionItem({ question, value, onChange, index, }) {
    if (question.type === 'single') {
        return (_jsxs("div", { className: "q-card", children: [_jsx("div", { className: "q-eyebrow", children: GROUP_LABELS[question.group] ?? question.group }), _jsxs("div", { className: "q-label", children: [index + 1, ". ", question.label] }), question.helperText && _jsx("div", { className: "q-helper", children: question.helperText }), _jsx("div", { className: "q-options", children: question.options?.map((opt) => (_jsx("button", { className: `q-opt${value === opt.value ? ' selected' : ''}`, onClick: () => onChange(question.id, opt.value), children: opt.label }, opt.id))) })] }));
    }
    if (question.type === 'multiple') {
        const arr = Array.isArray(value) ? value : [];
        return (_jsxs("div", { className: "q-card", children: [_jsx("div", { className: "q-eyebrow", children: GROUP_LABELS[question.group] ?? question.group }), _jsxs("div", { className: "q-label", children: [index + 1, ". ", question.label] }), question.helperText && _jsx("div", { className: "q-helper", children: question.helperText }), _jsx("div", { className: "q-options", children: question.options?.map((opt) => {
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
        return (_jsxs("div", { className: "q-card", children: [_jsx("div", { className: "q-eyebrow", children: GROUP_LABELS[question.group] ?? question.group }), _jsxs("div", { className: "q-label", children: [index + 1, ". ", question.label] }), _jsxs("div", { className: "q-scale-row", children: [_jsx("span", { className: "q-scale-min", children: question.min }), _jsx("input", { type: "range", min: question.min, max: question.max, step: question.step ?? 1, value: num, onChange: (e) => onChange(question.id, parseFloat(e.target.value)), className: "q-range" }), _jsx("span", { className: "q-scale-max", children: question.max }), _jsx("span", { className: "q-scale-val", children: num })] }), question.allowSkip && (_jsx("button", { className: "q-skip", onClick: () => onChange(question.id, null), children: "B\u1ECF qua c\u00E2u n\u00E0y" }))] }));
    }
    return null;
}
function HeroScreen({ onNext, onSafety }) {
    return (_jsxs("div", { className: "hero-wrap", children: [_jsx("div", { className: "hero-glow" }), _jsxs("div", { className: "hero-grid", children: [_jsxs("section", { className: "hero-left", children: [_jsx("div", { className: "hero-pill", children: "\uD83D\uDEE1 Kh\u00F4ng ch\u1EA9n \u0111o\u00E1n \u00B7 Kh\u00F4ng k\u00EA \u0111\u01A1n \u00B7 Ch\u1EC9 tham kh\u1EA3o c\u1ED5 h\u1ECDc" }), _jsxs("h1", { className: "hero-title", children: ["Y ", _jsx("span", { className: "hero-title-accent", children: "\u2013 Y h\u1ECDc c\u1ED5 h\u1ECDc" }), " tham kh\u1EA3o"] }), _jsx("p", { className: "hero-lead", children: "M\u1ED9t kh\u00F4ng gian h\u1ECDc hi\u1EC3u v\u00E0 t\u1EF1 quan s\u00E1t th\u1EC3 tr\u1EA1ng theo \u00E2m d\u01B0\u01A1ng, ng\u0169 h\u00E0nh, t\u1EA1ng ph\u1EE7, kh\u00ED huy\u1EBFt, kinh l\u1EA1c, t\u1EE9 ch\u1EA9n, b\u00E1t c\u01B0\u01A1ng v\u00E0 d\u01B0\u1EE1ng sinh. App ch\u1EC9 g\u1EE3i \u00FD xu h\u01B0\u1EDBng, kh\u00F4ng thay th\u1EBF t\u01B0 v\u1EA5n y t\u1EBF." }), _jsxs("div", { className: "hero-actions", children: [_jsx("button", { className: "btn-primary", onClick: onNext, children: "B\u1EAFt \u0111\u1EA7u t\u1EF1 quan s\u00E1t \u2192" }), _jsx("button", { className: "btn-secondary", onClick: onSafety, children: "\u0110\u1ECDc nguy\u00EAn t\u1EAFc an to\u00E0n" })] })] }), _jsxs("section", { className: "hero-right", children: [_jsx("div", { className: "hero-visual-card", children: _jsx("img", { src: imgHeroBg, alt: "Y h\u1ECDc c\u1ED5 h\u1ECDc tham kh\u1EA3o", className: "hero-visual-img" }) }), _jsxs("div", { className: "mock-card", children: [_jsxs("div", { className: "mock-card-header", children: [_jsxs("div", { children: [_jsx("div", { className: "mock-eyebrow", children: "M\u1EABu k\u1EBFt qu\u1EA3" }), _jsx("div", { className: "mock-title", children: "Xu h\u01B0\u1EDBng th\u1EC3 tr\u1EA1ng" })] }), _jsx("span", { className: "mock-icon", children: "\u262F" })] }), _jsx("div", { className: "mock-patterns", children: [{ name: 'Khí hư', score: 78, conf: 'vừa' }, { name: 'Tỳ vị hư', score: 62, conf: 'thấp-vừa' }].map((p) => (_jsxs("div", { className: "mock-pattern", children: [_jsxs("div", { className: "mock-pattern-row", children: [_jsx("span", { className: "mock-pattern-name", children: p.name }), _jsxs("span", { className: "mock-pattern-conf", children: ["confidence ", p.conf] })] }), _jsx("div", { className: "mock-bar-bg", children: _jsx("div", { className: "mock-bar-fill", style: { width: `${p.score}%` } }) }), _jsx("div", { className: "mock-pattern-score", children: p.score })] }, p.name))) }), _jsx("div", { className: "mock-redflag", children: "N\u1EBFu c\u00F3 \u0111au ng\u1EF1c, kh\u00F3 th\u1EDF, li\u1EC7t, ng\u1EA5t ho\u1EB7c d\u1EA5u hi\u1EC7u n\u1EB7ng, app \u01B0u ti\u00EAn khuy\u1EBFn ngh\u1ECB \u0111i kh\u00E1m." })] })] })] }), _jsx("div", { className: "feature-grid", children: FEATURE_CARDS.map((c) => (_jsxs("div", { className: "feature-card", children: [_jsx("div", { className: "feature-img-wrap", children: _jsx("img", { src: c.img, alt: c.title, className: "feature-img" }) }), _jsx("h3", { className: "feature-title", children: c.title }), _jsx("p", { className: "feature-text", children: c.text })] }, c.title))) })] }));
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
    return (_jsxs("div", { className: "wide-screen", children: [_jsx("button", { className: "back-btn", onClick: onBack, children: "\u2190 Quay l\u1EA1i" }), _jsx("div", { className: "section-eyebrow", children: "an to\u00E0n tr\u01B0\u1EDBc" }), _jsx("h2", { className: "section-title", children: "C\u1ED5ng \u0111\u1ECF \u0111\u1EB7t tr\u01B0\u1EDBc c\u1ED5ng lu\u1EADn gi\u1EA3i" }), _jsx("p", { className: "section-sub", children: "App Y lu\u00F4n h\u1ECFi d\u1EA5u hi\u1EC7u nguy hi\u1EC3m tr\u01B0\u1EDBc. N\u1EBFu c\u00F3 red flag, m\u00E0n k\u1EBFt qu\u1EA3 d\u1EEBng \u1EDF c\u1EA3nh b\u00E1o \u0111i kh\u00E1m, kh\u00F4ng c\u1ED1 di\u1EC5n gi\u1EA3i \u0110\u00F4ng y." }), _jsxs("div", { className: "safety-cols", children: [_jsxs("div", { className: "safety-rules-col", children: [_jsx("h3", { className: "col-title", children: "\uD83D\uDEE1 Nguy\u00EAn t\u1EAFc hi\u1EC3n th\u1ECB" }), _jsx("div", { className: "rules-list", children: SAFETY_RULES.map((r) => (_jsx("div", { className: "rule-item", children: r }, r))) }), _jsx("button", { className: "btn-primary mt-btn", onClick: proceed, disabled: selected.length === 0, children: "T\u00F4i \u0111\u00E3 hi\u1EC3u, b\u1EAFt \u0111\u1EA7u t\u1EF1 quan s\u00E1t \u2192" }), selected.length === 0 && (_jsx("p", { className: "safety-hint", children: "Vui l\u00F2ng x\u00E1c nh\u1EADn t\u00ECnh tr\u1EA1ng b\u00EAn d\u01B0\u1EDBi tr\u01B0\u1EDBc" }))] }), _jsxs("div", { className: "safety-flags-col", children: [_jsx("h3", { className: "col-title danger-title", children: "\u26A0 Red flags \u2013 b\u1EAFt bu\u1ED9c \u0111i kh\u00E1m" }), _jsxs("div", { className: "redflag-grid", children: [SAFETY_WARNINGS.map((w) => (_jsxs("button", { className: `redflag-item${selected.includes(w.id) ? ' selected' : ''} sev-${w.severity}`, onClick: () => toggle(w.id), children: [_jsx("span", { className: "redflag-label", children: w.label }), selected.includes(w.id) && _jsx("span", { className: "redflag-msg", children: w.message })] }, w.id))), _jsx("button", { className: `redflag-item none-item${selected.includes('none') ? ' selected' : ''}`, onClick: () => toggle('none'), children: _jsx("span", { className: "redflag-label", children: "Kh\u00F4ng c\u00F3 d\u1EA5u hi\u1EC7u n\u00E0o \u1EDF tr\u00EAn" }) })] }), _jsx("p", { className: "redflag-note", children: "Khi g\u1EB7p d\u1EA5u hi\u1EC7u nguy hi\u1EC3m, kh\u00F4ng d\u00F9ng app \u0111\u1EC3 t\u1EF1 x\u1EED l\u00FD. Li\u00EAn h\u1EC7 b\u00E1c s\u0129 ho\u1EB7c c\u1EA5p c\u1EE9u t\u00F9y m\u1EE9c \u0111\u1ED9." })] })] })] }));
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
    const totalAnswered = Object.keys(answers).length;
    const totalQs = FORM_QUESTIONS.length;
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
    return (_jsxs("div", { className: "wide-screen", children: [_jsx("div", { className: "section-eyebrow", children: "t\u1EF1 quan s\u00E1t" }), _jsx("h2", { className: "section-title", children: "M\u1ED9t v\u00F2ng h\u1ECFi nh\u1EB9, kh\u00F4ng \u00E9p k\u1EBFt lu\u1EADn" }), _jsx("p", { className: "section-sub", children: "B\u1EA1n c\u00F3 th\u1EC3 b\u1ECF qua c\u00E2u kh\u00F4ng ch\u1EAFc. Engine t\u00EDnh xu h\u01B0\u1EDBng d\u1EF1a tr\u00EAn d\u1EEF li\u1EC7u \u0111\u1EE7 tin, \u0111\u1ED3ng th\u1EDDi ghi r\u00F5 ph\u1EA7n c\u00F2n thi\u1EBFu." }), _jsxs("div", { className: "form-cols", children: [_jsxs("div", { className: "form-main", children: [_jsxs("div", { className: "form-progress", children: [_jsx("div", { className: "progress-bar", children: _jsx("div", { className: "progress-fill", style: { width: `${((currentIndex + 1) / groups.length) * 100}%` } }) }), _jsxs("span", { className: "progress-label", children: ["Nh\u00F3m ", currentIndex + 1, " / ", groups.length] })] }), _jsx("div", { className: "group-tabs", children: groups.map((g, i) => (_jsx("button", { className: `group-tab${activeGroup === g ? ' active' : ''}${i < currentIndex ? ' done' : ''}`, onClick: () => setActiveGroup(g), children: i < currentIndex ? '✓' : GROUP_LABELS[g] ?? g }, g))) }), _jsx("div", { className: "questions-list", children: currentGroupQs.map((q, i) => (_jsx(QuestionItem, { question: q, value: answers[q.id], onChange: handleChange, index: i }, q.id))) }), _jsxs("div", { className: "form-nav", children: [_jsx("button", { className: "btn-secondary", onClick: prev, children: "\u2190 Tr\u01B0\u1EDBc" }), _jsx("button", { className: "btn-primary", onClick: next, children: isLast ? 'Xem kết quả →' : 'Tiếp →' })] }), _jsx("p", { className: "form-note", children: "T\u1EA5t c\u1EA3 c\u00E2u h\u1ECFi \u0111\u1EC1u c\u00F3 th\u1EC3 b\u1ECF qua. App ch\u1EC9 tham kh\u1EA3o d\u1EEF li\u1EC7u b\u1EA1n cung c\u1EA5p." })] }), _jsxs("aside", { className: "form-sidebar", children: [_jsx("h3", { className: "sidebar-title", children: "Ti\u1EBFn \u0111\u1ED9" }), _jsxs("div", { className: "sidebar-stat", children: [_jsx("span", { children: "\u0110\u00E3 tr\u1EA3 l\u1EDDi" }), _jsxs("b", { children: [totalAnswered, " / ", totalQs] })] }), _jsxs("div", { className: "sidebar-stat", children: [_jsx("span", { children: "Nh\u00F3m hi\u1EC7n t\u1EA1i" }), _jsx("b", { children: GROUP_LABELS[activeGroup] })] }), _jsxs("div", { className: "sidebar-stat", children: [_jsx("span", { children: "Cho ph\u00E9p b\u1ECF qua" }), _jsx("b", { children: "C\u00F3" })] }), _jsxs("div", { className: "sidebar-stat", children: [_jsx("span", { children: "\u0110\u1ED9 tin c\u1EADy" }), _jsx("b", { children: "t\u00EDnh sau" })] }), _jsx("p", { className: "sidebar-note", children: "Form c\u00F3 th\u00EAm quan s\u00E1t l\u01B0\u1EE1i, m\u1ED3 h\u00F4i, kh\u00E1t n\u01B0\u1EDBc v\u00E0 \u0111\u1EA1i ti\u1EC3u ti\u1EC7n \u0111\u1EC3 t\u0103ng \u0111\u1ED9 ch\u00EDnh x\u00E1c." })] })] })] }));
}
const normalizePatternScore = (score) => {
    const raw = score ?? 0;
    return Math.max(0, Math.min(100, Math.round((raw / 7) * 100)));
};
function ResultScreen({ answers, onReset, onLearn, onFolk }) {
    const result = interpretYhocAnswers(answers);
    // Get folk care suggestions based on patterns
    const patternIds = result.topPatterns.map(p => p.pattern.id);
    const folkSuggestions = suggestFolkCareByPattern(patternIds);
    if (result.emergencyFirst) {
        return (_jsxs("div", { className: "screen result-screen", children: [_jsxs("div", { className: "emergency-box", children: [_jsx("div", { className: "emergency-icon", children: "\u26A0\uFE0F" }), _jsx("h2", { children: "\u01AFu ti\u00EAn an to\u00E0n y t\u1EBF" }), _jsx("p", { children: "B\u1EA1n c\u00F3 d\u1EA5u hi\u1EC7u c\u1EA7n \u0111\u01B0\u1EE3c th\u0103m kh\u00E1m ho\u1EB7c x\u1EED l\u00FD y t\u1EBF. App kh\u00F4ng lu\u1EADn gi\u1EA3i c\u1ED5 h\u1ECDc trong tr\u01B0\u1EDDng h\u1EE3p n\u00E0y." }), _jsx("ul", { className: "emergency-list", children: result.safetyWarnings.map((w) => (_jsxs("li", { children: [_jsx("strong", { children: w.label }), _jsx("br", {}), _jsx("span", { children: w.action })] }, w.id))) }), result.generalCautions.map((c, i) => _jsxs("p", { className: "caution-line", children: ["\u26A0 ", c] }, i))] }), _jsx("button", { className: "btn-secondary", onClick: onReset, children: "L\u00E0m l\u1EA1i t\u1EEB \u0111\u1EA7u" })] }));
    }
    return (_jsxs("div", { className: "wide-screen", children: [_jsx("div", { className: "section-eyebrow", children: "k\u1EBFt qu\u1EA3 tham kh\u1EA3o" }), _jsx("h2", { className: "section-title", children: "Ch\u1EC9 n\u00F3i xu h\u01B0\u1EDBng, kh\u00F4ng n\u00F3i b\u1EC7nh" }), _jsx("p", { className: "section-sub", children: "\u0110i\u1EC3m nghi\u00EAng theo pattern, d\u1EEF li\u1EC7u c\u00F2n thi\u1EBFu, m\u00E2u thu\u1EABn n\u1EBFu c\u00F3 v\u00E0 d\u01B0\u1EE1ng sinh nh\u1EB9. Kh\u00F4ng thu\u1ED1c, kh\u00F4ng li\u1EC1u, kh\u00F4ng ph\u00E1n quy\u1EBFt." }), _jsxs("div", { className: "result-cols", children: [_jsxs("div", { className: "result-main", children: [_jsx("div", { className: "disclaimer-bar", children: "K\u1EBFt qu\u1EA3 ch\u1EC9 mang t\u00EDnh tham kh\u1EA3o \u2014 kh\u00F4ng thay th\u1EBF b\u00E1c s\u0129. App kh\u00F4ng \u0111\u01B0a thu\u1ED1c, ph\u01B0\u01A1ng t\u1EC5 ho\u1EB7c li\u1EC1u l\u01B0\u1EE3ng." }), result.topPatterns.length === 0 && (_jsx("div", { className: "no-pattern-box", children: _jsx("p", { children: "D\u1EEF li\u1EC7u hi\u1EC7n ch\u01B0a \u0111\u1EE7 \u0111\u1EC3 g\u1EE3i \u00FD xu h\u01B0\u1EDBng th\u1EC3 tr\u1EA1ng r\u00F5 r\u00E0ng. B\u1EA1n c\u00F3 th\u1EC3 b\u1ED5 sung th\u00EAm d\u1EEF li\u1EC7u t\u1EF1 quan s\u00E1t." }) })), result.topPatterns.map((item, i) => {
                                const scorePercent = normalizePatternScore(item.score);
                                return (_jsxs("div", { className: `pattern-card rank-${i}`, children: [_jsxs("div", { className: "pattern-header", children: [_jsx("div", { className: "pattern-icon-wrap", children: "\u262F" }), _jsxs("div", { children: [_jsxs("div", { className: "pattern-name", children: ["Xu h\u01B0\u1EDBng ", item.pattern.name] }), _jsxs("div", { className: "pattern-cat", children: [item.pattern.classicalCategory, " \u00B7 M\u1EE9c tin c\u1EADy: ", CONFIDENCE_LABEL[item.confidence] ?? item.confidence] })] }), _jsxs("div", { className: "pattern-score-num", children: [scorePercent, "%"] })] }), _jsx("div", { className: "pattern-score-bar-bg", children: _jsx("div", { className: "pattern-score-bar-fill", style: { width: `${scorePercent}%` } }) }), _jsx("p", { className: "pattern-wording", children: item.wording }), _jsxs("div", { className: "pattern-signs", children: [_jsx("strong", { children: "D\u1EA5u hi\u1EC7u \u0111i\u1EC3n h\u00ECnh trong c\u1ED5 h\u1ECDc:" }), _jsx("ul", { children: item.pattern.signs.slice(0, 5).map((s, j) => _jsx("li", { children: s }, j)) })] }), item.pattern.supportiveCare.length > 0 && (_jsxs("div", { className: "pattern-care", children: [_jsx("strong", { children: "D\u01B0\u1EE1ng sinh tham kh\u1EA3o (kh\u00F4ng ph\u1EA3i \u0111i\u1EC1u tr\u1ECB):" }), _jsx("ul", { children: item.pattern.supportiveCare.map((c, j) => _jsx("li", { children: c }, j)) })] })), item.pattern.cautions.length > 0 && (_jsxs("div", { className: "pattern-caution", children: [_jsx("strong", { children: "L\u01B0u \u00FD:" }), _jsx("ul", { children: item.pattern.cautions.map((c, j) => _jsx("li", { children: c }, j)) })] }))] }, item.pattern.id));
                            }), result.contradictions.length > 0 && (_jsxs("div", { className: "contradiction-box", children: [_jsx("strong", { children: "D\u1EEF li\u1EC7u c\u00F3 m\u00E2u thu\u1EABn:" }), _jsx("ul", { children: result.contradictions.map((c, i) => _jsx("li", { children: c }, i)) })] })), result.missingQuestionIds.length > 0 && (_jsxs("div", { className: "missing-box", children: [_jsx("strong", { children: "D\u1EEF li\u1EC7u c\u00F2n thi\u1EBFu \u0111\u1EC3 g\u1EE3i \u00FD ch\u00EDnh x\u00E1c h\u01A1n:" }), _jsx("ul", { children: result.missingQuestionIds.map((id) => _jsx("li", { children: getQuestionLabel(id) }, id)) })] })), _jsx("div", { className: "general-cautions", children: result.generalCautions.map((c, i) => _jsxs("p", { className: "caution-line", children: ["\u26A0 ", c] }, i)) }), !result.emergencyFirst && folkSuggestions.length > 0 && (_jsxs("div", { className: "folk-suggestions-box", children: [_jsx("h3", { className: "folk-suggestions-title", children: "C\u00F3 th\u1EC3 tham kh\u1EA3o th\u00EAm trong C\u1EA9m nang" }), _jsx("p", { className: "folk-suggestions-note", children: "Nh\u1EEFng m\u1EE5c n\u00E0y ch\u1EC9 l\u00E0 g\u1EE3i \u00FD \u0111\u1ECDc th\u00EAm, kh\u00F4ng ph\u1EA3i h\u01B0\u1EDBng \u0111i\u1EC1u tr\u1ECB." }), _jsx("div", { className: "folk-suggestions-list", children: folkSuggestions.slice(0, 5).map((item) => (_jsxs("div", { className: "folk-suggestion-chip", onClick: onFolk, children: [_jsx("span", { className: "folk-suggestion-icon", children: "\uD83D\uDCD6" }), _jsx("span", { className: "folk-suggestion-text", children: item.title })] }, item.id))) }), _jsx("button", { className: "btn-folk-link", onClick: onFolk, children: "Xem C\u1EA9m nang ch\u0103m s\u00F3c \u0111\u1EDDi s\u1ED1ng \u2192" })] })), _jsxs("div", { className: "result-actions", children: [_jsx("button", { className: "btn-secondary", onClick: onReset, children: "L\u00E0m l\u1EA1i" }), _jsx("button", { className: "btn-folk", onClick: onFolk, children: "C\u1EA9m nang" }), _jsx("button", { className: "btn-primary", onClick: onLearn, children: "Sang kho t\u1EF1 h\u1ECDc \u2192" })] })] }), _jsxs("aside", { className: "result-sidebar", children: [_jsxs("div", { className: "sidebar-panel", children: [_jsx("h3", { className: "sidebar-title", children: "G\u1EE3i \u00FD d\u01B0\u1EE1ng sinh an to\u00E0n" }), _jsxs("ul", { className: "sidebar-care-list", children: [_jsx("li", { children: "Ng\u1EE7 v\u00E0 th\u1EE9c \u0111\u1EC1u gi\u1EDD h\u01A1n trong 7 ng\u00E0y t\u1EDBi." }), _jsx("li", { children: "\u0102n ch\u1EADm, gi\u1EA3m b\u1EEFa qu\u00E1 cay, qu\u00E1 l\u1EA1nh ho\u1EB7c qu\u00E1 d\u1EA7u." }), _jsx("li", { children: "\u0110i b\u1ED9 nh\u1EB9, th\u1EDF ch\u1EADm, kh\u00F4ng t\u1EADp qu\u00E1 s\u1EE9c khi \u0111ang m\u1EC7t." }), _jsx("li", { children: "Ghi l\u1EA1i c\u1EA3m gi\u00E1c n\u00F3ng/l\u1EA1nh, ti\u00EAu h\u00F3a, gi\u1EA5c ng\u1EE7 \u0111\u1EC3 quan s\u00E1t ti\u1EBFp." })] })] }), result.missingQuestionIds.length > 0 && (_jsxs("div", { className: "sidebar-panel", children: [_jsx("h3", { className: "sidebar-title", children: "D\u1EEF li\u1EC7u c\u00F2n thi\u1EBFu" }), _jsx("p", { className: "sidebar-note", children: "B\u1ED5 sung th\u00EAm \u0111\u1EC3 t\u0103ng \u0111\u1ED9 tin c\u1EADy c\u1EE7a g\u1EE3i \u00FD." })] })), _jsxs("div", { className: "sidebar-panel danger-panel", children: [_jsx("h3", { className: "sidebar-title danger-title", children: "\u26A0 Khi n\u00E0o n\u00EAn \u0111i kh\u00E1m?" }), _jsx("p", { className: "sidebar-note", children: "N\u1EBFu tri\u1EC7u ch\u1EE9ng k\u00E9o d\u00E0i, n\u1EB7ng l\u00EAn, c\u00F3 \u0111au ng\u1EF1c, kh\u00F3 th\u1EDF, ng\u1EA5t, s\u1ED1t cao ho\u1EB7c d\u1EA5u hi\u1EC7u b\u1EA5t th\u01B0\u1EDDng, kh\u00F4ng d\u00F9ng app \u0111\u1EC3 t\u1EF1 x\u1EED l\u00FD." })] })] })] })] }));
}
function LearnScreen({ onBack }) {
    const [tab, setTab] = useState('glossary');
    const [search, setSearch] = useState('');
    const filteredGlossary = GLOSSARY.filter((t) => !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.plain.toLowerCase().includes(search.toLowerCase()));
    const foundations = Object.values(YHOC_FOUNDATIONS);
    const filteredFound = foundations.filter((f) => !search || (f.title ?? '').toLowerCase().includes(search.toLowerCase()) || (f.summary ?? '').toLowerCase().includes(search.toLowerCase()));
    const MODULES = ['Bản đồ tạng phủ', 'Bát cương', 'Tứ chẩn', 'Quan sát lưỡi'];
    return (_jsxs("div", { className: "wide-screen", children: [_jsx("button", { className: "back-btn", onClick: onBack, children: "\u2190 Quay l\u1EA1i" }), _jsx("div", { className: "section-eyebrow", children: "t\u1EF1 h\u1ECDc" }), _jsx("h2", { className: "section-title", children: "Kho thu\u1EADt ng\u1EEF c\u1ED5 h\u1ECDc d\u1EC5 \u0111\u1ECDc" }), _jsx("p", { className: "section-sub learn-note", children: "Ph\u1EA7n n\u00E0y gi\u00FAp b\u1EA1n hi\u1EC3u ng\u00F4n ng\u1EEF \u0110\u00F4ng y m\u00E0 app d\u00F9ng. Lu\u00F4n k\u00E8m c\u1EA3nh b\u00E1o kh\u00F4ng quy \u0111\u1ED5i m\u00E1y m\u00F3c sang b\u1EC7nh danh hi\u1EC7n \u0111\u1EA1i." }), _jsxs("div", { className: "tab-row", children: [_jsx("button", { className: `tab-btn${tab === 'glossary' ? ' active' : ''}`, onClick: () => setTab('glossary'), children: "Thu\u1EADt ng\u1EEF" }), _jsx("button", { className: `tab-btn${tab === 'foundations' ? ' active' : ''}`, onClick: () => setTab('foundations'), children: "N\u1EC1n t\u1EA3ng" })] }), _jsx("input", { className: "search-input", type: "search", placeholder: "T\u00ECm ki\u1EBFm...", value: search, onChange: (e) => setSearch(e.target.value) }), tab === 'glossary' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "glossary-grid", children: filteredGlossary.map((t) => (_jsxs("div", { className: "glossary-item", children: [_jsx("div", { className: "glos-term-pill", children: t.term }), _jsx("div", { className: "glos-short", children: t.short }), _jsx("div", { className: "glos-plain", children: t.plain }), t.appExample && _jsxs("div", { className: "glos-example", children: ["V\u00ED d\u1EE5: ", t.appExample] }), _jsxs("div", { className: "glos-caution", children: ["\u26A0 ", t.caution] })] }, t.id))) }), _jsxs("div", { className: "module-panel", children: [_jsx("h3", { className: "sidebar-title", children: "Module h\u1ECDc m\u1EDF r\u1ED9ng" }), _jsx("div", { className: "module-grid", children: MODULES.map((m) => (_jsx("div", { className: "module-item", children: m }, m))) })] })] })), tab === 'foundations' && (_jsx("div", { className: "found-list", children: filteredFound.map((f) => (_jsxs("div", { className: "found-item", children: [_jsx("div", { className: "found-title", children: f.title }), _jsx("div", { className: "found-summary", children: f.summary }), f.appUse.length > 0 && (_jsxs("div", { className: "found-use", children: [_jsx("strong", { children: "\u1EE8ng d\u1EE5ng trong app:" }), _jsx("ul", { children: f.appUse.map((u, i) => _jsx("li", { children: u }, i)) })] })), _jsxs("div", { className: "found-caution", children: [_jsx("strong", { children: "Wording an to\u00E0n:" }), _jsx("ul", { children: f.safeWording.map((w, i) => _jsx("li", { children: w }, i)) })] })] }, f.id))) }))] }));
}
// Folk Care Screen Component
function FolkCareScreen({ onBack }) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState(ALL_CATEGORIES_ID);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sensitiveGroups, setSensitiveGroups] = useState([]);
    const [redFlags, setRedFlags] = useState([]);
    const filterResult = filterFolkCare({
        searchTerm: search,
        category: category === ALL_CATEGORIES_ID ? undefined : category,
        sensitiveGroups: sensitiveGroups,
        hasRedFlag: redFlags.length > 0,
    });
    const filteredItems = filterResult.items;
    return (_jsxs("div", { className: "screen folk-screen", children: [_jsxs("div", { className: "folk-header", children: [_jsx("h1", { className: "folk-title", children: "C\u1EA9m nang ch\u0103m s\u00F3c \u0111\u1EDDi s\u1ED1ng" }), _jsx("p", { className: "folk-subtitle", children: "M\u1ED9t s\u1ED1 g\u1EE3i \u00FD ch\u0103m s\u00F3c nh\u1EB9 khi g\u1EB7p kh\u00F3 ch\u1ECBu th\u01B0\u1EDDng ng\u00E0y. N\u1ED9i dung ch\u1EC9 mang t\u00EDnh tham kh\u1EA3o, kh\u00F4ng thay th\u1EBF b\u00E1c s\u0129 ho\u1EB7c th\u1EA7y thu\u1ED1c." }), _jsx("button", { className: "folk-back-btn", onClick: onBack, children: "\u2190 Quay l\u1EA1i" })] }), _jsxs("div", { className: "folk-toolbar", children: [_jsx("div", { className: "folk-search", children: _jsx("input", { type: "text", placeholder: "T\u00ECm t\u00ECnh hu\u1ED1ng: \u0111\u1EA7y b\u1EE5ng, kh\u00F3 ng\u1EE7, l\u1EA1nh tay ch\u00E2n...", value: search, onChange: (e) => setSearch(e.target.value), className: "folk-search-input" }) }), _jsxs("div", { className: "folk-category-row", children: [_jsx("button", { className: `folk-chip ${category === ALL_CATEGORIES_ID ? 'active' : ''}`, onClick: () => setCategory(ALL_CATEGORIES_ID), children: ALL_CATEGORIES_LABEL }), FOLK_CARE_CATEGORIES.map((cat) => (_jsxs("button", { className: `folk-chip ${category === cat.id ? 'active' : ''}`, onClick: () => setCategory(cat.id), children: [cat.icon, " ", cat.name] }, cat.id)))] }), _jsxs("div", { className: "folk-sensitive-box", children: [_jsx("p", { className: "folk-sensitive-label", children: "B\u1EA1n c\u00F3 thu\u1ED9c nh\u00F3m c\u1EA7n th\u1EADn tr\u1ECDng kh\u00F4ng?" }), _jsx("div", { className: "folk-sensitive-options", children: SENSITIVE_GROUPS.map((group) => (_jsxs("label", { className: "folk-sensitive-checkbox", children: [_jsx("input", { type: "checkbox", checked: sensitiveGroups.includes(group.id), onChange: (e) => {
                                                if (e.target.checked) {
                                                    setSensitiveGroups([...sensitiveGroups, group.id]);
                                                }
                                                else {
                                                    setSensitiveGroups(sensitiveGroups.filter((id) => id !== group.id));
                                                }
                                            } }), group.label] }, group.id))) })] }), _jsxs("div", { className: "folk-warning", children: [_jsx("p", { className: "folk-warning-label", children: "D\u1EA5u hi\u1EC7u c\u1EA7n l\u01B0u \u00FD (ch\u1ECDn n\u1EBFu c\u00F3):" }), _jsx("div", { className: "folk-redflag-options", children: getRedFlags().map((flag) => (_jsxs("label", { className: "folk-redflag-checkbox", children: [_jsx("input", { type: "checkbox", checked: redFlags.includes(flag.id), onChange: (e) => {
                                                if (e.target.checked) {
                                                    setRedFlags([...redFlags, flag.id]);
                                                }
                                                else {
                                                    setRedFlags(redFlags.filter((id) => id !== flag.id));
                                                }
                                            } }), flag.label] }, flag.id))) })] })] }), _jsxs("div", { className: "folk-content", children: [redFlags.length > 0 && (_jsxs("div", { className: "folk-emergency", children: [_jsx("div", { className: "folk-emergency-icon", children: "\uD83D\uDEA8" }), _jsx("p", { className: "folk-emergency-text", children: EMERGENCY_MESSAGE })] })), filterResult.filteredDueToSensitive && (_jsx("div", { className: "folk-sensitive-warning", children: _jsx("p", { children: SENSITIVE_GROUP_WARNING }) })), !redFlags.length && (_jsx("div", { className: "folk-card-grid", children: filteredItems.length === 0 ? (_jsx("p", { className: "folk-no-results", children: "Kh\u00F4ng t\u00ECm th\u1EA5y k\u1EBFt qu\u1EA3 ph\u00F9 h\u1EE3p. Th\u1EED t\u1EEB kh\u00F3a kh\u00E1c ho\u1EB7c ch\u1ECDn danh m\u1EE5c kh\u00E1c." })) : (filteredItems.map((item) => (_jsxs("div", { className: "folk-card", onClick: () => setSelectedItem(item), children: [_jsxs("div", { className: "folk-card-header", children: [_jsx("span", { className: "folk-card-category", children: FOLK_CARE_CATEGORIES.find((c) => c.id === item.category)?.icon }), _jsx("h3", { className: "folk-card-title", children: item.title }), _jsx("span", { className: `folk-card-safety folk-card-safety-${item.safetyLevel}`, children: item.safetyLevel === 'safe' ? 'An toàn' : item.safetyLevel === 'moderate' ? 'Thận trọng' : 'Hỏi bác sĩ' })] }), _jsx("p", { className: "folk-card-situation", children: item.situation }), _jsx("div", { className: "folk-card-signs", children: item.commonSigns.slice(0, 3).map((sign, i) => (_jsxs("span", { className: "folk-card-sign", children: ["\u2022 ", sign] }, i))) }), _jsx("button", { className: "folk-card-btn", children: "Xem g\u1EE3i \u00FD an to\u00E0n \u2192" })] }, item.id)))) }))] }), selectedItem && (_jsx("div", { className: "folk-detail-overlay", onClick: () => setSelectedItem(null), children: _jsxs("div", { className: "folk-detail", onClick: (e) => e.stopPropagation(), children: [_jsx("button", { className: "folk-detail-close", onClick: () => setSelectedItem(null), children: "\u2715" }), _jsx("h2", { className: "folk-detail-title", children: selectedItem.title }), _jsx("p", { className: "folk-detail-situation", children: selectedItem.situation }), _jsxs("div", { className: "folk-detail-section", children: [_jsx("h4", { children: "D\u1EA5u hi\u1EC7u th\u01B0\u1EDDng g\u1EB7p" }), _jsx("ul", { children: selectedItem.commonSigns.map((s, i) => _jsx("li", { children: s }, i)) })] }), _jsxs("div", { className: "folk-detail-section", children: [_jsx("h4", { children: "C\u00F3 th\u1EC3 th\u1EED" }), _jsx("ul", { children: selectedItem.safeCare.map((c, i) => _jsx("li", { children: c }, i)) })] }), (!sensitiveGroups.length || !selectedItem.hasFolkIngredients) && selectedItem.folkNotes && (_jsxs("div", { className: "folk-detail-section folk-detail-folk", children: [_jsx("h4", { children: "Ghi ch\u00FA d\u00E2n gian tham kh\u1EA3o" }), _jsx("ul", { children: selectedItem.folkNotes.map((n, i) => _jsx("li", { children: n }, i)) })] })), sensitiveGroups.length > 0 && selectedItem.hasFolkIngredients && (_jsx("div", { className: "folk-detail-section folk-detail-sensitive", children: _jsx("p", { children: _jsx("strong", { children: "\u26A0\uFE0F V\u1EDBi nh\u00F3m c\u1EA7n th\u1EADn tr\u1ECDng, app kh\u00F4ng hi\u1EC3n th\u1ECB m\u1EB9o d\u00E2n gian c\u00F3 nguy\u00EAn li\u1EC7u. B\u1EA1n n\u00EAn h\u1ECFi b\u00E1c s\u0129 ho\u1EB7c chuy\u00EAn gia ph\u00F9 h\u1EE3p." }) }) })), _jsxs("div", { className: "folk-detail-section", children: [_jsx("h4", { children: "\u0102n u\u1ED1ng / sinh ho\u1EA1t" }), _jsx("ul", { children: selectedItem.foodLifestyleNotes.map((n, i) => _jsx("li", { children: n }, i)) })] }), _jsxs("div", { className: "folk-detail-section", children: [_jsx("h4", { children: "N\u00EAn tr\u00E1nh" }), _jsx("ul", { children: selectedItem.avoid.map((a, i) => _jsx("li", { children: a }, i)) })] }), _jsxs("div", { className: "folk-detail-section", children: [_jsx("h4", { children: "Kh\u00F4ng ph\u00F9 h\u1EE3p cho" }), _jsx("ul", { children: selectedItem.notFor.map((n, i) => _jsx("li", { children: n }, i)) })] }), _jsxs("div", { className: "folk-detail-section folk-detail-doctor", children: [_jsx("h4", { children: "Khi n\u00E0o n\u00EAn \u0111i kh\u00E1m" }), _jsx("ul", { children: selectedItem.whenToSeeDoctor.map((d, i) => _jsx("li", { children: d }, i)) })] }), selectedItem.redFlags.length > 0 && (_jsxs("div", { className: "folk-detail-section folk-detail-redflags", children: [_jsx("h4", { children: "C\u1EA3nh b\u00E1o" }), _jsx("ul", { children: selectedItem.redFlags.map((r, i) => _jsxs("li", { children: ["\u26A0\uFE0F ", r] }, i)) })] })), _jsx("div", { className: "folk-detail-disclaimer", children: _jsx("p", { children: "Th\u00F4ng tin ch\u1EC9 mang t\u00EDnh tham kh\u1EA3o, kh\u00F4ng ph\u1EA3i ch\u1EA9n \u0111o\u00E1n hay h\u01B0\u1EDBng d\u1EABn \u0111i\u1EC1u tr\u1ECB." }) })] }) }))] }));
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
    return (_jsxs("div", { className: "yhoc-app", children: [_jsxs("header", { className: "app-header", children: [_jsxs("a", { href: "/nguthuat", className: "header-brand", children: [_jsx("span", { className: "header-logo", children: "\u262F" }), _jsxs("div", { children: [_jsx("div", { className: "header-eyebrow", children: "Ng\u0169 thu\u1EADt / Y" }), _jsx("div", { className: "header-name", children: "Y h\u1ECDc c\u1ED5 h\u1ECDc tham kh\u1EA3o" })] })] }), _jsx("nav", { className: "header-nav", children: ['hero', 'safety', 'form', 'result', 'folk', 'learn'].map((s) => (_jsx("button", { className: `header-nav-btn${screen === s ? ' active' : ''}`, onClick: () => setScreen(s), children: { hero: 'Trang đầu', safety: 'Nguyên tắc', form: 'Tự quan sát', result: 'Kết quả', folk: 'Cẩm nang', learn: 'Tự học' }[s] }, s))) })] }), _jsxs("main", { className: "app-main", children: [screen === 'hero' && _jsx(HeroScreen, { onNext: goSafety, onSafety: goSafety }), screen === 'safety' && _jsx(SafetyScreen, { onNext: handleSafety, onBack: goHero }), screen === 'form' && _jsx(FormScreen, { onSubmit: handleSubmit, onBack: goSafety }), screen === 'result' && _jsx(ResultScreen, { answers: answers, onReset: goHero, onLearn: goLearn, onFolk: () => setScreen('folk') }), screen === 'folk' && _jsx(FolkCareScreen, { onBack: () => setScreen(Object.keys(answers).length > 0 ? 'result' : 'hero') }), screen === 'learn' && _jsx(LearnScreen, { onBack: () => setScreen(Object.keys(answers).length > 0 ? 'result' : 'hero') })] }), _jsx("footer", { className: "app-footer", children: _jsx("span", { children: "Ch\u1EC9 mang t\u00EDnh tham kh\u1EA3o \u2013 kh\u00F4ng thay th\u1EBF b\u00E1c s\u0129 \u2013 n\u00EAn \u0111i kh\u00E1m n\u1EBFu c\u00F3 d\u1EA5u hi\u1EC7u b\u1EA5t th\u01B0\u1EDDng." }) })] }));
}
