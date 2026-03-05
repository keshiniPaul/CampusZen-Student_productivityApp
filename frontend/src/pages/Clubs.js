import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clubsAPI } from "../services/api";
import "./Clubs.css";
import "./Home.css";
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";
import profileImg from "../images/profile.png";
import clubImg from "../images/club.png";
import leoImg from "../images/LEO.png";
import sisImg from "../images/SIS.png";
import mediaImg from "../images/media.png";
import ieeeImg from "../images/IEEE.png";
import aiesecImg from "../images/AIESEC.png";
import societyImg from "../images/society.png";

// Initial clubs data with registration periods
const initialClubsData = [
  {
    id: "ieee",
    name: "IEEE Student Branch",
    category: "Technical",
    description: "Institute of Electrical and Electronics Engineers - Advancing technology for humanity.",
    registrationOpen: "2026-02-20",
    registrationClose: "2026-03-20",
    president: "Kasun Perera",
    advisor: "Dr. Chaminda Silva",
    maxMembers: 150,
    currentMembers: 87,
    vision: "To be the leading technical society fostering innovation and excellence in electrical and electronics engineering.",
    mission: "Empowering students through technical workshops, competitions, and industry connections.",
    upcomingEvents: ["Tech Talk Series", "Hackathon 2026", "Industry Visit"],
    socialMedia: {
      facebook: "https://facebook.com/ieee.sliit",
      instagram: "https://instagram.com/ieee.sliit",
      linkedin: "https://linkedin.com/company/ieee-sliit"
    },
    registrationLink: "https://forms.gle/ieee-registration",
    image: ieeeImg,
  },
  {
    id: "leo",
    name: "Leo Club",
    category: "Social Service",
    description: "Leadership, Experience, Opportunity - Youth empowerment through community service.",
    registrationOpen: "2026-03-01",
    registrationClose: "2026-03-31",
    president: "Nethmi Jayasinghe",
    advisor: "Ms. Sanduni Perera",
    maxMembers: 100,
    currentMembers: 68,
    vision: "Creating compassionate leaders who serve their communities with dedication.",
    mission: "Developing leadership skills through meaningful community service projects.",
    upcomingEvents: ["Blood Donation Camp", "Environmental Cleanup", "Charity Drive"],
    socialMedia: {
      facebook: "https://facebook.com/leo.sliit",
      instagram: "https://instagram.com/leo.sliit",
      linkedin: "https://linkedin.com/company/leo-sliit"
    },
    registrationLink: "https://forms.gle/leo-registration",
    image: leoImg,
  },
  {
    id: "aiesec",
    name: "AIESEC",
    category: "Professional",
    description: "Global youth-led organization for leadership development and international exchanges.",
    registrationOpen: "2026-02-25",
    registrationClose: "2026-03-25",
    president: "Dinuka Fernando",
    advisor: "Mr. Rohan Wickramasinghe",
    maxMembers: 80,
    currentMembers: 52,
    vision: "Peace and fulfillment of humankind's potential through youth leadership.",
    mission: "Activating leadership potential through cross-cultural exchanges and social impact.",
    upcomingEvents: ["Global Village", "Leadership Summit", "Exchange Info Session"],
    socialMedia: {
      facebook: "https://facebook.com/aiesec.sliit",
      instagram: "https://instagram.com/aiesec.sliit",
      linkedin: "https://linkedin.com/company/aiesec-sliit"
    },
    registrationLink: "https://forms.gle/aiesec-registration",
    image: aiesecImg,
  },
  {
    id: "sis",
    name: "Students Interactive Society",
    category: "Cultural",
    description: "Promoting cultural diversity and student interaction through creative events.",
    registrationOpen: "2026-03-05",
    registrationClose: "2026-04-05",
    president: "Tharushi Dissanayake",
    advisor: "Dr. Nirmal Gunawardena",
    maxMembers: 120,
    currentMembers: 95,
    vision: "Building a vibrant campus culture celebrating diversity and creativity.",
    mission: "Creating memorable experiences through cultural events and student engagement.",
    upcomingEvents: ["Cultural Night", "Talent Show", "Food Festival"],
    socialMedia: {
      facebook: "https://facebook.com/sis.sliit",
      instagram: "https://instagram.com/sis.sliit",
      linkedin: "https://linkedin.com/company/sis-sliit"
    },
    registrationLink: "https://forms.gle/sis-registration",
    image: sisImg,
  },
  {
    id: "media",
    name: "Media Unit",
    category: "Creative",
    description: "Capturing moments, telling stories - The official media unit of the university.",
    registrationOpen: "2026-03-10",
    registrationClose: "2026-04-10",
    president: "Sachini Wijesinghe",
    advisor: "Mr. Lasitha Bandara",
    maxMembers: 60,
    currentMembers: 45,
    vision: "Being the premier student media organization documenting campus life.",
    mission: "Delivering high-quality content through photography, videography, and journalism.",
    upcomingEvents: ["Photography Workshop", "Video Production Bootcamp", "Media Exhibition"],
    socialMedia: {
      facebook: "https://facebook.com/media.sliit",
      instagram: "https://instagram.com/media.sliit",
      linkedin: "https://linkedin.com/company/media-sliit"
    },
    registrationLink: "https://forms.gle/media-registration",
    image: mediaImg,
  },
  {
    id: "community",
    name: "Student Community",
    category: "Community",
    description: "Building bridges between students through social initiatives and welfare programs.",
    registrationOpen: "2026-02-28",
    registrationClose: "2026-03-28",
    president: "Ravindu Lakshan",
    advisor: "Ms. Priyanka Amarasinghe",
    maxMembers: 100,
    currentMembers: 73,
    vision: "Creating an inclusive and supportive student community.",
    mission: "Enhancing student welfare and fostering connections across batches.",
    upcomingEvents: ["Freshers' Welcome", "Mental Health Awareness Week", "Career Fair"],
    socialMedia: {
      facebook: "https://facebook.com/community.sliit",
      instagram: "https://instagram.com/community.sliit",
      linkedin: "https://linkedin.com/company/community-sliit"
    },
    registrationLink: "https://forms.gle/community-registration",
    image: societyImg,
  },
];

