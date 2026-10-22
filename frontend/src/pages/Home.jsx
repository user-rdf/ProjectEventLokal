import { Link } from "react-router-dom";

// Replace the emoji with the 3D illustrations from the Figma design.
const CHOICES = [
  { to: "/events", icon: "🎟️", title: "Daftar Event", desc: "Cari event yang ingin kamu ikuti." },
  { to: "/manage", icon: "🗂️", title: "Kelola Event", desc: "Buat event, pantau peserta, dan scan tiket." },
];

export default function Home() {
  return (
    <main className="container" style={{ maxWidth: 640 }}>
      <div className="center" style={{ margin: "32px 0" }}>
        <h1 className="logo" style={{ fontSize: "2rem" }}>EventLokal</h1>
        <p className="muted">Pendaftaran dan tiket event kampus tanpa Google Form.</p>
      </div>
      {CHOICES.map((c) => (
        <Link key={c.to} to={c.to} className="choice">
          <div className="icon">{c.icon}</div>
          <div className="text"><b>{c.title}</b><span className="muted">{c.desc}</span></div>
          <div className="arrow">↗</div>
        </Link>
      ))}
    </main>
  );
}
