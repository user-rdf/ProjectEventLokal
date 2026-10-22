import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setToken } from "../../api/client";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (mode === "register") await api("/auth/register", { method: "POST", body: form });
      const data = await api("/auth/login", { method: "POST", body: { email: form.email, password: form.password } });
      setToken(data.access_token);
      navigate("/manage");
    } catch (ex) { setErr(ex.message); }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 400, margin: "40px auto" }} className="card">
      <h1>{mode === "login" ? "Masuk Panitia" : "Daftar Panitia"}</h1>
      {mode === "register" && <label className="field"><span>Nama</span><input required value={form.name} onChange={set("name")} /></label>}
      <label className="field"><span>Email</span><input required type="email" value={form.email} onChange={set("email")} /></label>
      <label className="field"><span>Kata sandi</span><input required type="password" minLength={8} value={form.password} onChange={set("password")} /></label>
      {err && <p className="error">{err}</p>}
      <button className="btn">{mode === "login" ? "Masuk" : "Daftar dan masuk"}</button>
      <p className="muted"><a href="#" onClick={(e) => { e.preventDefault(); setMode(mode === "login" ? "register" : "login"); }}>
        {mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}</a></p>
    </form>
  );
}
