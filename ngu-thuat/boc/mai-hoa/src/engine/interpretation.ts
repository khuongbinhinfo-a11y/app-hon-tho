import type { FiveElementsRelation, CalculationResult, QuestionType } from "./types";

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

export function getReflectionQuestions(questionType?: QuestionType): string[] {
  const baseQuestions = [
    "Bạn đã cân nhắc đầy đủ các yếu tố thực tế chưa?",
    "Quyết định này có ảnh hưởng đến người khác không?",
    "Bạn có đang tìm kiếm một câu trả lời cụ thể thay vì hiểu rõ tình thế?",
    "Bạn có sẵn sàng chịu trách nhiệm với quyết định của mình không?"
  ];

  if (!questionType) return baseQuestions;

  // Add context-specific questions based on question type
  const contextualQuestions: Record<string, string[]> = {
    career: [
      "Bạn đã đánh giá đầy đủ năng lực bản thân và điều kiện thị trường chưa?",
      "Có thể cần tham khảo ý kiến đồng nghiệp hoặc cấp trên trước quyết định."
    ],
    relationship: [
      "Bạn đã lắng nghe quan điểm của đối phương chưa?",
      "Giao tiếp cởi mở thường quan trọng hơn quyết định đơn phương."
    ],
    health: [
      "⚠️ Kết quả này KHÔNG thay thế chẩn đoán y tế.",
      "Nếu có triệu chứng bất thường, hãy đi khám bác sĩ càng sớm càng tốt.",
      "Tự quan sát sức khỏe và giữ thói quen sinh hoạt điều độ là cần thiết."
    ],
    major_finance: [
      "⚠️ Đây là vấn đề tài chính quan trọng.",
      "NÊN tham khảo ý kiến chuyên gia tài chính trước khi quyết định.",
      "Không nên dựa vào kết quả này để đầu tư hoặc quyết định tài chính lớn."
    ],
    small_finance: [
      "Cân nhắc kỹ lưỡng trước khi chi tiêu.",
      "Tránh quyết định nóng vội về tiền bạc."
    ],
    study: [
      "Kết quả học tập phụ thuộc nhiều vào sự chuẩn bị và độ bền.",
      "Có thể cần điều chỉnh phương pháp học phù hợp."
    ],
    travel: [
      "Kiểm tra kỹ các giấy tờ cần thiết trước khi đi.",
      "Chuẩn bị phương án dự phòng cho tình huống bất ngờ."
    ],
    choice: [
      "Hãy liệt kê ưu/nhược điểm của từng phương án.",
      "Quyết định cuối cùng nên dựa trên phân tích thực tế."
    ],
    timing: [
      "Điều kiện chín muồi thường quan trọng hơn thời điểm tuyệt đối.",
      "Cần cân nhắc các yếu tố khách quan xung quanh."
    ]
  };

  const additional = contextualQuestions[questionType.id] || [];
  return [...baseQuestions, ...additional];
}

export function generateContextualInterpretation(
  result: CalculationResult,
  questionType?: QuestionType
): string[] {
  const interpretations = generateSafeInterpretation(result);

  if (!questionType) return interpretations;

  // Add contextual guidance based on question type
  const contextPrefix = `**Bối cảnh: ${questionType.label}**`;
  const toneNote = `*Hướng dẫn: ${questionType.guidanceTone}*`;

  // Add risk level warning for high-risk questions
  if (questionType.riskLevel === "high") {
    if (questionType.id === "health") {
      interpretations.push("⚠️ **Cảnh báo sức khỏe:** Kết quả này chỉ là tham khảo tượng số, hoàn toàn không thay thế chẩn đoán y tế. Nếu có vấn đề sức khỏe, hãy đi khám bác sĩ.");
    } else if (questionType.id === "major_finance") {
      interpretations.push("⚠️ **Cảnh báo tài chính:** Đây là quyết định tài chính quan trọng. Vui lòng tham khảo ý kiến chuyên gia tài chính chuyên nghiệp. Không nên dựa vào kết quả này để đầu tư.");
    }
  }

  // Insert context at the beginning
  return [contextPrefix, toneNote, "", ...interpretations];
}
