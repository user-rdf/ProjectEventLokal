import { CATEGORIES, PRICE_FILTERS } from "../utils/constants";

export default function FilterBar({ value, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch });
  return (
    <div>
      <input placeholder="Cari event..." value={value.q} onChange={(e) => set({ q: e.target.value })} />
      <div className="chips">
        {PRICE_FILTERS.map((p) => (
          <button key={p.value} className={`chip ${value.price === p.value ? "active" : ""}`} onClick={() => set({ price: p.value })}>{p.label}</button>
        ))}
      </div>
      <div className="chips">
        <button className={`chip ${value.category === "" ? "active" : ""}`} onClick={() => set({ category: "" })}>Semua kategori</button>
        {CATEGORIES.map((c) => (
          <button key={c.value} className={`chip ${value.category === c.value ? "active" : ""}`} onClick={() => set({ category: c.value })}>{c.label}</button>
        ))}
      </div>
    </div>
  );
}
