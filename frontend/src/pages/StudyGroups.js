import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { studyGroupsAPI } from "../services/api";
import "./StudyGroups.css";
import "./Home.css";
import campusLogo from "../images/campus_logo.png";
import profileImg from "../images/profile.png";

const MIN_GROUP_NAME_LENGTH = 3;
const MIN_MODULE_LENGTH = 2;
const MAX_DESCRIPTION_LENGTH = 500;
const MIN_MEMBERS = 2;
const MAX_MEMBERS = 100;

function StudyGroups() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModule, setFilterModule] = useState("");
  const [filterType, setFilterType] = useState("public");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    module: "",
    description: "",
    type: "public",
    maxMembers: 20,
  });
  const [createFormErrors, setCreateFormErrors] = useState({});
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    document.title = "Study Groups - CampusZen";
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [filterType]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { type: filterType };
      if (filterModule) params.module = filterModule;
      if (searchQuery) params.search = searchQuery;
      const response = await studyGroupsAPI.getAllGroups(params);
      if (response.success) {
        setGroups(response.data);
      }
    } catch (err) {
      setError("Failed to load study groups. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGroups();
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsNavOpen(false);
        setIsProfileOpen(false);
        setShowCreateModal(false);
        setShowJoinModal(false);
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

  const showToast = (message) => {
    setToastText(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
    setCreateFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateFormErrors({});
  };

  const openCreateModal = () => {
    if (!isLoggedIn) {
      showToast("Please log in to create a study group.");
      return;
    }
    setCreateFormErrors({});
    setShowCreateModal(true);
  };

  const validateCreateForm = () => {
    const errors = {};
    const name = createForm.name.trim();
    const module = createForm.module.trim();
    const description = createForm.description.trim();
    const maxMembers = Number(createForm.maxMembers);

    if (!name) errors.name = "Group name is required.";
    else if (name.length < MIN_GROUP_NAME_LENGTH) {
      errors.name = `Group name must be at least ${MIN_GROUP_NAME_LENGTH} characters.`;
    }

    if (!module) errors.module = "Module / Subject is required.";
    else if (module.length < MIN_MODULE_LENGTH) {
      errors.module = `Module / Subject must be at least ${MIN_MODULE_LENGTH} characters.`;
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      errors.description = `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`;
    }

    if (!["public", "private"].includes(createForm.type)) {
      errors.type = "Please choose a valid group type.";
    }

    if (!Number.isInteger(maxMembers)) {
      errors.maxMembers = "Max members must be a whole number.";
    } else if (maxMembers < MIN_MEMBERS || maxMembers > MAX_MEMBERS) {
      errors.maxMembers = `Max members must be between ${MIN_MEMBERS} and ${MAX_MEMBERS}.`;
    }

    return errors;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateCreateForm();
    if (Object.keys(validationErrors).length > 0) {
      setCreateFormErrors(validationErrors);
      showToast("Please fix the highlighted fields.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await studyGroupsAPI.createGroup(
        {
          ...createForm,
          name: createForm.name.trim(),
          module: createForm.module.trim(),
          description: createForm.description.trim(),
          maxMembers: Number(createForm.maxMembers),
        },
        token
      );
      if (response.success) {
        showToast("Study group created successfully!");
        closeCreateModal();
        setCreateForm({ name: "", module: "", description: "", type: "public", maxMembers: 20 });
        fetchGroups();
      }
    } catch (err) {
      showToast(err.message || "Failed to create group.");
    }
  };

  const handleJoinClick = (group) => {
    if (!isLoggedIn) {
      showToast("Please log in to join a study group.");
      return;
    }
    setSelectedGroup(group);
    setShowJoinModal(true);
  };

  const handleJoinConfirm = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await studyGroupsAPI.joinGroup(selectedGroup._id, token);
      if (response.success) {
        setShowJoinModal(false);
        navigate(`/study-groups/${selectedGroup._id}`);
      }
    } catch (err) {
      showToast(err.message || "Failed to join group.");
      setShowJoinModal(false);
    }
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
  const monthLabel = today.toLocaleString("en-US", { month: "long", year: "numeric" });
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const leadingEmptyDays = (firstDayIndex + 6) % 7;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarDays = [
    ...Array.from({ length: leadingEmptyDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  return (
    <>
      <header className="topbar" id="top">
        <nav className="nav container">
          <Link className="brand" to="/" aria-label="CampusZen Home" onClick={scrollToTop}>
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

      <main className="studyGroups">
        <div className="studyGroups__header container">
          <div className="studyGroups__headerContent">
            <Link to="/events" className="studyGroups__backBtn">← Back to Events</Link>
            <h1 className="studyGroups__title">Study Groups</h1>
            <p className="studyGroups__subtitle">
              Find or create study groups for your modules. Collaborate with peers and ace your exams together.
            </p>
          </div>
          <button
            className="studyGroups__createBtn"
            onClick={openCreateModal}
          >
            + Create Group
          </button>
        </div>

        <div className="studyGroups__filters container">
          <form className="studyGroups__searchForm" onSubmit={handleSearch}>
            <input
              className="studyGroups__searchInput"
              type="text"
              placeholder="Search by name or module..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="studyGroups__searchBtn" type="submit">Search</button>
          </form>

          <div className="studyGroups__filterTabs">
            {["public", "private", "all"].map((tab) => (
              <button
                key={tab}
                className={`studyGroups__tab ${filterType === tab ? "studyGroups__tab--active" : ""}`}
                onClick={() => setFilterType(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <input
            className="studyGroups__moduleFilter"
            type="text"
            placeholder="Filter by module..."
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchGroups()}
          />
        </div>

        {error && (
          <div className="studyGroups__alert container">
            <div className="alert alert--warning">
              <span className="alert__icon">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="studyGroups__loading container">
            <div className="loading__spinner"></div>
            <p className="loading__text">Loading study groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="studyGroups__empty container">
            <div className="studyGroups__emptyIcon">📚</div>
            <h3 className="studyGroups__emptyTitle">No study groups found</h3>
            <p className="studyGroups__emptyText">Be the first to create a study group!</p>
            <button className="studyGroups__createBtn" onClick={openCreateModal}>
              + Create Group
            </button>
          </div>
        ) : (
          <div className="studyGroups__grid container">
            {groups.map((group) => {
              const isFull = group.memberCount >= group.maxMembers;
              return (
                <article key={group._id} className="studyGroups__card">
                  <div className="studyGroups__cardHeader">
                    <div className="studyGroups__cardBadges">
                      <span className="studyGroups__moduleBadge">{group.module}</span>
                      <span className={`studyGroups__typeBadge studyGroups__typeBadge--${group.type}`}>
                        {group.type === "private" ? "🔒 Private" : "🌐 Public"}
                      </span>
                    </div>
                    {isFull && <span className="studyGroups__fullBadge">FULL</span>}
                  </div>

                  <div className="studyGroups__cardBody">
                    <h2 className="studyGroups__groupName">{group.name}</h2>
                    {group.description && (
                      <p className="studyGroups__groupDesc">{group.description}</p>
                    )}

                    <div className="studyGroups__cardMeta">
                      <span className="studyGroups__metaItem">
                        👥 {group.memberCount} / {group.maxMembers} members
                      </span>
                      <span className="studyGroups__metaItem">
                        📅 {new Date(group.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>

                    <div className="studyGroups__capacityBar">
                      <div
                        className="studyGroups__capacityFill"
                        style={{
                          width: `${(group.memberCount / group.maxMembers) * 100}%`,
                          backgroundColor: isFull ? "#e74c3c" : group.memberCount / group.maxMembers >= 0.7 ? "#f39c12" : "#3b82f6",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="studyGroups__cardActions">
                    <Link
                      to={`/study-groups/${group._id}`}
                      className="studyGroups__btn studyGroups__btn--secondary"
                    >
                      View Details
                    </Link>
                    <button
                      className={`studyGroups__btn studyGroups__btn--primary ${isFull ? "studyGroups__btn--disabled" : ""}`}
                      onClick={() => handleJoinClick(group)}
                      disabled={isFull}
                    >
                      {isFull ? "Group Full" : "Join Group"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="modal__overlay" onClick={closeCreateModal}>
          <div className="modal__content" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Create Study Group</h2>
              <button
                className="modal__close"
                onClick={closeCreateModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <form className="studyGroups__form" onSubmit={handleCreateSubmit}>
              <div className="studyGroups__formGroup">
                <label className="studyGroups__label">Group Name *</label>
                <input
                  className={`studyGroups__input ${createFormErrors.name ? "studyGroups__input--invalid" : ""}`.trim()}
                  type="text"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateFormChange}
                  placeholder="e.g. Database Systems Study Group"
                  required
                  aria-invalid={!!createFormErrors.name}
                />
                {createFormErrors.name && <p className="studyGroups__errorText">{createFormErrors.name}</p>}
              </div>
              <div className="studyGroups__formGroup">
                <label className="studyGroups__label">Module / Subject *</label>
                <input
                  className={`studyGroups__input ${createFormErrors.module ? "studyGroups__input--invalid" : ""}`.trim()}
                  type="text"
                  name="module"
                  value={createForm.module}
                  onChange={handleCreateFormChange}
                  placeholder="e.g. CS3043 Database Systems"
                  required
                  aria-invalid={!!createFormErrors.module}
                />
                {createFormErrors.module && <p className="studyGroups__errorText">{createFormErrors.module}</p>}
              </div>
              <div className="studyGroups__formGroup">
                <label className="studyGroups__label">Description</label>
                <textarea
                  className={`studyGroups__input studyGroups__textarea ${createFormErrors.description ? "studyGroups__input--invalid" : ""}`.trim()}
                  name="description"
                  value={createForm.description}
                  onChange={handleCreateFormChange}
                  placeholder="What will your group focus on?"
                  rows={3}
                  aria-invalid={!!createFormErrors.description}
                />
                {createFormErrors.description && <p className="studyGroups__errorText">{createFormErrors.description}</p>}
              </div>
              <div className="studyGroups__formGroup">
                <label className="studyGroups__label">Group Type *</label>
                <div className={`studyGroups__radioGroup ${createFormErrors.type ? "studyGroups__radioGroup--invalid" : ""}`.trim()}>
                  <label className="studyGroups__radioLabel">
                    <input
                      type="radio"
                      name="type"
                      value="public"
                      checked={createForm.type === "public"}
                      onChange={handleCreateFormChange}
                    />
                    🌐 Public — anyone can join
                  </label>
                  <label className="studyGroups__radioLabel">
                    <input
                      type="radio"
                      name="type"
                      value="private"
                      checked={createForm.type === "private"}
                      onChange={handleCreateFormChange}
                    />
                    🔒 Private — invite only
                  </label>
                </div>
                {createFormErrors.type && <p className="studyGroups__errorText">{createFormErrors.type}</p>}
              </div>
              <div className="studyGroups__formGroup">
                <label className="studyGroups__label">Max Members *</label>
                <input
                  className={`studyGroups__input ${createFormErrors.maxMembers ? "studyGroups__input--invalid" : ""}`.trim()}
                  type="number"
                  name="maxMembers"
                  value={createForm.maxMembers}
                  onChange={handleCreateFormChange}
                  min={2}
                  max={100}
                  required
                  aria-invalid={!!createFormErrors.maxMembers}
                />
                {createFormErrors.maxMembers && <p className="studyGroups__errorText">{createFormErrors.maxMembers}</p>}
              </div>
              <div className="studyGroups__formActions">
                <button
                  type="button"
                  className="studyGroups__btn studyGroups__btn--secondary"
                  onClick={closeCreateModal}
                >
                  Cancel
                </button>
                <button type="submit" className="studyGroups__btn studyGroups__btn--primary">
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Confirmation Modal */}
      {showJoinModal && selectedGroup && (
        <div className="modal__overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal__content modal__content--small" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Join Study Group</h2>
              <button className="modal__close" onClick={() => setShowJoinModal(false)}>×</button>
            </div>
            <div className="studyGroups__joinBody">
              <p>You are about to join:</p>
              <h3 className="studyGroups__joinGroupName">{selectedGroup.name}</h3>
              <p className="studyGroups__joinModule">📖 {selectedGroup.module}</p>
              <p className="studyGroups__joinCount">
                👥 {selectedGroup.memberCount} / {selectedGroup.maxMembers} members
              </p>
            </div>
            <div className="studyGroups__formActions">
              <button
                className="studyGroups__btn studyGroups__btn--secondary"
                onClick={() => setShowJoinModal(false)}
              >
                Cancel
              </button>
              <button
                className="studyGroups__btn studyGroups__btn--primary"
                onClick={handleJoinConfirm}
              >
                Confirm Join
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastVisible && (
        <div className="studyGroups__toast">
          <p>{toastText}</p>
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
              Provide Feedback to CampusZen
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
                if (!day) return <span key={index} className="footer__day--empty"></span>;
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
      </footer>
    </>
  );
}

export default StudyGroups;
