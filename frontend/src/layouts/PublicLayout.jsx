import { Link, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <>
      <header className="header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" className="logo" style={{ display: "inline-flex", alignItems: "center" }}>
          <img src="/images/Logo logo_EVENT2 GO.png" alt="EVENT 2 GO" style={{ height: "28px", width: "auto" }} />
        </Link>
        <Link to="/manage" className="muted">Kelola Event</Link>
      </header>
      <main className="container"><Outlet /></main>
    </>
  );
}
