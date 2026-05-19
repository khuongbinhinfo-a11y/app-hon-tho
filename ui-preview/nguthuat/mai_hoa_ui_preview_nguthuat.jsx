import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Compass,
  History,
  Info,
  Moon,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  Timer,
  Wand2,
} from "lucide-react";

const trigrams = [
  { name: "Càn", han: "乾", symbol: "☰", element: "Kim", image: "Trời", tone: "kiện, sáng, chủ động" },
  { name: "Đoài", han: "兌", symbol: "☱", element: "Kim", image: "Đầm", tone: "vui, nói, mở" },
  { name: "Ly", han: "離", symbol: "☲", element: "Hỏa", image: "Lửa", tone: "sáng, rõ, bám" },
  { name: "Chấn", han: "震", symbol: "☳", element: "Mộc", image: "Sấm", tone: "động, khởi, thức" },
  { name: "Tốn", han: "巽", symbol: "☴", element: "Mộc", image: "Gió", tone: "nhập, mềm, lan" },
  { name: "Khảm", han: "坎", symbol: "☵", element: "Thủy", image: "Nước", tone: "sâu, hiểm, trí" },
  { name: "Cấn", han: "艮", symbol: "☶", element: "Thổ", image: "Núi", tone: "dừng, giữ, tĩnh" },
  { name: "Khôn", han: "坤", symbol: "☷", element: "Thổ", image: "Đất", tone: "thuận, chứa, nuôi" },
];

const exampleCards = [
  {
    icon: Compass,
    title: "Lập quẻ theo thời gian",
    text: "Dùng năm, tháng, ngày, giờ để ra thượng quái, hạ quái và hào động.",
  },
  {
    icon: RotateCcw,
    title: "Quẻ chủ, quẻ hỗ, quẻ biến",
    text: "Hiển thị từng tầng quẻ để người học quan sát diễn biến tượng.",
  },
  {
    icon: BookOpen,
    title: "Tra 64 quẻ",
    text: "Tóm tắt nghĩa quẻ, chủ đề, lời đọc an toàn và điều cần tránh phán cứng.",
  },
  {
    icon: ShieldAlert,
    title: "Vùng an toàn",
    text: "Không quyết định thay người dùng, không hù dọa, không phán chắc tốt xấu.",
  },
];

const hexagramLines = [true, false, true, true, false, false];

function HexLine({ yang, active }: { yang: boolean; active?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {yang ? (
        <div className={`h-3 w-36 rounded-full ${active ? "bg-amber-300" : "bg-stone-100"}`} />
      ) : (
        <>
          <div className={`h-3 w-14 rounded-full ${active ? "bg-amber-300" : "bg-stone-100"}`} />
          <div className="w-8" />
          <div className={`h-3 w-14 rounded-full ${active ? "bg-amber-300" : "bg-stone-100"}`} />
        </>
      )}
    </div>
  );
}

