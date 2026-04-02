import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Event.css";
import "./Home.css";
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";
import wiramaya1Image from "../images/wiramaya1.png";
import ganthersImage from "../images/ganthera.png";
import lantharumaImage from "../images/lantharuma.png";
import opendayImage from "../images/openday.png";
import careerdayImage from "../images/careerday.png";
import convacationImage from "../images/convacation.png";

// Initial events data
const initialEventsData = [
  {
    id: "viramaya",
    title: "Viramaya Music Festival",
    shortDescription: "Annual music festival featuring live performances and cultural shows.",
    category: "Event",
    date: "2026-03-22",
    venue: "SLIIT, Dupatha",
    image: wiramaya1Image,
    registrationRequired: false,
    registrationLink: "",
  },
  {
    id: "lantharuma",
    title: "Lantharuma Drama Festival",
    shortDescription: "Showcase of theatrical performances by student drama societies.",
    category: "Activity",
    date: "2026-04-10",
    venue: "SLIIT, Wala",
    image: lantharumaImage,
    registrationRequired: false,
    registrationLink: "",
  },
  {
    id: "convacation",
    title: "Convacation Ceremony",
    shortDescription: "Celebration of academic achievements and graduation of students.",
    category: "Event",
    date: "2026-06-28",
    venue: "SLIIT, Campus Auditorium",
    image: convacationImage,
    registrationRequired: false,
    registrationLink: "",
  },
  {
    id: "career-day",
    title: "Career Day",
    shortDescription: "Meet recruiters from top companies and explore career opportunities.",
    category: "Community",
    date: "2026-04-05",
    venue: "SLIIT, Main Building",
    image: careerdayImage,
    registrationRequired: true,
    registrationLink: "https://forms.gle/career-day-registration",
  },
  {
    id: "codefest",
    title: "CodeFest 2026",
    shortDescription: "Competitive programming and hackathon event for all students.",
    category: "Event",
    date: "2026-05-12",
    venue: "SLIIT, Computing Labs",
    image: opendayImage,
    registrationRequired: true,
    registrationLink: "https://forms.gle/codefest-registration",
  },
  {
    id: "womens-day",
    title: "Women's Day Celebration",
    shortDescription: "An inclusive campus celebration with talks, performances, and awareness sessions.",
    category: "Community",
    date: "2026-03-08",
    venue: "SLIIT, Main Auditorium",
    image: ganthersImage,
    registrationRequired: true,
    registrationLink: "https://forms.gle/womens-day-registration",
  },
  {
    id: "open-day",
    title: "Open Day",
    shortDescription: "Campus open day for prospective students and parents to visit.",
    category: "Event",
    date: "2026-04-15",
    venue: "SLIIT, Campus Auditorium",
    image: opendayImage,
    registrationRequired: false,
    registrationLink: "",
  },
  {
    id: "ganthera",
    title: "Ganthera Cultural Show",
    shortDescription: "Celebration of diverse cultures through music, dance, and art.",
    category: "Community",
    date: "2026-04-20",
    venue: "SLIIT, wala",
    image: ganthersImage,
    registrationRequired: false,
    registrationLink: "",
  },
];

const loadStoredEvents = () => {
  try {
    const storedEvents = localStorage.getItem("campuszone_events");
    if (!storedEvents) {
      return initialEventsData;
    }

    const parsedEvents = JSON.parse(storedEvents);
    if (!Array.isArray(parsedEvents) || parsedEvents.length === 0) {
      return initialEventsData;
    }

    return parsedEvents.map((event) => ({
      ...event,
      registrationRequired: Boolean(event.registrationRequired),
      registrationLink: typeof event.registrationLink === "string" ? event.registrationLink : "",
    }));
  } catch (error) {
    console.error("Failed to read stored events:", error);
    return initialEventsData;
  }
};

