import { listWaitlist } from "../../../api/bookings";
import DataTable from "../../../components/DataTable";
import State from "../../../components/State";
import { useFetch } from "../../../hooks/useFetch";
import { formatDateTime } from "../../../utils/format";

export default function WaitlistTab({ eventId }) {
  const { data, loading, error } = useFetch(() => listWaitlist(eventId), [eventId]);
  const columns = [
    { key: "pos", label: "#", render: (r) => r.position }, { key: "name", label: "Nama" },
    { key: "email", label: "Email" }, { key: "ticket_type", label: "Tiket" },
    { key: "created_at", label: "Masuk", render: (r) => formatDateTime(r.created_at) }, { key: "status", label: "Status" },
  ];
  return (
    <>
      <p className="notice">Peserta berikutnya naik otomatis ketika ada pembatalan.</p>
      <State loading={loading} error={error} empty={data && data.length === 0} emptyText="Daftar tunggu kosong.">
        {data && <DataTable columns={columns} rows={data} />}
      </State>
    </>
  );
}
