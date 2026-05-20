import type { FiveElementsRelation, CalculationResult, QuestionType } from "./types";
import { getKnowledgeForQuestion, getElementExplanation, getRelationshipMeaning } from "./interpretation-knowledge";

const elementCycle: Record<string, string> = {
  "Kim": "Thủy",
  "Thủy": "Mộc",
  "Mộc": "Hỏa",
  "Hỏa": "Thổ",
  "Thổ": "Kim"
};

const elementOvercome: Record<string, string> = {
  "Kim": "Mộc",
  "Mộc": "Thổ",
  "Thổ": "Thủy",
  "Thủy": "Hỏa",
  "Hỏa": "Kim"
};

export function getFiveElementsRelation(element1: string, element2: string): FiveElementsRelation {
  if (element1 === element2) {
    return { relation: "same", description: "Đồng khí" };
  }
  if (elementCycle[element1] === element2) {
    return { relation: "sinh", description: `${element1} sinh ${element2}` };
  }
  if (elementCycle[element2] === element1) {
    return { relation: "bi-sinh", description: `${element2} sinh ${element1}` };
  }
  if (elementOvercome[element1] === element2) {
    return { relation: "khac", description: `${element1} khắc ${element2}` };
  }
  if (elementOvercome[element2] === element1) {
    return { relation: "bi-khac", description: `${element2} khắc ${element1}` };
  }
  return { relation: "same", description: "Không xác định" };
}

export function generateSafeInterpretation(result: CalculationResult): string[] {
  const interpretations: string[] = [];
  const { primaryHexagram, mutualHexagram, changedHexagram, movingLine, upperTrigram, lowerTrigram } = result;

  // Primary hexagram interpretation
  interpretations.push(`**Quẻ chủ ${primaryHexagram.name_vi}:** ${primaryHexagram.safe_interpretation}`);

  // Body-Usage relation with simple explanation
  let bodyUsageText: string;
  if (movingLine >= 4) {
    const bodyUsage = getFiveElementsRelation(upperTrigram.element, lowerTrigram.element);
    const relationMeaning = getRelationshipMeaning(bodyUsage.relation);
    bodyUsageText = `**Thể-Dụng:** ${upperTrigram.name_vi} (${getElementExplanation(upperTrigram.element)}) → ${lowerTrigram.name_vi} (${getElementExplanation(lowerTrigram.element)}) = ${relationMeaning}`;
  } else {
    const bodyUsage = getFiveElementsRelation(lowerTrigram.element, upperTrigram.element);
    const relationMeaning = getRelationshipMeaning(bodyUsage.relation);
    bodyUsageText = `**Thể-Dụng:** ${lowerTrigram.name_vi} (${getElementExplanation(lowerTrigram.element)}) → ${upperTrigram.name_vi} (${getElementExplanation(upperTrigram.element)}) = ${relationMeaning}`;
  }
  interpretations.push(bodyUsageText);

  // Mutual hexagram interpretation
  interpretations.push(`**Quẻ hỗ ${mutualHexagram.name_vi}:** ${mutualHexagram.safe_interpretation}`);

  // Changed hexagram interpretation
  interpretations.push(`**Quẻ biến ${changedHexagram.name_vi}:** ${changedHexagram.safe_interpretation}`);

  // Moving line guidance
  interpretations.push(`Hào động ${movingLine} cho thấy điểm biến chuyển trong tình thế hiện tại.`);

  // Cautionary note
  interpretations.push("Đây là kết quả tham khảo. Nên kiểm chứng với điều kiện thực tế trước khi quyết định.");

  return interpretations;
}

export function getReflectionQuestions(questionType?: QuestionType): string[] {
  const baseQuestions = [
    "Bạn đã cân nhắc đầy đủ các yếu tố thực tế chưa?",
    "Quyết định này có ảnh hưởng đến người khác không?",
    "Bạn có đang tìm kiếm một câu trả lời cụ thể thay vì hiểu rõ tình thế?",
    "Bạn có sẵn sàng chịu trách nhiệm với quyết định của mình không?"
  ];

  if (!questionType) return baseQuestions;

  const knowledge = getKnowledgeForQuestion(questionType);
  if (!knowledge) return baseQuestions;

  return [...baseQuestions];
}

export function generateContextualInterpretation(
  result: CalculationResult,
  questionType?: QuestionType
): string[] {
  const interpretations = generateSafeInterpretation(result);

  if (!questionType) return interpretations;

  const knowledge = getKnowledgeForQuestion(questionType);
  if (!knowledge) {
    const contextPrefix = `**Bối cảnh: ${questionType.label}**`;
    const toneNote = `*Hướng dẫn: ${questionType.guidanceTone}*`;
    return [contextPrefix, toneNote, "", ...interpretations];
  }

  const contextPrefix = `**Bối cảnh: ${questionType.label}**`;
  const toneNote = `*Hướng dẫn: ${questionType.guidanceTone}*`;
  const simpleExpl = `**Cách tiếp cận:** ${knowledge.simpleExplanation}`;

  const keyInsightsText = knowledge.keyInsights.length > 0
    ? `**Những điểm chính:**\n${knowledge.keyInsights.map(k => `- ${k}`).join("\n")}`
    : "";

  const warningText = knowledge.warningNotes.length > 0
    ? `**Cảnh báo:**\n${knowledge.warningNotes.map(w => `- ${w}`).join("\n")}`
    : "";

  const result_array = [contextPrefix, toneNote, "", simpleExpl];

  if (keyInsightsText) {
    result_array.push("", keyInsightsText);
  }

  result_array.push("", "**Diễn giải chi tiết:**", "");
  result_array.push(...interpretations);

  if (warningText) {
    result_array.push("", warningText);
  }

  return result_array;
}
