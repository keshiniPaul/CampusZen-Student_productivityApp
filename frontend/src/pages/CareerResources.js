import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Career.css";
import "./Home.css";
import "./CareerResources.css";
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

function CareerResources() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [resources, setResources] = useState([]);
  const [savedResourceIds, setSavedResourceIds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' or 'saved'
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "", description: "", type: "Article", category: "Career Growth", tags: "", link: "", file: null, fileName: ""
  });
  
  // Recommended
  const [recommended, setRecommended] = useState([]);
  const [skills, setSkills] = useState([]); // user skills
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill("");
      showToast("Skill added!");
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(prev => prev.filter(s => s !== skill));
    showToast("Skill removed");
  };

  const profileDropdownRef = useRef(null);
  const toastTimerRef = useRef(null);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (user) {
      setIsAdmin(user.role === "admin");
      // If we had skills in user localstorage, we could set them here. We'll simulate fetching if not.
      if (user.skills) setSkills(user.skills);
    }
    fetchResources();
    if (token) {
      fetchSavedResources();
    }
    // eslint-disable-next-line
  }, [typeFilter, categoryFilter, searchTerm]); // re-fetch when filters change (we handled search frontend or backend depending on scale, we'll do backend)

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

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchDebounced) params.search = searchDebounced;
      if (typeFilter) params.type = typeFilter;
      if (categoryFilter) params.category = categoryFilter;
      
      const resData = await api.resourcesAPI.getAllResources(params);
      setResources(resData.data || []);
      
      if (isLoggedIn && user && user.id) {
        // Fetch recommendations
        const recParams = { recommend: true, userId: user.id };
        const recData = await api.resourcesAPI.getAllResources(recParams);
        setRecommended(recData.data.filter(r => r._score > 0) || []);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchSavedResources = async () => {
    try {
      const token = localStorage.getItem("token");
      const savedData = await api.resourcesAPI.getSavedResources(token);
      const saved = savedData.data || [];
      setSavedResourceIds(saved.map(r => r._id));
    } catch (err) { console.error(err); }
  };

  // Debounce search
  const [searchDebounced, setSearchDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchDebounced(searchTerm);
    }, 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const showToast = (msg) => { setToastText(msg); setToastVisible(true); if (toastTimerRef.current) clearTimeout(toastTimerRef.current); toastTimerRef.current = setTimeout(() => setToastVisible(false), 2200); };
  const scrollToTop = (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); setIsNavOpen(false); };
  const goToHome = (e) => { e.preventDefault(); navigate("/"); setIsNavOpen(false); };
  const goToEvents = (e) => { e.preventDefault(); navigate("/events"); setIsNavOpen(false); };
  const handleLogout = () => { localStorage.clear(); setIsLoggedIn(false); setIsProfileDropdownOpen(false); navigate("/"); };
  const goToDashboard = () => { navigate("/dashboard"); setIsProfileDropdownOpen(false); setIsNavOpen(false); };
  const goToProfile = () => { navigate("/profile"); setIsProfileDropdownOpen(false); setIsNavOpen(false); };

  // Handlers
  const handleToggleSave = async (id, e) => {
    e.stopPropagation();
    if (!isLoggedIn) return showToast("Please login to save resources");
    const token = localStorage.getItem("token");
    const isSaved = savedResourceIds.includes(id);
    try {
      if (isSaved) {
        await api.resourcesAPI.unsaveResource(id, token);
        setSavedResourceIds(prev => prev.filter(sId => sId !== id));
        showToast("Removed from saved tasks");
      } else {
        await api.resourcesAPI.saveResource(id, token);
        setSavedResourceIds(prev => [...prev, id]);
        showToast("Resource saved!");
      }
    } catch (err) { alert(err.message); }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
         alert("File is too large. Max 20MB.");
         return;
      }
      setFormData(prev => ({ ...prev, file: file, fileName: file.name }));
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", type: "Article", category: "Career Growth", tags: "", link: "", file: null, fileName: "" });
    setShowAddForm(!showAddForm);
  };
  
  const openEditModal = (r, e) => {
    e.stopPropagation();
    setEditingId(r._id);
    setFormData({ 
      title: r.title, description: r.description, type: r.type, category: r.category, 
      tags: r.tags ? r.tags.join(", ") : "", link: r.link || "", 
      file: null, fileName: r.fileName || ""
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    // Build FormData for multipart upload
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("type", formData.type);
    data.append("category", formData.category);
    data.append("tags", formData.tags);
    data.append("link", formData.link || "");
    if (formData.file) {
      data.append("file", formData.file);
    }

    try {
      if (editingId) {
        await api.resourcesAPI.updateResource(editingId, data, token);
        showToast("Resource updated!");
      } else {
        await api.resourcesAPI.createResource(data, token);
        showToast("Resource created!");
      }
      setShowModal(false);
      fetchResources();
    } catch (err) { alert(err.message); }
  };
  
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this resource?")) return;
    try {
      await api.resourcesAPI.deleteResource(id, localStorage.getItem("token"));
      showToast("Deleted!");
      fetchResources();
    } catch (err) { alert(err.message); }
  };

  const [detailModal, setDetailModal] = useState(null);

  const getTypeStyle = (type) => {
    switch(type) {
      case "CV Template": return "res-type-cv";
      case "Interview Guide": return "res-type-guide";
      case "Course": return "res-type-course";
      case "Article": return "res-type-article";
      default: return "res-type-article";
    }
  };

  const displayResources = activeTab === "saved" 
    ? resources.filter(r => savedResourceIds.includes(r._id))
    : resources;

  return (
    <div className="career-res">
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
            <h1 className="hero__title">Career Resources</h1>
            <p className="hero__subtitle">Access CV templates, interview guides, skill assessments, and career planning tools</p>
          </div>
        </div>
      </section>

      <main className="section">
        <div className="container">
          {/* Controls */}
          <div className="res-controls">
            <div className="res-search">
              <input type="text" placeholder="Search resources by title or skills..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
            </div>
            <div className="res-filters">
              <select className="res-select" value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
                <option value="">All Types</option>
                <option value="CV Template">CV Templates</option>
                <option value="Interview Guide">Interview Guides</option>
                <option value="Course">Courses</option>
                <option value="Article">Articles</option>
              </select>
              <select className="res-select" value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}>
                <option value="">All Categories</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Career Growth">Career Growth</option>
              </select>
            </div>
          </div>

          {/* Admin Header & Inline Form */}
          {isAdmin && (
            <div className="res-admin-section">
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem"}}>
                <h2 style={{margin:0, fontSize:"1.5rem", color:"var(--res-text)"}}>Resource Management</h2>
                <button className={`res-btn ${showAddForm ? 'res-btn-outline' : ''}`} onClick={openAddModal}>
                  {showAddForm ? "✕ Close Form" : "+ Create New Post"}
                </button>
              </div>

              {showAddForm && (
                <div className="res-inline-form" style={{background:"#f8fafc", padding:"2rem", borderRadius:"16px", marginBottom:"2rem", border:"1px solid var(--res-border)"}}>
                  <form onSubmit={handleSubmit} id="res-inline-form">
                    <div className="res-form-row">
                      <div className="res-form-group">
                        <label>Title</label>
                        <input className="res-form-control" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Enter resource title..." />
                      </div>
                      <div className="res-form-group">
                        <label>Post Type</label>
                        <select className="res-form-control" name="type" value={formData.type} onChange={handleInputChange}>
                          <option value="CV Template">CV Template</option>
                          <option value="Interview Guide">Interview Guide</option>
                          <option value="Course">Course</option>
                          <option value="Article">Article</option>
                        </select>
                      </div>
                    </div>
                    <div className="res-form-group">
                      <label>Description</label>
                      <textarea className="res-form-control" name="description" value={formData.description} onChange={handleInputChange} required placeholder="Describe what this resource offers..." />
                    </div>
                    <div className="res-form-row">
                      <div className="res-form-group">
                        <label>Category</label>
                        <select className="res-form-control" name="category" value={formData.category} onChange={handleInputChange}>
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                          <option value="Soft Skills">Soft Skills</option>
                          <option value="Career Growth">Career Growth</option>
                        </select>
                      </div>
                      <div className="res-form-group">
                        <label>Tags (Comma separated)</label>
                        <input className="res-form-control" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="React, Node.js, Interview" />
                      </div>
                    </div>
                    <div className="res-form-row">
                      <div className="res-form-group">
                        <label>External Link (Optional)</label>
                        <input className="res-form-control" name="link" value={formData.link} onChange={handleInputChange} placeholder="https://..." />
                      </div>
                      <div className="res-form-group">
                        <label>Upload File (PDF/Docs)</label>
                        <input type="file" className="res-form-control" onChange={handleFileChange} />
                        {formData.fileName && <div style={{fontSize:"0.8rem", color:"var(--res-primary)", marginTop:"0.25rem"}}>Selected: {formData.fileName}</div>}
                      </div>
                    </div>
                    <div style={{display:"flex", justifyContent:"flex-end", gap:"1rem", marginTop:"1rem"}}>
                      <button type="button" className="res-btn res-btn-outline" onClick={()=>setShowAddForm(false)}>Cancel</button>
                      <button type="submit" form="res-inline-form" className="res-btn">Publish Resource</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}



          {/* Recommended Strip */}
          {isLoggedIn && recommended.length > 0 && activeTab === "all" && searchDebounced === "" && !typeFilter && !categoryFilter && (
            <div className="res-recommended">
              <div className="res-recommended-header">
                <span style={{fontSize:"1.5rem"}}>✨</span>
                <h3 className="res-recommended-title">Recommended for your skills</h3>
              </div>
              <div className="res-strip">
                {recommended.map(r => (
                  <div className="res-card" key={`rec-${r._id}`} onClick={()=>setDetailModal(r)} style={{cursor:"pointer"}}>
                    <div className="res-card-header">
                      <span className={`res-type-badge ${getTypeStyle(r.type)}`}>{r.type}</span>
                    </div>
                    <h3 className="res-card-title">{r.title}</h3>
                    <p className="res-card-desc">{r.description}</p>
                    <div className="res-card-tags">
                      {r.tags.slice(0,3).map(t => <span className="res-tag" key={t}>{t}</span>)}
                      {r.tags.length > 3 && <span className="res-tag">+{r.tags.length - 3}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          {isLoggedIn && (
            <div className="res-tabs">
              <button className={`res-tab ${activeTab==='all'?'active':''}`} onClick={()=>setActiveTab('all')}>All Resources</button>
              <button className={`res-tab ${activeTab==='saved'?'active':''}`} onClick={()=>setActiveTab('saved')}>My Saved ({savedResourceIds.length})</button>
            </div>
          )}

          {/* Data List (Table for Admin, Cards for Students) */}
          {loading ? (
             <div className="res-empty">Loading resources...</div>
          ) : displayResources.length === 0 ? (
             <div className="res-empty">
                <div className="res-empty-icon">📚</div>
                <p>No resources found matching your criteria.</p>
             </div>
          ) : isAdmin ? (
            <div className="res-table-container">
              <table className="res-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Tags</th>
                    <th>Created At</th>
                    <th style={{textAlign:"right"}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayResources.map((r) => (
                    <tr key={r._id}>
                      <td>
                        <div style={{fontWeight:600, color:"var(--res-text)"}}>{r.title}</div>
                        <div style={{fontSize:"0.8rem", color:"var(--res-muted)"}}>📁 {r.category}</div>
                      </td>
                      <td><span className={`res-type-badge ${getTypeStyle(r.type)}`}>{r.type}</span></td>
                      <td>
                        <div style={{display:"flex", gap:"0.25rem", flexWrap:"wrap"}}>
                          {r.tags.map(t => <span key={t} className="res-tag" style={{fontSize:"0.7rem"}}>{t}</span>)}
                        </div>
                      </td>
                      <td style={{fontSize:"0.85rem", color:"var(--res-muted)"}}>
                        {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td style={{textAlign:"right"}}>
                        <div style={{display:"flex", justifyContent:"flex-end", gap:"0.5rem"}}>
                          <button className="res-admin-btn btn-edit" title="Edit" onClick={(e)=>openEditModal(r, e)}>✏️ Edit</button>
                          <button className="res-admin-btn btn-delete" title="Delete" onClick={(e)=>handleDelete(r._id, e)}>🗑️ Delete</button>
                          <button className="res-admin-btn" title="View" onClick={() => setDetailModal(r)}>👁️ View</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="res-grid">
              {displayResources.map(r => (
                <div className="res-card" key={r._id} onClick={()=>setDetailModal(r)} style={{cursor:"pointer"}}>
                  
                  <div className="res-card-header">
                    <span className={`res-type-badge ${getTypeStyle(r.type)}`}>{r.type}</span>
                    <button 
                      className={`res-save-btn ${savedResourceIds.includes(r._id) ? 'saved' : ''}`}
                      onClick={(e) => handleToggleSave(r._id, e)}
                      title={savedResourceIds.includes(r._id) ? "Unsave" : "Save"}
                    >
                      {savedResourceIds.includes(r._id) ? "★" : "☆"}
                    </button>
                  </div>
                  <h3 className="res-card-title">{r.title}</h3>
                  <p className="res-card-desc">{r.description}</p>
                  
                  <div className="res-card-tags">
                    {r.tags.slice(0, 3).map(t => <span className="res-tag" key={t}>{t}</span>)}
                    {r.tags.length > 3 && <span className="res-tag">+{r.tags.length - 3}</span>}
                  </div>

                  <div className="res-card-footer">
                    <span className="res-card-cat">📁 {r.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Admin Add/Edit Modal */}
      {showModal && (
        <div className="res-modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="res-modal" onClick={e=>e.stopPropagation()}>
            <div className="res-modal-header">
              <h2 className="res-modal-title">{editingId ? "Edit Resource" : "Create Resource"}</h2>
              <button className="res-modal-close" onClick={()=>setShowModal(false)}>&times;</button>
            </div>
            <div className="res-modal-body">
              <form id="res-form" onSubmit={handleSubmit}>
                <div className="res-form-group">
                  <label>Title</label>
                  <input className="res-form-control" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="res-form-group">
                  <label>Description</label>
                  <textarea className="res-form-control" name="description" value={formData.description} onChange={handleInputChange} required />
                </div>
                
                <div className="res-form-row">
                  <div className="res-form-group">
                    <label>Type</label>
                    <select className="res-form-control" name="type" value={formData.type} onChange={handleInputChange} required>
                      <option value="CV Template">CV Template</option>
                      <option value="Interview Guide">Interview Guide</option>
                      <option value="Course">Course</option>
                      <option value="Article">Article</option>
                    </select>
                  </div>
                  <div className="res-form-group">
                    <label>Category</label>
                    <select className="res-form-control" name="category" value={formData.category} onChange={handleInputChange} required>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Soft Skills">Soft Skills</option>
                      <option value="Career Growth">Career Growth</option>
                    </select>
                  </div>
                </div>

                <div className="res-form-group">
                  <label>Tags (comma separated)</label>
                  <input className="res-form-control" name="tags" placeholder="React, Java, Resume" value={formData.tags} onChange={handleInputChange} />
                </div>

                <div className="res-form-group">
                  <label>External Link (Optional)</label>
                  <input className="res-form-control" type="url" name="link" placeholder="https://" value={formData.link} onChange={handleInputChange} />
                </div>

                <div className="res-form-group">
                  <label>File Upload (Optional Base-64)</label>
                  <div className="res-file-drop" onClick={() => document.getElementById("file-input").click()}>
                    <p style={{margin:0}}>Click to select a file (PDF, Docx etc)</p>
                    <input type="file" id="file-input" style={{display:"none"}} onChange={handleFileChange} />
                    {formData.fileName && <p style={{margin:"0.5rem 0 0", color:"var(--res-primary)", fontWeight:600}}>{formData.fileName}</p>}
                  </div>
                </div>

              </form>
            </div>
            <div className="res-modal-footer">
              <button className="res-btn res-btn-outline" onClick={()=>setShowModal(false)}>Cancel</button>
              <button type="submit" form="res-form" className="res-btn">{editingId ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {detailModal && (
        <div className="res-modal-overlay" onClick={()=>setDetailModal(null)}>
          <div className="res-modal" onClick={e=>e.stopPropagation()}>
            <div className="res-modal-header">
              <h2 className="res-modal-title">{detailModal.title}</h2>
              <button className="res-modal-close" onClick={()=>setDetailModal(null)}>&times;</button>
            </div>
            <div className="res-modal-body">
              <div style={{display:"flex", gap:"1rem", marginBottom:"1rem"}}>
                <span className={`res-type-badge ${getTypeStyle(detailModal.type)}`}>{detailModal.type}</span>
                <span className="res-card-cat">📁 {detailModal.category}</span>
              </div>
              <p style={{fontSize:"1rem", lineHeight:"1.6", color:"var(--res-text)", marginBottom:"1.5rem"}}>{detailModal.description}</p>
              
              {detailModal.tags && detailModal.tags.length > 0 && (
                <div className="res-card-tags">
                  {detailModal.tags.map(t => <span className="res-tag" key={t}>{t}</span>)}
                </div>
              )}
            </div>
            <div className="res-modal-footer" style={{justifyContent:"space-between"}}>
              <button 
                className={`res-btn ${savedResourceIds.includes(detailModal._id) ? "res-btn-outline" : ""}`}
                style={{display:"flex", alignItems:"center", gap:"0.5rem"}}
                onClick={(e) => handleToggleSave(detailModal._id, e)}
              >
                {savedResourceIds.includes(detailModal._id) ? "★ Saved" : "☆ Save Resource"}
              </button>

              <div style={{display:"flex", gap:"1rem"}}>
                {detailModal.link && <a href={detailModal.link} target="_blank" rel="noreferrer" className="res-btn res-btn-outline">Open Link ↗</a>}
                {detailModal.fileUrl && (
                  <a href={`${SERVER_URL}${detailModal.fileUrl}`} target="_blank" rel="noreferrer" className="res-btn">View / Download File ⬇</a>
                )}
              </div>
            </div>
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
        </div>
        <div className="footer__bottom">
          <div className="container footer__inner">
            <div className="footer__brand"><div><div className="footer__name">CampusZone</div><div className="footer__small">Student Productivity Platform</div></div></div>
            <div className="footer__socials">
              <a href="/" onClick={goToHome}><img src={facebookIcon} alt="facebook" className="footer__socialIcon"/></a>
              <a href="/" onClick={goToHome}><img src={instagramIcon} alt="instagram" className="footer__socialIcon"/></a>
            </div>
          </div>
        </div>
      </footer>
      <div className={`toast ${toastVisible?"is-visible":""}`} role="status">{toastText}</div>
    </div>
  );
}

export default CareerResources;
