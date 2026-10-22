export default function StatCard({ label, value, total }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="card">
      <div className="muted">{label}</div>
      <b style={{ fontSize: "1.4rem" }}>{value}{total != null ? ` / ${total}` : ""}</b>
      {total != null && <div className="progress"><div style={{ width: `${pct}%` }} /></div>}
    </div>
  );
}
