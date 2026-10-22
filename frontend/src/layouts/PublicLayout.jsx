import { Link, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <>
      <header className="header">
        <Link to="/" className="logo">EventLokal</Link>
        <Link to="/manage" className="muted">Kelola Event</Link>
      </header>
      <main className="container"><Outlet /></main>
    </>
  );
}
