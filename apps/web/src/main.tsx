import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const nguThuatApps = [
  ["Mệnh · Tứ Trụ", "Lập bốn trụ từ ngày giờ sinh, đọc Can Chi, Ngũ hành và Thập thần.", "/nguthuat/menh/tutru", "Đang thử nghiệm"],
  ["Sơn · Phong thủy an cư", "Bát trạch, Phi tinh, hướng nhà và bố cục không gian.", "/nguthuat/son/phongthu", "Sắp mở"],
  ["Y · Y học cổ học", "Kiến thức dưỡng sinh, mùa tiết, thân thể và khí huyết tham khảo.", "/nguthuat/y/yhoc", "Sắp mở"],
  ["Bốc · Mai Hoa", "Lập quẻ tham khảo, học tượng số và cách đọc có giới hạn.", "/nguthuat/boc/maihoa", "Sắp mở"],
  ["Tướng · Xem tướng", "Quan sát hình tướng theo tinh thần học hỏi, không định kiến con người.", "/nguthuat/tuong/xem-tuong", "Sắp mở"]
];

function route() {
  return window.location.pathname.replace(/\/$/, "") || "/";
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="app-shell">
      <nav className="top-nav">
        <a href="/" className="brand">Hồn Thơ App</a>
        <div className="nav-links">
          <a href="/nguthuat">Ngũ thuật</a>
          <a href="/tam-thuc">Tam thức</a>
          <a href="/account">Tài khoản</a>
          <a href="/credits">Tín dụng</a>
          <a href="/history">Lịch sử</a>
        </div>
      </nav>
      {children}
    </main>
  );
}

function App() {
  const path = route();
  if (path === "/nguthuat") return <NguThuatHub />;
  if (path === "/tam-thuc") return <SimplePage title="Khu ứng dụng Tam thức" subtitle="Khu này dành cho các công cụ thực hành, quan sát và tra cứu sẽ phát triển sau." />;
  if (path === "/nguthuat/menh/tutru") return <SimplePage title="Tứ Trụ" subtitle="Route chính thức để gắn mini-app Tứ Trụ hiện tại vào khu app chung." />;
  if (path === "/account") return <SimplePage title="Tài khoản" subtitle="Khu hồ sơ người dùng, đăng nhập và thông tin cá nhân." />;
  if (path === "/credits") return <SimplePage title="Tín dụng" subtitle="Theo dõi số dư, yêu cầu nạp và lịch sử sử dụng tín dụng." />;
  if (path === "/history") return <SimplePage title="Lịch sử tra cứu" subtitle="Lưu và xem lại các bản đọc đã tạo." />;
  if (path === "/admin") return <SimplePage title="Quản trị" subtitle="Duyệt chuyển khoản, kiểm tra người dùng và theo dõi log." />;
  return <Home />;
}

function Home() {
  return (
    <Shell>
      <section className="hero">
        <p className="eyebrow">app.hontho.com</p>
        <h1>Khu ứng dụng Hồn Thơ</h1>
        <p className="lead">Một cổng chung cho Ngũ thuật, Tam thức, tài khoản, tín dụng và lịch sử tra cứu.</p>
        <div className="hero-actions">
          <a className="seal-button" href="/nguthuat">Mở Ngũ thuật</a>
          <a className="ghost-button" href="/tam-thuc">Mở Tam thức</a>
        </div>
      </section>
      <section className="grid two">
        <Feature title="Ngũ thuật" href="/nguthuat" text="Sơn · Y · Mệnh · Bốc · Tướng. Năm cửa ứng dụng được gom vào cùng một khu quản lý." />
        <Feature title="Tam thức" href="/tam-thuc" text="Khu thực hành và tra cứu sẽ mở rộng sau, dùng chung tài khoản và tín dụng." />
      </section>
    </Shell>
  );
}

function NguThuatHub() {
  return (
    <Shell>
      <section className="section-head">
        <p className="eyebrow">Sơn · Y · Mệnh · Bốc · Tướng</p>
        <h1>Ngũ thuật ứng dụng</h1>
        <p className="lead">Chọn một công cụ để bắt đầu. Tất cả dùng chung tài khoản, tín dụng và lịch sử trong khu app.</p>
      </section>
      <section className="grid cards">
        {nguThuatApps.map(([title, subtitle, href, status]) => (
          <a className="app-card" href={href} key={title}>
            <span>{status}</span>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </a>
        ))}
      </section>
    </Shell>
  );
}

function SimplePage({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Shell>
      <section className="section-head">
        <p className="eyebrow">Đang chuẩn bị</p>
        <h1>{title}</h1>
        <p className="lead">{subtitle}</p>
        <div className="notice">Đây là khung route để sau này gắn tính năng thật vào.</div>
      </section>
    </Shell>
  );
}

function Feature({ title, text, href }: { title: string; text: string; href: string }) {
  return <a className="feature" href={href}><h2>{title}</h2><p>{text}</p></a>;
}

createRoot(document.getElementById("root")!).render(<App />);
