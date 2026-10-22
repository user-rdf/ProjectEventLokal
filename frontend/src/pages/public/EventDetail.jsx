import { Link, useParams } from "react-router-dom";
import { getEvent } from "../../api/events";
import State from "../../components/State";
import { useFetch } from "../../hooks/useFetch";
import { formatDateTime, formatRupiah } from "../../utils/format";

export default function EventDetail() {
  const { slug } = useParams();
  const { data: ev, loading, error } = useFetch(() => getEvent(slug), [slug]);
  return (
    <State loading={loading} error={error}>
      {ev && (
        <>
          <span className="badge">{ev.category}</span>
          <h1>{ev.title}</h1>
          <p className="muted">{formatDateTime(ev.starts_at)} · {ev.venue}</p>
          <p>{ev.description}</p>
          <h2>Pilih tiket</h2>
          {ev.ticket_types?.map((t) => (
            <div key={t.id} className="card" style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><b>{t.name}</b><br /><span className="muted">{formatRupiah(t.price_idr)} · sisa {t.remaining}</span></div>
              {t.remaining > 0
                ? <Link className="btn" to={`/events/${slug}/register?ticket=${t.id}`}>Daftar</Link>
                : <Link className="btn secondary" to={`/events/${slug}/waitlist?ticket=${t.id}`}>Masuk Daftar Tunggu</Link>}
            </div>
          ))}
        </>
      )}
    </State>
  );
}
