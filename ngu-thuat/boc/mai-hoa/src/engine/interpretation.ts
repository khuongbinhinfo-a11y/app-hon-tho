import { FiveElementsRelation, CalculationResult } from "./types";

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
  
  // Body-Usage relation
  // If moving line is in upper trigram (lines 4,5,6), upper is body, lower is usage
  // If moving line is in lower trigram (lines 1,2,3), lower is body, upper is usage
  let bodyUsageText: string;
  if (movingLine >= 4) {
    const bodyUsage = getFiveElementsRelation(upperTrigram.element, lowerTrigram.element);
    bodyUsageText = `Thể: ${upperTrigram.name_vi} (${upperTrigram.element}) | Dụng: ${lowerTrigram.name_vi} (${lowerTrigram.element}) | ${bodyUsage.description}`;
  } else {
    const bodyUsage = getFiveElementsRelation(lowerTrigram.element, upperTrigram.element);
    bodyUsageText = `Thể: ${lowerTrigram.name_vi} (${lowerTrigram.element}) | Dụng: ${upperTrigram.name_vi} (${upperTrigram.element}) | ${bodyUsage.description}`;
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

export function getReflectionQuestions(): string[] {
  return [
    "Bạn đã cân nhắc đầy đủ các yếu tố thực tế chưa?",
    "Quyết định này có ảnh hưởng đến người khác không?",
    "Bạn có đang tìm kiếm một câu trả lời cụ thể thay vì hiểu rõ tình thế?",
    "Bạn có sẵn sàng chịu trách nhiệm với quyết định của mình không?"
  ];
}
