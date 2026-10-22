import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { getToken, setToken } from "../api/client";

/** Everything under /manage requires a login token. */
export default function ManageLayout() {
  const navigate = useNavigate();
  if (!getToken()) return <Navigate to="/login" replace />;
  const logout = () => { setToken(null); navigate("/login"); };
  return (
    <>
      <header className="header">
        <Link to="/manage" className="logo">EventLokal · Panitia</Link>
        <span><Link to="/manage/events/new" className="btn">Buat Event</Link>{" "}
          <button className="btn secondary" onClick={logout}>Keluar</button></span>
      </header>
      <main className="container"><Outlet /></main>
    </>
  );
}
