import StatCard from "../../../components/StatCard";
import { formatDateTime, formatRupiah } from "../../../utils/format";

export default function InfoTab({ event }) {
  return (
    <>
      <p className="muted">{formatDateTime(event.starts_at)} – {formatDateTime(event.ends_at)} · {event.venue}</p>
      <p>{event.description}</p>
      <h2>Kuota tiket</h2>
      <div className="grid">
        {event.ticket_types?.map((t) => (
          <StatCard key={t.id} label={`${t.name} (${formatRupiah(t.price_idr)})`} value={t.sold} total={t.quota} />
        ))}
      </div>
    </>
  );
}
