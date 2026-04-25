import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import "./StudyHelp.css";
import campusLogo from "../images/campus_logo.png";
import profileImg from "../images/profile.png";

function StudyHelp() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    document.title = "Study Help - CampusZen";
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsNavOpen(false);
        setIsProfileOpen(false);
      }
    };
    const onDocumentClick = (event) => {
      const target = event.target;
      if (!target || !navLinksRef.current || !navToggleRef.current) return;
      const clickedInsideNav =
        navLinksRef.current.contains(target) || navToggleRef.current.contains(target);
      const clickedInsideProfile = profileRef.current && profileRef.current.contains(target);
      if (!clickedInsideNav) setIsNavOpen(false);
      if (!clickedInsideProfile) setIsProfileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onDocumentClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocumentClick);
    };
  }, []);

  const goHome = (event) => {
    event.preventDefault();
    navigate("/");
    setIsNavOpen(false);
  };

  return (
    <>
      <header className="topbar" id="top">
        <nav className="nav container">
          <Link className="brand" to="/" aria-label="CampusZen Home" onClick={goHome}>
            <img className="brand__logo--img" src={campusLogo} alt="CampusZen Logo" />
          </Link>

          <button
            className="nav__toggle"
            ref={navToggleRef}
            aria-label={isNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={isNavOpen ? "true" : "false"}
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            <span className="nav__toggleBars" aria-hidden="true"></span>
          </button>

          <div
            className={`nav__links ${isNavOpen ? "is-open" : ""}`.trim()}
            ref={navLinksRef}
          >
            <Link to="/" onClick={goHome}>Home</Link>
            <Link to="/health" onClick={() => setIsNavOpen(false)}>Health</Link>
            <Link to="/events" onClick={() => setIsNavOpen(false)}>Events</Link>
            <Link to="/study-help" onClick={() => setIsNavOpen(false)}>Study Help</Link>
          </div>

          <div className="header__profileDropdown" ref={profileRef}>
            {isLoggedIn ? (
              <>
                <button
                  className="header__profileBtn"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  aria-expanded={isProfileOpen}
                >
                  <span className="header__profileText">My Account</span>
                  <span className="header__profileArrow" aria-hidden="true">▼</span>
                  <img className="header__profileCircle" src={profileImg} alt="Profile" />
                </button>
                {isProfileOpen && (
                  <div className="header__profileMenu">
                    <a href="#profile" className="header__profileMenuItem">Profile</a>
                    <button
                      className="header__profileMenuItem header__profileMenuItem--danger"
                      onClick={() => { localStorage.clear(); navigate("/login"); }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="btn btn--ghost">Login</Link>
            )}
          </div>
        </nav>
      </header>

      <main className="studyHelp">
        <div className="studyHelp__header container">
          <h1 className="studyHelp__title">Study Help</h1>
          <p className="studyHelp__subtitle">
            Everything you need to excel in your studies — all in one place.
          </p>
        </div>

        <div className="studyHelp__grid container">
          <article className="studyHelp__card" onClick={() => navigate("/study-groups")}>
            <div className="studyHelp__cardImgWrap">
              <img
                className="studyHelp__cardImg"
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80"
                alt="Students studying together"
              />
              <span className="studyHelp__cardBadge">👥</span>
            </div>
            <div className="studyHelp__cardBody">
              <h2 className="studyHelp__cardTitle">Study Groups</h2>
              <p className="studyHelp__cardDesc">
                Find or create study groups for your modules. Collaborate with peers and ace your exams together.
              </p>
              <Link
                to="/study-groups"
                className="studyHelp__cardBtn"
                onClick={(e) => e.stopPropagation()}
              >
                Go to Study Groups →
              </Link>
            </div>
          </article>

          <article className="studyHelp__card" onClick={() => navigate("/resources")}>
            <div className="studyHelp__cardImgWrap">
              <img
                className="studyHelp__cardImg"
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80"
                alt="Library books and study materials"
              />
              <span className="studyHelp__cardBadge">📚</span>
            </div>
            <div className="studyHelp__cardBody">
              <h2 className="studyHelp__cardTitle">Resources</h2>
              <p className="studyHelp__cardDesc">
                Share and discover study materials including PDFs, notes, slides, videos, and links.
              </p>
              <Link
                to="/resources"
                className="studyHelp__cardBtn"
                onClick={(e) => e.stopPropagation()}
              >
                Go to Resources →
              </Link>
            </div>
          </article>

          <article className="studyHelp__card" onClick={() => navigate("/assignments")}>
            <div className="studyHelp__cardImgWrap">
              <img
                className="studyHelp__cardImg"
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80"
                alt="Writing and completing assignments"
              />
              <span className="studyHelp__cardBadge">📝</span>
            </div>
            <div className="studyHelp__cardBody">
              <h2 className="studyHelp__cardTitle">Assignments</h2>
              <p className="studyHelp__cardDesc">
                Track and manage your assignments. Stay on top of deadlines and never miss a submission.
              </p>
              <Link
                to="/assignments"
                className="studyHelp__cardBtn"
                onClick={(e) => e.stopPropagation()}
              >
                Go to Assignments →
              </Link>
            </div>
          </article>

          <article className="studyHelp__card" onClick={() => navigate("/timetable")}>
            <div className="studyHelp__cardImgWrap">
              <img
                className="studyHelp__cardImg"
                src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=80"
                alt="Weekly planner and timetable"
              />
              <span className="studyHelp__cardBadge">📅</span>
            </div>
            <div className="studyHelp__cardBody">
              <h2 className="studyHelp__cardTitle">Timetable</h2>
              <p className="studyHelp__cardDesc">
                Plan your weekly schedule with a visual timetable. Manage lectures, study sessions, and revision time.
              </p>
              <Link
                to="/timetable"
                className="studyHelp__cardBtn"
                onClick={(e) => e.stopPropagation()}
              >
                Go to Timetable →
              </Link>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}

export default StudyHelp;
