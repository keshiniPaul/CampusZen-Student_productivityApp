import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Career.css";
import "./Home.css";
import { internshipAPI } from "../services/api";
import campusLogo from "../images/campus_logo.png";

function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    roleTitle: "",
    jobPostingLink: "",
    status: "",
    nextImportantDate: "",
    nextDateContext: "",
    notes: "",
  });

  const toastTimerRef = useRef(null);
  const navToggleRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    setIsLoggedIn(true);
    fetchApplicationDetails();
    // eslint-disable-next-line
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const data = await internshipAPI.getApplicationById(id, token);
      setApplication(data);
      setFormData({
        companyName: data.companyName,
        roleTitle: data.roleTitle,
        jobPostingLink: data.jobPostingLink || "",
        status: data.status,
        nextImportantDate: data.nextImportantDate ? data.nextImportantDate.substring(0, 10) : "",
        nextDateContext: data.nextDateContext || "",
        notes: data.notes || "",
      });
    } catch (err) {
      console.error(err);
      showToast("Failed to load application details");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastText(msg); setToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 2200);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem("token");
    try {
      await internshipAPI.updateApplication(id, formData, token);
      showToast("Changes saved successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) return;
    const token = localStorage.getItem("token");
    try {
      await internshipAPI.deleteApplication(id, token);
      navigate("/career/internship-tracker");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="career__loading">Loading details...</div>;
  if (!application) return <div className="career__loading">Application not found.</div>;

  return (
    <>
      <header className="topbar">
        <nav className="nav container">
          <a className="brand" href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}><img className="brand__logo--img" src={campusLogo} alt="CampusZone Logo" /></a>
          <div className="nav__links is-visible">
            <button className="btn btn--ghost" onClick={() => navigate("/career/internship-tracker")}>← Back to Tracker</button>
          </div>
        </nav>
      </header>

      <section className="hero hero--career" style={{ padding: "3rem 0" }}>
        <div className="container hero__container">
          <div className="hero__content">
            <p className="hero__tagline">TRACKING APPLICATION</p>
            <h1 className="hero__title">{formData.companyName}</h1>
            <h3 className="hero__subtitle" style={{ fontSize: "1.5rem", opacity: 0.9 }}>{formData.roleTitle}</h3>
            {formData.jobPostingLink && (
              <a href={formData.jobPostingLink.startsWith('http') ? formData.jobPostingLink : `https://${formData.jobPostingLink}`} target="_blank" rel="noopener noreferrer" className="hero__link" style={{ color: "white", textDecoration: "underline", display: "inline-block", marginTop: "10px" }}>
                🌐 View Job Posting
              </a>
            )}
          </div>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <form className="details__grid" onSubmit={handleSubmit}>
            <div className="details__main">
              <div className="details__card">
                <div className="details__card-header">
                  <h3 className="details__card-title">Application Notes</h3>
                  <small>Paste cover letters, contact info, or interview feedback here</small>
                </div>
                <textarea 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleInputChange} 
                  placeholder="Keep your scratchpad notes here..."
                  className="details__textarea"
                />
              </div>
            </div>

            <div className="details__sidebar">
              <div className="details__card">
                <h3 className="details__card-title">Current Status</h3>
                <select name="status" value={formData.status} onChange={handleInputChange} className="details__select" style={{ borderColor: getStatusColor(formData.status) }}>
                  <option value="Draft">Draft</option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="details__card">
                <h3 className="details__card-title">Next Important Event</h3>
                <div className="details__form-group">
                  <label>Date</label>
                  <input type="date" name="nextImportantDate" value={formData.nextImportantDate} onChange={handleInputChange} className="details__input" />
                </div>
                <div className="details__form-group" style={{ marginTop: "1rem" }}>
                  <label>Context (e.g. Technical Interview)</label>
                  <input type="text" name="nextDateContext" value={formData.nextDateContext} onChange={handleInputChange} placeholder="Brief description..." className="details__input" />
                </div>
              </div>

              <div className="details__actions">
                <button type="submit" className="details__save-btn" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save All Changes"}
                </button>
                <button type="button" className="details__delete-btn" onClick={handleDelete}>Delete Application</button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <div className={`toast ${toastVisible ? "is-visible" : ""}`} role="status">{toastText}</div>

      <style>{`
        .details__grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 2.5rem;
          margin-top: 1rem;
        }
        .details__card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          margin-bottom: 2rem;
        }
        .details__card-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }
        .details__card-header small {
          display: block;
          color: #64748b;
          margin-bottom: 1.5rem;
        }
        .details__textarea {
          width: 100%;
          min-height: 450px;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-family: inherit;
          font-size: 1rem;
          line-height: 1.6;
          resize: vertical;
          color: #334155;
        }
        .details__select, .details__input {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          outline: none;
          transition: all 0.2s ease;
        }
        .details__select:focus, .details__input:focus {
          border-color: #667eea;
        }
        .details__form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 0.5rem;
        }
        .details__save-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          margin-bottom: 1rem;
        }
        .details__save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
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
        .hero__tagline {
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.7);
          margin-bottom: 0.5rem;
        }
        @media (max-width: 900px) {
          .details__grid { grid-template-columns: 1fr; }
          .details__sidebar { order: -1; }
        }
      `}</style>
    </>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case "Draft": return "#94a3b8";
    case "Applied": return "#3b82f6";
    case "Interviewing": return "#8b5cf6";
    case "Offered": return "#10b981";
    case "Rejected": return "#ef4444";
    default: return "#e2e8f0";
  }
};

export default InternshipDetails;
