import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { timetableAPI } from "../services/api";
import "./Timetable.css";
import "./Home.css";
import campusLogo from "../images/campus_logo.png";
import profileImg from "../images/profile.png";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SESSION_TYPES = [
  { value: "lecture", label: "Lecture" },
  { value: "study", label: "Study" },
  { value: "group-session", label: "Group Session" },
  { value: "revision", label: "Revision" },
];

const DEFAULT_COLORS = {
  lecture: "#4F46E5",
  study: "#0891b2",
  "group-session": "#16a34a",
  revision: "#d97706",
};

// Grid: 6 AM – 10 PM (16 hours)
const GRID_START_HOUR = 6;
const GRID_END_HOUR = 22;
const CELL_HEIGHT = 64; // px per hour
const HOURS = Array.from({ length: GRID_END_HOUR - GRID_START_HOUR + 1 }, (_, i) => i + GRID_START_HOUR);

const timeToMinutes = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
};

const formatHour = (h) => {
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display} ${suffix}`;
};

const EMPTY_FORM = {
  subject: "",
  dayOfWeek: "0",
  startTime: "09:00",
  endTime: "10:00",
  type: "lecture",
  color: DEFAULT_COLORS.lecture,
  repeat: true,
};

function validateSlotForm(form) {
  const errors = {};
  if (!form.subject.trim()) errors.subject = "Subject is required.";
  else if (form.subject.trim().length < 2) errors.subject = "At least 2 characters.";
  if (!form.startTime) errors.startTime = "Start time is required.";
  if (!form.endTime) errors.endTime = "End time is required.";
  else if (form.startTime && form.endTime <= form.startTime) errors.endTime = "End time must be after start time.";
  if (!SESSION_TYPES.find((t) => t.value === form.type)) errors.type = "Select a session type.";
  return errors;
}

function Timetable() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    document.title = "Timetable - CampusZen";
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  }, [navigate]);

  const fetchSlots = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await timetableAPI.getAll(token);
      if (res.success) setSlots(res.data);
    } catch (err) {
      if (err.message === "Unauthorized") {
        setError("Your session has expired. Please log in again.");
        handleUnauthorized();
        return;
      }
      setError("Failed to load timetable.");
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { setIsNavOpen(false); setIsProfileOpen(false); closeModal(); }
    };
    const onClick = (e) => {
      if (!navLinksRef.current?.contains(e.target) && !navToggleRef.current?.contains(e.target)) setIsNavOpen(false);
      if (!profileRef.current?.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("click", onClick); };
  }, []);

  const showToast = (msg) => {
    setToastText(msg); setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const openCreate = () => {
    if (!isLoggedIn) { showToast("Please log in to add time slots."); return; }
    setForm(EMPTY_FORM);
    setFormErrors({});
    setEditTarget(null);
    setShowModal(true);
  };

  const openEdit = (slot) => {
    setForm({
      subject: slot.subject,
      dayOfWeek: String(slot.dayOfWeek),
      startTime: slot.startTime,
      endTime: slot.endTime,
      type: slot.type,
      color: slot.color,
      repeat: slot.repeat,
    });
    setFormErrors({});
    setEditTarget(slot);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setFormErrors({}); setEditTarget(null); };

  const handleFormChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    const val = inputType === "checkbox" ? checked : value;
    setForm((p) => {
      const next = { ...p, [name]: val };
      // Auto-set color when type changes
      if (name === "type" && !editTarget) next.color = DEFAULT_COLORS[value] || p.color;
      return next;
    });
    setFormErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateSlotForm(form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast("Please fix the highlighted fields.");
      return;
    }
    const token = localStorage.getItem("token");
    setSubmitting(true);
    try {
      const payload = { ...form, subject: form.subject.trim(), dayOfWeek: Number(form.dayOfWeek) };
      let res;
      if (editTarget) {
        res = await timetableAPI.update(editTarget._id, payload, token);
      } else {
        res = await timetableAPI.create(payload, token);
      }
      if (res.success) {
        showToast(editTarget ? "Slot updated!" : "Slot added!");
        closeModal();
        fetchSlots();
      }
    } catch (err) {
      if (err.message === "Unauthorized") {
        showToast("Session expired. Please log in again.");
        handleUnauthorized();
        return;
      }
      showToast(err.message || "Failed to save slot.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slotId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await timetableAPI.delete(slotId, token);
      if (res.success) {
        setSlots((prev) => prev.filter((s) => s._id !== slotId));
        showToast("Slot deleted.");
      }
    } catch (err) {
      if (err.message === "Unauthorized") {
        showToast("Session expired. Please log in again.");
        handleUnauthorized();
        return;
      }
      showToast(err.message || "Failed to delete slot.");
    }
  };

  // Group slots by day
  const slotsByDay = Array.from({ length: 7 }, (_, d) =>
    slots.filter((s) => s.dayOfWeek === d)
  );

  const scrollToTop = (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); setIsNavOpen(false); };
  const goHome = (e) => { e.preventDefault(); navigate("/"); setIsNavOpen(false); };

  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const currentYear = today.getFullYear(), currentMonth = today.getMonth(), currentDay = today.getDate();
  const monthLabel = today.toLocaleString("en-US", { month: "long", year: "numeric" });
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const leadingEmptyDays = (firstDayIndex + 6) % 7;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarDays = [...Array.from({ length: leadingEmptyDays }, () => null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  return (
    <>
      <header className="topbar" id="top">
        <nav className="nav container">
          <Link className="brand" to="/" onClick={scrollToTop}>
            <img className="brand__logo--img" src={campusLogo} alt="CampusZen Logo" />
          </Link>
          <button className="nav__toggle" ref={navToggleRef}
            aria-label={isNavOpen ? "Close menu" : "Open menu"} aria-expanded={isNavOpen ? "true" : "false"}
            onClick={() => setIsNavOpen((p) => !p)}>
            <span className="nav__toggleBars" aria-hidden="true"></span>
          </button>
          <div className={`nav__links ${isNavOpen ? "is-open" : ""}`.trim()} ref={navLinksRef}>
            <Link to="/" onClick={goHome}>Home</Link>
            <Link to="/health" onClick={() => setIsNavOpen(false)}>Health</Link>
            <Link to="/events" onClick={() => setIsNavOpen(false)}>Events</Link>
            <Link to="/study-help" onClick={() => setIsNavOpen(false)}>Study Help</Link>
          </div>
          <div className="header__profileDropdown" ref={profileRef}>
            {isLoggedIn ? (
              <>
                <button className="header__profileBtn" onClick={() => setIsProfileOpen((p) => !p)} aria-expanded={isProfileOpen}>
                  <span className="header__profileText">My Account</span>
                  <span className="header__profileArrow">▼</span>
                  <img className="header__profileCircle" src={profileImg} alt="Profile" />
                </button>
                {isProfileOpen && (
                  <div className="header__profileMenu">
                    <a href="#profile" className="header__profileMenuItem">Profile</a>
                    <button className="header__profileMenuItem header__profileMenuItem--danger"
                      onClick={() => { localStorage.clear(); navigate("/login"); }}>Logout</button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="btn btn--ghost">Login</Link>
            )}
          </div>
        </nav>
      </header>

      <main className="timetable">
        <div className="timetable__header container">
          <div>
            <h1 className="timetable__title">Weekly Timetable</h1>
            <p className="timetable__subtitle">Plan and manage your weekly study schedule.</p>
          </div>
          <button className="timetable__addBtn" onClick={openCreate}>+ Add Slot</button>
        </div>

        {!isLoggedIn ? (
          <div className="timetable__loginPrompt container">
            <div className="timetable__loginIcon">📅</div>
            <h3>Sign in to manage your timetable</h3>
            <p>Your weekly schedule is personal — please log in to view and edit it.</p>
            <Link to="/login" className="timetable__loginBtn">Login</Link>
          </div>
        ) : error ? (
          <div className="container">
            <div className="alert alert--warning"><span className="alert__icon">⚠️</span><span>{error}</span></div>
          </div>
        ) : loading ? (
          <div className="timetable__loading container">
            <div className="loading__spinner"></div>
            <p className="loading__text">Loading timetable...</p>
          </div>
        ) : (
          <div className="timetable__gridWrapper container">
            <div className="timetable__grid">
              {/* Time column */}
              <div className="timetable__timeCol">
                <div className="timetable__dayHeader timetable__timeLabel--head"></div>
                <div className="timetable__dayBody">
                  {HOURS.map((h) => (
                    <div key={h} className="timetable__hourCell">
                      <span className="timetable__hourLabel">{formatHour(h)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day columns */}
              {DAYS.map((day, dayIdx) => (
                <div key={day} className="timetable__dayCol">
                  <div className="timetable__dayHeader">
                    <span className="timetable__dayName">{DAY_SHORT[dayIdx]}</span>
                  </div>
                  <div className="timetable__dayBody" style={{ height: `${(GRID_END_HOUR - GRID_START_HOUR) * CELL_HEIGHT}px`, position: "relative" }}>
                    {/* Hour grid lines */}
                    {HOURS.slice(0, -1).map((h) => (
                      <div key={h} className="timetable__gridLine"
                        style={{ top: `${(h - GRID_START_HOUR) * CELL_HEIGHT}px` }} />
                    ))}
                    {/* Slots */}
                    {slotsByDay[dayIdx].map((slot) => {
                      const startMins = timeToMinutes(slot.startTime);
                      const endMins = timeToMinutes(slot.endTime);
                      const topPx = ((startMins - GRID_START_HOUR * 60) / 60) * CELL_HEIGHT;
                      const heightPx = ((endMins - startMins) / 60) * CELL_HEIGHT;
                      return (
                        <div
                          key={slot._id}
                          className="timetable__slot"
                          style={{ top: `${topPx}px`, height: `${Math.max(heightPx, 28)}px`, backgroundColor: slot.color + "22", borderLeft: `3px solid ${slot.color}` }}
                        >
                          <span className="timetable__slotSubject" style={{ color: slot.color }}>{slot.subject}</span>
                          <span className="timetable__slotTime">{slot.startTime}–{slot.endTime}</span>
                          <span className="timetable__slotType">{SESSION_TYPES.find((t) => t.value === slot.type)?.label}</span>
                          <div className="timetable__slotActions">
                            <button className="timetable__slotEdit" onClick={() => openEdit(slot)} title="Edit">✏</button>
                            <button className="timetable__slotDelete" onClick={() => handleDelete(slot._id)} title="Delete">✕</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {slots.length === 0 && (
              <div className="timetable__empty">
                <div className="timetable__emptyIcon">📅</div>
                <h3 className="timetable__emptyTitle">No slots yet</h3>
                <p className="timetable__emptyText">Click "+ Add Slot" to build your weekly schedule.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal__overlay" onClick={closeModal}>
          <div className="modal__content timetable__modal" onClick={(e) => e.stopPropagation()}>
            <div className="timetable__modalHeader">
              <h2 className="modal__title">{editTarget ? "Edit Slot" : "Add Time Slot"}</h2>
              <button className="modal__close" onClick={closeModal}>×</button>
            </div>

            <form className="timetable__form" onSubmit={handleSubmit} noValidate>
              <div className="timetable__formGroup">
                <label className="timetable__label">Subject / Module *</label>
                <input
                  className={`timetable__input ${formErrors.subject ? "timetable__input--invalid" : ""}`}
                  type="text" name="subject" value={form.subject} onChange={handleFormChange}
                  placeholder="e.g. Database Systems" />
                {formErrors.subject && <p className="timetable__errorText">{formErrors.subject}</p>}
              </div>

              <div className="timetable__formRow">
                <div className="timetable__formGroup">
                  <label className="timetable__label">Day of Week *</label>
                  <select
                    className={`timetable__input timetable__select ${formErrors.dayOfWeek ? "timetable__input--invalid" : ""}`}
                    name="dayOfWeek" value={form.dayOfWeek} onChange={handleFormChange}>
                    {DAYS.map((d, i) => <option key={i} value={String(i)}>{d}</option>)}
                  </select>
                </div>

                <div className="timetable__formGroup">
                  <label className="timetable__label">Session Type *</label>
                  <select
                    className={`timetable__input timetable__select ${formErrors.type ? "timetable__input--invalid" : ""}`}
                    name="type" value={form.type} onChange={handleFormChange}>
                    {SESSION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  {formErrors.type && <p className="timetable__errorText">{formErrors.type}</p>}
                </div>
              </div>

              <div className="timetable__formRow">
                <div className="timetable__formGroup">
                  <label className="timetable__label">Start Time *</label>
                  <input
                    className={`timetable__input ${formErrors.startTime ? "timetable__input--invalid" : ""}`}
                    type="time" name="startTime" value={form.startTime} onChange={handleFormChange}
                    min="06:00" max="22:00" />
                  {formErrors.startTime && <p className="timetable__errorText">{formErrors.startTime}</p>}
                </div>

                <div className="timetable__formGroup">
                  <label className="timetable__label">End Time *</label>
                  <input
                    className={`timetable__input ${formErrors.endTime ? "timetable__input--invalid" : ""}`}
                    type="time" name="endTime" value={form.endTime} onChange={handleFormChange}
                    min="06:00" max="22:00" />
                  {formErrors.endTime && <p className="timetable__errorText">{formErrors.endTime}</p>}
                </div>
              </div>

              <div className="timetable__formRow">
                <div className="timetable__formGroup">
                  <label className="timetable__label">Color *</label>
                  <div className="timetable__colorRow">
                    <input type="color" name="color" value={form.color} onChange={handleFormChange}
                      className="timetable__colorPicker" />
                    <span className="timetable__colorPreview" style={{ backgroundColor: form.color + "33", border: `2px solid ${form.color}`, color: form.color }}>
                      {SESSION_TYPES.find((t) => t.value === form.type)?.label}
                    </span>
                  </div>
                </div>

                <div className="timetable__formGroup timetable__formGroup--toggle">
                  <label className="timetable__label">Repeat Weekly</label>
                  <label className="timetable__toggle">
                    <input type="checkbox" name="repeat" checked={form.repeat} onChange={handleFormChange} />
                    <span className="timetable__toggleSlider"></span>
                    <span className="timetable__toggleText">{form.repeat ? "Yes" : "No"}</span>
                  </label>
                </div>
              </div>

              <div className="timetable__formActions">
                <button type="button" className="timetable__btn timetable__btn--secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="timetable__btn timetable__btn--primary" disabled={submitting}>
                  {submitting ? "Saving..." : editTarget ? "Save Changes" : "Add Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastVisible && <div className="timetable__toast"><p>{toastText}</p></div>}

      <footer className="footer">
        <div className="container footer__panel">
          <div className="footer__support">
            <p className="footer__kicker">Do you need any</p>
            <h3 className="footer__heading">Support?</h3>
            <a className="footer__contact footer__contact--accent" href="https://support.campuszone.lk">🌐 support.campuszone.lk</a>
            <a className="footer__contact" href="tel:+94117540000">📞 +94 11 754 0000</a>
            <a className="footer__feedback" href="https://support.campuszone.lk">Provide Feedback to CampusZen</a>
          </div>
          <div className="footer__calendar" aria-label="Calendar preview">
            <h3 className="footer__calendarTitle">Calendar</h3>
            <div className="footer__calendarHead"><strong>{monthLabel}</strong></div>
            <div className="footer__weekdays">{weekdayLabels.map((w) => <span key={w}>{w}</span>)}</div>
            <div className="footer__days">
              {calendarDays.map((day, i) =>
                !day ? <span key={i} className="footer__day--empty"></span> :
                <span key={i} className={`footer__day${day === currentDay ? " footer__day--today" : ""}`}>{day}</span>
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Timetable;
