import { Link } from "react-router-dom";
import { formatDateTime, formatRupiah } from "../utils/format";

export default function EventCard({ event }) {
  const soldOut = event.remaining === 0;
  return (
    <Link to={`/events/${event.slug}`} className="card">
      <span className="badge">{event.category}</span>
      <h3>{event.title}</h3>
      <p className="muted">{formatDateTime(event.starts_at)}<br />{event.venue}</p>
      <b>{formatRupiah(event.min_price ?? 0)}</b>{" "}
      {soldOut ? <span className="badge bad">Habis</span> : <span className="muted">sisa {event.remaining}</span>}
    </Link>
  );
}
