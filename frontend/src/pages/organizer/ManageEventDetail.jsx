import { useState } from "react";
import { useParams } from "react-router-dom";
import { getManageEvent } from "../../api/events";
import State from "../../components/State";
import { useFetch } from "../../hooks/useFetch";
import AttendeesTab from "./tabs/AttendeesTab";
import InfoTab from "./tabs/InfoTab";
import ReportTab from "./tabs/ReportTab";
import ScanTab from "./tabs/ScanTab";
import WaitlistTab from "./tabs/WaitlistTab";

const TABS = [
  ["info", "Info"], ["attendees", "Peserta"], ["scan", "Scan"], ["waitlist", "Daftar Tunggu"], ["report", "Laporan"],
];

export default function ManageEventDetail() {
  const { id } = useParams();
  const [tab, setTab] = useState("info");
  const { data: ev, loading, error } = useFetch(() => getManageEvent(id), [id]);
  return (
    <State loading={loading} error={error}>
      {ev && (
        <>
          <h1>{ev.title}</h1>
          <div className="tabs">
            {TABS.map(([k, label]) => <button key={k} className={`tab ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{label}</button>)}
          </div>
          {tab === "info" && <InfoTab event={ev} />}
          {tab === "attendees" && <AttendeesTab eventId={id} />}
          {tab === "scan" && <ScanTab eventId={id} />}
          {tab === "waitlist" && <WaitlistTab eventId={id} />}
          {tab === "report" && <ReportTab eventId={id} />}
        </>
      )}
    </State>
  );
}
