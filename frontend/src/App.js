import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import EventDashboard from "./pages/EventDashboard";
import Event from "./pages/Event";
import ActivityDetails from "./pages/ActivityDetails";
import Sports from "./pages/Sports";
import Clubs from "./pages/Clubs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventDashboard />} />
        <Route path="/events/list" element={<Event />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/activity/:activityType" element={<ActivityDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
