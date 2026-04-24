import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assignmentsAPI } from "../services/api";
import "./Assignments.css";
import "./Home.css";
import campusLogo from "../images/campus_logo.png";
import profileImg from "../images/profile.png";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "overdue", label: "Overdue" },
];

const PRIORITY_OPTIONS = ["low", "medium", "high"];

const STATUS_NEXT = { pending: "in-progress", "in-progress": "completed" };

const PRIORITY_META = {
  low:    { label: "Low",    color: "#16a34a", bg: "#f0fdf4" },
  medium: { label: "Medium", color: "#d97706", bg: "#fef3c7" },
  high:   { label: "High",   color: "#dc2626", bg: "#fef2f2" },
};

const STATUS_META = {
  pending:     { label: "Pending",     color: "#3b82f6", bg: "#eff6ff" },
  "in-progress": { label: "In Progress", color: "#d97706", bg: "#fef3c7" },
  completed:   { label: "Completed",   color: "#16a34a", bg: "#f0fdf4" },
  overdue:     { label: "Overdue",     color: "#dc2626", bg: "#fef2f2" },
};

// DeadlineCountdown component
function DeadlineCountdown({ dueDate }) {
  const [text, setText] = useState("");
  const [urgency, setUrgency] = useState("normal");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const due = new Date(dueDate);
      const diff = due - now;

      if (diff <= 0) {
        setText("Overdue");
        setUrgency("overdue");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 7) { setText(`${days}d remaining`); setUrgency("normal"); }
      else if (days >= 2) { setText(`${days}d ${hours}h`); setUrgency("warning"); }
      else if (days >= 1) { setText(`${days}d ${hours}h`); setUrgency("urgent"); }
      else if (hours >= 1) { setText(`${hours}h ${mins}m`); setUrgency("critical"); }
      else { setText(`${mins}m remaining`); setUrgency("critical"); }
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [dueDate]);

  return <span className={`countdown countdown--${urgency}`}>{text}</span>;
}

// Validation
const MIN_TITLE = 3;
const MIN_MODULE = 2;
const MAX_NOTES = 1000;

function validateForm(form) {
  const errors = {};
  const title = form.title.trim();
  const module = form.module.trim();
  const notes = form.notes.trim();

  if (!title) errors.title = "Title is required.";
  else if (title.length < MIN_TITLE) errors.title = `Title must be at least ${MIN_TITLE} characters.`;

  if (!module) errors.module = "Module is required.";
  else if (module.length < MIN_MODULE) errors.module = `Module must be at least ${MIN_MODULE} characters.`;

  if (!form.dueDate) errors.dueDate = "Due date and time are required.";
  else if (new Date(form.dueDate) < new Date()) errors.dueDate = "Due date must be in the future.";

  if (!PRIORITY_OPTIONS.includes(form.priority)) errors.priority = "Select a valid priority.";

  if (notes.length > MAX_NOTES) errors.notes = `Notes cannot exceed ${MAX_NOTES} characters.`;

  return errors;
}

const EMPTY_FORM = { title: "", module: "", dueDate: "", priority: "medium", notes: "" };

