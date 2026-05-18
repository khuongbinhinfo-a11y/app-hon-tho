import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function route() {
  return window.location.pathname.replace(/\/$/, "") || "/";
}

function Shell({ children, activePage }: { children: React.ReactNode; activePage?: string }) {
  return (
    <div className="app-shell">
      <nav className="top-nav">
        <a href="/" className="brand">
          <img src="/images/app-home/bg-app-home-hero.webp" className="brand-seal" alt="" aria-hidden="true" />
          <span>Hồn Thơ App</span>
        </a>
        <div className="nav-links">
          <a href="/nguthuat" className={activePage === "nguthuat" ? "nav-active" : ""}>
            <span className="nav-icon">☯</span> Ngũ thuật
          </a>
          <a href="/tam-thuc" className={activePage === "tamthuc" ? "nav-active" : ""}>
            <span className="nav-icon">◎</span> Tam thức
          </a>
          <a href="/account"><span className="nav-icon">👤</span> Tài khoản</a>
          <a href="/history"><span className="nav-icon">🕐</span> Lịch sử</a>
        </div>
      </nav>
      {children}
      <footer className="site-footer">
        <span className="footer-seal">☯</span>
        <span>Hồn Thơ – Tri thức cổ học, thực hành có kiểm soát.</span>
      </footer>
    </div>
  );
}

