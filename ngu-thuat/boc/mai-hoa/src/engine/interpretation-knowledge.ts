export interface KnowledgeBase {
  simpleExplanation: string;
  keyInsights: string[];
  contextualGuidance: Record<string, string[]>;
  warningNotes: string[];
}

const elementSymbols: Record<string, string> = {
  "Kim": "🔶 Kim (kim loại) - Cứng cỏi, ranh giới rõ ràng",
  "Thủy": "🔵 Thủy (nước) - Linh hoạt, thích ứng, chảy theo",
  "Mộc": "🟢 Mộc (gỗ) - Phát triển, tăng trưởng, sáng tạo",
  "Hỏa": "🔴 Hỏa (lửa) - Năng động, sáng suốt, nhanh chóng",
  "Thổ": "🟡 Thổ (đất) - Ổn định, chứa đựng, nuôi dưỡng"
};

const relationshipMeanings: Record<string, string> = {
  "sinh": "hỗ trợ, giúp đỡ, tạo điều kiện thuận lợi",
  "bi-sinh": "được hỗ trợ, có sự giúp đỡ từ bên ngoài",
  "khac": "cản trở, xung đột, cần điều chỉnh",
  "bi-khac": "bị cản trở, gặp khó khăn, cần thích ứng",
  "same": "cùng nhịp điệu, hòa hợp"
};

export function getElementExplanation(element: string): string {
  return elementSymbols[element] || element;
}

export function getRelationshipMeaning(relation: string): string {
  return relationshipMeanings[relation] || relation;
}

