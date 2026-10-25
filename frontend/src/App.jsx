import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import Checkout from './pages/Checkout';
import Login from './pages/organizer/Login';
import TicketSent from './pages/public/TicketSent';
import Dashboard from './pages/organizer/Dashboard';
import BuatEvent from './pages/organizer/BuatEvent';
import ManageEventDetail from './pages/organizer/ManageEventDetail';
import DaftarPanitia from './pages/organizer/DaftarPanitia';

import Waitlist from './pages/public/Waitlist';

// Halaman Pengelolaan Panitia
import ManageLayout from './layouts/ManageLayout';
import Manage from './pages/organizer/Manage';
import CreateEvent from './pages/organizer/CreateEvent';
import ManageEventDetail from './pages/organizer/ManageEventDetail';


function App() {
  return (
    <Routes>
      {/* Rute Publik (Desain Baru Modern) */}
      <Route path="/" element={<Landing />} />
      <Route path="/events" element={<EventList />} />
      <Route path="/events/:slug" element={<EventDetail />} />
      <Route path="/events/:slug/checkout" element={<Checkout />} />
      <Route path="/events/:slug/register" element={<Checkout />} />
      <Route path="/events/:slug/waitlist" element={<Waitlist />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/tickets/sent" element={<TicketSent />} />
      <Route path="/ticket-sent" element={<TicketSent />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/buat-event" element={<BuatEvent />} />
      <Route path="/manage-event/:id" element={<ManageEventDetail />} />
      <Route path="/daftar-panitia" element={<DaftarPanitia />} />s

      {/* Rute Pengelolaan Panitia & Staf */}
      <Route path="/manage" element={<ManageLayout />}>
        <Route index element={<Manage />} />
        <Route path="events/new" element={<CreateEvent />} />
        <Route path="events/:id" element={<ManageEventDetail />} />
      </Route>
    </Routes>
  );
}

export default App;