function Assignments() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
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
    document.title = "Assignments - CampusZen";
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const res = await assignmentsAPI.getAll(params);
      if (res.success) setAssignments(res.data);
    } catch {
      setError("Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

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
    if (!isLoggedIn) { showToast("Please log in to add assignments."); return; }
    setForm(EMPTY_FORM);
    setFormErrors({});
    setEditTarget(null);
    setShowCreateModal(true);
  };

  const openEdit = (assignment) => {
    const dueDateLocal = new Date(assignment.dueDate).toISOString().slice(0, 16);
    setForm({ title: assignment.title, module: assignment.module, dueDate: dueDateLocal,
      priority: assignment.priority, notes: assignment.notes || "" });
    setFormErrors({});
    setEditTarget(assignment);
    setShowCreateModal(true);
  };

  const closeModal = () => { setShowCreateModal(false); setFormErrors({}); setEditTarget(null); };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setFormErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast("Please fix the highlighted fields.");
      return;
    }
    const token = localStorage.getItem("token");
    setSubmitting(true);
    try {
      const payload = { ...form, title: form.title.trim(), module: form.module.trim(), notes: form.notes.trim() };
      let res;
      if (editTarget) {
        res = await assignmentsAPI.update(editTarget._id, payload, token);
      } else {
        res = await assignmentsAPI.create(payload, token);
      }
      if (res.success) {
        showToast(editTarget ? "Assignment updated!" : "Assignment created!");
        closeModal();
        fetchAssignments();
      }
    } catch (err) {
      showToast(err.message || "Failed to save assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (assignment, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const res = await assignmentsAPI.updateStatus(assignment._id, newStatus, token);
      if (res.success) {
        setAssignments((prev) => prev.map((a) => a._id === assignment._id ? { ...a, status: newStatus } : a));
      }
    } catch (err) {
      showToast(err.message || "Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await assignmentsAPI.delete(id, token);
      if (res.success) {
        showToast("Assignment deleted.");
        setAssignments((prev) => prev.filter((a) => a._id !== id));
      }
    } catch (err) {
      showToast(err.message || "Failed to delete.");
    }
  };

  // Stats
  const stats = {
    total: assignments.length,
    pending: assignments.filter((a) => a.status === "pending").length,
    inProgress: assignments.filter((a) => a.status === "in-progress").length,
    completed: assignments.filter((a) => a.status === "completed").length,
    overdue: assignments.filter((a) => a.status === "overdue").length,
  };

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

  // Min datetime for input (now)
  const minDateTime = new Date(Date.now() + 60000).toISOString().slice(0, 16);

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

      <main className="assignments">
        {/* Header */}
        <div className="assignments__header container">
          <div>
            <h1 className="assignments__title">Assignments</h1>
            <p className="assignments__subtitle">Track your academic tasks and never miss a deadline.</p>
          </div>
          <button className="assignments__addBtn" onClick={openCreate}>+ Add Assignment</button>
        </div>

        {/* Stats */}
        <div className="assignments__stats container">
          {[
            { label: "Total", value: stats.total, color: "#3b82f6" },
            { label: "Pending", value: stats.pending, color: "#64748b" },
            { label: "In Progress", value: stats.inProgress, color: "#d97706" },
            { label: "Completed", value: stats.completed, color: "#16a34a" },
            { label: "Overdue", value: stats.overdue, color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} className="assignments__statCard" style={{ borderTopColor: s.color }}>
              <span className="assignments__statValue" style={{ color: s.color }}>{s.value}</span>
              <span className="assignments__statLabel">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Status Tabs */}
        <div className="assignments__tabs container">
          {STATUS_TABS.map((tab) => (
            <button key={tab.value}
              className={`assignments__tab ${filterStatus === tab.value ? "assignments__tab--active" : ""}`}
              onClick={() => setFilterStatus(tab.value)}>
              {tab.label}
              {tab.value === "overdue" && stats.overdue > 0 && (
                <span className="assignments__overdueCount">{stats.overdue}</span>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="assignments__alert container">
            <div className="alert alert--warning"><span className="alert__icon">⚠️</span><span>{error}</span></div>
          </div>
        )}

        {loading ? (
          <div className="assignments__loading container">
            <div className="loading__spinner"></div>
            <p className="loading__text">Loading assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="assignments__empty container">
            <div className="assignments__emptyIcon">📋</div>
            <h3 className="assignments__emptyTitle">No assignments found</h3>
            <p className="assignments__emptyText">
              {filterStatus ? `No ${filterStatus} assignments.` : "Add your first assignment to get started!"}
            </p>
            <button className="assignments__addBtn" onClick={openCreate}>+ Add Assignment</button>
          </div>
        ) : (
          <div className="assignments__list container">
            {assignments.map((a) => {
              const pm = PRIORITY_META[a.priority] || PRIORITY_META.medium;
              const sm = STATUS_META[a.status] || STATUS_META.pending;
              const nextStatus = STATUS_NEXT[a.status];
              return (
                <article key={a._id} className={`assignments__card assignments__card--${a.status}`}>
                  <div className="assignments__cardLeft">
                    <div className="assignments__cardBadges">
                      <span className="assignments__priorityBadge" style={{ color: pm.color, background: pm.bg }}>
                        {a.priority === "high" ? "🔴" : a.priority === "medium" ? "🟡" : "🟢"} {pm.label}
                      </span>
                      <span className="assignments__statusBadge" style={{ color: sm.color, background: sm.bg }}>
                        {sm.label}
                      </span>
                    </div>
                    <h2 className="assignments__cardTitle">{a.title}</h2>
                    <p className="assignments__cardModule">📖 {a.module}</p>
                    {a.notes && <p className="assignments__cardNotes">{a.notes}</p>}
                  </div>

                  <div className="assignments__cardRight">
                    <div className="assignments__deadline">
                      <span className="assignments__dueLabel">Due</span>
                      <span className="assignments__dueDate">
                        {new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="assignments__dueTime">
                        {new Date(a.dueDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {a.status !== "completed" && <DeadlineCountdown dueDate={a.dueDate} />}
                    </div>

                    <div className="assignments__cardActions">
                      {nextStatus && (
                        <button className="assignments__progressBtn"
                          onClick={() => handleStatusChange(a, nextStatus)}>
                          {nextStatus === "in-progress" ? "▶ Start" : "✓ Complete"}
                        </button>
                      )}
                      {a.status === "completed" && (
                        <button className="assignments__undoBtn"
                          onClick={() => handleStatusChange(a, "in-progress")}>
                          ↩ Undo
                        </button>
                      )}
                      <button className="assignments__editBtn" onClick={() => openEdit(a)}>✏</button>
                      <button className="assignments__deleteBtn" onClick={() => handleDelete(a._id)}>🗑</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Create / Edit Modal */}
      {showCreateModal && (
        <div className="modal__overlay" onClick={closeModal}>
          <div className="modal__content assignments__modal" onClick={(e) => e.stopPropagation()}>
            <div className="assignments__modalHeader">
              <h2 className="modal__title">{editTarget ? "Edit Assignment" : "New Assignment"}</h2>
              <button className="modal__close" onClick={closeModal}>×</button>
            </div>

            <form className="assignments__form" onSubmit={handleSubmit} noValidate>
              <div className="assignments__formGroup">
                <label className="assignments__label">Assignment Title *</label>
                <input className={`assignments__input ${formErrors.title ? "assignments__input--invalid" : ""}`}
                  type="text" name="title" value={form.title} onChange={handleFormChange}
                  placeholder="e.g. Database ER Diagram" />
                {formErrors.title && <p className="assignments__errorText">{formErrors.title}</p>}
              </div>

              <div className="assignments__formRow">
                <div className="assignments__formGroup">
                  <label className="assignments__label">Module / Subject *</label>
                  <input className={`assignments__input ${formErrors.module ? "assignments__input--invalid" : ""}`}
                    type="text" name="module" value={form.module} onChange={handleFormChange}
                    placeholder="e.g. CS3043" />
                  {formErrors.module && <p className="assignments__errorText">{formErrors.module}</p>}
                </div>

                <div className="assignments__formGroup">
                  <label className="assignments__label">Priority *</label>
                  <select className={`assignments__input assignments__select ${formErrors.priority ? "assignments__input--invalid" : ""}`}
                    name="priority" value={form.priority} onChange={handleFormChange}>
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                  {formErrors.priority && <p className="assignments__errorText">{formErrors.priority}</p>}
                </div>
              </div>

              <div className="assignments__formGroup">
                <label className="assignments__label">Due Date & Time *</label>
                <input className={`assignments__input ${formErrors.dueDate ? "assignments__input--invalid" : ""}`}
                  type="datetime-local" name="dueDate" value={form.dueDate} onChange={handleFormChange}
                  min={minDateTime} />
                {formErrors.dueDate && <p className="assignments__errorText">{formErrors.dueDate}</p>}
              </div>

              <div className="assignments__formGroup">
                <label className="assignments__label">
                  Notes <span className="assignments__charCount">({form.notes.length}/{MAX_NOTES})</span>
                </label>
                <textarea className={`assignments__input assignments__textarea ${formErrors.notes ? "assignments__input--invalid" : ""}`}
                  name="notes" value={form.notes} onChange={handleFormChange}
                  placeholder="Any extra details..." rows={3} maxLength={MAX_NOTES} />
                {formErrors.notes && <p className="assignments__errorText">{formErrors.notes}</p>}
              </div>

              <div className="assignments__formActions">
                <button type="button" className="assignments__btn assignments__btn--secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="assignments__btn assignments__btn--primary" disabled={submitting}>
                  {submitting ? "Saving..." : editTarget ? "Save Changes" : "Add Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastVisible && <div className="assignments__toast"><p>{toastText}</p></div>}

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

export default Assignments;
