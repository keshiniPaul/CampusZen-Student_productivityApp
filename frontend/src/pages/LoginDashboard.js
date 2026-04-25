import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css"; // Import the same CSS as Home page
import "./LoginDashboard.css";
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";

const dashboardCards = [
  {
    title: "Overview",
    description: "Catch up on your priorities, reminders, and latest updates.",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    badge: "Today",
    key: "overview",
  },
  {
    title: "Health & Wellbeing",
    description: "Log your wellbeing journey and discover support resources.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    badge: "Wellness",
    key: "health",
  },
  {
    title: "Events",
    description: "Discover campus activities, workshops, and networking events.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    badge: "New",
    key: "events",
  },
  {
    title: "Career",
    description: "Build your profile and move ahead with practical career tools.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    badge: "Growth",
    key: "career",
  },
  {
    title: "Study",
    description: "Organize tasks and keep your learning goals on schedule.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    badge: "Planner",
    key: "study",
  },
  {
    title: "Resources",
    description: "Access practical guides and curated student learning assets.",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
    badge: "Library",
    key: "resources",
  },
];

function LoginDashboard() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [dashboardEvents, setDashboardEvents] = useState([]);
  
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

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

  const loadNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsNotificationsLoading(true);
    setNotificationsError("");

    try {
      const response = await fetch("http://localhost:5000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load notifications");
      }

      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setNotificationsError(error.message || "Failed to load notifications");
    } finally {
      setIsNotificationsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    try {
      const stored = localStorage.getItem("campuszone_events");
      if (stored) {
        let eventsArr = JSON.parse(stored);
        if (Array.isArray(eventsArr)) {
          // Sort events by date ascending and filter out very old ones
          const upcoming = eventsArr
            .filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5); // Just show top 5 upcoming
          setDashboardEvents(upcoming);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }

      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsNavOpen(false);
        setIsNotificationsOpen(false);
      }
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

  const markNotificationAsRead = async (notificationId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getRelativeTime = (dateValue) => {
    if (!dateValue) return "";
    const now = Date.now();
    const date = new Date(dateValue).getTime();
    const diffMs = Math.max(0, now - date);
    const minutes = Math.floor(diffMs / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return new Date(dateValue).toLocaleDateString();
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const handleNotificationClick = async (notification) => {
    if (!notification?.isRead) {
      await markNotificationAsRead(notification._id);
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id ? { ...item, isRead: true } : item
        )
      );
    }

    if (notification?.link) {
      navigate(notification.link);
      setIsNotificationsOpen(false);
      setIsNavOpen(false);
    }
  };

  const openNotifications = async () => {
    const nextOpen = !isNotificationsOpen;
    setIsNotificationsOpen(nextOpen);

    if (nextOpen) {
      await loadNotifications();
    }
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
              <div className="notification-dropdown" ref={notificationDropdownRef}>
                <button
                  className="header__notificationBtn"
                  aria-label="Notifications"
                  onClick={openNotifications}
                >
                  <svg className="header__notificationIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
                    <path d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"/>
                  </svg>
                  <span className="header__notificationBadge">{unreadCount}</span>
                </button>

                {isNotificationsOpen && (
                  <div className="notification-dropdown-menu">
                    <div className="notification-dropdown-header">
                      <strong>Notifications</strong>
                      <button type="button" onClick={loadNotifications}>
                        Refresh
                      </button>
                    </div>

                    <div className="notification-dropdown-list">
                      {isNotificationsLoading && <p className="notification-empty">Loading notifications...</p>}

                      {!isNotificationsLoading && notificationsError && (
                        <p className="notification-empty notification-empty--error">{notificationsError}</p>
                      )}

                      {!isNotificationsLoading && !notificationsError && notifications.length === 0 && (
                        <p className="notification-empty">No notifications yet.</p>
                      )}

                      {!isNotificationsLoading &&
                        !notificationsError &&
                        notifications.map((notification) => (
                          <button
                            type="button"
                            key={notification._id}
                            className={`notification-item ${notification.isRead ? "" : "is-unread"}`.trim()}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="notification-item__top">
                              <h4>{notification.title || "Notification"}</h4>
                              <span>{getRelativeTime(notification.createdAt)}</span>
                            </div>
                            <p>{notification.message}</p>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              
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
        <section className="section dashboardWelcome">
          <div className="container">
            <div className="dashboardWelcome__panel">
              <div className="dashboardWelcome__intro">
                <p className="dashboardWelcome__eyebrow">Personal Workspace</p>
                <h1 className="dashboardWelcome__title">
                  Welcome back, {user?.fullName || "Student"}
                </h1>
                <p className="dashboardWelcome__subtitle">
                  Stay focused with a dashboard designed around your daily campus flow.
                </p>
                <div className="dashboardWelcome__chips" aria-label="Quick status">
                  <span>6 Modules</span>
                  <span>{dashboardEvents.length} Upcoming Events</span>
                  <span>{monthLabel}</span>
                </div>
              </div>

              <div className="dashboardWelcome__banner" role="img" aria-label="Student campus dashboard banner">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=80"
                  alt="University campus"
                  loading="lazy"
                />
                <div className="dashboardWelcome__bannerOverlay">
                  <strong>Build your best semester</strong>
                  <p>Plan better, feel better, achieve more.</p>
                </div>
              </div>
            </div>

            {/* Unified Timeline Section */}
            {dashboardEvents.length > 0 && (
              <div className="dashboardTimeline">
                <div className="dashboardTimeline__header">
                  <h2 className="dashboardTimeline__title">Upcoming in "My Campus Space"</h2>
                  <Link to="/events" className="dashboardTimeline__viewAll">View Calendar &rarr;</Link>
                </div>
                <div className="dashboardTimeline__scroll">
                  {dashboardEvents.map((ev, index) => {
                    const d = new Date(ev.date);
                    const isToday = d.toDateString() === new Date().toDateString();
                    return (
                      <div className="timelineEventCard" key={ev.id || index}>
                        <div className="timelineEventCard__date">
                          <strong>{d.getDate()}</strong>
                          <span>{d.toLocaleString('en-US', { month: 'short' })}</span>
                        </div>
                        <div className="timelineEventCard__content">
                          {isToday && <span className="timelineEventCard__badge">Today</span>}
                          <h4>{ev.title}</h4>
                          <p>{ev.venue}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Advanced Animated Filters */}
            <div className="dashboardFilters">
              {['All', 'Essentials', 'Growth', 'Lifestyle'].map(filter => (
                <button 
                  key={filter}
                  className={`dashboardFilterBtn ${activeFilter === filter ? 'is-active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="dashboardWelcome__grid">
              {dashboardCards
                .filter(card => {
                  if (activeFilter === "All") return true;
                  if (activeFilter === "Essentials" && ["overview", "study", "resources"].includes(card.key)) return true;
                  if (activeFilter === "Growth" && ["events", "career"].includes(card.key)) return true;
                  if (activeFilter === "Lifestyle" && ["health"].includes(card.key)) return true;
                  return false;
                })
                .map((card, index) => {
                const onOpen =
                  card.key === "overview"
                    ? goToOverview
                    : card.key === "health"
                    ? goToHealth
                    : card.key === "events"
                    ? goToEventsDashboard
                    : card.key === "career"
                    ? goToCareer
                    : card.key === "study"
                    ? goToStudy
                    : goToResources;

                return (
                  <article 
                    className="dashboardCard dashboardCard--animated" 
                    key={card.key} 
                    onClick={onOpen}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="dashboardCard__media">
                      <img src={card.image} alt={card.title} loading="lazy" />
                      <span className="dashboardCard__badge">{card.badge}</span>
                    </div>
                    <div className="dashboardCard__body">
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                      <button type="button" className="dashboardCard__action">
                        Open section
                      </button>
                    </div>
                  </article>
                );
              })}
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