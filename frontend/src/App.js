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

// new pages for login
import LoginDashboard from "./pages/LoginDashboard";

// Study Groups
import StudyGroups from "./pages/StudyGroups";
import StudyGroupDetail from "./pages/StudyGroupDetail";

// Resources
import Resources from "./pages/Resources";

// Assignments
import Assignments from "./pages/Assignments";

// Timetable
import Timetable from "./pages/Timetable";

// Study Help
import StudyHelp from "./pages/StudyHelp";

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

        {/* Health Module */}
        <Route path="/daily-health" element={<DailyHealth />} />
        <Route path="/health-resources" element={<HealthtipsandSupport />} />
        <Route path="/healthy-habits" element={<HealthyHabits />} />
        <Route path="/health" element={<Health />} />
        <Route path="/dashboard" element={<LoginDashboard />} />

        {/* Study Groups */}
        <Route path="/study-groups" element={<StudyGroups />} />
        <Route path="/study-groups/:groupId" element={<StudyGroupDetail />} />

        {/* Resources */}
        <Route path="/resources" element={<Resources />} />

        {/* Assignments */}
        <Route path="/assignments" element={<Assignments />} />

        {/* Timetable */}
        <Route path="/timetable" element={<Timetable />} />

        {/* Study Help */}
        <Route path="/study-help" element={<StudyHelp />} />

        {/* Default */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;