export default function MaiHoaUiPreviewNguthuat() {
  const [questionType, setQuestionType] = useState("Tổng quan một việc");
  const [query, setQuery] = useState("Tôi nên quan sát điều gì trong việc này?");

  const selectedRisk = useMemo(() => {
    if (["Sức khỏe", "Tài chính lớn", "Kiện tụng", "Hôn nhân/ly hôn"].includes(questionType)) return "Cần thận trọng";
    return "Tham khảo nhẹ";
  }, [questionType]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#3b2a1a_0%,#16110d_42%,#090706_100%)] text-stone-100">
      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-amber-200/15 bg-stone-950/45 p-5 shadow-2xl shadow-black/30 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300 text-2xl text-stone-950 shadow-lg shadow-amber-900/20">
              ☯
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-amber-200/80">Ngũ thuật / Bốc</p>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Mai Hoa Dịch Số</h1>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm text-stone-300">
            {["Lập quẻ", "64 quẻ", "8 quái", "Nhật ký", "An toàn"].map((item) => (
              <span key={item} className="rounded-full border border-stone-700/80 px-4 py-2 hover:border-amber-300/60 hover:text-amber-100">
                {item}
              </span>
            ))}
          </nav>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-[2rem] border border-amber-200/15 bg-stone-950/55 p-6 shadow-2xl shadow-black/30 backdrop-blur"
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
              <Sparkles size={16} />
              UI preview cho dev, không phải bản luận quẻ thật
            </div>

            <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center">
              <div>
                <h2 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                  Lập quẻ như mở một chiếc la bàn nội tâm.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-stone-300 md:text-lg">
                  App định hướng học Dịch, tra tượng, quan sát tình huống và ghi nhật ký quẻ. Không phán chắc, không thay quyết định của người dùng.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button className="rounded-2xl bg-amber-300 px-5 py-3 font-medium text-stone-950 shadow-lg shadow-amber-900/25 hover:bg-amber-200">
                    Lập quẻ thử
                  </button>
                  <button className="rounded-2xl border border-stone-600 px-5 py-3 font-medium text-stone-100 hover:border-amber-300/70 hover:text-amber-100">
                    Xem thư viện 64 quẻ
                  </button>
                </div>
              </div>

              <div className="relative rounded-[2rem] border border-stone-700/70 bg-gradient-to-br from-stone-900 to-stone-950 p-5">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-300/20 blur-3xl" />
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-stone-500">Quẻ mẫu</p>
                    <h3 className="text-2xl font-semibold">Phong Hỏa Gia Nhân</h3>
                  </div>
                  <div className="rounded-2xl bg-stone-800 px-3 py-2 text-3xl">䷤</div>
                </div>
                <div className="space-y-3 rounded-3xl bg-black/25 p-5">
                  {hexagramLines.slice().reverse().map((line, index) => (
                    <HexLine key={index} yang={line} active={index === 2} />
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-2xl border border-stone-700 bg-stone-900/70 p-3">
                    <p className="text-stone-500">Thượng</p>
                    <p className="font-medium text-amber-100">Tốn ☴</p>
                  </div>
                  <div className="rounded-2xl border border-stone-700 bg-stone-900/70 p-3">
                    <p className="text-stone-500">Hạ</p>
                    <p className="font-medium text-amber-100">Ly ☲</p>
                  </div>
                  <div className="rounded-2xl border border-amber-300/25 bg-amber-300/10 p-3">
                    <p className="text-amber-100/70">Động</p>
                    <p className="font-medium text-amber-100">Hào 4</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-[2rem] border border-stone-700/70 bg-stone-950/60 p-5 shadow-2xl shadow-black/25 backdrop-blur"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-amber-200/70">Form MVP</p>
                <h3 className="text-2xl font-semibold">Nhập câu hỏi</h3>
              </div>
              <Wand2 className="text-amber-200" />
            </div>

            <label className="mb-2 block text-sm text-stone-400">Nội dung cần quan sát</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-28 w-full resize-none rounded-3xl border border-stone-700 bg-black/30 p-4 text-stone-100 outline-none ring-0 placeholder:text-stone-600 focus:border-amber-300/70"
            />

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-stone-400">Loại câu hỏi</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full rounded-2xl border border-stone-700 bg-black/30 px-4 py-3 text-stone-100 outline-none focus:border-amber-300/70"
                >
                  {[
                    "Tổng quan một việc",
                    "Công việc",
                    "Học tập",
                    "Quan hệ",
                    "Sức khỏe",
                    "Tài chính lớn",
                    "Kiện tụng",
                    "Hôn nhân/ly hôn",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-stone-400">Cách lập quẻ</label>
                <button className="flex w-full items-center justify-between rounded-2xl border border-stone-700 bg-black/30 px-4 py-3 text-left text-stone-100">
                  <span>Theo thời gian</span>
                  <Timer size={18} className="text-amber-200" />
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-amber-100">
                <ShieldAlert size={18} />
                <span className="font-medium">Mức rủi ro: {selectedRisk}</span>
              </div>
              <p className="text-sm leading-6 text-stone-300">
                Quẻ chỉ gợi ý tượng để suy ngẫm. Với y tế, pháp lý, tài chính lớn hoặc quyết định hệ trọng, cần gặp chuyên gia phù hợp.
              </p>
            </div>

            <button className="mt-5 w-full rounded-2xl bg-stone-100 px-5 py-3 font-semibold text-stone-950 hover:bg-amber-200">
              Xem quẻ tham khảo
            </button>
          </motion.aside>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          {exampleCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.05 }}
                className="rounded-3xl border border-stone-700/70 bg-stone-950/55 p-5 shadow-lg shadow-black/20"
              >
                <Icon className="mb-4 text-amber-200" />
                <h3 className="mb-2 text-lg font-semibold">{card.title}</h3>
                <p className="text-sm leading-6 text-stone-400">{card.text}</p>
              </motion.div>
            );
          })}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-stone-700/70 bg-stone-950/55 p-5 shadow-xl shadow-black/20">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-amber-200/70">Bát quái</p>
                <h3 className="text-2xl font-semibold">8 cánh cửa tượng</h3>
              </div>
              <Compass className="text-amber-200" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              {trigrams.map((item) => (
                <div key={item.name} className="rounded-3xl border border-stone-700 bg-black/25 p-4 hover:border-amber-300/50">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="text-xl font-semibold">{item.name} <span className="text-stone-500">{item.han}</span></p>
                      <p className="text-sm text-stone-400">{item.image} / {item.element}</p>
                    </div>
                    <span className="text-3xl text-amber-100">{item.symbol}</span>
                  </div>
                  <p className="text-sm text-stone-400">{item.tone}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-700/70 bg-stone-950/55 p-5 shadow-xl shadow-black/20">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-amber-200/70">Thư viện</p>
                <h3 className="text-2xl font-semibold">Tra cứu 64 quẻ</h3>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-stone-700 bg-black/30 px-4 py-3 text-stone-400">
                <Search size={18} />
                <span>Tìm quẻ, tượng, chủ đề</span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {[
                { no: 1, name: "Thuần Càn", han: "乾", theme: "Khởi động, chủ động, sáng tạo" },
                { no: 2, name: "Thuần Khôn", han: "坤", theme: "Tiếp nhận, nuôi dưỡng, thuận thế" },
                { no: 3, name: "Thủy Lôi Truân", han: "屯", theme: "Khởi đầu khó, cần trật tự" },
                { no: 37, name: "Phong Hỏa Gia Nhân", han: "家人", theme: "Gia đạo, vai trò, bên trong" },
                { no: 52, name: "Thuần Cấn", han: "艮", theme: "Dừng lại, giữ tĩnh, quan sát" },
                { no: 63, name: "Thủy Hỏa Ký Tế", han: "既濟", theme: "Việc đã thành, giữ cân bằng" },
              ].map((hex) => (
                <article key={hex.no} className="rounded-3xl border border-stone-700 bg-black/25 p-4 hover:border-amber-300/50">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-stone-800 px-3 py-1 text-sm text-stone-300">#{hex.no}</span>
                    <span className="text-2xl text-amber-100">{hex.han}</span>
                  </div>
                  <h4 className="text-lg font-semibold">{hex.name}</h4>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{hex.theme}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-stone-700/70 bg-stone-950/55 p-5 lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <History className="text-amber-200" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-amber-200/70">Nhật ký quẻ</p>
                <h3 className="text-2xl font-semibold">Ghi lại, đối chiếu, học dần</h3>
              </div>
            </div>
            <div className="space-y-3">
              {[
                ["Hôm nay", "Câu hỏi công việc", "Quẻ chủ: Sơn Hỏa Bí", "low"],
                ["Hôm qua", "Quan sát quan hệ", "Quẻ chủ: Phong Trạch Trung Phu", "medium"],
                ["12/05", "Tự phản tỉnh", "Quẻ chủ: Thuần Cấn", "low"],
              ].map(([date, type, result, risk]) => (
                <div key={date} className="flex flex-col gap-3 rounded-3xl border border-stone-700 bg-black/25 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-stone-500">{date}</p>
                    <p className="font-medium text-stone-100">{type}</p>
                    <p className="text-sm text-stone-400">{result}</p>
                  </div>
                  <span className="w-fit rounded-full border border-stone-700 px-3 py-1 text-sm text-stone-300">risk: {risk}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-5">
            <div className="mb-4 flex items-center gap-3 text-amber-100">
              <Info />
              <h3 className="text-xl font-semibold">Câu cảnh báo chuẩn</h3>
            </div>
            <p className="text-sm leading-7 text-stone-200">
              Nội dung trong app chỉ dùng để học cổ học và suy ngẫm. Không xem là kết luận chắc chắn. Không dùng để thay chuyên gia y tế, pháp lý, tài chính hoặc các quyết định hệ trọng.
            </p>
            <div className="mt-5 rounded-3xl border border-amber-300/20 bg-black/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-amber-100">
                <Moon size={18} />
                <span className="font-medium">Tông UI đề nghị</span>
              </div>
              <p className="text-sm leading-6 text-stone-300">
                Nền tối nâu đá, điểm vàng hổ phách, card bo lớn, cảm giác thư viện cổ học nhưng vẫn hiện đại.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-8 rounded-3xl border border-stone-700/70 bg-black/25 p-5 text-sm text-stone-400">
          <p>
            Gợi ý lưu file tham khảo: <span className="text-amber-100">D:\\Wep_Yhocnhanai\\Web_Goc_Binh_Yen\\app-hontho\\ui-preview\\nguthuat\\mai-hoa-ui-preview.tsx</span>
          </p>
        </footer>
      </section>
    </main>
  );
}
