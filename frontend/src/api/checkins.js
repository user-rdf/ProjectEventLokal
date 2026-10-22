import { api } from "./client";

export const checkIn = (eventId, code) =>
  api("/manage/check-ins", { method: "POST", auth: true, body: { event_id: Number(eventId), code } });
export const searchTickets = (eventId, q) =>
  api(`/manage/events/${eventId}/tickets/search?q=${encodeURIComponent(q)}`, { auth: true });
