import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sportsAPI } from "../services/api";
import "./Sports.css";
import "./Home.css";
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";
import profileImg from "../images/profile.png";
import cricketImg from "../images/cricket.png";
import swimmingImg from "../images/swimming.png";
import chessImg from "../images/chess.png";
import badmintonImg from "../images/badminton.png";
import carromImg from "../images/carrom.png";
import footballImg from "../images/football.png";
import volleyballImg from "../images/volleyball.png";
import netballImg from "../images/netball.png";

// Sports data with registration periods
const initialSportsData = [
  {
    id: "cricket",
    name: "Cricket Team Selection",
    category: "Team Selection",
    description: "Join the university cricket team and represent us in inter-university tournaments.",
    registrationOpen: "2026-03-01",
    registrationClose: "2026-03-25",
    venue: "Cricket Ground",
    coach: "Coach Rajitha Silva",
    maxCapacity: 100,
    registered: 45,
    eligibility: "All students with basic cricket knowledge",
    selectionCriteria: "Batting, Bowling, Fielding skills assessment",
    requiresMedical: true,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://forms.gle/cricket-registration",
    image: cricketImg,
  },
  {
    id: "volleyball",
    name: "Volleyball Tournament",
    category: "Tournament",
    description: "Compete in the annual inter-batch volleyball tournament.",
    registrationOpen: "2026-03-05",
    registrationClose: "2026-03-30",
    venue: "Indoor Sports Complex",
    coach: "Coach Nimal Fernando",
    maxCapacity: 80,
    registered: 62,
    eligibility: "All students",
    selectionCriteria: "Team formation and skill assessment",
    requiresMedical: false,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://forms.gle/volleyball-registration",
    image: volleyballImg,
  },
  {
    id: "netball",
    name: "Netball Team Trials",
    category: "Team Selection",
    description: "Try out for the university netball team.",
    registrationOpen: "2026-03-10",
    registrationClose: "2026-04-05",
    venue: "Netball Court",
    coach: "Coach Sanduni Perera",
    maxCapacity: 60,
    registered: 38,
    eligibility: "Female students only",
    selectionCriteria: "Agility, teamwork, and game knowledge",
    requiresMedical: true,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://forms.gle/netball-registration",
    image: netballImg,
  },
  {
    id: "badminton",
    name: "Badminton Championship",
    category: "Tournament",
    description: "Annual badminton singles and doubles championship.",
    registrationOpen: "2026-02-25",
    registrationClose: "2026-03-20",
    venue: "Indoor Sports Hall",
    coach: "Coach Kasun Jayawardena",
    maxCapacity: 120,
    registered: 98,
    eligibility: "All students",
    selectionCriteria: "Singles and doubles matches",
    requiresMedical: false,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://forms.gle/badminton-registration",
    image: badmintonImg,
  },
  {
    id: "chess",
    name: "Chess Tournament",
    category: "Tournament",
    description: "Strategic chess tournament for all skill levels.",
    registrationOpen: "2026-03-08",
    registrationClose: "2026-04-10",
    venue: "Chess Club Room",
    coach: "Instructor Pradeep Kumar",
    maxCapacity: 50,
    registered: 23,
    eligibility: "All students",
    selectionCriteria: "Round-robin tournament format",
    requiresMedical: false,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://forms.gle/chess-registration",
    image: chessImg,
  },
  {
    id: "carrom",
    name: "Carrom Championship",
    category: "Tournament",
    description: "Inter-batch carrom singles and doubles tournament.",
    registrationOpen: "2026-03-15",
    registrationClose: "2026-04-15",
    venue: "Recreation Center",
    coach: "Coordinator Ruwan Silva",
    maxCapacity: 40,
    registered: 15,
    eligibility: "All students",
    selectionCriteria: "Tournament knockout rounds",
    requiresMedical: false,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://forms.gle/carrom-registration",
    image: carromImg,
  },
  {
    id: "football",
    name: "Football Team Selection",
    category: "Team Selection",
    description: "Selection for university football team.",
    registrationOpen: "2026-02-28",
    registrationClose: "2026-03-28",
    venue: "Football Field",
    coach: "Coach Dilshan Wickramasinghe",
    maxCapacity: 70,
    registered: 54,
    eligibility: "All students",
    selectionCriteria: "Singles matches and reaction time",
    requiresMedical: false,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://forms.gle/football-registration",
    image: footballImg,
  },
  {
    id: "swimming",
    name: "Swimming Team Selection",
    category: "Team Selection",
    description: "Join the university swimming team for competitive events.",
    registrationOpen: "2026-03-20",
    registrationClose: "2026-04-20",
    venue: "University Pool",
    coach: "Coach Nimali Wickramarachchi",
    maxCapacity: 50,
    registered: 12,
    eligibility: "Students with swimming certification",
    selectionCriteria: "Freestyle, backstroke, breaststroke trials",
    requiresMedical: true,
    skillLevels: ["Intermediate", "Advanced"],
    registrationLink: "https://forms.gle/swimming-registration",
    image: swimmingImg,
  },
];

