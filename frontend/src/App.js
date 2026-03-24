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
import Sports from "./pages/Sports";
import Clubs from "./pages/Clubs";
import Career from "./pages/Career";
import CareerInternships from "./pages/CareerInternships";
import CareerGuidance from "./pages/CareerGuidance";
import CareerResources from "./pages/CareerResources";
import CareerManagement from "./pages/CareerManagement";
import ResumeBuilder from "./pages/ResumeBuilder";


// new pages for login
import LoginDashboard from "./pages/LoginDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Events */}
        <Route path="/events" element={<EventDashboard />} />
        <Route path="/events/list" element={<Event />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/activity/:activityType" element={<ActivityDetails />} />

        {/* Authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/student/register" element={<Register />} />
        <Route path="/student/login" element={<Login />} />

        {/* Health Module */}
        <Route path="/daily-health" element={<DailyHealth />} />
        <Route path="/health-resources" element={<HealthtipsandSupport />} />
        <Route path="/healthy-habits" element={<HealthyHabits />} />
        <Route path="/health" element={<Health />} />
        <Route path="/dashboard" element={<LoginDashboard />} />

        {/* Career Module */}
        <Route path="/career" element={<Career />} />
        <Route path="/career/internships" element={<CareerInternships />} />
        <Route path="/career/guidance" element={<CareerGuidance />} />
        <Route path="/career/resources" element={<CareerResources />} />
        <Route path="/career/management" element={<CareerManagement />} />
        <Route path="/career/resume-builder" element={<ResumeBuilder />} />


        {/* Default */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;