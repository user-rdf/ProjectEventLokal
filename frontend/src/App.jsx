import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/events" element={<EventList />} />
      <Route path="/events/detail" element={<EventDetail />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;