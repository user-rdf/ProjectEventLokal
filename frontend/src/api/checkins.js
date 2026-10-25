import { api } from "./client";

// Backend membalas 201 (valid), 404 (invalid) atau 409 (already_used/cancelled/wrong_event)
// dengan body {status, message, ...}. Kembalikan body itu agar layar scan bisa menampilkan warna yang benar.
export const checkIn = async (eventId, code) => {
  try {
    return await api("/manage/check-ins", { method: "POST", auth: true, body: { event_id: eventId, code } });
  } catch (e) {
    if (e.body?.status) return e.body;
    throw e;
  }
};
export const searchTickets = (eventId, q) =>
  api(`/manage/events/${eventId}/tickets/search?q=${encodeURIComponent(q)}`, { auth: true });
