import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { getToken, setToken } from "../api/client";

/** Everything under /manage requires a login token. */
export default function ManageLayout() {
  const navigate = useNavigate();
  if (!getToken()) return <Navigate to="/login" replace />;
  const logout = () => { setToken(null); navigate("/login"); };
  return (
    <>
      <header className="header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/manage" className="logo" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <img src="/images/Logo logo_EVENT2 GO.png" alt="EVENT 2 GO" style={{ height: "26px", width: "auto" }} />
          <span style={{ fontSize: "13px", fontWeight: "bold", color: "#666" }}>· Panitia</span>
        </Link>
        <span><Link to="/manage/events/new" className="btn">Buat Event</Link>{" "}
          <button className="btn secondary" onClick={logout}>Keluar</button></span>
      </header>
      <main className="container"><Outlet /></main>
    </>
  );
}