function Clubs() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [clubs, setClubs] = useState(initialClubsData);
  const [selectedClub, setSelectedClub] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const profileRef = useRef(null);

  // Debug: Log when Clubs page loads
  useEffect(() => {
    console.log('Clubs page loaded successfully!');
    console.log('Initial clubs data:', initialClubsData.length, 'items');
    document.title = 'Clubs - CampusZone';
  }, []);

  // Fetch clubs data from API
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        console.log('Fetching clubs from API...');
        const response = await clubsAPI.getAllClubs();
        
        if (response.success && response.data && response.data.length > 0) {
          const mappedClubs = response.data.map((club) => {
            // Find matching initial data for image fallback
            const initialClub = initialClubsData.find(c => c.id === club._id || c.name === club.name);
            return {
              id: club._id,
              name: club.name,
              category: club.category,
              description: club.description,
              registrationOpen: club.registrationOpen,
              registrationClose: club.registrationClose,
              president: club.president,
              advisor: club.advisor,
              maxMembers: club.maxMembers,
              currentMembers: club.currentMembers,
              vision: club.vision,
              mission: club.mission,
              upcomingEvents: club.upcomingEvents,
              socialMedia: club.socialMedia,
              registrationLink: club.registrationLink,
              image: club.image || (initialClub ? initialClub.image : clubImg),
            };
          });
          console.log('API clubs loaded:', mappedClubs.length);
          setClubs(mappedClubs);
        } else {
          // API returned no data, keep initial data
          console.log('API returned no data, keeping initial clubs data');
          setError('Using sample clubs data.');
        }
      } catch (err) {
        console.error('Error fetching clubs:', err);
        setError('Failed to load clubs. Showing sample data.');
        console.log('Using initial clubs data due to error');
        // Don't call setClubs, keep the initial data
      } finally {
        setLoading(false);
      }
    };

    // Set initial loading state
    setLoading(true);
    setError(null);
    fetchClubs();
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

    clubs.forEach((club) => {
      const openDate = new Date(club.registrationOpen);
      const closeDate = new Date(club.registrationClose);
      const threeDaysBefore = new Date(closeDate);
      threeDaysBefore.setDate(closeDate.getDate() - 3);
      const oneDayBefore = new Date(closeDate);
      oneDayBefore.setDate(closeDate.getDate() - 1);

      // Registration opening today
      if (today.toDateString() === openDate.toDateString()) {
        newNotifications.push({
          id: `open-${club.id}`,
          type: "success",
          message: `${club.name} registration is now OPEN!`,
          club: club.name,
          date: today,
        });
      }

      // 3 days before closing
      if (today.toDateString() === threeDaysBefore.toDateString()) {
        newNotifications.push({
          id: `3days-${club.id}`,
          type: "warning",
          message: `${club.name} registration closes in 3 days!`,
          club: club.name,
          date: today,
        });
      }

      // 1 day before closing
      if (today.toDateString() === oneDayBefore.toDateString()) {
        newNotifications.push({
          id: `1day-${club.id}`,
          type: "urgent",
          message: `TOMORROW! ${club.name} registration closes tomorrow!`,
          club: club.name,
          date: today,
        });
      }

      // Last day
      if (today.toDateString() === closeDate.toDateString()) {
        newNotifications.push({
          id: `lastday-${club.id}`,
          type: "urgent",
          message: `LAST DAY! ${club.name} registration closes today!`,
          club: club.name,
          date: today,
        });
      }
    });

    setNotifications(newNotifications);
  }, [clubs]);

  const getRegistrationStatus = (club) => {
    const today = new Date();
    const openDate = new Date(club.registrationOpen);
    const closeDate = new Date(club.registrationClose);

    if (today < openDate) {
      return { status: "COMING SOON", class: "status--comingSoon", disabled: true };
    } else if (today >= openDate && today <= closeDate) {
      if (club.currentMembers >= club.maxMembers) {
        return { status: "FULL", class: "status--full", disabled: true };
      }
      return { status: "OPEN", class: "status--open", disabled: false };
    } else {
      return { status: "CLOSED", class: "status--closed", disabled: true };
    }
  };

  const handleViewDetails = (club) => {
    setSelectedClub(club);
    setShowDetailsModal(true);
  };

  const handleJoinClub = (club) => {
    const statusInfo = getRegistrationStatus(club);
    if (statusInfo.disabled) return;

    // Open the registration link in a new tab
    window.open(club.registrationLink, '_blank');
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
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="Notifications"
          >
            🔔
            {notifications.length > 0 && (
              <span className="header__notificationBadge">{notifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications__dropdown">
              <div className="notifications__header">
                <h3 className="notifications__title">Notifications</h3>
                <span className="notifications__count">{notifications.length} new</span>
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
                      <span className="notification__club">{notif.club}</span>
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
                <a href="#myclubs" className="header__profileMenuItem">My Clubs</a>
                <a href="#password-change" className="header__profileMenuItem">Password Change</a>
                <a href="#logout" className="header__profileMenuItem header__profileMenuItem--danger">Logout</a>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="clubs">
        <div className="clubs__header container">
          <div className="clubs__headerContent">
            <Link to="/events" className="clubs__backBtn">
              ← Back to Events
            </Link>
            <h1 className="clubs__title">Clubs & Societies</h1>
            <p className="clubs__subtitle">
              Join student clubs and societies. Register during open periods to become a member and participate in exciting activities.
            </p>
          </div>
        </div>

        {error && (
          <div className="clubs__alertBanner container">
            <div className="alert alert--warning">
              <span className="alert__icon">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {notifications.length > 0 && (
          <div className="clubs__alertBanner container">
            <div className="alert alert--info">
              <span className="alert__icon">📢</span>
              <span>You have {notifications.length} active club notification{notifications.length > 1 ? 's' : ''}!</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="clubs__loading container">
            <div className="loading__spinner"></div>
            <p className="loading__text">Loading clubs & societies...</p>
          </div>
        ) : (
          <div className="clubs__grid container">
            {clubs.map((club) => {
              const statusInfo = getRegistrationStatus(club);
              const filledPercentage = (club.currentMembers / club.maxMembers) * 100;

              return (
                <article key={club.id} className="clubs__card">
                  <div className="clubs__cardImage">
                    <img src={club.image} alt={club.name} className="clubs__image" />
                    <div className="clubs__cardBadges">
                      <span className="clubs__categoryBadge">{club.category}</span>
                      <span className={`clubs__status ${statusInfo.class}`}>
                        {statusInfo.status}
                      </span>
                    </div>
                  </div>

                  <div className="clubs__content">
                    <h2 className="clubs__name">{club.name}</h2>
                    <p className="clubs__description">{club.description}</p>

                    <div className="clubs__meta">
                      <div className="clubs__metaItem">
                        <svg className="clubs__metaIcon" viewBox="0 0 24 24" fill="none">
                          <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="clubs__metaText">
                          <span className="clubs__metaLabel">Opens:</span>
                          <span className="clubs__metaValue">
                            {new Date(club.registrationOpen).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>

                      <div className="clubs__metaItem">
                        <svg className="clubs__metaIcon" viewBox="0 0 24 24" fill="none">
                          <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="clubs__metaText">
                          <span className="clubs__metaLabel">Closes:</span>
                          <span className="clubs__metaValue">
                            {new Date(club.registrationClose).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>

                      <div className="clubs__metaItem clubs__metaItem--full">
                        <svg className="clubs__metaIcon" viewBox="0 0 24 24" fill="none">
                          <path d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C9.12 11.49 9.13 11.49 9.15 11.49C9.16 11.49 9.16 11.49 9.17 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14.08 14.15C11.29 12.29 6.73996 12.29 3.92996 14.15C2.65996 15 1.95996 16.15 1.95996 17.38C1.95996 18.61 2.65996 19.75 3.91996 20.59C5.31996 21.53 7.15996 22 8.99996 22C10.84 22 12.68 21.53 14.08 20.59C15.34 19.74 16.04 18.6 16.04 17.36C16.03 16.13 15.34 14.99 14.08 14.15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19.9901 7.34C20.1501 9.28 18.7701 10.98 16.8601 11.21C16.8501 11.21 16.8501 11.21 16.8401 11.21H16.8101C16.7501 11.21 16.6901 11.21 16.6401 11.23C15.6701 11.28 14.7801 10.97 14.1101 10.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M20.01 16.59C19.99 16.97 19.9 17.35 19.74 17.71C19.33 18.58 18.58 19.29 17.61 19.76C16.68 20.21 15.63 20.42 14.59 20.37C15.14 19.81 15.46 19.11 15.51 18.38C15.57 17.41 15.16 16.46 14.38 15.67C13.76 15.04 12.99 14.57 12.15 14.23C15.07 12.93 18.77 13.57 20.01 16.59Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="clubs__metaText">
                          <span className="clubs__metaLabel">Members:</span>
                          <span className="clubs__metaValue">{club.currentMembers} / {club.maxMembers}</span>
                        </div>
                      </div>
                    </div>

                    <div className="clubs__capacitySection">
                      <div className="clubs__capacityHeader">
                        <span className="clubs__capacityLabel">Active Members</span>
                        <span className="clubs__capacityValue">
                          {club.currentMembers} / {club.maxMembers}
                        </span>
                      </div>
                      <div className="clubs__progressBar">
                        <div 
                          className="clubs__progress"
                          style={{ 
                            width: `${filledPercentage}%`,
                            backgroundColor: filledPercentage >= 90 ? '#e74c3c' : filledPercentage >= 70 ? '#f39c12' : '#3b82f6'
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="clubs__actions">
                      <button
                        className="clubs__btn clubs__btn--secondary"
                        onClick={() => handleViewDetails(club)}
                      >
                        View Details
                      </button>
                      <button
                        className={`clubs__btn clubs__btn--primary ${statusInfo.disabled ? 'clubs__btn--disabled' : ''}`}
                        onClick={() => handleJoinClub(club)}
                        disabled={statusInfo.disabled}
                      >
                        {statusInfo.status === "FULL" ? "Membership Full" : 
                         statusInfo.status === "CLOSED" ? "Registration Closed" :
                         statusInfo.status === "COMING SOON" ? "Coming Soon" : "Join Club"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Club Details Modal */}
      {showDetailsModal && selectedClub && (
        <div className="modal__overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal__content modal__content--large" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <div className="modal__headerImage">
                <img src={selectedClub.image} alt={selectedClub.name} className="modal__clubImage" />
              </div>
              <div className="modal__headerContent">
                <div>
                  <h2 className="modal__title">{selectedClub.name}</h2>
                  <span className="modal__category">{selectedClub.category}</span>
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
              <div className="clubDetails__section">
                <h3 className="clubDetails__heading">Description</h3>
                <p className="clubDetails__text">{selectedClub.description}</p>
              </div>

              <div className="clubDetails__visionMission">
                <div className="clubDetails__box">
                  <h4 className="clubDetails__boxTitle">🎯 Vision</h4>
                  <p className="clubDetails__boxText">{selectedClub.vision}</p>
                </div>
                <div className="clubDetails__box">
                  <h4 className="clubDetails__boxTitle">🚀 Mission</h4>
                  <p className="clubDetails__boxText">{selectedClub.mission}</p>
                </div>
              </div>

              <div className="clubDetails__grid">
                <div className="clubDetails__item">
                  <span className="clubDetails__label">President</span>
                  <span className="clubDetails__value">{selectedClub.president}</span>
                </div>
                <div className="clubDetails__item">
                  <span className="clubDetails__label">Faculty Advisor</span>
                  <span className="clubDetails__value">{selectedClub.advisor}</span>
                </div>
                <div className="clubDetails__item">
                  <span className="clubDetails__label">Total Members</span>
                  <span className="clubDetails__value">{selectedClub.currentMembers} Active Members</span>
                </div>
                <div className="clubDetails__item">
                  <span className="clubDetails__label">Maximum Capacity</span>
                  <span className="clubDetails__value">{selectedClub.maxMembers} members</span>
                </div>
              </div>

              <div className="clubDetails__section">
                <h3 className="clubDetails__heading">Upcoming Events</h3>
                <div className="clubDetails__events">
                  {selectedClub.upcomingEvents.map((event, index) => (
                    <div key={index} className="clubDetails__eventBadge">
                      📅 {event}
                    </div>
                  ))}
                </div>
              </div>

              <div className="clubDetails__section">
                <h3 className="clubDetails__heading">Connect With Us</h3>
                <div className="clubDetails__social">
                  <a 
                    href={selectedClub.socialMedia.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="clubDetails__socialLink"
                  >
                    <img src={facebookIcon} alt="Facebook" className="clubDetails__socialIcon" />
                    Facebook
                  </a>
                  <a 
                    href={selectedClub.socialMedia.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="clubDetails__socialLink"
                  >
                    <img src={instagramIcon} alt="Instagram" className="clubDetails__socialIcon" />
                    Instagram
                  </a>
                  <a 
                    href={selectedClub.socialMedia.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="clubDetails__socialLink"
                  >
                    <img src={linkedinIcon} alt="LinkedIn" className="clubDetails__socialIcon" />
                    LinkedIn
                  </a>
                </div>
              </div>

              <div className="clubDetails__registration">
                <div className="clubDetails__dates">
                  <div className="clubDetails__dateItem">
                    <span className="clubDetails__dateLabel">Registration Opens</span>
                    <span className="clubDetails__dateValue">
                      {new Date(selectedClub.registrationOpen).toLocaleDateString("en-US", { 
                        weekday: "long", month: "long", day: "numeric", year: "numeric" 
                      })}
                    </span>
                  </div>
                  <div className="clubDetails__dateItem">
                    <span className="clubDetails__dateLabel">Registration Closes</span>
                    <span className="clubDetails__dateValue">
                      {new Date(selectedClub.registrationClose).toLocaleDateString("en-US", { 
                        weekday: "long", month: "long", day: "numeric", year: "numeric" 
                      })}
                    </span>
                  </div>
                </div>
                <button
                  className={`clubDetails__joinBtn ${getRegistrationStatus(selectedClub).disabled ? 'clubDetails__joinBtn--disabled' : ''}`}
                  onClick={() => handleJoinClub(selectedClub)}
                  disabled={getRegistrationStatus(selectedClub).disabled}
                >
                  {getRegistrationStatus(selectedClub).status === "FULL" ? "Membership Full" : 
                   getRegistrationStatus(selectedClub).status === "CLOSED" ? "Registration Closed" :
                   getRegistrationStatus(selectedClub).status === "COMING SOON" ? "Coming Soon" : "Join Club Now"}
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
            <a className="footer__contact footer__contact--accent" href="https://support.campuszone.lk">
              🌐 support.campuszone.lk
            </a>
            <a className="footer__contact" href="tel:+94117540000">
              📞 +94 11 754 0000
            </a>
            <a className="footer__feedback" href="https://support.campuszone.lk">
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
                  return <span key={index} className="footer__day--empty"></span>;
                }
                const isToday = day === currentDay;
                return (
                  <span
                    key={index}
                    className={`footer__day${isToday ? " footer__day--today" : ""}`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
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
      </footer>

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

export default Clubs;
