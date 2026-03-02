import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import EventDashboard from "./pages/EventDashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DailyHealth from "./pages/DailyHealth";
import HealthtipsandSupport from "./pages/HealthtipsandSupport";
import HealthyHabits from "./pages/HealthyHabits";
import Health from "./pages/Health";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/daily-health" element={<DailyHealth />} />
        <Route path="/health-resources" element={<HealthtipsandSupport />} />
        <Route path="/healthy-habits" element={<HealthyHabits />} />
        <Route path="/health" element={<Health />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
