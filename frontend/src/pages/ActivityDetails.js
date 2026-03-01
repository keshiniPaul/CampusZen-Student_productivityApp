import { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./ActivityDetails.css";
import "../pages/Home.css";
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";
import profileImg from "../images/profile.png";

// Sample activity data - replace with API calls later
const activitiesData = {
  event: {
    id: "event-1",
    title: "Web Development Workshop",
    category: "Event",
    date: "2026-03-15",
    time: "10:00 AM - 1:00 PM",
    venue: "Main Auditorium, Building A",
    description:
      "Learn modern web development with React and Node.js. This workshop covers the fundamentals of full-stack web development and includes hands-on coding exercises. Perfect for beginners and intermediate developers.",
    registrationOpen: "2026-03-01",
    registrationClose: "2026-03-10",
    capacity: 100,
    registered: 45,
    image: require("../images/event1.png"),
  },
  sports: {
    id: "sports-1",
    title: "Cricket Tournament Registration",
    category: "Sports",
    date: "2026-04-05",
    time: "2:00 PM",
    venue: "Sports Field, Campus Ground",
    description:
      "Join the annual inter-batch cricket tournament. Teams of 11 players per batch. Register your team before the deadline. Winners will receive trophies and certificates.",
    registrationOpen: "2026-03-08",
    registrationClose: "2026-03-25",
    capacity: 200,
    registered: 180,
    image: require("../images/sport.png"),
  },
  community: {
    id: "community-1",
    title: "IEEE Student Chapter Meetup",
    category: "Club & Society",
    date: "2026-03-20",
    time: "3:30 PM - 5:00 PM",
    venue: "Digital Lab, Building B",
    description:
      "Meet with IEEE student chapter members. Discuss upcoming projects, network with industry professionals, and explore career opportunities in engineering and technology.",
    registrationOpen: "2026-03-05",
    registrationClose: "2026-03-18",
    capacity: 80,
    registered: 62,
    image: require("../images/club.png"),
  },
};

function ActivityDetails() {
  const { activityType } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [showClosedMessage, setShowClosedMessage] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const data =
      activitiesData[activityType] || activitiesData.event;
    setActivity(data);

    // Check if registration is open
    const today = new Date();
    const regOpen = new Date(data.registrationOpen);
    const regClose = new Date(data.registrationClose);
    setIsRegistrationOpen(today >= regOpen && today <= regClose);
  }, [activityType]);

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

  const scrollToTop = (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsNavOpen(false);
  };

  const goHome = (event) => {
    event.preventDefault();
    navigate("/");
    setIsNavOpen(false);
  };

  const handleRegistrationClick = (e) => {
    e.preventDefault();
    if (!isRegistrationOpen) {
      setShowClosedMessage(true);
      setTimeout(() => setShowClosedMessage(false), 3000);
      return;
    }
    navigate(`/register/${activity.id}`);
  };

  if (!activity) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header className="topbar" id="top">
        <nav className="nav container">
          <Link className="brand" to="/" aria-label="CampusZone Home" onClick={scrollToTop}>
            <img 
              className="brand__logo--img" 
              src={campusLogo} 
              alt="CampusZone Logo"
            />
          </Link>

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
            <Link to="/" onClick={goHome}>
              Home
            </Link>
            <a href="#health" onClick={() => setIsNavOpen(false)}>
              Health
            </a>
            <a href="#event" onClick={() => setIsNavOpen(false)}>
              Events
            </a>
            <a href="#career" onClick={() => setIsNavOpen(false)}>
              Career
            </a>
            <a href="#study" onClick={() => setIsNavOpen(false)}>
              Study
            </a>
          </div>

          <div className="header__profileDropdown" ref={profileRef}>
            <button
              className="header__profileBtn"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-expanded={isProfileOpen}
            >
              <span className="header__profileText"> UTHPALA </span>
              <span className="header__profileArrow" aria-hidden="true">▼</span>
              <img className="header__profileCircle" src={profileImg} alt="Uthpala" />
            </button>
            {isProfileOpen && (
              <div className="header__profileMenu">
                <a href="#profile" className="header__profileMenuItem">Profile</a>
                <a href="#password change" className="header__profileMenuItem">Password Change</a>
                <a href="#logout" className="header__profileMenuItem header__profileMenuItem--danger">Logout</a>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="activityDetails">
        <div className="activityDetails__hero container">
          <Link to="/events" className="activityDetails__backBtn">
            ← Back to Dashboard
          </Link>
          <h1 className="activityDetails__title">{activity.title}</h1>
          <span className="activityDetails__category">{activity.category}</span>
        </div>

        <section className="activityDetails__container container">
          <div className="activityDetails__main">
            <img 
              src={activity.image} 
              alt={activity.title}
              className="activityDetails__image"
            />

            <div className="activityDetails__info">
              <div className="activityDetails__detail">
                <h3>📅 Date</h3>
                <p>{new Date(activity.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
              </div>

              <div className="activityDetails__detail">
                <h3>⏰ Time</h3>
                <p>{activity.time}</p>
              </div>

              <div className="activityDetails__detail">
                <h3>📍 Venue</h3>
                <p>{activity.venue}</p>
              </div>

              <div className="activityDetails__detail">
                <h3>👥 Capacity</h3>
                <p>{activity.registered} / {activity.capacity} registered</p>
                <div className="activityDetails__progressBar">
                  <div 
                    className="activityDetails__progress"
                    style={{ width: `${(activity.registered / activity.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="activityDetails__description">
              <h2>About This Activity</h2>
              <p>{activity.description}</p>
            </div>

            <div className="activityDetails__registrationInfo">
              <h3>Registration Period</h3>
              <p>
                Opens: {new Date(activity.registrationOpen).toLocaleDateString()}
              </p>
              <p>
                Closes: {new Date(activity.registrationClose).toLocaleDateString()}
              </p>
              {isRegistrationOpen ? (
                <p className="activityDetails__register--open">✓ Registration is Open</p>
              ) : (
                <p className="activityDetails__register--closed">✗ Registration is Closed</p>
              )}
            </div>

            {showClosedMessage && (
              <div className="activityDetails__notification activityDetails__notification--error">
                Registration period is closed. Please check back during the registration window.
              </div>
            )}
          </div>

          <aside className="activityDetails__sidebar">
            <button
              className={`activityDetails__registerBtn ${
                isRegistrationOpen ? "is-enabled" : "is-disabled"
              }`.trim()}
              onClick={handleRegistrationClick}
            >
              {isRegistrationOpen ? "Register Now" : "Registration Closed"}
            </button>
            <div className="activityDetails__sidebarInfo">
              <p className="activityDetails__small">
                {isRegistrationOpen
                  ? "Click the button above to join this activity"
                  : "Registration period has ended"}
              </p>
            </div>
          </aside>
        </section>
      </main>

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
              <a href="#top" onClick={scrollToTop} aria-label="Facebook">
                <img className="footer__socialIcon" src={facebookIcon} alt="Facebook" />
              </a>
              <a href="#top" onClick={scrollToTop} aria-label="Instagram">
                <img className="footer__socialIcon" src={instagramIcon} alt="Instagram" />
              </a>
              <a href="#top" onClick={scrollToTop} aria-label="LinkedIn">
                <img className="footer__socialIcon" src={linkedinIcon} alt="LinkedIn" />
              </a>
              <a href="#top" onClick={scrollToTop} aria-label="YouTube">
                <img className="footer__socialIcon" src={youtubeIcon} alt="YouTube" />
              </a>
            </div>

            <a className="toTop" href="#top" onClick={scrollToTop} aria-label="Back to top">
              ↑
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default ActivityDetails;