function Sports() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sports, setSports] = useState(initialSportsData);
  const [isAdmin, setIsAdmin] = useState(false); // Set to true for admin
  const [selectedSport, setSelectedSport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const profileRef = useRef(null);

  // Fetch sports data from API
  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await sportsAPI.getAllSports();
        
        if (response.success && response.data) {
          // Map backend data to match frontend format
          const mappedSports = response.data.map((sport) => ({
            id: sport._id,
            name: sport.name,
            category: sport.category,
            description: sport.description,
            registrationOpen: sport.registrationOpen,
            registrationClose: sport.registrationClose,
            venue: sport.venue,
            coach: sport.coach,
            maxCapacity: sport.maxCapacity,
            registered: sport.registered,
            eligibility: sport.eligibility,
            selectionCriteria: sport.selectionCriteria,
            requiresMedical: sport.requiresMedical,
            skillLevels: sport.skillLevels,
            registrationLink: sport.registrationLink,
          }));
          setSports(mappedSports);
        } else {
          // Use fallback data if API fails
          setSports(initialSportsData);
        }
      } catch (err) {
        console.error('Error fetching sports:', err);
        setError('Failed to load sports. Showing sample data.');
        // Use fallback data on error
        setSports(initialSportsData);
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsNavOpen(false);
        setIsProfileOpen(false);
        setShowDetailsModal(false);
        setShowNotifications(false);
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

  // Check registration status and generate notifications
  useEffect(() => {
    const today = new Date();
    const newNotifications = [];

    sports.forEach((sport) => {
      const openDate = new Date(sport.registrationOpen);
      const closeDate = new Date(sport.registrationClose);
      const twoDaysBefore = new Date(closeDate);
      twoDaysBefore.setDate(closeDate.getDate() - 2);

      // Registration opening today
      if (today.toDateString() === openDate.toDateString()) {
        newNotifications.push({
          id: `open-${sport.id}`,
          type: "success",
          message: `${sport.name} registration is now OPEN!`,
          sport: sport.name,
          date: today,
        });
      }

      // 2 days before closing
      if (today >= twoDaysBefore && today < closeDate) {
        const daysLeft = Math.ceil((closeDate - today) / (1000 * 60 * 60 * 24));
        newNotifications.push({
          id: `warning-${sport.id}`,
          type: "warning",
          message: `${sport.name} registration closes in ${daysLeft} day${daysLeft > 1 ? 's' : ''}!`,
          sport: sport.name,
          date: today,
        });
      }

      // Last day
      if (today.toDateString() === closeDate.toDateString()) {
        newNotifications.push({
          id: `lastday-${sport.id}`,
          type: "urgent",
          message: `LAST DAY! ${sport.name} registration closes today!`,
          sport: sport.name,
          date: today,
        });
      }
    });

    setNotifications(newNotifications);
  }, [sports]);

  const getRegistrationStatus = (sport) => {
    const today = new Date();
    const openDate = new Date(sport.registrationOpen);
    const closeDate = new Date(sport.registrationClose);

    if (today < openDate) {
      return { status: "COMING SOON", class: "status--comingSoon", disabled: true };
    } else if (today >= openDate && today <= closeDate) {
      if (sport.registered >= sport.maxCapacity) {
        return { status: "FULL", class: "status--full", disabled: true };
      }
      return { status: "OPEN", class: "status--open", disabled: false };
    } else {
      return { status: "CLOSED", class: "status--closed", disabled: true };
    }
  };

  const handleViewDetails = (sport) => {
    setSelectedSport(sport);
    setShowDetailsModal(true);
  };

  const handleRegister = (sport) => {
    const statusInfo = getRegistrationStatus(sport);
    
    if (statusInfo.disabled) {
      alert(`Registration is ${statusInfo.status}. Cannot register at this time.`);
      return;
    }

    // Open the registration link in a new tab
    window.open(sport.registrationLink, '_blank');
  };

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
            <Link to="/events" onClick={() => setIsNavOpen(false)}>
              Events
            </Link>
            <a href="#career" onClick={() => setIsNavOpen(false)}>
              Career
            </a>
            <a href="#study" onClick={() => setIsNavOpen(false)}>
              Study
            </a>
          </div>

          <button 
            className="header__notificationBtn" 
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <svg className="header__notificationIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
              <path d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"/>
            </svg>
            {notifications.length > 0 && (
              <span className="header__notificationBadge">{notifications.length}</span>
            )}
          </button>

          {showNotifications && notifications.length > 0 && (
            <div className="notifications__dropdown">
              <div className="notifications__header">
                <h3>Notifications</h3>
                <button onClick={() => setShowNotifications(false)}>×</button>
              </div>
              <div className="notifications__list">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`notification__item notification__item--${notif.type}`}>
                    <div className="notification__icon">
                      {notif.type === "success" && "🔔"}
                      {notif.type === "warning" && "⚠️"}
                      {notif.type === "urgent" && "🚨"}
                    </div>
                    <div className="notification__content">
                      <p className="notification__message">{notif.message}</p>
                      <span className="notification__sport">{notif.sport}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                <a href="#mysports" className="header__profileMenuItem">My Sports</a>
                <a href="#password change" className="header__profileMenuItem">Password Change</a>
                <a href="#logout" className="header__profileMenuItem header__profileMenuItem--danger">Logout</a>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="sports">
        <div className="sports__header container">
          <div className="sports__headerContent">
            <Link to="/events" className="sports__backBtn">
              ← Back to Events
            </Link>
            <h1 className="sports__title">University Sports Programs</h1>
            <p className="sports__subtitle">
              Join our sports teams and tournaments. Register during open periods to participate in university sports activities.
            </p>
          </div>
        </div>

        {error && (
          <div className="sports__alertBanner container">
            <div className="alert alert--warning">
              <span className="alert__icon">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {notifications.length > 0 && (
          <div className="sports__alertBanner container">
            <div className="alert alert--info">
              <span className="alert__icon">📢</span>
              <span>You have {notifications.length} active sports notification{notifications.length > 1 ? 's' : ''}!</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="sports__loading container">
            <div className="loading__spinner"></div>
            <p className="loading__text">Loading sports programs...</p>
          </div>
        ) : (
          <div className="sports__grid container">
            {sports.map((sport) => {
            const statusInfo = getRegistrationStatus(sport);
            const filledPercentage = (sport.registered / sport.maxCapacity) * 100;

            return (
              <article key={sport.id} className="sports__card">
                <div className="sports__cardImage">
                  <img src={sport.image} alt={sport.name} className="sports__image" />
                  <div className="sports__cardBadges">
                    <span className="sports__categoryBadge">{sport.category}</span>
                    <span className={`sports__status ${statusInfo.class}`}>
                      {statusInfo.status}
                    </span>
                  </div>
                </div>

                <div className="sports__content">
                  <h2 className="sports__name">{sport.name}</h2>
                  <p className="sports__description">{sport.description}</p>

                  <div className="sports__meta">
                    <div className="sports__metaItem">
                      <svg className="sports__metaIcon" viewBox="0 0 24 24" fill="none">
                        <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="sports__metaText">
                        <span className="sports__metaLabel">Opens:</span>
                        <span className="sports__metaValue">
                          {new Date(sport.registrationOpen).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>

                    <div className="sports__metaItem">
                      <svg className="sports__metaIcon" viewBox="0 0 24 24" fill="none">
                        <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="sports__metaText">
                        <span className="sports__metaLabel">Closes:</span>
                        <span className="sports__metaValue">
                          {new Date(sport.registrationClose).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>

                    <div className="sports__metaItem sports__metaItem--full">
                      <svg className="sports__metaIcon" viewBox="0 0 24 24" fill="none">
                        <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M3.62 8.49C5.59 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      <div className="sports__metaText">
                        <span className="sports__metaLabel">Venue:</span>
                        <span className="sports__metaValue">{sport.venue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="sports__capacitySection">
                    <div className="sports__capacityHeader">
                      <span className="sports__capacityLabel">Registered</span>
                      <span className="sports__capacityValue">
                        {sport.registered} / {sport.maxCapacity}
                      </span>
                    </div>
                    <div className="sports__progressBar">
                      <div 
                        className="sports__progress"
                        style={{ 
                          width: `${filledPercentage}%`,
                          backgroundColor: filledPercentage >= 90 ? '#e74c3c' : filledPercentage >= 70 ? '#f39c12' : '#27ae60'
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="sports__actions">
                    <button
                      className="sports__btn sports__btn--secondary"
                      onClick={() => handleViewDetails(sport)}
                    >
                      View Details
                    </button>
                    <button
                      className={`sports__btn sports__btn--primary ${statusInfo.disabled ? 'sports__btn--disabled' : ''}`}
                      onClick={() => handleRegister(sport)}
                      disabled={statusInfo.disabled}
                    >
                      {statusInfo.status === "FULL" ? "Registration Full" : 
                       statusInfo.status === "CLOSED" ? "Registration Closed" :
                       statusInfo.status === "COMING SOON" ? "Coming Soon" : "Register Now"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        )}
      </main>

      {/* Sports Details Modal */}
      {showDetailsModal && selectedSport && (
        <div className="modal__overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal__content modal__content--large" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <div className="modal__headerImage">
                <img src={selectedSport.image} alt={selectedSport.name} className="modal__sportImage" />
              </div>
              <div className="modal__headerContent">
                <div>
                  <h2 className="modal__title">{selectedSport.name}</h2>
                  <span className="modal__category">{selectedSport.category}</span>
                </div>
              </div>
              <button
                className="modal__close"
                onClick={() => setShowDetailsModal(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="modal__body">
              <div className="sportDetails__section">
                <h3 className="sportDetails__heading">Description</h3>
                <p className="sportDetails__text">{selectedSport.description}</p>
              </div>

              <div className="sportDetails__grid">
                <div className="sportDetails__item">
                  <span className="sportDetails__label">Coach/Instructor</span>
                  <span className="sportDetails__value">{selectedSport.coach}</span>
                </div>
                <div className="sportDetails__item">
                  <span className="sportDetails__label">Venue</span>
                  <span className="sportDetails__value">{selectedSport.venue}</span>
                </div>
                <div className="sportDetails__item">
                  <span className="sportDetails__label">Max Capacity</span>
                  <span className="sportDetails__value">{selectedSport.maxCapacity} participants</span>
                </div>
                <div className="sportDetails__item">
                  <span className="sportDetails__label">Currently Registered</span>
                  <span className="sportDetails__value">{selectedSport.registered} students</span>
                </div>
              </div>

              <div className="sportDetails__section">
                <h3 className="sportDetails__heading">Eligibility Requirements</h3>
                <p className="sportDetails__text">{selectedSport.eligibility}</p>
              </div>

              <div className="sportDetails__section">
                <h3 className="sportDetails__heading">Selection Criteria</h3>
                <p className="sportDetails__text">{selectedSport.selectionCriteria}</p>
              </div>

              <div className="sportDetails__section">
                <h3 className="sportDetails__heading">Skill Levels Accepted</h3>
                <div className="sportDetails__skillLevels">
                  {selectedSport.skillLevels.map((level) => (
                    <span key={level} className="sportDetails__skillBadge">
                      {level}
                    </span>
                  ))}
                </div>
              </div>

              {selectedSport.requiresMedical && (
                <div className="sportDetails__alert">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 9V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 21.41H5.94C2.47 21.41 1.02 18.93 2.7 15.9L5.82 10.28L8.76 5.00003C10.54 1.79003 13.46 1.79003 15.24 5.00003L18.18 10.29L21.3 15.91C22.98 18.94 21.52 21.42 18.06 21.42H12V21.41Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.995 17H12.004" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Medical certificate required for registration</span>
                </div>
              )}

              <div className="sportDetails__registration">
                <div className="sportDetails__dates">
                  <div className="sportDetails__dateItem">
                    <span className="sportDetails__dateLabel">Registration Opens</span>
                    <span className="sportDetails__dateValue">
                      {new Date(selectedSport.registrationOpen).toLocaleDateString("en-US", { 
                        weekday: "long", month: "long", day: "numeric", year: "numeric" 
                      })}
                    </span>
                  </div>
                  <div className="sportDetails__dateItem">
                    <span className="sportDetails__dateLabel">Registration Closes</span>
                    <span className="sportDetails__dateValue">
                      {new Date(selectedSport.registrationClose).toLocaleDateString("en-US", { 
                        weekday: "long", month: "long", day: "numeric", year: "numeric" 
                      })}
                    </span>
                  </div>
                </div>

                <button
                  className={`sports__btn sports__btn--primary sports__btn--large ${
                    getRegistrationStatus(selectedSport).disabled ? 'sports__btn--disabled' : ''
                  }`}
                  onClick={() => handleRegister(selectedSport)}
                  disabled={getRegistrationStatus(selectedSport).disabled}
                >
                  {getRegistrationStatus(selectedSport).status === "FULL" ? "Registration Full" : 
                   getRegistrationStatus(selectedSport).status === "CLOSED" ? "Registration Closed" :
                   getRegistrationStatus(selectedSport).status === "COMING SOON" ? "Coming Soon" : "Register Now →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <Link className="footer__fullCalendar" to="/events">
              Full calendar
            </Link>
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

export default Sports;
