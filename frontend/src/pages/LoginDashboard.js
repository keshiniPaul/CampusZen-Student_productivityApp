import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Import the same CSS as Home page
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";

// Import dashboard images with .jpg extensions
import overviewImg from "../images/overviewimg.jpg";
import healthImg from "../images/healthimg.jpg";
import eventImg from "../images/eventimg.png";
import careerImg from "../images/career.jpg";
import studyImg from "../images/study.jpg";
import resourcesImg from "../images/resources.jpg"; // New Resources image

function LoginDashboard() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // Calendar data
  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  const monthLabel = today.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const leadingEmptyDays = (firstDayIndex + 6) % 7;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = [
    ...Array.from({ length: leadingEmptyDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsNavOpen(false);
    };

    const onDocumentClick = (event) => {
      const target = event.target;
      if (!target || !navLinksRef.current || !navToggleRef.current) return;

      const clickedInsideNav =
        navLinksRef.current.contains(target) || navToggleRef.current.contains(target);

      if (!clickedInsideNav) setIsNavOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onDocumentClick);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocumentClick);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:5000/api/auth/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  // Updated: Navigate to home page instead of just scrolling
  const goToHomePage = (event) => {
    event.preventDefault();
    navigate("/");
    setIsNavOpen(false);
  };

  const scrollToTop = (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsNavOpen(false);
  };

  const goToEventsDashboard = (event) => {
    event.preventDefault();
    navigate("/events");
    setIsNavOpen(false);
  };

  const goToDashboard = () => {
    navigate("/dashboard");
    setDropdownOpen(false);
    setIsNavOpen(false);
  };

  const goToProfile = () => {
    navigate("/profile");
    setDropdownOpen(false);
    setIsNavOpen(false);
  };

  const scrollToSection = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsNavOpen(false);
  };

  // Navigation functions for dashboard cards
  const goToOverview = (e) => {
    e.preventDefault();
    navigate("/overview");
    setIsNavOpen(false);
  };

  const goToHealth = (e) => {
    e.preventDefault();
    navigate("/health");
    setIsNavOpen(false);
  };

  const goToCareer = (e) => {
    e.preventDefault();
    navigate("/career");
    setIsNavOpen(false);
  };

  const goToStudy = (e) => {
    e.preventDefault();
    alert("Study section coming soon");
    setIsNavOpen(false);
  };

  const goToResources = (e) => {
    e.preventDefault();
    navigate("/resources");
    setIsNavOpen(false);
  };

  return (
    <div>
      {/* Header - Same as Home page */}
      <header className="topbar" id="top">
        <nav className="nav container">
          {/* Updated: Brand/Logo now goes to home page */}
          <a className="brand" href="/" aria-label="CampusZone Home" onClick={goToHomePage}>
            <img 
              className="brand__logo--img" 
              src={campusLogo} 
              alt="CampusZone Logo"
            />
          </a>

          <button
            className="nav__toggle"
            id="navToggle"
            ref={navToggleRef}
            aria-label={isNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={isNavOpen ? "true" : "false"}
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            <span className="nav__toggleBars" aria-hidden="true"></span>
          </button>

          <div
            className={`nav__links ${isNavOpen ? "is-open" : ""}`.trim()}
            id="navLinks"
            ref={navLinksRef}
          >
            {/* Updated: Home button now goes to home page */}
            <a href="/" onClick={goToHomePage}>
              Home
            </a>
            <a href="#health" onClick={(e) => {
                      e.preventDefault();
                  navigate("/health");
                   setIsNavOpen(false);
              }}
               >
              Health
            </a>
            <a href="/events" onClick={goToEventsDashboard}>
              Events
            </a>
            <a href="/career" onClick={goToCareer}>
              Career
            </a>

            <a href="#study" onClick={(e) => scrollToSection(e, "study")}>
              Study
            </a>

            <div className="nav__cta">
              <button className="header__notificationBtn" aria-label="Notifications">
                <svg className="header__notificationIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
                  <path d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"/>
                </svg>
                <span className="header__notificationBadge">3</span>
              </button>
              
              <div className="profile-dropdown" ref={profileDropdownRef}>
                <button 
                  className="profile-icon-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="Profile menu"
                >
                  👤
                </button>
                
                {dropdownOpen && (
                  <div className="profile-dropdown-menu">
                    <button onClick={goToProfile} className="dropdown-item">
                      <span className="dropdown-icon">👤</span>
                      My Profile
                    </button>
                    <button onClick={goToDashboard} className="dropdown-item">
                      <span className="dropdown-icon">📊</span>
                      Dashboard
                    </button>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <span className="dropdown-icon">🚪</span>
                      Log out
                    </button>
                    <button onClick={handleDeleteAccount} className="dropdown-item logout">
                      <span className="dropdown-icon">🗑️</span>
                      Delete Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Dashboard Content */}
      <main>
        <section className="section">
          <div className="container">
            <div style={{ 
              background: "var(--card-strong)",
              border: "1px solid rgba(2,30,55,.07)",
              borderRadius: "var(--radius-lg)",
              padding: "40px",
              boxShadow: "var(--shadow)",
              marginTop: "20px"
            }}>
              <h1 style={{ fontSize: "32px", margin: "0 0 8px 0" }}>
                Welcome back, {user?.fullName || "Student"}! 👋
              </h1>
              <p style={{ color: "var(--muted)", fontSize: "16px", marginBottom: "32px" }}>
                This is your student productivity dashboard. Track your progress and manage your activities.
              </p>

              {/* Dashboard Cards with Images */}
              <div className="dashboard-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                marginTop: "30px"
              }}>
                {/* Overview Card */}
                <div className="dashboard-card" style={{
                  background: "white",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow)",
                  transition: "transform 0.3s ease",
                  cursor: "pointer"
                }} onClick={goToOverview}>
                  <img src={overviewImg} alt="Overview" style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover"
                  }} />
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ margin: "0 0 10px 0", fontSize: "20px" }}>Overview</h3>
                    <p style={{ color: "var(--muted)", margin: 0 }}>
                      View your activity summary and recent updates
                    </p>
                  </div>
                </div>

                {/* Health Card */}
                <div className="dashboard-card" style={{
                  background: "white",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow)",
                  transition: "transform 0.3s ease",
                  cursor: "pointer"
                }} onClick={goToHealth}>
                  <img src={healthImg} alt="Health" style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover"
                  }} />
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ margin: "0 0 10px 0", fontSize: "20px" }}>Health & Wellbeing</h3>
                    <p style={{ color: "var(--muted)", margin: 0 }}>
                      Track your wellbeing and access support services
                    </p>
                  </div>
                </div>

                {/* Events Card */}
                <div className="dashboard-card" style={{
                  background: "white",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow)",
                  transition: "transform 0.3s ease",
                  cursor: "pointer"
                }} onClick={goToEventsDashboard}>
                  <img src={eventImg} alt="Events" style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover"
                  }} />
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ margin: "0 0 10px 0", fontSize: "20px" }}>Events</h3>
                    <p style={{ color: "var(--muted)", margin: 0 }}>
                      Check upcoming events and your registrations
                    </p>
                  </div>
                </div>

                {/* Career Card */}
                <div className="dashboard-card" style={{
                  background: "white",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow)",
                  transition: "transform 0.3s ease",
                  cursor: "pointer"
                }} onClick={goToCareer}>
                  <img src={careerImg} alt="Career" style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover"
                  }} />
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ margin: "0 0 10px 0", fontSize: "20px" }}>Career</h3>
                    <p style={{ color: "var(--muted)", margin: 0 }}>
                      Plan your future with internships and CV tools
                    </p>
                  </div>
                </div>

                {/* Study Card */}
                <div className="dashboard-card" style={{
                  background: "white",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow)",
                  transition: "transform 0.3s ease",
                  cursor: "pointer"
                }} onClick={goToStudy}>
                  <img src={studyImg} alt="Study" style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover"
                  }} />
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ margin: "0 0 10px 0", fontSize: "20px" }}>Study</h3>
                    <p style={{ color: "var(--muted)", margin: 0 }}>
                      Manage your courses and study materials
                    </p>
                  </div>
                </div>

                {/* Resources Card - New */}
                <div className="dashboard-card" style={{
                  background: "white",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow)",
                  transition: "transform 0.3s ease",
                  cursor: "pointer"
                }} onClick={goToResources}>
                  <img src={resourcesImg} alt="Resources" style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover"
                  }} />
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ margin: "0 0 10px 0", fontSize: "20px" }}>Resources</h3>
                    <p style={{ color: "var(--muted)", margin: 0 }}>
                      Access study materials, guides, and helpful resources
                    </p>
                  </div>
                </div>
              </div>

              {/* Add hover effect CSS */}
              <style jsx>{`
                .dashboard-card:hover {
                  transform: translateY(-5px);
                  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
                }
              `}</style>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with Support Section and Calendar - Same as Home page */}
      <footer className="footer">
        <div className="container footer__panel">
          <div className="footer__support">
            <p className="footer__kicker">Do you need any</p>
            <h3 className="footer__heading">Support?</h3>
            <a className="footer__contact footer__contact--accent" href="https://support.sliit.lk">
              🌐 support.campuszone.lk
            </a>
            <a className="footer__contact" href="tel:+94117544801">
              📞 +94 11 754 0000
            </a>
            <a className="footer__feedback" href="https://support.sliit.lk">
              Provide Feedback to CampusZone
            </a>
          </div>

          <div className="footer__calendar" aria-label="Calendar preview">
            <h3 className="footer__calendarTitle">Calendar</h3>
            <div className="footer__calendarHead">
              <strong>{monthLabel}</strong>
            </div>
            <div className="footer__weekdays">
              {weekdayLabels.map((weekday) => (
                <span key={weekday}>{weekday}</span>
              ))}
            </div>
            <div className="footer__days">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <span className="is-muted" key={`empty-${index}`}></span>;
                }

                const isToday = day === currentDay;
                return (
                  <span className={isToday ? "is-active" : ""} key={`day-${day}`}>
                    {day}
                  </span>
                );
              })}
            </div>
            <a className="footer__fullCalendar" href="/events" onClick={goToEventsDashboard}>
              Full calendar
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="container footer__inner">
            <div className="footer__brand">
              <div>
                <div className="footer__name">CampusZone</div>
                <div className="footer__small">Student Productivity Platform</div>
              </div>
            </div>

            <div className="footer__socials" aria-label="Social links">
              {/* Updated: Social links now go to home page */}
              <a href="/" onClick={goToHomePage} aria-label="Facebook">
                <img className="footer__socialIcon" src={facebookIcon} alt="Facebook" />
              </a>
              <a href="/" onClick={goToHomePage} aria-label="Instagram">
                <img className="footer__socialIcon" src={instagramIcon} alt="Instagram" />
              </a>
              <a href="/" onClick={goToHomePage} aria-label="LinkedIn">
                <img className="footer__socialIcon" src={linkedinIcon} alt="LinkedIn" />
              </a>
              <a href="/" onClick={goToHomePage} aria-label="YouTube">
                <img className="footer__socialIcon" src={youtubeIcon} alt="YouTube" />
              </a>
            </div>

            {/* Updated: To Top button still scrolls to top, doesn't navigate away */}
            <a className="toTop" href="#top" onClick={scrollToTop} aria-label="Back to top">
              ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LoginDashboard;