function Home() {
  return (
    <Shell>
      <div className="home-hero" style={{ backgroundImage: "url('/images/app-home/bg-app-home-hero.webp')" }}>
        <div className="home-hero-overlay" />
        <div className="home-hero-content">
          <div className="ornament">◆</div>
          <h1>Khu ứng dụng Hồn Thơ</h1>
          <p className="lead">
            Không gian ứng dụng của Hồn Thơ – nơi tra cứu, thực hành<br />
            và tham khảo có kiểm soát, chính xác và hệ thống.
          </p>
        </div>
      </div>

      <div className="home-portals-wrap">
        <div className="home-portals">
          <a className="portal-card portal-nguthuat" href="/nguthuat"
            style={{ backgroundImage: "url('/images/app-home/portal-nguthuat.webp')" }}>
            <div className="portal-overlay" />
            <div className="portal-content">
              <div className="portal-symbol">☯</div>
              <h2>Ngũ thuật</h2>
              <div className="portal-divider">◆</div>
              <p className="portal-sub">Sơn · Y · Mệnh · Bốc · Tướng</p>
              <div className="portal-divider-line" />
              <span className="portal-btn">Vào Ngũ thuật <span>›</span></span>
            </div>
          </a>
          <a className="portal-card portal-tamthuc" href="/tam-thuc"
            style={{ backgroundImage: "url('/images/app-home/portal-tamthuc.webp')" }}>
            <div className="portal-overlay" />
            <div className="portal-content">
              <div className="portal-symbol">◎</div>
              <h2>Tam thức</h2>
              <div className="portal-divider">◆</div>
              <p className="portal-sub">Kỳ Môn · Thái Ất · Lục Nhâm</p>
              <div className="portal-divider-line" />
              <span className="portal-btn">Vào Tam thức <span>›</span></span>
            </div>
          </a>
        </div>
      </div>

      <div className="home-cards-wrap">
        <div className="home-cards">
          <div className="info-card">
            <img src="/images/app-home/card-account.webp" className="info-card-img" alt="Tài khoản" />
            <div className="info-card-body">
              <h3>Tài khoản</h3>
              <p>Quản lý thông tin cá nhân, bảo mật và tuỳ chọn sử dụng.</p>
              <span className="coming-soon">🕐 Sắp ra mắt</span>
            </div>
          </div>
          <div className="info-card">
            <img src="/images/app-home/card-history.webp" className="info-card-img" alt="Lịch sử" />
            <div className="info-card-body">
              <h3>Lịch sử tra cứu</h3>
              <p>Xem lại các lần tra cứu, thực hành và ghi chú.</p>
              <span className="coming-soon">🕐 Sắp ra mắt</span>
            </div>
          </div>
          <div className="info-card">
            <img src="/images/app-home/card-credits.webp" className="info-card-img" alt="Tín dụng" />
            <div className="info-card-body">
              <h3>Tín dụng</h3>
              <p>Quản lý tín dụng, gói dịch vụ và lịch sử giao dịch.</p>
              <span className="coming-soon">🕐 Sắp ra mắt</span>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

const nguThuatCards = [
  {
    key: "son",
    title: "Sơn",
    sub: "Phong thủy an cư",
    desc: "Bát trạch, Phi tinh, hướng nhà và bố cục không gian sống.",
    icon: "/images/nguthuat/icon-son.webp",
    href: "/nguthuat/son/phongthu",
  },
  {
    key: "y",
    title: "Y",
    sub: "Y học cổ học",
    desc: "Kiến thức dưỡng sinh, mùa tiết, thân thể và khí huyết tham khảo.",
    icon: "/images/nguthuat/icon-y.webp",
    href: "/nguthuat/y/yhoc",
  },
  {
    key: "menh",
    title: "Mệnh",
    sub: "Tứ Trụ",
    desc: "Lập bốn trụ từ ngày giờ sinh, đọc Can Chi, Ngũ hành và Thập thần.",
    icon: "/images/nguthuat/icon-menh.webp",
    href: "/nguthuat/menh/tutru",
  },
  {
    key: "boc",
    title: "Bốc",
    sub: "Mai Hoa · 64 quẻ",
    desc: "Lập quẻ tham khảo, học tượng số và cách đọc có giới hạn.",
    icon: "/images/nguthuat/icon-boc.webp",
    href: "/nguthuat/boc/maihoa",
  },
  {
    key: "tuong",
    title: "Tướng",
    sub: "Xem tướng tham khảo",
    desc: "Quan sát hình tướng theo tinh thần học hỏi, không định kiến con người.",
    icon: "/images/nguthuat/icon-tuong.webp",
    href: "/nguthuat/tuong/xem-tuong",
  },
];

function NguThuatHub() {
  return (
    <Shell activePage="nguthuat">
      <div className="page-hero" style={{ backgroundImage: "url('/images/nguthuat/bg-nguthuat-hero.webp')" }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="breadcrumb"><a href="/">🏠</a> / <a href="/">Trang chủ</a> / <span>Ngũ thuật</span></div>
          <div className="ornament">◆</div>
          <h1>Ngũ thuật</h1>
          <p className="lead">
            Cổng ứng dụng thực hành có kiểm soát, hỗ trợ tra cứu, tham khảo<br />
            và thực hành theo tri thức cổ học.
          </p>
        </div>
      </div>

      <div className="branch-cards-wrap">
        <div className="branch-cards five">
          {nguThuatCards.map((card) => (
            <a key={card.key} className="branch-card" href={card.href}>
              <div className="branch-card-inner">
                <img src={card.icon} className="branch-icon" alt={card.title} />
                <h2>{card.title}</h2>
                <div className="branch-divider">◆</div>
                <p className="branch-sub">{card.sub}</p>
                <p className="branch-desc">{card.desc}</p>
                <span className="branch-btn">Mở mục <span>›</span></span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="principles-bar">
        <div className="principle">
          <div className="principle-icon">🛡</div>
          <div>
            <strong>Tra cứu có kiểm soát</strong>
            <p>Nội dung được biên soạn chọn lọc, hệ thống kiểm soát đầu vào và đầu ra, hạn chế diễn giải cực đoan.</p>
          </div>
        </div>
        <div className="principle">
          <div className="principle-icon">📖</div>
          <div>
            <strong>Minh bạch nguồn tham khảo</strong>
            <p>Dựa trên sách cổ, tài liệu học thuật và hệ thống chú giải rõ ràng, có trích dẫn nguồn.</p>
          </div>
        </div>
        <div className="principle">
          <div className="principle-icon">⚖</div>
          <div>
            <strong>Không phán đoán cực đoan</strong>
            <p>Ứng dụng hỗ trợ tham khảo và thực hành, không thay thế tư duy độc lập và trách nhiệm cá nhân.</p>
          </div>
        </div>
      </div>
    </Shell>
  );
}

const tamThucCards = [
  {
    key: "ky-mon",
    title: "Kỳ Môn",
    sub: "Kỳ Môn Độn Giáp",
    desc: "Cục bàn thời không, trạch hướng, lựa chọn thời cơ và phương vị.",
    icon: "/images/tam-thuc/icon-ky-mon.webp",
    href: "/tam-thuc/ky-mon",
  },
  {
    key: "thai-at",
    title: "Thái Ất",
    sub: "Thái Ất Thần Số",
    desc: "Dự đoán cát hung, thiên thời, nhân sự và vận hạn theo hệ thống Thái Ất.",
    icon: "/images/tam-thuc/icon-thai-at.webp",
    href: "/tam-thuc/thai-at",
  },
  {
    key: "luc-nham",
    title: "Lục Nhâm",
    sub: "Đại Lục Nhâm",
    desc: "Phán đoán sự việc, công việc, hành trình và các tình huống thực tế.",
    icon: "/images/tam-thuc/icon-luc-nham.webp",
    href: "/tam-thuc/luc-nham",
  },
];

function TamThucHub() {
  return (
    <Shell activePage="tamthuc">
      <div className="page-hero" style={{ backgroundImage: "url('/images/tam-thuc/bg-tamthuc-hero.webp')" }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="breadcrumb"><a href="/">🏠</a> / <a href="/">Trang chủ</a> / <span>Tam thức</span></div>
          <div className="ornament">◆</div>
          <h1>Tam thức</h1>
          <p className="lead">
            Khu vực hệ thống hoá các bộ môn Tam thức – thực dụng, ứng nghiệm,<br />
            phục vụ tra cứu, tham khảo và ứng dụng thực hành.
          </p>
        </div>
      </div>

      <div className="branch-cards-wrap">
        <div className="branch-cards three">
          {tamThucCards.map((card) => (
            <a key={card.key} className="branch-card branch-card-lg" href={card.href}>
              <div className="branch-card-inner">
                <img src={card.icon} className="branch-icon branch-icon-lg" alt={card.title} />
                <h2>{card.title}</h2>
                <div className="branch-divider">◆</div>
                <p className="branch-desc">{card.desc}</p>
                <span className="branch-btn">Khám phá <span>›</span></span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="principles-bar">
        <div className="principle">
          <div className="principle-icon">📚</div>
          <div>
            <strong>Tham khảo có hệ thống</strong>
            <p>Tổng hợp kiến thức cổ học một cách có cấu trúc, dễ tra cứu và đối chiếu.</p>
          </div>
        </div>
        <div className="principle">
          <div className="principle-icon">✒</div>
          <div>
            <strong>Giữ ngôn từ thận trọng</strong>
            <p>Không khẳng định tuyệt đối, ưu tiên cách diễn giải khách quan.</p>
          </div>
        </div>
        <div className="principle">
          <div className="principle-icon">🧘</div>
          <div>
            <strong>Ưu tiên học hiểu trước khi ứng dụng</strong>
            <p>Hiểu đúng bản chất, vận dụng đúng bối cảnh, tránh mê tín và lệ thuộc.</p>
          </div>
        </div>
      </div>

      <div className="tamthuc-footer-quote">
        <span className="lotus">🪷</span>
        <em>Học để hiểu đạo lý, dùng để thuận tự nhiên, hành sự có căn cứ, tâm an mà trí sáng.</em>
        <span className="lotus">🪷</span>
      </div>
    </Shell>
  );
}

interface PlaceholderConfig {
  title: string;
  subtitle: string;
  icon: string;
  desc: string;
  parent: string;
  parentHref: string;
  grandParent?: string;
  grandParentHref?: string;
}

function PlaceholderPage({ cfg }: { cfg: PlaceholderConfig }) {
  const { title, subtitle, icon, desc, parent, parentHref, grandParent, grandParentHref } = cfg;
  return (
    <Shell>
      <div className="placeholder-hero">
        <div className="breadcrumb">
          <a href="/">🏠</a>
          {" / "}
          {grandParent && grandParentHref
            ? <><a href={grandParentHref}>{grandParent}</a>{" / "}</>
            : null}
          <a href={parentHref}>{parent}</a>
          {" / "}
          <span>{title}</span>
        </div>
        <div className="placeholder-icon">{icon}</div>
        <h1>{title}</h1>
        {subtitle && <p style={{ color: "var(--gold)", fontSize: "14px", letterSpacing: ".08em", marginBottom: "16px" }}>{subtitle}</p>}
        <p className="lead">{desc}</p>
      </div>
      <div className="placeholder-body">
        <div className="placeholder-notice">
          <strong>Ứng dụng đang được chuẩn bị</strong>
          Nội dung sẽ được biên soạn theo hướng tra cứu có kiểm soát, không phán đoán cực đoan.
          Thông tin mang tính tham khảo, không thay thế phán xét độc lập của người dùng.
        </div>
        <div className="placeholder-btn-row">
          <a className="ph-btn-primary" href={parentHref}>← Quay về {parent}</a>
          <a className="ph-btn-secondary" href="/">Về trang chủ App</a>
        </div>
      </div>
    </Shell>
  );
}

function TuTruPage() {
  return (
    <Shell activePage="nguthuat">
      <div className="page-hero" style={{ backgroundImage: "url('/images/nguthuat/bg-nguthuat-hero.webp')" }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="breadcrumb">
            <a href="/">🏠</a>{" / "}
            <a href="/">Trang chủ</a>{" / "}
            <a href="/nguthuat">Ngũ thuật</a>{" / "}
            <a href="/nguthuat">Mệnh</a>{" / "}
            <span>Tứ Trụ</span>
          </div>
          <div className="ornament">◆</div>
          <h1>Tứ Trụ</h1>
          <p className="lead">
            Ứng dụng tham khảo lá số Tứ Trụ, hỗ trợ tra cứu có kiểm soát và diễn giải thận trọng.
          </p>
        </div>
      </div>
      <div className="tutru-wrapper">
        <div className="tutru-frame-box">
          <iframe
            src="/apps/tutru/index.html"
            title="Tứ Trụ App"
            allowFullScreen
          >
            <div className="tutru-fallback">
              Trình duyệt không hỗ trợ hiển thị ứng dụng nhúng.
              <br />
              <a className="ph-btn-primary" style={{ marginTop: "16px", display: "inline-flex" }} href="/apps/tutru/index.html" target="_blank" rel="noreferrer">
                Mở Tứ Trụ trong tab mới →
              </a>
            </div>
          </iframe>
        </div>
        <div style={{ marginTop: "24px" }} className="placeholder-btn-row">
          <a className="ph-btn-primary" href="/nguthuat">← Quay về Ngũ thuật</a>
          <a className="ph-btn-secondary" href="/">Về trang chủ App</a>
        </div>
      </div>
    </Shell>
  );
}

const PLACEHOLDER_ROUTES: Record<string, PlaceholderConfig> = {
  "/nguthuat/son/phongthu": {
    title: "Sơn - Phong thủy an cư",
    subtitle: "Phong thủy · Bát trạch · Phi tinh",
    icon: "🏔",
    desc: "Tra cứu phong thủy an cư, Bát trạch, Phi tinh, hướng nhà và bố cục không gian sống theo tri thức cổ học.",
    parent: "Ngũ thuật",
    parentHref: "/nguthuat",
    grandParent: "Trang chủ",
    grandParentHref: "/",
  },
  "/nguthuat/y/yhoc": {
    title: "Y - Y học cổ học",
    subtitle: "Dưỡng sinh · Khí huyết · Mùa tiết",
    icon: "⚕",
    desc: "Tra cứu kiến thức dưỡng sinh, mùa tiết, thân thể và khí huyết theo góc nhìn y học cổ truyền. Chỉ mang tính tham khảo.",
    parent: "Ngũ thuật",
    parentHref: "/nguthuat",
    grandParent: "Trang chủ",
    grandParentHref: "/",
  },
  "/nguthuat/boc/maihoa": {
    title: "Bốc - Mai Hoa Dịch Số",
    subtitle: "Mai Hoa · 64 quẻ Dịch",
    icon: "☵",
    desc: "Lập quẻ tham khảo theo phương pháp Mai Hoa Dịch Số, học tượng số và cách đọc có giới hạn.",
    parent: "Ngũ thuật",
    parentHref: "/nguthuat",
    grandParent: "Trang chủ",
    grandParentHref: "/",
  },
  "/nguthuat/tuong/xem-tuong": {
    title: "Tướng - Xem tướng tham khảo",
    subtitle: "Tướng học · Quan sát · Học hỏi",
    icon: "👁",
    desc: "Quan sát hình tướng theo tinh thần học hỏi, không định kiến con người. Nội dung mang tính tham khảo học thuật.",
    parent: "Ngũ thuật",
    parentHref: "/nguthuat",
    grandParent: "Trang chủ",
    grandParentHref: "/",
  },
  "/tam-thuc/ky-mon": {
    title: "Kỳ Môn",
    subtitle: "Kỳ Môn Độn Giáp",
    icon: "🧭",
    desc: "Cục bàn thời không, trạch hướng, lựa chọn thời cơ và phương vị theo Kỳ Môn Độn Giáp.",
    parent: "Tam thức",
    parentHref: "/tam-thuc",
    grandParent: "Trang chủ",
    grandParentHref: "/",
  },
  "/tam-thuc/thai-at": {
    title: "Thái Ất",
    subtitle: "Thái Ất Thần Số",
    icon: "🌙",
    desc: "Dự đoán cát hung, thiên thời, nhân sự và vận hạn theo hệ thống Thái Ất. Tham khảo có kiểm soát.",
    parent: "Tam thức",
    parentHref: "/tam-thuc",
    grandParent: "Trang chủ",
    grandParentHref: "/",
  },
  "/tam-thuc/luc-nham": {
    title: "Lục Nhâm",
    subtitle: "Đại Lục Nhâm",
    icon: "⚖",
    desc: "Phán đoán sự việc, công việc, hành trình và các tình huống thực tế theo Đại Lục Nhâm.",
    parent: "Tam thức",
    parentHref: "/tam-thuc",
    grandParent: "Trang chủ",
    grandParentHref: "/",
  },
  "/account": {
    title: "Tài khoản",
    subtitle: "",
    icon: "👤",
    desc: "Quản lý thông tin cá nhân, bảo mật và tuỳ chọn sử dụng. Tính năng đang được phát triển.",
    parent: "Trang chủ",
    parentHref: "/",
  },
  "/history": {
    title: "Lịch sử tra cứu",
    subtitle: "",
    icon: "🕐",
    desc: "Xem lại các lần tra cứu, thực hành và ghi chú. Tính năng đang được phát triển.",
    parent: "Trang chủ",
    parentHref: "/",
  },
};

function App() {
  const path = route();
  if (path === "/nguthuat") return <NguThuatHub />;
  if (path === "/tam-thuc") return <TamThucHub />;
  if (path === "/nguthuat/menh/tutru") return <TuTruPage />;
  const ph = PLACEHOLDER_ROUTES[path];
  if (ph) return <PlaceholderPage cfg={ph} />;
  return <Home />;
}

createRoot(document.getElementById("root")!).render(<App />);
