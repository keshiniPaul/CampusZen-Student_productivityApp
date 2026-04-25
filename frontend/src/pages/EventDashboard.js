import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./EventDashboard.css";
import "../pages/Home.css";
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";
import eventIcon from "../images/event.png";
import sportIcon from "../images/sport.png";
import clubIcon from "../images/club.png";
import api from "../services/api";

const categories = [
  {
    title: "Event",
    tag: "Event",
    image: eventIcon,
    description: "Browse campus events, workshops, and student meetups happening this week.",
  },
  {
    title: "Sports",
    tag: "Activity",
    image: sportIcon,
    description: "Find tournaments, practice sessions, and fitness challenges around the campus.",
  },
  {
    title: "Club & Society",
    tag: "Community",
    image: clubIcon,
    description: "Discover student clubs and societies to build skills, network, and have fun.",
  },
];

function EventDashboard() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsError, setNotificationsError] = useState("");
  const [userEcas, setUserEcas] = useState([]);
  const [showEcaModal, setShowEcaModal] = useState(false);
  const [newEca, setNewEca] = useState({ title: "", category: "event", role: "Participant" });
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const token = localStorage.getItem("token");

  const normalizeNotifications = (items) =>
    (Array.isArray(items) ? items : []).map((item) => {
      let rawCat = String(item.category || item.type || "event").toLowerCase();
      let titleLower = String(item.title).toLowerCase();
      
      let finalCat = "event";
      if (rawCat === "sport" || titleLower.includes("sport") || titleLower.includes("tournament")) finalCat = "sport";
      else if (rawCat === "club" || titleLower.includes("club") || titleLower.includes("society")) finalCat = "club";
      else if (rawCat === "career" || titleLower.includes("internship") || titleLower.includes("career")) finalCat = "career";
      else if (rawCat === "event" || titleLower.includes("event")) finalCat = "event";
      else if (["sport", "club", "career", "event"].includes(rawCat)) finalCat = rawCat;

      return {
        id: item._id || item.id,
        title: item.title || "Notification",
        message: item.message || "",
        category: finalCat,
        priority: item.priority || "low",
        isRead: Boolean(item.isRead),
        createdAt: item.createdAt || item.created_at || new Date().toISOString(),
      };
    });

  const getCategoryLabel = (cat) => {
    if (cat === "sport") return "Sport";
    if (cat === "club") return "Club & Society";
    if (cat === "career") return "Career";
    return "Event";
  };

  const loadLocalNotifications = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("campuszone_notifications") || "[]");
      return normalizeNotifications(stored);
    } catch (error) {
      return [];
    }
  };

  const mergeNotifications = (apiItems, localItems) => {
    const map = new Map();

    [...localItems, ...apiItems].forEach((item) => {
      const key = String(item.id || `${item.title}-${item.createdAt}`);
      if (!map.has(key)) {
        map.set(key, item);
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const fetchNotifications = async () => {
    const localNotifications = loadLocalNotifications();

    if (!token) {
      setNotifications(localNotifications);
      return;
    }

    try {
      setNotificationsError("");
      const data = await api.notificationAPI.getAllNotifications(token);
      const normalizedApi = normalizeNotifications(data?.data || data || []);
      setNotifications(mergeNotifications(normalizedApi, localNotifications));
    } catch (error) {
      setNotifications(localNotifications);
      setNotificationsError("Showing local notifications only.");
    }
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsNavOpen(false);
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    const onDocumentClick = (event) => {
      const target = event.target;
      if (!target || !navLinksRef.current || !navToggleRef.current) return;
      const clickedInsideNav =
        navLinksRef.current.contains(target) || navToggleRef.current.contains(target);
      const clickedInsideProfile = profileRef.current && profileRef.current.contains(target);
      const clickedInsideNotifications =
        notificationsRef.current && notificationsRef.current.contains(target);
      if (!clickedInsideNav) setIsNavOpen(false);
      if (!clickedInsideProfile) setIsProfileOpen(false);
      if (!clickedInsideNotifications) setIsNotificationsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onDocumentClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocumentClick);
    };
  }, []);

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("campuszone_user_ecas") || "[]");
      setUserEcas(stored);
    } catch {
      setUserEcas([]);
    }
  }, []);

  const handleAddEca = (e) => {
    e.preventDefault();
    if (!newEca.title) return;
    const added = { ...newEca, id: Date.now() };
    const nextList = [added, ...userEcas].slice(0, 50); // Keep max 50
    setUserEcas(nextList);
    localStorage.setItem("campuszone_user_ecas", JSON.stringify(nextList));
    setShowEcaModal(false);
    setNewEca({ title: "", category: "event", role: "Participant" });
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

  const handleLogout = () => {
    localStorage.clear();
    setIsProfileOpen(false);
    navigate("/");
  };

  const goToDashboard = () => {
    setIsProfileOpen(false);
    navigate("/dashboard");
  };

  const goToProfile = () => {
    setIsProfileOpen(false);
    navigate("/profile");
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

          <div className="nav__cta">
            <div className="eventDashboard__notificationWrap" ref={notificationsRef}>
              <button
                className="header__notificationBtn"
                aria-label="Notifications"
                onClick={() => setIsNotificationsOpen((prev) => !prev)}
                type="button"
              >
                <svg className="header__notificationIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
                  <path d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" />
                </svg>
                {notifications.filter((item) => !item.isRead).length > 0 && (
                  <span className="header__notificationBadge">
                    {notifications.filter((item) => !item.isRead).length}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="eventDashboard__notificationDropdown">
                  <div className="eventDashboard__notificationHeader">
                    <h3>Notifications</h3>
                    <span>{notifications.length} total</span>
                  </div>

                  {notificationsError ? (
                    <p className="eventDashboard__notificationEmpty">{notificationsError}</p>
                  ) : notifications.length === 0 ? (
                    <p className="eventDashboard__notificationEmpty">No notifications yet.</p>
                  ) : (
                    <div className="eventDashboard__notificationList">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`eventDashboard__notificationItem eventDashboard__notificationItem--${notification.category} ${notification.isRead ? "is-read" : "is-unread"}`}
                        >
                          <div className="eventDashboard__notificationBadgeLabel">
                            {getCategoryLabel(notification.category)}
                          </div>
                          <div className="eventDashboard__notificationBody">
                            <strong>{notification.title}</strong>
                            <p>{notification.message}</p>
                            <span>{new Date(notification.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="profile-dropdown" ref={profileRef}>
              <button
                className="profile-icon-btn"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                aria-label="Profile menu"
              >
                👤
              </button>

              {isProfileOpen && (
                <div className="profile-dropdown-menu">
                  <button onClick={goToProfile} className="dropdown-item" type="button">
                    <span className="dropdown-icon">👤</span>
                    My Profile
                  </button>
                  <button onClick={goToDashboard} className="dropdown-item" type="button">
                    <span className="dropdown-icon">📊</span>
                    Dashboard
                  </button>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout" type="button">
                    <span className="dropdown-icon">🚪</span>
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="eventDashboard">
        <div className="eventDashboard__bg" aria-hidden="true">
          <div className="eventDashboard__blob eventDashboard__blob--one"></div>
          <div className="eventDashboard__blob eventDashboard__blob--two"></div>
        </div>

        <section className="eventDashboard__hero container">
          <button className="back-to-dashboard" onClick={() => navigate(token ? "/dashboard" : "/")}>
            <span>←</span> Back to Welcome Dashboard
          </button>
          <div className="eventDashboard__pill">CampusZone Events</div>
          <h1 className="eventDashboard__title">Event Dashboard</h1>
          <p className="eventDashboard__subtitle">
            Explore student life with quick access to events, sports, and club &amp; society activities.
          </p>

        </section>

        <section className="eventDashboard__grid container" aria-label="Event categories">
          {categories.map((category) => (
            <article className="eventCard" key={category.title}>
              <div className="eventCard__media">
                <img className="eventCard__photo" src={category.image} alt={category.title} />
                <span className="eventCard__tag">{category.tag}</span>
              </div>
              <div className="eventCard__content">
                <h2 className="eventCard__title">{category.title}</h2>
                <p className="eventCard__text">{category.description}</p>
                <div className="eventDashboard__actions eventCard__actions">
                  {category.title === "Event" && (
                    <Link
                      className="eventDashboard__btn eventDashboard__btn--primary eventCard__btn"
                      to="/events/list"
                    >
                      View Details
                    </Link>
                  )}
                  {category.title === "Sports" && (
                    <Link
                      className="eventDashboard__btn eventDashboard__btn--primary eventCard__btn"
                      to="/sports"
                      onClick={() => console.log('Navigating to /sports')}
                    >
                      View Details
                    </Link>
                  )}
                  {category.title === "Club & Society" && (
                    <Link
                      className="eventDashboard__btn eventDashboard__btn--primary eventCard__btn"
                      to="/clubs"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Extra-Curricular Activity (ECA) Tracker Component */}
        <section className="eventDashboard__tracker container">
          <div className="ecaTracker">
            <div className="ecaTracker__header">
              <div>
                <h2 className="ecaTracker__title">My ECA Portfolio</h2>
                <p className="ecaTracker__subtitle">Track your campus involvement and registrations.</p>
              </div>
              <button className="ecaTracker__addBtn" onClick={() => setShowEcaModal(true)}>
                + Log Activity
              </button>
            </div>

            <div className="ecaTracker__metrics">
              <div className="ecaMetric">
                <span className="ecaMetric__value">{userEcas.length}</span>
                <span className="ecaMetric__label">Total Activities</span>
              </div>
              <div className="ecaMetric">
                <span className="ecaMetric__value">{userEcas.filter(e => e.category === 'club').length}</span>
                <span className="ecaMetric__label">Clubs Joined</span>
              </div>
              <div className="ecaMetric">
                <span className="ecaMetric__value">{userEcas.filter(e => e.category === 'sport').length}</span>
                <span className="ecaMetric__label">Sports Teams</span>
              </div>
              <div className="ecaMetric">
                <span className="ecaMetric__value">{userEcas.filter(e => e.category === 'event').length}</span>
                <span className="ecaMetric__label">Events</span>
              </div>
            </div>

            <div className="ecaTracker__roster">
              {userEcas.length === 0 ? (
                <p className="ecaTracker__empty">You haven't logged any activities yet. Click "Log Activity" to start building your portfolio.</p>
              ) : (
                <div className="ecaTracker__grid">
                  {userEcas.map((eca) => (
                    <div className={`ecaCard ecaCard--${eca.category}`} key={eca.id}>
                      <div className="ecaCard__icon">
                        {eca.category === 'event' ? '📅' : eca.category === 'sport' ? '🏅' : '🤝'}
                      </div>
                      <div className="ecaCard__content">
                        <h4>{eca.title}</h4>
                        <span className="ecaCard__role">{eca.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ECA Logging Modal */}
          {showEcaModal && (
            <div className="ecaModal">
              <div className="ecaModal__overlay" onClick={() => setShowEcaModal(false)}></div>
              <div className="ecaModal__content">
                <h3>Log New Activity</h3>
                <form onSubmit={handleAddEca}>
                  <div className="formGroup">
                    <label>Activity Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chess Club, Hackathon..."
                      value={newEca.title}
                      onChange={(e) => setNewEca({ ...newEca, title: e.target.value })}
                    />
                  </div>
                  <div className="formGroup">
                    <label>Category</label>
                    <select value={newEca.category} onChange={(e) => setNewEca({ ...newEca, category: e.target.value })}>
                      <option value="event">Event</option>
                      <option value="sport">Sport</option>
                      <option value="club">Club/Society</option>
                    </select>
                  </div>
                  <div className="formGroup">
                    <label>Your Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Participant, Player, President"
                      value={newEca.role}
                      onChange={(e) => setNewEca({ ...newEca, role: e.target.value })}
                    />
                  </div>
                  <div className="ecaModal__actions">
                    <button type="button" className="ecaModal__cancel" onClick={() => setShowEcaModal(false)}>Cancel</button>
                    <button type="submit" className="ecaModal__save">Save Activity</button>
                  </div>
                </form>
              </div>
            </div>
          )}
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

export default EventDashboard;
