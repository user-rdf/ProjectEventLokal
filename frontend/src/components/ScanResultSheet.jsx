import { formatDateTime } from "../utils/format";

const STYLES = {
  valid: { cls: "ok", title: "Check-in berhasil" },
  already_used: { cls: "bad", title: "Tiket sudah dipakai" },
  invalid: { cls: "bad", title: "Tiket tidak valid" },
  cancelled: { cls: "bad", title: "Tiket dibatalkan" },
  wrong_event: { cls: "warn", title: "Tiket untuk event lain" },
};

export default function ScanResultSheet({ result, onClose }) {
  if (!result) return null;
  const s = STYLES[result.status] ?? STYLES.invalid;
  return (
    <div className={`sheet ${s.cls}`}>
      <div className="big">{s.title}</div>
      {result.attendee_name && <p>{result.attendee_name} {result.ticket_type ? `· ${result.ticket_type}` : ""}</p>}
      {result.status === "already_used" && result.first_checked_in_at && <p>Check-in pertama: {formatDateTime(result.first_checked_in_at)}</p>}
      {result.message && <p>{result.message}</p>}
      <button className="btn secondary" onClick={onClose}>Scan berikutnya</button>
    </div>
  );
}
