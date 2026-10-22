import { cancelBooking, listAttendees, resendTicket } from "../../../api/bookings";
import DataTable from "../../../components/DataTable";
import State from "../../../components/State";
import { useFetch } from "../../../hooks/useFetch";

export default function AttendeesTab({ eventId }) {
  const { data, loading, error, reload } = useFetch(() => listAttendees(eventId), [eventId]);
  const act = (fn, id, confirmText) => async () => {
    if (confirmText && !window.confirm(confirmText)) return;
    try { await fn(id); reload(); } catch (e) { alert(e.message); }
  };
  const columns = [
    { key: "attendee_name", label: "Nama" }, { key: "attendee_email", label: "Email" },
    { key: "attendee_phone", label: "Telepon" }, { key: "ticket_type", label: "Tiket" },
    { key: "status", label: "Status" },
    { key: "actions", label: "", render: (r) => (
      <>
        <button className="btn secondary" onClick={act(resendTicket, r.id)}>Kirim ulang</button>{" "}
        <button className="btn danger" onClick={act(cancelBooking, r.id, "Batalkan pendaftaran ini?")}>Batalkan</button>
      </>) },
  ];
  return (
    <State loading={loading} error={error} empty={data && data.length === 0} emptyText="Belum ada peserta.">
      {data && <DataTable columns={columns} rows={data} />}
    </State>
  );
}
