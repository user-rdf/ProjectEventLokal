const BASE = "/api/v1";

export const getToken = () => localStorage.getItem("token");
export const setToken = (t) => (t ? localStorage.setItem("token", t) : localStorage.removeItem("token"));

/** fetch wrapper: JSON in/out, optional Bearer token, readable Error messages. */
export async function api(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;
  const res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => null);
    if (!res.ok) {
    // Baca format kontrak API dulu, fallback ke format default FastAPI
    const errMsg = data?.error?.message 
                || (typeof data?.detail === "string" ? data.detail 
                : (Array.isArray(data?.detail) ? data.detail.map((x) => x.msg).join(", ") : "Terjadi kesalahan"));
    
    const err = new Error(errMsg);
    err.status = res.status;
    err.code = data?.error?.code; // Simpan kode (misal: 'EL001') jika komponen UI butuh handle khusus
    err.body = data;
    throw err;
  }
  return data;
}
