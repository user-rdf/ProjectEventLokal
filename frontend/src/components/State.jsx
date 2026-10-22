/** Shared loading / error / empty rendering for data screens. */
export default function State({ loading, error, empty, emptyText = "Belum ada data.", children }) {
  if (loading) return <p className="muted">Memuat...</p>;
  if (error) return <p className="error">{error}</p>;
  if (empty) return <p className="muted">{emptyText}</p>;
  return children;
}
