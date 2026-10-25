import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { joinWaitlist } from "../../api/bookings";

export default function Waitlist() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await joinWaitlist({ ticket_type_id: params.get("ticket"), attendee_name: form.name, attendee_email: form.email, attendee_phone: form.phone });
      setDone(true);
    } catch (ex) { setErr(ex.message); }
  };

  if (done) return <div className="center"><h1>Kamu masuk daftar tunggu</h1><p>Kami akan mengirim tiket ke emailmu jika ada slot kosong.</p></div>;
  return (
    <form onSubmit={submit} style={{ maxWidth: 480 }}>
      <h1>Daftar Tunggu</h1>
      <p className="muted">Tiket untuk {slug} sudah habis. Isi data di bawah dan kami kabari otomatis jika ada pembatalan.</p>
      <label className="field"><span>Nama lengkap</span><input required value={form.name} onChange={set("name")} /></label>
      <label className="field"><span>Email</span><input required type="email" value={form.email} onChange={set("email")} /></label>
      <label className="field"><span>Nomor telepon</span><input required value={form.phone} onChange={set("phone")} /></label>
      {err && <p className="error">{err}</p>}
      <button className="btn">Masuk Daftar Tunggu</button>
    </form>
  );
}
