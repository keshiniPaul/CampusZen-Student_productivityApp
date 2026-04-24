import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { studyGroupsAPI } from "../services/api";
import "./StudyGroupDetail.css";
import "./Home.css";
import campusLogo from "../images/campus_logo.png";
import profileImg from "../images/profile.png";

function StudyGroupDetail() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [joining, setJoining] = useState(false);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    document.title = "Study Group - CampusZen";
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserId(parsed.id || parsed._id);
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await studyGroupsAPI.getGroupById(groupId);
        if (response.success) {
          setGroup(response.data);
        }
      } catch (err) {
        setError("Failed to load study group.");
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [groupId]);

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

  const showToast = (message) => {
    setToastText(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const isMember = () => {
    if (!group || !userId) return false;
    return group.members.some((m) => {
      const id = m.userId?._id || m.userId;
      return id && id.toString() === userId;
    });
  };

  const getMemberRole = () => {
    if (!group || !userId) return null;
    const member = group.members.find((m) => {
      const id = m.userId?._id || m.userId;
      return id && id.toString() === userId;
    });
    return member ? member.role : null;
  };

  const isFull = () => group && group.memberCount >= group.maxMembers;

  const handleJoin = async () => {
    if (!isLoggedIn) {
      showToast("Please log in to join this group.");
      return;
    }
    const token = localStorage.getItem("token");
    setJoining(true);
    try {
      const response = await studyGroupsAPI.joinGroup(groupId, token);
      if (response.success) {
        navigate(`/study-groups/${groupId}`, { replace: true });
      }
    } catch (err) {
      showToast(err.message || "Failed to join group.");
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!userId) return;
    const token = localStorage.getItem("token");
    try {
      const response = await studyGroupsAPI.leaveGroup(groupId, userId, token);
      if (response.success) {
        showToast("Left group successfully.");
        const updated = await studyGroupsAPI.getGroupById(groupId);
        if (updated.success) setGroup(updated.data);
      }
    } catch (err) {
      showToast(err.message || "Failed to leave group.");
    }
  };

  const getRoleBadge = (role) => {
    if (role === "admin") return { label: "Admin", className: "sgDetail__roleBadge--admin" };
    if (role === "mentor") return { label: "Mentor", className: "sgDetail__roleBadge--mentor" };
    return { label: "Member", className: "sgDetail__roleBadge--member" };
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

      <main className="sgDetail">
        {loading ? (
          <div className="sgDetail__loading container">
            <div className="loading__spinner"></div>
            <p className="loading__text">Loading group details...</p>
          </div>
        ) : error ? (
          <div className="sgDetail__error container">
            <div className="alert alert--warning">
              <span className="alert__icon">⚠️</span>
              <span>{error}</span>
            </div>
            <Link to="/study-groups" className="sgDetail__backLink">← Back to Study Groups</Link>
          </div>
        ) : group ? (
          <>
            <div className="sgDetail__hero container">
              <Link to="/study-groups" className="sgDetail__backBtn">← Back to Study Groups</Link>

              <div className="sgDetail__heroContent">
                <div className="sgDetail__badges">
                  <span className="studyGroups__moduleBadge">{group.module}</span>
                  <span className={`studyGroups__typeBadge studyGroups__typeBadge--${group.type}`}>
                    {group.type === "private" ? "🔒 Private" : "🌐 Public"}
                  </span>
                </div>
                <h1 className="sgDetail__title">{group.name}</h1>
                {group.description && (
                  <p className="sgDetail__description">{group.description}</p>
                )}

                <div className="sgDetail__stats">
                  <div className="sgDetail__stat">
                    <span className="sgDetail__statValue">{group.memberCount}</span>
                    <span className="sgDetail__statLabel">Members</span>
                  </div>
                  <div className="sgDetail__stat">
                    <span className="sgDetail__statValue">{group.maxMembers}</span>
                    <span className="sgDetail__statLabel">Max</span>
                  </div>
                  <div className="sgDetail__stat">
                    <span className="sgDetail__statValue">
                      {new Date(group.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                    <span className="sgDetail__statLabel">Created</span>
                  </div>
                </div>

                <div className="sgDetail__capacityBar">
                  <div
                    className="sgDetail__capacityFill"
                    style={{
                      width: `${(group.memberCount / group.maxMembers) * 100}%`,
                      backgroundColor: isFull() ? "#e74c3c" : group.memberCount / group.maxMembers >= 0.7 ? "#f39c12" : "#3b82f6",
                    }}
                  ></div>
                </div>
                <p className="sgDetail__capacityText">
                  {group.memberCount} of {group.maxMembers} spots filled
                </p>
              </div>

              <div className="sgDetail__heroActions">
                {isMember() ? (
                  <div className="sgDetail__memberStatus">
                    <span className="sgDetail__memberBadge">
                      ✓ You are a member
                      {getMemberRole() && ` · ${getMemberRole()}`}
                    </span>
                    <button className="sgDetail__leaveBtn" onClick={handleLeave}>
                      Leave Group
                    </button>
                  </div>
                ) : (
                  <button
                    className={`sgDetail__joinBtn ${isFull() ? "sgDetail__joinBtn--disabled" : ""}`}
                    onClick={handleJoin}
                    disabled={isFull() || joining}
                  >
                    {joining ? "Joining..." : isFull() ? "Group Full" : "Join Group"}
                  </button>
                )}
              </div>
            </div>

            <div className="sgDetail__body container">
              <section className="sgDetail__section">
                <h2 className="sgDetail__sectionTitle">
                  Members ({group.memberCount})
                </h2>
                {group.members.length === 0 ? (
                  <p className="sgDetail__noMembers">No members yet. Be the first to join!</p>
                ) : (
                  <div className="sgDetail__memberList">
                    {group.members.map((member, index) => {
                      const roleBadge = getRoleBadge(member.role);
                      const name = member.userId?.fullName || "Unknown Member";
                      const email = member.userId?.email || "";
                      const initials = name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase();
                      return (
                        <div key={member._id || index} className="sgDetail__memberCard">
                          <div className="sgDetail__memberAvatar">{initials}</div>
                          <div className="sgDetail__memberInfo">
                            <span className="sgDetail__memberName">{name}</span>
                            {email && <span className="sgDetail__memberEmail">{email}</span>}
                          </div>
                          <span className={`sgDetail__roleBadge ${roleBadge.className}`}>
                            {roleBadge.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </>
        ) : null}
      </main>

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

export default StudyGroupDetail;
