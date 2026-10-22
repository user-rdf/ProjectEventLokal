import { Link } from "react-router-dom";
import { getOrganizerHome } from "../../api/events";
import State from "../../components/State";
import StatCard from "../../components/StatCard";
import { useFetch } from "../../hooks/useFetch";
import { formatDateTime } from "../../utils/format";

function EventRow({ e }) {
  return (
    <Link to={`/manage/events/${e.id}`} className="card" style={{ display: "block", marginBottom: 12 }}>
      <b>{e.title}</b> <span className="muted">· {formatDateTime(e.starts_at)}</span>
      <StatCard label="Hadir" value={e.checked_in} total={e.registered} />
    </Link>
  );
}

export default function Manage() {
  const { data, loading, error } = useFetch(getOrganizerHome, []);
  return (
    <State loading={loading} error={error}>
      {data && (
        <>
          <h1>Beranda Panitia</h1>
          <h2>Sedang Berlangsung</h2>
          {data.ongoing.length === 0 ? <p className="muted">Tidak ada event yang sedang berlangsung.</p> : data.ongoing.map((e) => <EventRow key={e.id} e={e} />)}
          <h2>Akan Datang</h2>
          {data.upcoming.length === 0 ? <p className="muted">Belum ada.</p> : data.upcoming.map((e) => <EventRow key={e.id} e={e} />)}
          <h2>Selesai</h2>
          {data.finished.length === 0 ? <p className="muted">Belum ada.</p> : data.finished.map((e) => <EventRow key={e.id} e={e} />)}
        </>
      )}
    </State>
  );
}
