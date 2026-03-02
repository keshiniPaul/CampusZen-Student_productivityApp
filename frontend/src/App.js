import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import EventDashboard from "./pages/EventDashboard";

// Your pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import DailyHealth from "./pages/DailyHealth";
import HealthtipsandSupport from "./pages/HealthtipsandSupport";
import HealthyHabits from "./pages/HealthyHabits";
import Health from "./pages/Health";

// Group member added pages
import Event from "./pages/Event";
import ActivityDetails from "./pages/ActivityDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Events */}
        <Route path="/events" element={<EventDashboard />} />
        <Route path="/events/list" element={<Event />} />
        <Route path="/activity/:activityType" element={<ActivityDetails />} />

        {/* Authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Health Module */}
        <Route path="/daily-health" element={<DailyHealth />} />
        <Route path="/health-resources" element={<HealthtipsandSupport />} />
        <Route path="/healthy-habits" element={<HealthyHabits />} />
        <Route path="/health" element={<Health />} />

        {/* Default */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;