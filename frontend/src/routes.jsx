import { Route, Routes } from "react-router-dom";
import ManageLayout from "./layouts/ManageLayout";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import CreateEvent from "./pages/organizer/CreateEvent";
import Login from "./pages/organizer/Login";
import Manage from "./pages/organizer/Manage";
import ManageEventDetail from "./pages/organizer/ManageEventDetail";
import EventDetail from "./pages/public/EventDetail";
import EventList from "./pages/public/EventList";
import RegisterForm from "./pages/public/RegisterForm";
import TicketSent from "./pages/public/TicketSent";
import Waitlist from "./pages/public/Waitlist";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<PublicLayout />}>
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/events/:slug/register" element={<RegisterForm />} />
        <Route path="/events/:slug/waitlist" element={<Waitlist />} />
        <Route path="/tickets/sent" element={<TicketSent />} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/manage" element={<ManageLayout />}>
        <Route index element={<Manage />} />
        <Route path="events/new" element={<CreateEvent />} />
        <Route path="events/:id" element={<ManageEventDetail />} />
      </Route>
    </Routes>
  );
}
