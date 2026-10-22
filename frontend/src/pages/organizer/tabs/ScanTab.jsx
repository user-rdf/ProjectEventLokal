import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { checkIn, searchTickets } from "../../../api/checkins";
import ScanResultSheet from "../../../components/ScanResultSheet";

// NOTE: camera access only works on HTTPS or localhost.
export default function ScanTab({ eventId }) {
  const [result, setResult] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [q, setQ] = useState("");
  const [found, setFound] = useState([]);
  const busy = useRef(false);

  const submitCode = async (code) => {
    try { setResult(await checkIn(eventId, code)); }
    catch (e) { setResult({ status: "invalid", message: e.message }); }
  };

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scanner
      .start({ facingMode: "environment" }, { fps: 10, qrbox: 240 }, (text) => {
        if (busy.current) return; // ignore frames while a result is showing
        busy.current = true;
        submitCode(text);
      }, () => {})
      .catch((e) => setCameraError(`Kamera tidak bisa dibuka: ${e}`));
    return () => {
      scanner.stop().then(() => scanner.clear()).catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const closeSheet = () => { setResult(null); busy.current = false; };
  const search = async (e) => {
    e.preventDefault();
    try { setFound(await searchTickets(eventId, q)); } catch (ex) { setFound([]); alert(ex.message); }
  };

  return (
    <>
      <div id="qr-reader" />
      {cameraError && <p className="error">{cameraError}</p>}
      <h2>Cari manual</h2>
      <form onSubmit={search} style={{ display: "flex", gap: 8 }}>
        <input placeholder="Nama, email, telepon, atau kode tiket" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn">Cari</button>
      </form>
      {found.map((t) => (
        <div key={t.code} className="card" style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
          <span><b>{t.attendee_name}</b> <span className="muted">{t.attendee_email} · {t.status}</span></span>
          <button className="btn" onClick={() => window.confirm("Check-in manual?") && submitCode(t.code)}>Check-in manual</button>
        </div>
      ))}
      <ScanResultSheet result={result} onClose={closeSheet} />
    </>
  );
}
