import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import TicketSent from './pages/public/TicketSent';

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
    </Routes>
  );
}

export default App;