import { api } from "./client";

export const createBooking = (body) => api("/bookings", { method: "POST", body });
export const joinWaitlist = (body) => api("/waitlist", { method: "POST", body });
export const listAttendees = (eventId) => api(`/manage/events/${eventId}/attendees`, { auth: true });
export const listWaitlist = (eventId) => api(`/manage/events/${eventId}/waitlist`, { auth: true });
export const cancelBooking = (id) => api(`/manage/bookings/${id}/cancel`, { method: "POST", auth: true });
export const resendTicket = (id) => api(`/manage/bookings/${id}/resend-ticket`, { method: "POST", auth: true });
