import { Link, useLocation } from "react-router-dom";

export default function TicketSent() {
  const email = useLocation().state?.email;
  return (
    <div className="center" style={{ maxWidth: 480, margin: "40px auto" }}>
      <h1>Pendaftaran berhasil 🎉</h1>
      <p>Tiket dikirim ke <b>{email ?? "email kamu"}</b>.</p>
      <p className="notice">Belum masuk? Cek folder spam. Tunjukkan QR di email saat masuk acara.</p>
      <Link to="/events" className="btn secondary">Lihat event lain</Link>
    </div>
  );
}
