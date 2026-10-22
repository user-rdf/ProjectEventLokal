import { useState } from "react";
import { listEvents } from "../../api/events";
import EventCard from "../../components/EventCard";
import FilterBar from "../../components/FilterBar";
import State from "../../components/State";
import { useFetch } from "../../hooks/useFetch";

export default function EventList() {
  const [filter, setFilter] = useState({ q: "", price: "", category: "" });
  const { data, loading, error } = useFetch(() => listEvents(filter), [filter.q, filter.price, filter.category]);
  return (
    <>
      <h1>Daftar Event</h1>
      <FilterBar value={filter} onChange={setFilter} />
      <State loading={loading} error={error} empty={data && data.length === 0} emptyText="Tidak ada event yang cocok.">
        <div className="grid">{data?.map((e) => <EventCard key={e.slug} event={e} />)}</div>
      </State>
    </>
  );
}
