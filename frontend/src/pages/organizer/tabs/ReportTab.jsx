import { getReport } from "../../../api/events";
import DataTable from "../../../components/DataTable";
import State from "../../../components/State";
import StatCard from "../../../components/StatCard";
import { useFetch } from "../../../hooks/useFetch";
import { formatRupiah } from "../../../utils/format";

export default function ReportTab({ eventId }) {
  const { data, loading, error } = useFetch(() => getReport(eventId), [eventId]);
  return (
    <State loading={loading} error={error}>
      {data && (
        <>
          <div className="grid">
            <StatCard label="Hadir" value={data.attended} total={data.registered} />
            <div className="card"><div className="muted">Tingkat kehadiran</div><b style={{ fontSize: "1.4rem" }}>{data.attendance_rate}%</b></div>
          </div>
          <h2>Pendapatan per kategori tiket</h2>
          <DataTable
            columns={[{ key: "name", label: "Tiket" }, { key: "sold", label: "Terjual" }, { key: "revenue", label: "Pendapatan", render: (r) => formatRupiah(r.revenue) }]}
            rows={data.revenue_by_ticket_type}
          />
        </>
      )}
    </State>
  );
}