export const questionTypeKnowledge: Record<string, KnowledgeBase> = {
  general: {
    simpleExplanation: "Quan sát tổng thể tình huống từ nhiều góc độ, không kết luận quá sớm.",
    keyInsights: [
      "Quẻ chủ cho thấy xu hướng chính của tình thế",
      "Quẻ hỗ gợi ý những khía cạnh ẩn hoặc phía sau",
      "Quẻ biến chỉ ra hướng phát triển tiếp theo"
    ],
    contextualGuidance: {
      career: [
        "Nhìn vào vị trí hiện tại (quẻ chủ) và cơ hội phát triển (quẻ biến)",
        "Quẻ hỗ có thể chỉ những yếu tố bạn chưa chú ý đến"
      ],
      relationship: [
        "Quẻ chủ phản ánh trạng thái hiện tại của mối quan hệ",
        "Quẻ hỗ gợi ý cách cảm nhận của đối phương hoặc yếu tố ẩn"
      ],
      health: [
        "Quan sát các dấu hiệu cơ thể và thói quen sinh hoạt",
        "Không nên chẩn đoán bệnh dựa trên kết quả này"
      ]
    },
    warningNotes: [
      "Kết quả này là tham khảo, không phải dự báo chắc chắn"
    ]
  },

  career: {
    simpleExplanation: "Nhìn vào sự phối hợp giữa năng lực bản thân (thể) và điều kiện bên ngoài (dụng), cùng với thời điểm thích hợp.",
    keyInsights: [
      "Thể (body): năng lực, vị trí, tình trạng hiện tại của bạn",
      "Dụng (usage): môi trường, cơ hội, yêu cầu của công việc",
      "Quan hệ giữa thể-dụng cho thấy liệu bạn có phù hợp với công việc này không"
    ],
    contextualGuidance: {
      promotion: [
        "Nếu thể-dụng hòa hợp (sinh): bạn sẵn sàng cho bước tiến",
        "Nếu thể-dụng xung đột (khắc): cần chuẩn bị thêm hoặc điều chỉnh kỳ vọng"
      ],
      jobChange: [
        "Quẻ chủ cho thấy tình trạng công việc hiện tại",
        "Quẻ biến chỉ ra công việc mới có thể mang lại gì",
        "Hào động (moving line) chỉ điểm cần thay đổi"
      ],
      teamwork: [
        "Thể: bạn và kỹ năng của bạn",
        "Dụng: đội nhóm và yêu cầu công việc",
        "Quan hệ thể-dụng cho thấy liệu bạn có hợp tác tốt không"
      ]
    },
    warningNotes: [
      "Quyết định công việc nên dựa trên phân tích thực tế: lương, môi trường, phát triển",
      "Tham khảo ý kiến từ người có kinh nghiệm hoặc cấp trên"
    ]
  },

  relationship: {
    simpleExplanation: "Nhìn vào sự cân bằng giữa hai bên: bạn (thể) và đối phương (dụng), cùng với khả năng giao tiếp và lắng nghe.",
    keyInsights: [
      "Thể: bạn, cảm xúc, nhu cầu của bạn",
      "Dụng: đối phương, cảm xúc, nhu cầu của họ",
      "Quan hệ thể-dụng cho thấy liệu hai bên có hòa hợp không"
    ],
    contextualGuidance: {
      romance: [
        "Nếu thể-dụng sinh: hai bên có thể hỗ trợ nhau",
        "Nếu thể-dụng khắc: cần giao tiếp cởi mở để giải quyết bất đồng",
        "Quẻ hỗ có thể chỉ những cảm xúc chưa được nói ra"
      ],
      friendship: [
        "Quẻ chủ cho thấy trạng thái tình bạn hiện tại",
        "Quẻ biến gợi ý cách mối quan hệ có thể phát triển",
        "Hào động chỉ ra điểm cần chú ý hoặc cải thiện"
      ],
      family: [
        "Thể: bạn và vị trí của bạn trong gia đình",
        "Dụng: người thân khác và nhu cầu của họ",
        "Hòa khí gia đình phụ thuộc vào sự thấu hiểu lẫn nhau"
      ]
    },
    warningNotes: [
      "Giao tiếp cởi mở thường quan trọng hơn bất kỳ dự báo nào",
      "Nên lắng nghe quan điểm của đối phương thay vì chỉ tập trung vào ý kiến riêng"
    ]
  },

  health: {
    simpleExplanation: "Quan sát tình trạng cơ thể và tinh thần, nhưng KHÔNG thay thế chẩn đoán y tế. Nếu có vấn đề, hãy đi khám bác sĩ.",
    keyInsights: [
      "Quẻ chủ cho thấy tình trạng sức khỏe hiện tại",
      "Quẻ hỗ gợi ý những yếu tố ẩn (stress, thói quen, môi trường)",
      "Quẻ biến chỉ ra hướng phục hồi hoặc cần chú ý"
    ],
    contextualGuidance: {
      prevention: [
        "Giữ thói quen sinh hoạt điều độ: ngủ đủ, ăn uống cân bằng, vận động",
        "Quẻ chỉ ra những khía cạnh cần chú ý, nhưng không phải chẩn đoán"
      ],
      recovery: [
        "Nếu đang điều trị, hãy tuân theo hướng dẫn của bác sĩ",
        "Quẻ có thể gợi ý những điều cần kiên nhẫn hoặc thay đổi"
      ],
      mentalHealth: [
        "Stress, lo âu, mệt mỏi có thể ảnh hưởng đến sức khỏe toàn thân",
        "Nên tìm cách thư giãn, tập trung và lắng nghe cơ thể"
      ]
    },
    warningNotes: [
      "⚠️ QUAN TRỌNG: Kết quả này KHÔNG thay thế chẩn đoán y tế",
      "Nếu có triệu chứng bất thường hoặc kéo dài, hãy đi khám bác sĩ ngay",
      "Tự quan sát sức khỏe là tốt, nhưng không nên tự chẩn đoán"
    ]
  },

  major_finance: {
    simpleExplanation: "Đây là quyết định tài chính quan trọng. Quẻ chỉ là tham khảo, KHÔNG nên dựa vào nó để đầu tư hoặc vay mượn lớn.",
    keyInsights: [
      "Thể: tài chính hiện tại, khả năng của bạn",
      "Dụng: cơ hội, rủi ro, điều kiện thị trường",
      "Quan hệ thể-dụng cho thấy liệu bạn sẵn sàng hay cần chuẩn bị thêm"
    ],
    contextualGuidance: {
      investment: [
        "Không nên đầu tư dựa vào kết quả này",
        "Hãy tham khảo chuyên gia tài chính, phân tích thị trường, và hiểu rõ rủi ro",
        "Chỉ đầu tư số tiền bạn có thể mất"
      ],
      loan: [
        "Nếu đang cân nhắc vay, hãy tính toán kỹ lưỡng: lãi suất, kỳ hạn, khả năng trả",
        "Quẻ có thể gợi ý thời điểm, nhưng quyết định cuối cùng dựa trên số liệu thực"
      ],
      business: [
        "Kinh doanh có rủi ro cao. Cần kế hoạch chi tiết, vốn dự phòng, và sự chuẩn bị",
        "Quẻ chỉ là một góc nhìn, không phải bảo đảm thành công"
      ]
    },
    warningNotes: [
      "⚠️ CẢNH BÁO: Đây là vấn đề tài chính quan trọng",
      "KHÔNG nên dựa vào kết quả này để quyết định đầu tư, vay mượn, hoặc kinh doanh",
      "Hãy tham khảo chuyên gia tài chính, luật sư, hoặc người có kinh nghiệm",
      "Phân tích thực tế (số liệu, thị trường, rủi ro) quan trọng hơn bất kỳ dự báo nào"
    ]
  },

  small_finance: {
    simpleExplanation: "Cân nhắc kỹ lưỡng trước khi chi tiêu hoặc quyết định tài chính nhỏ. Tránh quyết định nóng vội.",
    keyInsights: [
      "Quẻ chủ cho thấy tình trạng tài chính hiện tại",
      "Quẻ hỗ gợi ý những yếu tố cần xem xét (nhu cầu vs muốn)",
      "Quẻ biến chỉ ra hậu quả hoặc lợi ích dài hạn"
    ],
    contextualGuidance: {
      shopping: [
        "Hãy hỏi bản thân: đây là nhu cầu hay muốn?",
        "Chờ vài ngày trước khi mua hàng không cần thiết"
      ],
      saving: [
        "Quẻ có thể gợi ý thời điểm tốt để tiết kiệm hoặc chi tiêu",
        "Lập kế hoạch tài chính hàng tháng sẽ giúp bạn kiểm soát tốt hơn"
      ]
    },
    warningNotes: [
      "Tránh quyết định tài chính khi tâm trạng không ổn định",
      "Lập ngân sách và tuân thủ nó sẽ hiệu quả hơn bất kỳ dự báo nào"
    ]
  },

  study: {
    simpleExplanation: "Kết quả học tập phụ thuộc nhiều vào sự chuẩn bị, độ bền, và phương pháp học. Quẻ gợi ý hướng cải thiện.",
    keyInsights: [
      "Quẻ chủ cho thấy tình trạng học tập hiện tại",
      "Quẻ hỗ gợi ý những khía cạnh cần chú ý (phương pháp, thời gian, tâm lý)",
      "Quẻ biến chỉ ra kết quả có thể đạt được với sự chuẩn bị"
    ],
    contextualGuidance: {
      exam: [
        "Chuẩn bị kỹ lưỡng: ôn tập, làm bài tập, hiểu rõ kiến thức",
        "Quẻ có thể gợi ý cách tiếp cận hoặc điều cần chú ý"
      ],
      learning: [
        "Tìm phương pháp học phù hợp với bạn (nghe, đọc, viết, thực hành)",
        "Kiên trì và đều đặn quan trọng hơn học nhiều một lần"
      ]
    },
    warningNotes: [
      "Không nên dựa vào kết quả này thay vì chuẩn bị kỹ lưỡng",
      "Thành công học tập phụ thuộc vào nỗ lực và phương pháp của bạn"
    ]
  },

  travel: {
    simpleExplanation: "Chuẩn bị kỹ lưỡng trước khi đi: kiểm tra giấy tờ, lộ trình, an toàn, và có phương án dự phòng.",
    keyInsights: [
      "Quẻ chủ cho thấy tình trạng chuẩn bị hiện tại",
      "Quẻ hỗ gợi ý những rủi ro hoặc yếu tố cần chú ý",
      "Quẻ biến chỉ ra kết quả hoặc trải nghiệm có thể có"
    ],
    contextualGuidance: {
      safety: [
        "Kiểm tra giấy tờ: hộ chiếu, visa, bảo hiểm du lịch",
        "Thông báo cho gia đình hoặc bạn bè về lộ trình của bạn"
      ],
      planning: [
        "Lập kế hoạch chi tiết: nơi ở, phương tiện, chi phí",
        "Chuẩn bị phương án dự phòng cho tình huống bất ngờ"
      ]
    },
    warningNotes: [
      "An toàn là ưu tiên hàng đầu",
      "Không nên đi du lịch khi tâm trạng không ổn định hoặc chưa chuẩn bị"
    ]
  },

  choice: {
    simpleExplanation: "So sánh ưu/nhược điểm của từng phương án, sau đó quyết định dựa trên phân tích thực tế, không chỉ cảm tính.",
    keyInsights: [
      "Quẻ chủ cho thấy phương án A hoặc tình trạng hiện tại",
      "Quẻ hỗ cho thấy phương án B hoặc khía cạnh khác",
      "Quẻ biến chỉ ra hậu quả hoặc kết quả dài hạn"
    ],
    contextualGuidance: {
      decisionMaking: [
        "Liệt kê ưu/nhược điểm của từng phương án",
        "Xem xét giá trị của bạn: cái gì quan trọng nhất?",
        "Tưởng tượng kết quả 1 năm sau, 5 năm sau"
      ]
    },
    warningNotes: [
      "Quyết định cuối cùng nên dựa trên phân tích, không chỉ cảm giác",
      "Hãy tham khảo ý kiến từ người tin tưởng, nhưng quyết định là của bạn"
    ]
  },

  timing: {
    simpleExplanation: "Quan sát điều kiện chín muồi: không phải mọi thứ đều sẵn sàng cùng lúc. Cần kiên nhẫn hoặc hành động nhanh tùy tình huống.",
    keyInsights: [
      "Quẻ chủ cho thấy tình trạng hiện tại",
      "Quẻ hỗ gợi ý những yếu tố chưa sẵn sàng hoặc cần chú ý",
      "Quẻ biến chỉ ra thời điểm thích hợp hoặc hậu quả"
    ],
    contextualGuidance: {
      waiting: [
        "Nếu quẻ gợi ý chưa sẵn sàng, hãy chuẩn bị thêm hoặc chờ",
        "Kiên nhẫn thường mang lại kết quả tốt hơn vội vày"
      ],
      action: [
        "Nếu quẻ gợi ý sẵn sàng, hãy hành động quyết đoán",
        "Thời điểm tốt không kéo dài lâu, cần nắm bắt"
      ]
    },
    warningNotes: [
      "Điều kiện chín muồi phụ thuộc vào nhiều yếu tố, không chỉ thời gian",
      "Hãy quan sát thực tế và điều chỉnh kế hoạch nếu cần"
    ]
  },

  family: {
    simpleExplanation: "Nhìn vào sự cân bằng giữa các thành viên gia đình: vai trò, nhu cầu, và cách giao tiếp. Hòa khí gia đình phụ thuộc vào sự thấu hiểu lẫn nhau.",
    keyInsights: [
      "Thể: bạn và vị trí của bạn trong gia đình",
      "Dụng: người thân khác và nhu cầu của họ",
      "Quan hệ thể-dụng cho thấy liệu có hòa hợp hay cần điều chỉnh"
    ],
    contextualGuidance: {
      parentChild: [
        "Hiểu rõ kỳ vọng và nhu cầu của cả hai bên",
        "Giao tiếp cởi mở thường giải quyết được nhiều xung đột"
      ],
      siblings: [
        "Quẻ chủ cho thấy trạng thái hiện tại của mối quan hệ",
        "Quẻ biến gợi ý cách mối quan hệ có thể phát triển"
      ],
      elderCare: [
        "Tôn trọng và lắng nghe là nền tảng",
        "Cân bằng giữa chăm sóc và giữ gìn độc lập của người cao tuổi"
      ]
    },
    warningNotes: [
      "Giao tiếp cởi mở thường quan trọng hơn bất kỳ dự báo nào",
      "Nên tìm sự hòa giải thay vì chỉ tập trung vào ý kiến riêng"
    ]
  },

  lost_item: {
    simpleExplanation: "Quẻ chỉ gợi ý hướng quan sát hoặc nơi cần tìm kiếm, không khẳng định chắc chắn vị trí. Hãy kết hợp với logic và tìm kiếm thực tế.",
    keyInsights: [
      "Quẻ chủ cho thấy tình trạng của vật thất lạc",
      "Quẻ hỗ gợi ý những nơi hoặc điều kiện cần chú ý",
      "Quẻ biến chỉ ra khả năng tìm thấy hoặc hướng tìm kiếm"
    ],
    contextualGuidance: {
      lostObject: [
        "Hãy nhớ lại nơi cuối cùng bạn thấy vật đó",
        "Quẻ có thể gợi ý những nơi bạn chưa kiểm tra kỹ"
      ],
      lostPerson: [
        "Liên hệ với cơ quan chức năng nếu cần thiết",
        "Quẻ chỉ là tham khảo, không thay thế hành động thực tế"
      ]
    },
    warningNotes: [
      "Kết quả này là gợi ý, không phải khẳng định chắc chắn",
      "Nên kết hợp với tìm kiếm thực tế và logic"
    ]
  },

  reflection: {
    simpleExplanation: "Quan sát tâm thế và phản ứng bên trong của bạn. Quẻ gợi ý những khía cạnh cần chú ý hoặc suy ngẫm sâu hơn.",
    keyInsights: [
      "Quẻ chủ cho thấy trạng thái tâm lý hiện tại",
      "Quẻ hỗ gợi ý những cảm xúc hoặc suy nghĩ ẩn",
      "Quẻ biến chỉ ra hướng phát triển tâm thế hoặc nhận thức"
    ],
    contextualGuidance: {
      emotionalState: [
        "Hãy lắng nghe cơ thể và cảm xúc của bạn",
        "Tìm hiểu nguồn gốc của cảm xúc thay vì chỉ phản ứng"
      ],
      selfAwareness: [
        "Quan sát những mô hình lặp lại trong hành động của bạn",
        "Tự phản tư giúp bạn hiểu rõ hơn về bản thân"
      ],
      growth: [
        "Quẻ có thể gợi ý những khía cạnh cần phát triển",
        "Sự thay đổi bắt đầu từ nhận thức và ý định"
      ]
    },
    warningNotes: [
      "Tự phản tư là công cụ tốt, nhưng không thay thế tư vấn tâm lý",
      "Nếu gặp vấn đề tâm lý nghiêm trọng, hãy tìm sự giúp đỡ chuyên môn"
    ]
  },

  other: {
    simpleExplanation: "Giữ diễn giải thận trọng theo bối cảnh cụ thể của câu hỏi. Không khẳng định chắc chắn, mà gợi ý những khía cạnh cần xem xét.",
    keyInsights: [
      "Quẻ chủ cho thấy tình trạng hoặc xu hướng chính",
      "Quẻ hỗ gợi ý những khía cạnh ẩn hoặc phía sau",
      "Quẻ biến chỉ ra hướng phát triển hoặc hậu quả tiềm năng"
    ],
    contextualGuidance: {
      general: [
        "Xem xét bối cảnh cụ thể của câu hỏi",
        "Không nên quá tin tưởng vào kết quả, hãy kết hợp với phán đoán thực tế"
      ]
    },
    warningNotes: [
      "Kết quả này là tham khảo, không phải dự báo chắc chắn",
      "Hãy sử dụng lý trí và kinh nghiệm để đánh giá kết quả"
    ]
  }
};

export function getKnowledgeForQuestion(questionType?: { id: string; label: string }): KnowledgeBase | null {
  if (!questionType) return null;
  return questionTypeKnowledge[questionType.id] || null;
}
