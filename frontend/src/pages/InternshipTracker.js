import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Career.css";
import "./Home.css";
import { internshipAPI } from "../services/api";
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";

function InternshipTracker() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    roleTitle: "",
    jobPostingLink: "",
    status: "Draft",
  });

  const profileDropdownRef = useRef(null);
  const toastTimerRef = useRef(null);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setIsLoggedIn(true);
    fetchApplications();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target))
        setIsProfileDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const data = await internshipAPI.getAllApplications(token);
      setApplications(data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastText(msg);
    setToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 2200);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await internshipAPI.createApplication(formData, token);
      showToast("Application added!");
      setShowAddModal(false);
      setFormData({ companyName: "", roleTitle: "", jobPostingLink: "", status: "Draft" });
      fetchApplications();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    const token = localStorage.getItem("token");
    try {
      await internshipAPI.deleteApplication(id, token);
      showToast("Application deleted!");
      setShowViewModal(false);
      fetchApplications();
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Draft": return "#94a3b8";
      case "Applied": return "#3b82f6";
      case "Interviewing": return "#8b5cf6";
      case "Offered": return "#10b981";
      case "Rejected": return "#ef4444";
      default: return "#64748b";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const openViewModal = (app) => {
    setSelectedApp(app);
    setShowViewModal(true);
  };

  const goToHome = (e) => { e.preventDefault(); navigate("/"); };
  const goToEvents = (e) => { e.preventDefault(); navigate("/events"); };
  const handleLogout = () => { localStorage.clear(); navigate("/"); };
  const goToDashboard = () => { navigate("/dashboard"); };
  const goToProfile = () => { navigate("/profile"); };

  const today = new Date();
  const monthLabel = today.toLocaleString("en-US", { month: "long", year: "numeric" });
  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const cD = today.getDate();
  const fi = new Date(today.getFullYear(), today.getMonth(), 1).getDay(), le = (fi + 6) % 7, dim = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const calDays = [...Array.from({ length: le }, () => null), ...Array.from({ length: dim }, (_, i) => i + 1)];
  while (calDays.length % 7 !== 0) calDays.push(null);

  return (
    <>
      <header className="topbar" id="top">
        <nav className="nav container">
          <a className="brand" href="/" onClick={goToHome}><img className="brand__logo--img" src={campusLogo} alt="CampusZone Logo" /></a>
          <button className="nav__toggle" ref={navToggleRef} onClick={() => setIsNavOpen(p => !p)}><span className="nav__toggleBars"></span></button>
          <div className={`nav__links ${isNavOpen ? "is-open" : ""}`} ref={navLinksRef}>
            <a href="/" onClick={goToHome}>Home</a>
            <a href="/health" onClick={(e) => { e.preventDefault(); navigate("/health"); }}>Health</a>
            <a href="/events" onClick={goToEvents}>Events</a>
            <a href="/career" className="nav__link--career-active" onClick={(e) => { e.preventDefault(); navigate("/career"); }}>Career</a>
            <a href="#study" onClick={(e) => { e.preventDefault(); showToast("Study section coming soon"); }}>Study</a>
            <div className="nav__cta">
              {isLoggedIn && (
                <div className="profile-dropdown" ref={profileDropdownRef}>
                  <button className="profile-icon-btn" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>👤</button>
                  {isProfileDropdownOpen && (
                    <div className="profile-dropdown-menu">
                      <button onClick={goToProfile} className="dropdown-item">👤 My Profile</button>
                      <button onClick={goToDashboard} className="dropdown-item">📊 Dashboard</button>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item logout">🚪 Log out</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <section className="hero hero--career">
        <div className="container hero__container">
          <div className="hero__content">
            <h1 className="hero__title">Internship Tracker</h1>
            <p className="hero__subtitle">Manage your applications and stay on top of your career journey</p>
          </div>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div className="section__head">
            <span className="section__tag section__tag--career">Personal Tracker</span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <h2 className="section__title">My Applications</h2>
              <button className="career__addBtn" onClick={() => setShowAddModal(true)}>+ Add New Internship</button>
            </div>
          </div>

          {loading ? (
            <div className="career__loading">Loading your applications...</div>
          ) : (
            <div className="tracker__container">
              {applications.length > 0 ? (
                <div className="tracker__table-wrapper">
                  <table className="tracker__table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Role Title</th>
                        <th>Status</th>
                        <th>Next Important Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app._id} onClick={() => openViewModal(app)} style={{ cursor: "pointer" }}>
                          <td><div className="tracker__company-cell"><strong>{app.companyName}</strong></div></td>
                          <td>{app.roleTitle}</td>
                          <td>
                            <span className="status-pill" style={{ backgroundColor: getStatusColor(app.status), color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600" }}>
                              {app.status}
                            </span>
                          </td>
                          <td>
                            <div className="tracker__date-cell">
                              <div>{formatDate(app.nextImportantDate)}</div>
                              {app.nextDateContext && <small className="tracker__date-context">{app.nextDateContext}</small>}
                            </div>
                          </td>
                          <td>
                            <button className="tracker__view-btn" onClick={(e) => { e.stopPropagation(); openViewModal(app); }}>View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="career__empty">
                  <div className="career__empty-icon">📝</div>
                  <p className="career__empty-text">You haven't added any internship applications yet. Click 'Add New Internship' to start tracking!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="career__modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="career__modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="career__modal-title">Add New Internship</h2>
            <form className="career__form" onSubmit={handleSubmit}>
              <div className="career__form-group">
                <label>Company Name</label>
                <input name="companyName" value={formData.companyName} onChange={handleInputChange} required placeholder="e.g. Google, Sri Lanka Telecom" />
              </div>
              <div className="career__form-group">
                <label>Role Title</label>
                <input name="roleTitle" value={formData.roleTitle} onChange={handleInputChange} required placeholder="e.g. Software Engineer Intern" />
              </div>
              <div className="career__form-group">
                <label>Job Posting Link (Optional)</label>
                <input name="jobPostingLink" value={formData.jobPostingLink} onChange={handleInputChange} placeholder="e.g. https://careers.google.com/jobs/..." />
              </div>
              <div className="career__form-group">
                <label>Application Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="career__form-select" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <option value="Draft">Draft</option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="career__form-actions">
                <button type="button" className="career__form-cancelBtn" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="career__form-submitBtn">Add Internship</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedApp && (
        <div className="career__modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="career__modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <h2 className="career__modal-title" style={{ marginBottom: "0.25rem" }}>{selectedApp.companyName}</h2>
                <p style={{ fontSize: "1.1rem", color: "#64748b", fontWeight: "600" }}>{selectedApp.roleTitle}</p>
              </div>
              <span className="status-pill" style={{ backgroundColor: getStatusColor(selectedApp.status), color: "white", padding: "6px 16px", borderRadius: "20px", fontSize: "0.9rem", fontWeight: "700" }}>
                {selectedApp.status}
              </span>
            </div>

            <div className="view-modal__content">
              {selectedApp.jobPostingLink && (
                <div className="view-modal__section">
                  <label>🔗 Job Posting</label>
                  <p><a href={selectedApp.jobPostingLink.startsWith('http') ? selectedApp.jobPostingLink : `https://${selectedApp.jobPostingLink}`} target="_blank" rel="noopener noreferrer" style={{ color: "#667eea", textDecoration: "underline" }}>View Original Post</a></p>
                </div>
              )}

              <div className="view-modal__section">
                <label>📅 Next Important Date</label>
                <p><strong>{formatDate(selectedApp.nextImportantDate)}</strong> {selectedApp.nextDateContext && `— ${selectedApp.nextDateContext}`}</p>
              </div>

              {selectedApp.notes && (
                <div className="view-modal__section">
                  <label>📝 Notes Summary</label>
                  <p style={{ whiteSpace: "pre-wrap", maxHeight: "150px", overflowY: "auto", background: "#f8fafc", padding: "1rem", borderRadius: "8px", fontSize: "0.95rem" }}>
                    {selectedApp.notes.length > 300 ? `${selectedApp.notes.substring(0, 300)}...` : selectedApp.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="career__form-actions" style={{ marginTop: "2rem" }}>
              <button type="button" className="career__form-cancelBtn" onClick={() => setShowViewModal(false)}>Close</button>
              <div style={{ display: "flex", gap: "0.75rem", flex: 2 }}>
                <button type="button" className="details__delete-btn" style={{ flex: 1, padding: "0.75rem" }} onClick={() => handleDelete(selectedApp._id)}>Remove</button>
                <button type="button" className="career__form-submitBtn" style={{ flex: 1 }} onClick={() => navigate(`/career/internship-tracker/${selectedApp._id}`)}>Edit & Full Details</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer__panel">
          <div className="footer__support">
            <p className="footer__kicker">Need Career Help?</p>
            <h3 className="footer__heading">Support</h3>
            <a className="footer__contact footer__contact--accent" href="https://support.sliit.lk">🌐 support.campuszone.lk</a>
            <a className="footer__contact" href="tel:+94117544801">📞 +94 11 754 0000</a>
          </div>
          <div className="footer__calendar">
            <h3 className="footer__calendarTitle">Calendar</h3>
            <div className="footer__calendarHead"><strong>{monthLabel}</strong></div>
            <div className="footer__weekdays">{weekdayLabels.map(d => <span key={d}>{d}</span>)}</div>
            <div className="footer__days">{calDays.map((day, i) => !day ? <span className="is-muted" key={`e-${i}`}></span> : <span key={`d-${day}`} className={day === cD ? "is-active" : ""}>{day}</span>)}</div>
          </div>
        </div>
        <div className="footer__bottom">
          <div className="container footer__inner">
            <div className="footer__brand"><div><div className="footer__name">CampusZone</div><div className="footer__small">Student Productivity Platform</div></div></div>
            <div className="footer__socials">
              <a href="/"><img src={facebookIcon} alt="facebook" className="footer__socialIcon" /></a>
              <a href="/"><img src={instagramIcon} alt="instagram" className="footer__socialIcon" /></a>
              <a href="/"><img src={linkedinIcon} alt="linkedin" className="footer__socialIcon" /></a>
              <a href="/"><img src={youtubeIcon} alt="youtube" className="footer__socialIcon" /></a>
            </div>
          </div>
        </div>
      </footer>
      <div className={`toast ${toastVisible ? "is-visible" : ""}`} role="status">{toastText}</div>

      <style>{`
        .tracker__table-wrapper {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          overflow: hidden;
          margin-top: 2rem;
        }
        .tracker__table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .tracker__table th {
          background: #f8fafc;
          padding: 1.25rem 1.5rem;
          color: #64748b;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .tracker__table td {
          padding: 1.25rem 1.5rem;
          border-top: 1px solid #f1f5f9;
          color: #1e293b;
          vertical-align: middle;
        }
        .tracker__table tr:hover td {
          background-color: #fcfdfe;
        }
        .tracker__company-cell {
          font-size: 1.05rem;
          color: #1e293b;
        }
        .tracker__view-btn {
          padding: 8px 16px;
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .tracker__view-btn:hover {
          background: #667eea;
          color: white;
          border-color: #667eea;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }
        .tracker__date-cell {
          display: flex;
          flex-direction: column;
        }
        .tracker__date-context {
          color: #64748b;
          font-size: 0.8rem;
          margin-top: 2px;
        }
        .view-modal__content {
          margin-top: 1rem;
        }
        .view-modal__section {
          margin-bottom: 1.5rem;
        }
        .view-modal__section label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .view-modal__section p {
          color: #1e293b;
          font-size: 1rem;
          margin: 0;
        }
        .details__delete-btn {
          width: 100%;
          padding: 0.75rem;
          background: transparent;
          color: #ef4444;
          border: 1px solid #ef4444;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .details__delete-btn:hover {
          background: #fef2f2;
        }
        @media (max-width: 768px) {
          .tracker__table thead { display: none; }
          .tracker__table td { display: block; padding: 0.75rem 1.5rem; border: none; }
          .tracker__table td:first-child { padding-top: 1.5rem; }
          .tracker__table td:last-child { padding-bottom: 1.5rem; border-bottom: 8px solid #f1f5f9; }
          .tracker__table td::before { content: attr(data-label); font-weight: 600; color: #64748b; margin-bottom: 4px; display: block; font-size: 0.75rem; text-transform: uppercase; }
        }
      `}</style>
    </>
  );
}

export default InternshipTracker;
