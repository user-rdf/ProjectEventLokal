import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import Checkout from './pages/Checkout';
import TicketSent from './pages/public/TicketSent';
import Dashboard from './pages/organizer/Dashboard';
import BuatEvent from './pages/organizer/BuatEvent';
import ManageEventDetail from './pages/organizer/ManageEventDetail';
import DaftarPanitia from './pages/organizer/DaftarPanitia';
import TemplateEmail from './pages/TemplateEmail';
import Waitlist from './pages/public/Waitlist';

function App() {
  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/" element={<Landing />} />
      <Route path="/events" element={<EventList />} />
      <Route path="/events/:slug" element={<EventDetail />} />
      <Route path="/events/:slug/checkout" element={<Checkout />} />
      <Route path="/events/:slug/register" element={<Checkout />} />
      <Route path="/events/:slug/waitlist" element={<Waitlist />} />
      <Route path="/waitlist" element={<Waitlist />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/tickets/sent" element={<TicketSent />} />
      <Route path="/ticket-sent" element={<TicketSent />} />
      <Route path="/template-email" element={<TemplateEmail />} />

      {/* Rute Panitia & Autentikasi (EVENT 2 GO) */}
      <Route path="/login" element={<DaftarPanitia initialMode="login" />} />
      <Route path="/daftar-panitia" element={<DaftarPanitia initialMode="register" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/buat-event" element={<BuatEvent />} />
      <Route path="/manage-event/:id" element={<ManageEventDetail />} />

      {/* Redirect Rute Legacy / Alias ke Rute Aktif */}
      <Route path="/manage" element={<Navigate to="/dashboard" replace />} />
      <Route path="/manage/events/new" element={<Navigate to="/buat-event" replace />} />
      <Route path="/manage/events/:id" element={<Navigate to="/manage-event/:id" replace />} />

      {/* Fallback 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;