import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../api/events";
import { CATEGORIES } from "../../utils/constants";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", category: "workshop", description: "", venue: "", starts_at: "", ends_at: "" });
  const [tickets, setTickets] = useState([{ name: "Reguler", price_idr: 0, quota: 50 }]);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setTicket = (i, k, v) => setTickets(tickets.map((t, j) => (j === i ? { ...t, [k]: v } : t)));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const ev = await createEvent({
        ...form,
        starts_at: new Date(form.starts_at).toISOString(),
        ends_at: new Date(form.ends_at).toISOString(),
        ticket_types: tickets.map((t) => ({ ...t, price_idr: Number(t.price_idr), quota: Number(t.quota) })),
      });
      navigate(`/manage/events/${ev.id}`);
    } catch (ex) { setErr(ex.message); }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 560 }}>
      <h1>Buat Event</h1>
      <label className="field"><span>Judul</span><input required value={form.title} onChange={set("title")} /></label>
      <label className="field"><span>Kategori</span>
        <select value={form.category} onChange={set("category")}>{CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></label>
      <label className="field"><span>Deskripsi</span><textarea rows={3} value={form.description} onChange={set("description")} /></label>
      <label className="field"><span>Lokasi</span><input required value={form.venue} onChange={set("venue")} /></label>
      <label className="field"><span>Mulai</span><input required type="datetime-local" value={form.starts_at} onChange={set("starts_at")} /></label>
      <label className="field"><span>Selesai</span><input required type="datetime-local" value={form.ends_at} onChange={set("ends_at")} /></label>
      <h2>Kategori tiket</h2>
      {tickets.map((t, i) => (
        <div key={i} className="card" style={{ marginBottom: 10 }}>
          <label className="field"><span>Nama</span><input value={t.name} onChange={(e) => setTicket(i, "name", e.target.value)} /></label>
          <label className="field"><span>Harga (Rp, 0 = gratis)</span><input type="number" min="0" value={t.price_idr} onChange={(e) => setTicket(i, "price_idr", e.target.value)} /></label>
          <label className="field"><span>Kuota</span><input type="number" min="1" value={t.quota} onChange={(e) => setTicket(i, "quota", e.target.value)} /></label>
        </div>
      ))}
      <button type="button" className="btn secondary" onClick={() => setTickets([...tickets, { name: "", price_idr: 0, quota: 10 }])}>+ Tambah kategori</button>
      {err && <p className="error">{err}</p>}
      <p><button className="btn">Simpan event</button></p>
    </form>
  );
}
