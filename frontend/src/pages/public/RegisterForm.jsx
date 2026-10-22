import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createBooking } from "../../api/bookings";
import { getEvent } from "../../api/events";
import State from "../../components/State";
import { useFetch } from "../../hooks/useFetch";
import { PHONE_RE } from "../../utils/constants";
import { formatRupiah } from "../../utils/format";

export default function RegisterForm() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { data: ev, loading, error } = useFetch(() => getEvent(slug), [slug]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", ticket: params.get("ticket") || "", consent: false });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!PHONE_RE.test(form.phone.replace(/[\s-]/g, ""))) return setErr("Nomor telepon tidak valid");
    if (!form.consent) return setErr("Centang persetujuan data terlebih dahulu");
    setBusy(true);
    try {
      await createBooking({ ticket_type_id: Number(form.ticket), attendee_name: form.name, attendee_email: form.email, attendee_phone: form.phone });
      navigate("/tickets/sent", { state: { email: form.email } });
    } catch (ex) {
      setErr(ex.status === 409 ? "Kuota habis. Kamu bisa masuk daftar tunggu." : ex.message);
    } finally { setBusy(false); }
  };

  return (
    <State loading={loading} error={error}>
      {ev && (
        <form onSubmit={submit} style={{ maxWidth: 480 }}>
          <h1>Daftar: {ev.title}</h1>
          <label className="field"><span>Tiket</span>
            <select required value={form.ticket} onChange={set("ticket")}>
              <option value="">Pilih tiket</option>
              {ev.ticket_types?.map((t) => <option key={t.id} value={t.id} disabled={t.remaining === 0}>{t.name} - {formatRupiah(t.price_idr)}</option>)}
            </select></label>
          <label className="field"><span>Nama lengkap</span><input required minLength={2} value={form.name} onChange={set("name")} /></label>
          <label className="field"><span>Email (tiket dikirim ke sini)</span><input required type="email" value={form.email} onChange={set("email")} /></label>
          <label className="field"><span>Nomor telepon</span><input required inputMode="tel" placeholder="08123456789" value={form.phone} onChange={set("phone")} /></label>
          <label className="field"><input type="checkbox" style={{ width: "auto" }} checked={form.consent} onChange={set("consent")} /> Saya setuju datanya dipakai panitia untuk keperluan event ini.</label>
          {err && <p className="error">{err}</p>}
          <button className="btn" disabled={busy}>{busy ? "Memproses..." : "Daftar"}</button>
        </form>
      )}
    </State>
  );
}
