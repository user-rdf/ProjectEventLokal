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


function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/events" element={<EventList />} />
      <Route path="/events/detail" element={<EventDetail />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/events/:id/checkout" element={<Checkout />} />
      <Route path="/events/detail/checkout" element={<Checkout />} />
      <Route path="/tickets/sent" element={<TicketSent />} />
      <Route path="/ticket-sent" element={<TicketSent />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/buat-event" element={<BuatEvent />} />
      <Route path="/manage-event/:id" element={<ManageEventDetail />} />
      <Route path="/daftar-panitia" element={<DaftarPanitia />} />s
    </Routes>
  );
}

export default App;