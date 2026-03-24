import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Career.css";
import "./Home.css";
import { careerAPI } from "../services/api";
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

function CareerManagement() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "", description: "", color: "#8b5cf6", link: "#", image: null, category: "management"
  });

  const profileDropdownRef = useRef(null);
  const toastTimerRef = useRef(null);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (user) setIsAdmin(user.role === "admin");
    fetchCareers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const h = (e) => { if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) setIsProfileDropdownOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setIsNavOpen(false); };
    const onClick = (e) => {
      if (!e.target || !navLinksRef.current || !navToggleRef.current) return;
      if (!navLinksRef.current.contains(e.target) && !navToggleRef.current.contains(e.target)) setIsNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("click", onClick); };
  }, []);

  useEffect(() => () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); }, []);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const data = await careerAPI.getAllCareers();
      const all = data.data || [];
      // Use category field for reliable filtering
      setCareers(all.filter(c => c.category === "management"));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const showToast = (msg) => { setToastText(msg); setToastVisible(true); if (toastTimerRef.current) clearTimeout(toastTimerRef.current); toastTimerRef.current = setTimeout(() => setToastVisible(false), 2200); };
  const scrollToTop = (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); setIsNavOpen(false); };
  const goToHome = (e) => { e.preventDefault(); navigate("/"); setIsNavOpen(false); };
  const goToEvents = (e) => { e.preventDefault(); navigate("/events"); setIsNavOpen(false); };
  const handleLogout = () => { localStorage.clear(); setIsLoggedIn(false); setIsProfileDropdownOpen(false); navigate("/"); };
  const goToDashboard = () => { navigate("/dashboard"); setIsProfileDropdownOpen(false); setIsNavOpen(false); };
  const goToProfile = () => { navigate("/profile"); setIsProfileDropdownOpen(false); setIsNavOpen(false); };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") setFormData(prev => ({ ...prev, [name]: files[0] }));
    else setFormData(prev => ({ ...prev, [name]: value }));
  };
  const openAddModal = () => { setEditingId(null); setFormData({ title: "", description: "", image: null, color: "#8b5cf6", link: "#", category: "management" }); setShowModal(true); };
  const openEditModal = (c) => { setEditingId(c._id); setFormData({ title: c.title, description: c.description, image: null, color: c.color, link: c.link || "#", category: c.category || "management" }); setShowModal(true); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("color", formData.color);
    data.append("link", formData.link);
    data.append("category", formData.category);
    if (formData.image) data.append("image", formData.image);

    try {
      if (editingId) { await careerAPI.updateCareer(editingId, data, token); showToast("Updated!"); }
      else { await careerAPI.createCareer(data, token); showToast("Created!"); }
      setShowModal(false); fetchCareers();
    } catch (err) { alert(err.message); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try { await careerAPI.deleteCareer(id, localStorage.getItem("token")); showToast("Deleted!"); fetchCareers(); }
    catch (err) { alert(err.message); }
  };

  const weekdayLabels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const today = new Date();
  const cY = today.getFullYear(), cM = today.getMonth(), cD = today.getDate();
  const monthLabel = today.toLocaleString("en-US",{month:"long",year:"numeric"});
  const fi = new Date(cY,cM,1).getDay(), le = (fi+6)%7, dim = new Date(cY,cM+1,0).getDate();
  const calDays = [...Array.from({length:le},()=>null),...Array.from({length:dim},(_,i)=>i+1)];
  while(calDays.length%7!==0) calDays.push(null);

  return (
    <>
      <header className="topbar" id="top">
        <nav className="nav container">
          <a className="brand" href="/" onClick={goToHome}><img className="brand__logo--img" src={campusLogo} alt="CampusZone Logo"/></a>
          <button className="nav__toggle" ref={navToggleRef} onClick={()=>setIsNavOpen(p=>!p)}><span className="nav__toggleBars"></span></button>
          <div className={`nav__links ${isNavOpen?"is-open":""}`} ref={navLinksRef}>
            <a href="/" onClick={goToHome}>Home</a>
            <a href="/health" onClick={(e)=>{e.preventDefault();navigate("/health");setIsNavOpen(false);}}>Health</a>
            <a href="/events" onClick={goToEvents}>Events</a>
            <a href="/career" className="nav__link--career-active" onClick={(e)=>{e.preventDefault();navigate("/career");setIsNavOpen(false);}}>Career</a>
            <a href="#study" onClick={(e)=>{e.preventDefault();showToast("Study section coming soon");setIsNavOpen(false);}}>Study</a>
            <div className="nav__cta">
              <button className="header__notificationBtn" aria-label="Notifications">
                <svg className="header__notificationIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.02 2.91C8.71 2.91 6.02 5.6 6.02 8.91V11.8C6.02 12.41 5.76 13.34 5.45 13.86L4.3 15.77C3.59 16.95 4.08 18.26 5.38 18.7C9.69 20.14 14.34 20.14 18.65 18.7C19.86 18.3 20.39 16.87 19.73 15.77L18.58 13.86C18.28 13.34 18.02 12.41 18.02 11.8V8.91C18.02 5.61 15.32 2.91 12.02 2.91Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/><path d="M13.87 3.2C13.56 3.11 13.24 3.04 12.91 3C11.95 2.88 11.03 2.95 10.17 3.2C10.46 2.46 11.18 1.94 12.02 1.94C12.86 1.94 13.58 2.46 13.87 3.2Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.02 19.06C15.02 20.71 13.67 22.06 12.02 22.06C11.2 22.06 10.44 21.72 9.9 21.18C9.36 20.64 9.02 19.88 9.02 19.06" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"/></svg>
                <span className="header__notificationBadge">3</span>
              </button>
              {isLoggedIn ? (
                <div className="profile-dropdown" ref={profileDropdownRef}>
                  <button className="profile-icon-btn" onClick={()=>setIsProfileDropdownOpen(!isProfileDropdownOpen)}>👤</button>
                  {isProfileDropdownOpen && (
                    <div className="profile-dropdown-menu">
                      <button onClick={goToProfile} className="dropdown-item"><span className="dropdown-icon">👤</span> My Profile</button>
                      <button onClick={goToDashboard} className="dropdown-item"><span className="dropdown-icon">📊</span> Dashboard</button>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item logout"><span className="dropdown-icon">🚪</span> Log out</button>
                    </div>
                  )}
                </div>
              ) : (<><a className="btn btn--ghost" href="/login">Login</a><a className="btn btn--primary" href="/register">Register</a></>)}
            </div>
          </div>
        </nav>
      </header>

      <section className="hero hero--career">
        <div className="container hero__container">
          <div className="hero__content">
            <h1 className="hero__title">Internship Management</h1>
            <p className="hero__subtitle">Track your internship applications, manage deadlines, and monitor your progress</p>
          </div>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <div className="section__head">
            <span className="section__tag section__tag--career">Management</span>
            <h2 className="section__title">Application Tracker & Management</h2>
            <p className="section__desc">Stay organized and on top of all your internship applications</p>
          </div>

          {isAdmin && (
            <div className="career__admin-bar">
              <p style={{color:"#64748b",fontSize:"0.9rem"}}>Admin Mode — {careers.length} management items</p>
              <button className="career__addBtn" onClick={openAddModal}>+ Add Management Item</button>
            </div>
          )}

          {loading ? (
            <div className="career__loading">Loading management tools...</div>
          ) : (
            <div className="career__grid">
              {careers.map(c => (
                <article className="career__card" key={c._id}>
                  <div className="career__card-bar" style={{background: c.color || "#8b5cf6"}}></div>
                  {isAdmin && (
                    <div className="career__card-actions">
                      <button className="career__card-editBtn" onClick={()=>openEditModal(c)}>✏️ Edit</button>
                      <button className="career__card-deleteBtn" onClick={()=>handleDelete(c._id)}>🗑️ Delete</button>
                    </div>
                  )}
                  <div className="career__card-body">
                    <div className="career__card-icon">
                      {c.image ? (
                        <img src={`${SERVER_URL}${c.image}`} alt={c.title} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"12px"}} />
                      ) : (
                        "📋"
                      )}
                    </div>
                    <h3 className="career__card-title">{c.title}</h3>
                    <p className="career__card-desc">{c.description}</p>
                    <a className="career__card-link" href={c.link||"#"} onClick={e=>e.preventDefault()}>Explore Now <span>→</span></a>
                  </div>
                </article>
              ))}
              {careers.length === 0 && (
                <div className="career__empty">
                  <div className="career__empty-icon">📋</div>
                  <p className="career__empty-text">No management tools posted yet.{isAdmin ? " Click '+ Add Management Item' to add one." : ""}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="career__modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="career__modal" onClick={e=>e.stopPropagation()}>
            <h2 className="career__modal-title">{editingId?"Edit Management Item":"Add New Management Item"}</h2>
            <form className="career__form" onSubmit={handleSubmit}>
              <div className="career__form-group"><label>Title</label><input name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Application Deadline Tracker"/></div>
              <div className="career__form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" placeholder="Describe the management tool..."/></div>
              <div className="career__form-row">
                <div className="career__form-group"><label>Image (Upload)</label><input type="file" name="image" onChange={handleInputChange} accept="image/*"/></div>
                <div className="career__form-group"><label>Theme Color</label><input type="color" name="color" value={formData.color} onChange={handleInputChange} style={{height:42,cursor:"pointer"}}/></div>
              </div>
              <div className="career__form-actions">
                <button type="button" className="career__form-cancelBtn" onClick={()=>setShowModal(false)}>Cancel</button>
                <button type="submit" className="career__form-submitBtn">{editingId?"Update":"Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="container footer__panel">
          <div className="footer__support">
            <p className="footer__kicker">Need Career Help?</p><h3 className="footer__heading">Support</h3>
            <a className="footer__contact footer__contact--accent" href="https://support.sliit.lk">🌐 support.campuszone.lk</a>
            <a className="footer__contact" href="tel:+94117544801">📞 +94 11 754 0000</a>
            <a className="footer__feedback" href="https://support.sliit.lk">Provide Feedback to CampusZone</a>
          </div>
          <div className="footer__calendar">
            <h3 className="footer__calendarTitle">Calendar</h3>
            <div className="footer__calendarHead"><strong>{monthLabel}</strong></div>
            <div className="footer__weekdays">{weekdayLabels.map(d=><span key={d}>{d}</span>)}</div>
            <div className="footer__days">{calDays.map((day,i)=>!day?<span className="is-muted" key={`e-${i}`}></span>:<span key={`d-${day}`} className={day===cD?"is-active":""}>{day}</span>)}</div>
            <a className="footer__fullCalendar" href="/events" onClick={goToEvents}>Full calendar →</a>
          </div>
        </div>
        <div className="footer__bottom">
          <div className="container footer__inner">
            <div className="footer__brand"><div><div className="footer__name">CampusZone</div><div className="footer__small">Student Productivity Platform</div></div></div>
            <div className="footer__socials">
              <a href="/" onClick={goToHome}><img src={facebookIcon} alt="facebook" className="footer__socialIcon"/></a>
              <a href="/" onClick={goToHome}><img src={instagramIcon} alt="instagram" className="footer__socialIcon"/></a>
              <a href="/" onClick={goToHome}><img src={linkedinIcon} alt="linkedin" className="footer__socialIcon"/></a>
              <a href="/" onClick={goToHome}><img src={youtubeIcon} alt="youtube" className="footer__socialIcon"/></a>
            </div>
            <a className="toTop" href="#top" onClick={scrollToTop}>↑</a>
          </div>
        </div>
      </footer>
      <div className={`toast ${toastVisible?"is-visible":""}`} role="status">{toastText}</div>
    </>
  );
}

export default CareerManagement;