const addActivityNotification = ({ title, message, category }) => {
  try {
    const existing = JSON.parse(localStorage.getItem("campuszone_notifications") || "[]");
    const next = [
      {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        message,
        category,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...(Array.isArray(existing) ? existing : []),
    ].slice(0, 100);
    localStorage.setItem("campuszone_notifications", JSON.stringify(next));
  } catch (error) {
    console.error("Failed to save notification:", error);
  }
};

function Event() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const displayName = currentUser?.fullName || currentUser?.email || "User";
  const isAdmin = currentUser?.role === "admin";
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [events, setEvents] = useState(loadStoredEvents);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    category: "Event",
    date: "",
    venue: "",
    image: "",
    registrationRequired: false,
    registrationLink: "",
  });
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const profileRef = useRef(null);
  const fieldRefs = useRef({});
    const [toastText, setToastText] = useState("");
    const [toastVisible, setToastVisible] = useState(false);

  const validateField = (fieldName, value) => {
    const trimmedValue = typeof value === "string" ? value.trim() : value;
    const hasAlphabetCharacter = typeof trimmedValue === "string" && /[A-Za-z]/.test(trimmedValue);

    switch (fieldName) {
      case "title":
        if (!trimmedValue) return "Title is required.";
        if (trimmedValue.length < 3) return "Title must be at least 3 characters.";
        if (trimmedValue.length > 100) return "Title cannot exceed 100 characters.";
        if (!hasAlphabetCharacter) return "Title cannot contain only numbers or symbols.";
        return "";
      case "shortDescription":
        if (!trimmedValue) return "Description is required.";
        if (trimmedValue.length < 20) return "Description must be at least 20 characters.";
        if (trimmedValue.length > 500) return "Description cannot exceed 500 characters.";
        if (!hasAlphabetCharacter) return "Description cannot contain only numbers or symbols.";
        return "";
      case "category":
        if (!trimmedValue) return "Category is required.";
        return "";
      case "date": {
        if (!trimmedValue) return "Date is required.";
        const selectedDate = new Date(`${trimmedValue}T00:00:00`);
        const todayAtMidnight = new Date();
        todayAtMidnight.setHours(0, 0, 0, 0);
        if (Number.isNaN(selectedDate.getTime())) return "Please select a valid date.";
        if (selectedDate <= todayAtMidnight) return "Date must be in the future.";
        return "";
      }
      case "venue":
        if (!trimmedValue) return "Venue is required.";
        if (trimmedValue.length < 5) return "Venue must be at least 5 characters.";
        if (trimmedValue.length > 150) return "Venue cannot exceed 150 characters.";
        return "";
      case "image":
        if (!value) return "Please select an event image.";
        return "";
      case "registrationLink": {
        if (!formData.registrationRequired) return "";
        if (!trimmedValue) return "Please provide the registration form link.";
        try {
          const url = new URL(trimmedValue);
          if (!["http:", "https:"].includes(url.protocol)) {
            return "Registration link must start with http:// or https://.";
          }
          return "";
        } catch (error) {
          return "Please enter a valid registration link.";
        }
      }
      default:
        return "";
    }
  };

  const validateForm = (values) => {
    return {
      title: validateField("title", values.title),
      shortDescription: validateField("shortDescription", values.shortDescription),
      category: validateField("category", values.category),
      date: validateField("date", values.date),
      venue: validateField("venue", values.venue),
      image: validateField("image", values.image),
      registrationLink: validateField("registrationLink", values.registrationLink),
    };
  };

  const shouldShowError = (fieldName) => {
    return Boolean((formTouched[fieldName] || submitAttempted) && formErrors[fieldName]);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsNavOpen(false);
        setIsProfileOpen(false);
        setShowNotifications(false);
        setShowModal(false);
        setDeleteConfirm(null);
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

  useEffect(() => {
    const now = new Date();
    const todayOnly = new Date(now.toDateString());
    const generatedNotifications = [];

    events.forEach((event) => {
      const eventDate = new Date(event.date);
      const eventOnly = new Date(eventDate.toDateString());
      const msDiff = eventOnly.getTime() - todayOnly.getTime();
      const dayDiff = Math.round(msDiff / (1000 * 60 * 60 * 24));

      if (dayDiff === 0) {
        generatedNotifications.push({
          id: `today-${event.id}`,
          type: "success",
          message: `${event.title} is happening today!`,
          event: event.title,
        });
      } else if (dayDiff === 1) {
        generatedNotifications.push({
          id: `tomorrow-${event.id}`,
          type: "warning",
          message: `${event.title} starts tomorrow.`,
          event: event.title,
        });
      } else if (dayDiff > 1 && dayDiff <= 3) {
        generatedNotifications.push({
          id: `soon-${event.id}`,
          type: "warning",
          message: `${event.title} is coming in ${dayDiff} days.`,
          event: event.title,
        });
      }
    });

    setNotifications(generatedNotifications);
  }, [events]);

  useEffect(() => {
    localStorage.setItem("campuszone_events", JSON.stringify(events));
  }, [events]);

  const handleAddEvent = () => {
    if (!isAdmin) {
      alert("Only administrators can add events.");
      return;
    }
    setEditingEvent(null);
    setFormData({
      title: "",
      shortDescription: "",
      category: "Event",
      date: "",
      venue: "",
      image: "",
      registrationRequired: false,
      registrationLink: "",
    });
    setFormErrors({});
    setFormTouched({});
    setSubmitAttempted(false);
    setSelectedImageName("");
    setShowModal(true);
  };

  const handleEditEvent = (event) => {
    if (!isAdmin) {
      alert("Only administrators can edit events.");
      return;
    }
    setEditingEvent(event);
    setFormData({
      title: event.title,
      shortDescription: event.shortDescription,
      category: event.category,
      date: event.date,
      venue: event.venue,
      image: event.image,
      registrationRequired: Boolean(event.registrationRequired),
      registrationLink: event.registrationLink || "",
    });
    setFormErrors({});
    setFormTouched({});
    setSubmitAttempted(false);
    setSelectedImageName("");
    setShowModal(true);
  };

  const handleDeleteEvent = (eventId) => {
    if (!isAdmin) {
      alert("Only administrators can delete events.");
      return;
    }
    setDeleteConfirm(eventId);
  };

  const confirmDelete = () => {
    const updatedEvents = events.filter((event) => event.id !== deleteConfirm);
    setEvents(updatedEvents);
    setDeleteConfirm(null);
    setToastText("✅ Event deleted successfully!");
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleSubmitEvent = (e) => {
    e.preventDefault();

    const nextErrors = validateForm(formData);
    setFormErrors(nextErrors);
    setSubmitAttempted(true);
    setFormTouched({
      title: true,
      shortDescription: true,
      category: true,
      date: true,
      venue: true,
      image: true,
      registrationLink: formData.registrationRequired,
    });

    const fieldOrder = [
      "title",
      "shortDescription",
      "category",
      "date",
      "venue",
      "image",
      ...(formData.registrationRequired ? ["registrationLink"] : []),
    ];
    const firstErrorField = fieldOrder.find((fieldName) => nextErrors[fieldName]);
    if (firstErrorField) {
      const firstInvalidField = fieldRefs.current[firstErrorField];
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
        if (typeof firstInvalidField.focus === "function") {
          firstInvalidField.focus();
        }
      }
      return;
    }

    if (editingEvent) {
      // Update existing event
        const updatedEvents = events.map((event) =>
        event.id === editingEvent.id
          ? { ...event, ...formData }
          : event
        );
        setEvents(updatedEvents);
        setToastText("✅ Event updated successfully!");
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    } else {
      // Add new event
      const newEvent = {
        ...formData,
        id: `event-${Date.now()}`,
      };
        const updatedEvents = [newEvent, ...events];
        setEvents(updatedEvents);
        addActivityNotification({
          title: `New event added: ${newEvent.title}`,
          message: `${newEvent.title} has been added to the event list.`,
          category: "event",
        });
        setToastText("✅ Event added successfully!");
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    }

    setShowModal(false);
    setEditingEvent(null);
    setFormErrors({});
    setFormTouched({});
    setSubmitAttempted(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const normalizedValue =
        name === "registrationRequired" ? value === "true" : value;

      const nextValues = {
        ...prev,
        [name]: normalizedValue,
      };

      if (name === "registrationRequired" && !normalizedValue) {
        nextValues.registrationLink = "";
      }

      if (formTouched[name] || submitAttempted) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validateField(name, nextValues[name]),
        }));
      }

      if (name === "registrationRequired") {
        setFormTouched((prevTouched) => ({
          ...prevTouched,
          registrationLink: normalizedValue ? prevTouched.registrationLink : false,
        }));
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          registrationLink: validateField("registrationLink", nextValues.registrationLink),
        }));
      }

      return nextValues;
    });
  };

  const handleFieldBlur = (e) => {
    const { name } = e.target;
    setFormTouched((prev) => ({ ...prev, [name]: true }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: validateField(name, formData[name]),
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    setFormTouched((prev) => ({ ...prev, image: true }));

    if (!file) {
      setSelectedImageName("");
      setFormData((prev) => ({ ...prev, image: "" }));
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        image: validateField("image", ""),
      }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        image: "Please upload a valid image file.",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const encodedImage = typeof reader.result === "string" ? reader.result : "";
      setSelectedImageName(file.name);
      setFormData((prev) => ({ ...prev, image: encodedImage }));
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        image: validateField("image", encodedImage),
      }));
    };

    reader.onerror = () => {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        image: "Unable to read this image. Please try another file.",
      }));
    };

    reader.readAsDataURL(file);
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

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredEvents = events.filter((event) => {
    if (!normalizedSearch) return true;

    const searchableText = [
      event.title,
      event.shortDescription,
      event.category,
      event.venue,
      event.date,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearch);
  });


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

          <button
            className="header__notificationBtn"
            aria-label="Notifications"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            🔔
            {notifications.length > 0 && (
              <span className="header__notificationBadge">{notifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications__dropdown">
              <div className="notifications__header">
                <h3>Notifications</h3>
                <button onClick={() => setShowNotifications(false)}>×</button>
              </div>
              <div className="notifications__list">
                {notifications.length === 0 && (
                  <p className="notifications__empty">No event notifications right now.</p>
                )}
                {notifications.map((notif) => (
                  <div key={notif.id} className={`notification__item notification__item--${notif.type}`}>
                    <div className="notification__icon">
                      {notif.type === "success" && "🔔"}
                      {notif.type === "warning" && "⚠️"}
                      {notif.type === "urgent" && "🚨"}
                    </div>
                    <div className="notification__content">
                      <p className="notification__message">{notif.message}</p>
                      <span className="notification__event">{notif.event}</span>
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
              <span className="header__profileText">{displayName}</span>
              <span className="header__profileArrow" aria-hidden="true">▼</span>
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

      <main className="event">
        <div className="event__header container">
          <div className="event__headerContent">
            <Link to="/events" className="event__backBtn">
              ← Back
            </Link>
            <h1 className="event__title">Upcoming Events</h1>
            <p className="event__subtitle">
              Explore student life with quick access to events, sports, and club & society activities.
            </p>
          </div>
          <div className="event__headerActions">
            {isAdmin && (
              <button className="event__addBtn" onClick={handleAddEvent}>
                + Add Event
              </button>
            )}
          </div>
        </div>

        <div className="event__searchWrap container">
          <div className="event__searchBar" role="search">
            <span className="event__searchIcon" aria-hidden="true">⌕</span>
            <input
              type="search"
              className="event__searchInput"
              placeholder="Search events by title, category, venue, date..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search events"
            />
            {searchQuery && (
              <button
                type="button"
                className="event__searchClear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>
          <p className="event__searchMeta">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="event__grid container">
            {filteredEvents.map((event) => (
            <article key={event.id} className="event__card">
              {isAdmin && (
                <div className="event__adminActions">
                  <button
                    className="event__actionBtn event__actionBtn--edit"
                    onClick={() => handleEditEvent(event)}
                    title="Edit Event"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14.91 4.15002C15.58 6.54002 17.45 8.41002 19.85 9.09002" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    className="event__actionBtn event__actionBtn--delete"
                    onClick={() => handleDeleteEvent(event.id)}
                    title="Delete Event"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 5.98001C17.67 5.65001 14.32 5.48001 10.98 5.48001C9 5.48001 7.02 5.58001 5.04 5.78001L3 5.98001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.33 16.5H13.66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.5 12.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
              <div className="event__imageWrapper">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="event__image"
                />
                <span className="event__category">{event.category}</span>
              </div>
              <div className="event__content">
                <h2 className="event__cardTitle">{event.title}</h2>
                <div className="event__meta">
                  <div className="event__metaItem">
                    <svg className="event__icon" viewBox="0 0 24 24" fill="none">
                      <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <div className="event__metaItem">
                    <svg className="event__icon" viewBox="0 0 24 24" fill="none">
                      <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M3.62 8.49C5.59 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <span>{event.venue}</span>
                  </div>
                </div>
                <p className="event__description">{event.shortDescription}</p>
                {event.registrationRequired && event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    className="event__registerBtn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Register Now
                  </a>
                )}
                <Link 
                  to={`/activity/${event.id}`} 
                  className="event__detailsBtn"
                >
                  View Details
                </Link>
              </div>
            </article>
            ))}
          </div>
        ) : (
          <div className="event__empty container">
            <p className="event__emptyTitle">No events matched your search</p>
            <p className="event__emptyText">Try keywords like "career", "community", or a venue name.</p>
          </div>
        )}
      </main>

      <div
        className={`toast ${toastVisible ? "is-visible" : ""}`.trim()}
        id="toast"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {toastText}
      </div>

      {/* Add/Edit Event Modal */}
      {showModal && (
        <div className="modal__overlay" onClick={() => setShowModal(false)}>
          <div className="modal__content" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">
                {editingEvent ? "Edit Event" : "Add New Event"}
              </h2>
              <button
                className="modal__close"
                onClick={() => {
                  setShowModal(false);
                  setFormErrors({});
                  setFormTouched({});
                  setSubmitAttempted(false);
                }}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <form className="modal__form" onSubmit={handleSubmitEvent}>
              <div className="form__group">
                <label htmlFor="title" className="form__label">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={`form__input ${shouldShowError("title") ? "form__input--error" : ""}`.trim()}
                  value={formData.title}
                  onChange={handleFormChange}
                  onBlur={handleFieldBlur}
                  ref={(element) => {
                    fieldRefs.current.title = element;
                  }}
                  placeholder="Enter event title"
                />
                {shouldShowError("title") && <p className="form__error">{formErrors.title}</p>}
              </div>

              <div className="form__group">
                <label htmlFor="shortDescription" className="form__label">
                  Description *
                </label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  className={`form__input form__textarea ${shouldShowError("shortDescription") ? "form__input--error" : ""}`.trim()}
                  value={formData.shortDescription}
                  onChange={handleFormChange}
                  onBlur={handleFieldBlur}
                  ref={(element) => {
                    fieldRefs.current.shortDescription = element;
                  }}
                  rows="3"
                  placeholder="Enter event description"
                />
                {shouldShowError("shortDescription") && <p className="form__error">{formErrors.shortDescription}</p>}
              </div>

              <div className="form__row">
                <div className="form__group">
                  <label htmlFor="category" className="form__label">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    className={`form__input ${shouldShowError("category") ? "form__input--error" : ""}`.trim()}
                    value={formData.category}
                    onChange={handleFormChange}
                    onBlur={handleFieldBlur}
                    ref={(element) => {
                      fieldRefs.current.category = element;
                    }}
                  >
                    <option value="Event">Event</option>
                    <option value="Sports">Sports</option>
                    <option value="Clubs">Clubs</option>
                    <option value="Activity">Activity</option>
                    <option value="Community">Community</option>
                  </select>
                  {shouldShowError("category") && <p className="form__error">{formErrors.category}</p>}
                </div>

                <div className="form__group">
                  <label htmlFor="date" className="form__label">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className={`form__input ${shouldShowError("date") ? "form__input--error" : ""}`.trim()}
                    value={formData.date}
                    onChange={handleFormChange}
                    onBlur={handleFieldBlur}
                    ref={(element) => {
                      fieldRefs.current.date = element;
                    }}
                  />
                  {shouldShowError("date") && <p className="form__error">{formErrors.date}</p>}
                </div>
              </div>

              <div className="form__group">
                <label htmlFor="venue" className="form__label">
                  Venue *
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  className={`form__input ${shouldShowError("venue") ? "form__input--error" : ""}`.trim()}
                  value={formData.venue}
                  onChange={handleFormChange}
                  onBlur={handleFieldBlur}
                  ref={(element) => {
                    fieldRefs.current.venue = element;
                  }}
                  placeholder="Enter event venue"
                />
                {shouldShowError("venue") && <p className="form__error">{formErrors.venue}</p>}
              </div>

              <div className="form__group">
                <label htmlFor="image" className="form__label">Event Image *</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  className={`form__input form__fileInput ${shouldShowError("image") ? "form__input--error" : ""}`.trim()}
                  onChange={handleImageUpload}
                  onBlur={handleFieldBlur}
                  ref={(element) => {
                    fieldRefs.current.image = element;
                  }}
                />
                {formData.image && (
                  <div className="form__imagePreviewWrap">
                    <img src={formData.image} alt="Event preview" className="form__imagePreview" />
                    <p className="form__imagePreviewText">
                      {selectedImageName || "Current image selected"}
                    </p>
                  </div>
                )}
                {shouldShowError("image") && <p className="form__error">{formErrors.image}</p>}
              </div>

              <div className="form__row">
                <div className="form__group">
                  <label htmlFor="registrationRequired" className="form__label">
                    Registration Required?
                  </label>
                  <select
                    id="registrationRequired"
                    name="registrationRequired"
                    className="form__input"
                    value={String(formData.registrationRequired)}
                    onChange={handleFormChange}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>

                {formData.registrationRequired && (
                  <div className="form__group">
                    <label htmlFor="registrationLink" className="form__label">
                      Registration Form Link *
                    </label>
                    <input
                      type="url"
                      id="registrationLink"
                      name="registrationLink"
                      className={`form__input ${shouldShowError("registrationLink") ? "form__input--error" : ""}`.trim()}
                      value={formData.registrationLink}
                      onChange={handleFormChange}
                      onBlur={handleFieldBlur}
                      ref={(element) => {
                        fieldRefs.current.registrationLink = element;
                      }}
                      placeholder="https://forms.gle/your-form-link"
                    />
                    {shouldShowError("registrationLink") && (
                      <p className="form__error">{formErrors.registrationLink}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="modal__actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setShowModal(false);
                    setFormErrors({});
                    setFormTouched({});
                    setSubmitAttempted(false);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  {editingEvent ? "Update Event" : "Add Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal__overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal__content modal__content--small" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Confirm Delete</h2>
              <button
                className="modal__close"
                onClick={() => setDeleteConfirm(null)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="modal__body">
              <p>Are you sure you want to delete this event? This action cannot be undone.</p>
            </div>
            <div className="modal__actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn--danger"
                onClick={confirmDelete}
              >
                Delete Event
              </button>
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

export default Event;
