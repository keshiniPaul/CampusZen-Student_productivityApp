import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Career.css";
import "./Home.css";
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";
import internshipImg from "../images/internship_card.png";
import guidanceImg from "../images/career_guidance_card.png";
import resourcesImg from "../images/resources_card.png";
import managementImg from "../images/internship_mgmt_card.png";

function Career() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const profileDropdownRef = useRef(null);
  const toastTimerRef = useRef(null);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);

  /* ---------- Lifecycle ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    setIsLoggedIn(!!token);
    if (userString) {
      const user = JSON.parse(userString);
      setIsAdmin(user.role === "admin");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
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

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  /* ---------- Helpers ---------- */
  const showToast = (message) => {
    setToastText(message || "Coming soon");
    setToastVisible(true);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastVisible(false), 2200);
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsNavOpen(false);
  };

  const goToHome = (e) => {
    e.preventDefault();
    navigate("/");
    setIsNavOpen(false);
  };

  const goToEventsDashboard = (e) => {
    e.preventDefault();
    navigate("/events");
    setIsNavOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsProfileDropdownOpen(false);
    navigate("/");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
    setIsProfileDropdownOpen(false);
    setIsNavOpen(false);
  };

  const goToProfile = () => {
    navigate("/profile");
    setIsProfileDropdownOpen(false);
    setIsNavOpen(false);
  };

  /* ---------- Calendar ---------- */
  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  const monthLabel = today.toLocaleString("en-US", { month: "long", year: "numeric" });
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const leadingEmptyDays = (firstDayIndex + 6) % 7;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarDays = [
    ...Array.from({ length: leadingEmptyDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  /* ================================ RENDER ================================ */
  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="topbar" id="top">
        <nav className="nav container">
          <a className="brand" href="/" aria-label="CampusZone Home" onClick={goToHome}>
            <img className="brand__logo--img" src={campusLogo} alt="CampusZone Logo" />
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
            <a href="/" onClick={goToHome}>Home</a>
            <a href="/health" onClick={(e) => { e.preventDefault(); navigate("/health"); setIsNavOpen(false); }}>
              Health
            </a>
            <a href="/events" onClick={goToEventsDashboard}>Events</a>
            <a
              href="/career"
              className="nav__link--career-active"
              onClick={(e) => { e.preventDefault(); setIsNavOpen(false); }}
            >
              Career
            </a>
            <a href="#study" onClick={(e) => { e.preventDefault(); showToast("Study section coming soon"); setIsNavOpen(false); }}>
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

              {isLoggedIn ? (
                <div className="profile-dropdown" ref={profileDropdownRef}>
                  <button
                    className="profile-icon-btn"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    aria-label="Profile menu"
                  >
                    👤
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="profile-dropdown-menu">
                      <button onClick={goToProfile} className="dropdown-item">
                        <span className="dropdown-icon">👤</span> My Profile
                      </button>
                      <button onClick={goToDashboard} className="dropdown-item">
                        <span className="dropdown-icon">📊</span> Dashboard
                      </button>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item logout">
                        <span className="dropdown-icon">🚪</span> Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <a className="btn btn--ghost" href="/login" onClick={() => setIsNavOpen(false)}>Login</a>
                  <a className="btn btn--primary" href="/register" onClick={() => setIsNavOpen(false)}>Register</a>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className={`hero hero--career ${isAdmin ? "hero--admin" : ""}`}>
        <div className="container hero__container">
          <div className="hero__content">
            <h1 className="hero__title">
              {isAdmin ? "Career System Management" : "Career Development Hub"}
            </h1>
            
            {!isAdmin && (
              <>
                <p className="hero__subtitle">
                  Plan your future with internship opportunities, career guidance, and professional resources
                </p>
                <div className="hero__stats">
                  <div className="hero__stat">
                    <span className="hero__stat-number">50+</span>
                    <span className="hero__stat-label">Internships</span>
                  </div>
                  <div className="hero__stat">
                    <span className="hero__stat-number">Expert</span>
                    <span className="hero__stat-label">Career Guidance</span>
                  </div>
                  <div className="hero__stat">
                    <span className="hero__stat-number">Free</span>
                    <span className="hero__stat-label">Resources</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ================= MAIN CAREER DASHBOARD ================= */}
      <main className="section">
        <div className="container">
          <div className="section__head">
            <span className={`section__tag ${isAdmin ? "section__tag--admin" : "section__tag--career"}`}>
              {isAdmin ? "Admin Controls" : "Career Services"}
            </span>
            <h2 className="section__title">
              {isAdmin ? "System Configuration & Moderation" : "Career Opportunities & Resources"}
            </h2>
            <p className="section__desc">
              {isAdmin 
                ? "Select a category below to add, edit, or delete items from the career database."
                : "Explore career pathways, find internships, and access tools to build your professional future"}
            </p>
          </div>

          {/* Career Cards — same .posts pattern as Events on Home page */}
          <div className="posts">
            {/* Internship Opportunities Card */}
            <article className="post">
              <div className="post__media">
                <img
                  src={internshipImg}
                  alt="Internship opportunities"
                  loading="lazy"
                />
                <span className="tag tag--activity">Opportunities</span>
              </div>
              <div className="post__body">
                <h3 className="post__title">Internship Opportunities</h3>
                {!isAdmin && (
                  <p className="post__text">
                    Browse and apply for the latest internship openings from top companies and startups.
                  </p>
                )}
                <a
                  className={`post__link ${isAdmin ? "post__link--admin" : ""}`}
                  href="/career/internships"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/career/internships");
                    setIsNavOpen(false);
                  }}
                >
                  {isAdmin ? "Manage Component →" : "View Details →"}
                </a>
              </div>
            </article>

            {/* Career Guidance Card */}
            <article className="post">
              <div className="post__media">
                <img
                  src={guidanceImg}
                  alt="Career guidance"
                  loading="lazy"
                />
                <span className="tag tag--activity">Guidance</span>
              </div>
              <div className="post__body">
                <h3 className="post__title">Career Guidance</h3>
                {!isAdmin && (
                  <p className="post__text">
                    Get personalized career advice, roadmaps, and mentorship from industry professionals.
                  </p>
                )}
                <a
                  className={`post__link ${isAdmin ? "post__link--admin" : ""}`}
                  href="/career/guidance"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/career/guidance");
                    setIsNavOpen(false);
                  }}
                >
                  {isAdmin ? "Manage Component →" : "View Details →"}
                </a>
              </div>
            </article>

            {/* Resources Card */}
            <article className="post">
              <div className="post__media">
                <img
                  src={resourcesImg}
                  alt="Career resources"
                  loading="lazy"
                />
                <span className="tag tag--activity">Resources</span>
              </div>
              <div className="post__body">
                <h3 className="post__title">Resources</h3>
                {!isAdmin && (
                  <p className="post__text">
                    Access CV templates, interview guides, skill assessments, and career planning tools.
                  </p>
                )}
                <a
                  className={`post__link ${isAdmin ? "post__link--admin" : ""}`}
                  href="/career/resources"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/career/resources");
                    setIsNavOpen(false);
                  }}
                >
                  {isAdmin ? "Manage Component →" : "View Details →"}
                </a>
              </div>
            </article>

            {/* Internship Management Card */}
            <article className="post">
              <div className="post__media">
                <img
                  src={managementImg}
                  alt="Internship management"
                  loading="lazy"
                />
                <span className="tag tag--activity">Management</span>
              </div>
              <div className="post__body">
                <h3 className="post__title">Internship Management</h3>
                {!isAdmin && (
                  <p className="post__text">
                    Track your internship applications, manage deadlines, and monitor progress.
                  </p>
                )}
                <a
                  className={`post__link ${isAdmin ? "post__link--admin" : ""}`}
                  href="/career/management"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/career/management");
                    setIsNavOpen(false);
                  }}
                >
                  {isAdmin ? "Manage Component →" : "View Details →"}
                </a>
              </div>
            </article>

            {/* Resume Builder Card */}
            <article className="post">
              <div className="post__media">
                <img
                  src={resourcesImg}
                  alt="Resume Builder"
                  loading="lazy"
                />
                <span className="tag tag--activity">Tools</span>
              </div>
              <div className="post__body">
                <h3 className="post__title">CV / Resume Builder</h3>
                {!isAdmin && (
                  <p className="post__text">
                    Create, edit, and export ATS-friendly professional resumes tailored to your career goals.
                  </p>
                )}
                <a
                  className={`post__link ${isAdmin ? "post__link--admin" : ""}`}
                  href="/career/resume-builder"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/career/resume-builder");
                    setIsNavOpen(false);
                  }}
                >
                  {isAdmin ? "Build Sample Resume →" : "Build Resume →"}
                </a>
              </div>
            </article>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="container footer__panel">
          <div className="footer__support">
            <p className="footer__kicker">Need Career Help?</p>
            <h3 className="footer__heading">Support</h3>
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
              {weekdayLabels.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="footer__days">
              {calendarDays.map((day, index) => {
                if (!day) return <span className="is-muted" key={`empty-${index}`}></span>;
                const isToday = day === currentDay;
                return (
                  <span key={`day-${day}`} className={isToday ? "is-active" : ""}>
                    {day}
                  </span>
                );
              })}
            </div>
            <a className="footer__fullCalendar" href="/events" onClick={goToEventsDashboard}>
              Full calendar →
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
              <a href="/" onClick={goToHome} aria-label="Facebook">
                <img src={facebookIcon} alt="facebook" className="footer__socialIcon" />
              </a>
              <a href="/" onClick={goToHome} aria-label="Instagram">
                <img src={instagramIcon} alt="instagram" className="footer__socialIcon" />
              </a>
              <a href="/" onClick={goToHome} aria-label="LinkedIn">
                <img src={linkedinIcon} alt="linkedin" className="footer__socialIcon" />
              </a>
              <a href="/" onClick={goToHome} aria-label="YouTube">
                <img src={youtubeIcon} alt="youtube" className="footer__socialIcon" />
              </a>
            </div>

            <a className="toTop" href="#top" onClick={scrollToTop} aria-label="Back to top">
              ↑
            </a>
          </div>
        </div>
      </footer>

      {/* Toast notification */}
      <div
        className={`toast ${toastVisible ? "is-visible" : ""}`.trim()}
        id="toast"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {toastText}
      </div>
    </>
  );
}

export default Career;
