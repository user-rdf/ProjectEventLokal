import { api } from "./client";

export const listEvents = ({ q = "", price = "", category = "" } = {}) => {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  if (price) p.set("price", price);
  if (category) p.set("category", category);
  return api(`/events?${p}`);
};
export const getEvent = (slug) => api(`/events/${slug}`);
export const createEvent = (body) => api("/manage/events", { method: "POST", body, auth: true });
export const getManageEvent = (id) => api(`/manage/events/${id}`, { auth: true });
export const getOrganizerHome = () => api("/manage/home", { auth: true });
export const getReport = (id) => api(`/manage/events/${id}/reports/summary`, { auth: true });
