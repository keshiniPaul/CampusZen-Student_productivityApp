import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resourcesAPI, studyGroupsAPI } from "../services/api";
import "./Resources.css";
import "./Home.css";
import campusLogo from "../images/campus_logo.png";
import profileImg from "../images/profile.png";

const RESOURCE_TYPES = ["pdf", "notes", "slides", "video", "link"];
const MAX_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = [
  "pdf", "doc", "docx", "ppt", "pptx", "txt", "png", "jpg", "jpeg", "mp4", "webm",
];

const TYPE_ICONS = {
  pdf:    { icon: "📄", label: "PDF",    color: "#e74c3c" },
  notes:  { icon: "📝", label: "Notes",  color: "#3b82f6" },
  slides: { icon: "📊", label: "Slides", color: "#f59e0b" },
  video:  { icon: "🎬", label: "Video",  color: "#8b5cf6" },
  link:   { icon: "🔗", label: "Link",   color: "#10b981" },
};

function Resources() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModule, setFilterModule] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [myGroups, setMyGroups] = useState([]);
  const [uploadForm, setUploadForm] = useState({
    title: "", module: "", type: "pdf", description: "", groupId: "", fileUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState({});
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const profileRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.title = "Resources - CampusZen";
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => { fetchResources(); }, [filterType]); // eslint-disable-line

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterType) params.type = filterType;
      if (filterModule) params.module = filterModule;
      if (searchQuery) params.search = searchQuery;
      const res = await resourcesAPI.getAll(params);
      if (res.success) {
        let data = res.data;
        if (sortBy === "downloads") data = [...data].sort((a, b) => b.downloadCount - a.downloadCount);
        setResources(data);
      }
    } catch (err) {
      setError("Failed to load resources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyGroups = async () => {
    try {
      const res = await studyGroupsAPI.getAllGroups({ type: "all" });
      if (res.success) setMyGroups(res.data);
    } catch (_) {}
  };

  const handleOpenUpload = () => {
    if (!isLoggedIn) { showToast("Please log in to upload resources."); return; }
    fetchMyGroups();
    setUploadErrors({});
    setShowUploadModal(true);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") { setIsNavOpen(false); setIsProfileOpen(false); setShowUploadModal(false); }
    };
    const onDocumentClick = (e) => {
      const t = e.target;
      if (!t || !navLinksRef.current || !navToggleRef.current) return;
      if (!navLinksRef.current.contains(t) && !navToggleRef.current.contains(t)) setIsNavOpen(false);
      if (profileRef.current && !profileRef.current.contains(t)) setIsProfileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onDocumentClick);
    return () => { document.removeEventListener("keydown", onKeyDown); document.removeEventListener("click", onDocumentClick); };
  }, []);

  const showToast = (msg) => {
    setToastText(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUploadForm((p) => ({ ...p, [name]: value }));
    setUploadErrors((p) => ({ ...p, [name]: undefined }));

    if (name === "type") {
      if (value === "link") {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setUploadErrors((p) => ({ ...p, file: undefined }));
      } else {
        setUploadErrors((p) => ({ ...p, fileUrl: undefined }));
      }
    }
  };

  const getFileExtension = (name = "") => name.split(".").pop()?.toLowerCase() || "";

  const validateSelectedFile = (file) => {
    if (!file) return "Please select a file.";

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return "File size must be 50 MB or less.";
    }

    const ext = getFileExtension(file.name);
    if (!ALLOWED_FILE_EXTENSIONS.includes(ext)) {
      return "Unsupported file format.";
    }

    return "";
  };

  const isValidHttpUrl = (value) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const validateUploadForm = () => {
    const errors = {};
    const title = uploadForm.title.trim();
    const module = uploadForm.module.trim();
    const description = uploadForm.description.trim();
    const fileUrl = uploadForm.fileUrl.trim();

    if (!title) errors.title = "Title is required.";
    else if (title.length < 3) errors.title = "Title must be at least 3 characters.";

    if (!module) errors.module = "Module / Subject is required.";
    else if (module.length < 2) errors.module = "Module / Subject must be at least 2 characters.";

    if (!RESOURCE_TYPES.includes(uploadForm.type)) {
      errors.type = "Please choose a valid resource type.";
    }

    if (description.length > 500) {
      errors.description = "Description cannot exceed 500 characters.";
    }

    if (uploadForm.type === "link") {
      if (!fileUrl) errors.fileUrl = "URL is required for link resources.";
      else if (!isValidHttpUrl(fileUrl)) errors.fileUrl = "Enter a valid URL starting with http:// or https://.";
    } else {
      const fileError = validateSelectedFile(selectedFile);
      if (fileError) errors.file = fileError;
    }

    return errors;
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const fileError = validateSelectedFile(file);
    setSelectedFile(file);
    setUploadErrors((p) => ({ ...p, file: fileError || undefined }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileError = validateSelectedFile(file);
    setSelectedFile(file);
    setUploadErrors((p) => ({ ...p, file: fileError || undefined }));
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploadErrors({});
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateUploadForm();
    if (Object.keys(validationErrors).length > 0) {
      setUploadErrors(validationErrors);
      showToast("Please fix the highlighted fields.");
      return;
    }

    const token = localStorage.getItem("token");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("title", uploadForm.title.trim());
      formData.append("module", uploadForm.module.trim());
      formData.append("type", uploadForm.type);
      if (uploadForm.description.trim()) formData.append("description", uploadForm.description.trim());
      if (uploadForm.groupId) formData.append("groupId", uploadForm.groupId);
      if (uploadForm.type === "link") {
        formData.append("fileUrl", uploadForm.fileUrl.trim());
      } else if (selectedFile) {
        formData.append("file", selectedFile);
      }
      const res = await resourcesAPI.upload(formData, token);
      if (res.success) {
        showToast("Resource uploaded successfully!");
        closeUploadModal();
        setUploadForm({ title: "", module: "", type: "pdf", description: "", groupId: "", fileUrl: "" });
        setSelectedFile(null);
        fetchResources();
      }
    } catch (err) {
      showToast(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (resource) => {
    await resourcesAPI.incrementDownload(resource._id).catch(() => {});
    if (resource.type === "link") {
      window.open(resource.fileUrl, "_blank");
    } else {
      const a = document.createElement("a");
      a.href = `http://localhost:5000${resource.fileUrl}`;
      a.download = resource.title;
      a.click();
    }
    setResources((prev) =>
      prev.map((r) => r._id === resource._id ? { ...r, downloadCount: r.downloadCount + 1 } : r)
    );
  };

  const handleDelete = async (resourceId) => {
    const token = localStorage.getItem("token");
    try {
      await resourcesAPI.delete(resourceId, token);
      showToast("Resource deleted.");
      setResources((prev) => prev.filter((r) => r._id !== resourceId));
    } catch (err) {
      showToast(err.message || "Delete failed.");
    }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchResources(); };

  const scrollToTop = (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); setIsNavOpen(false); };
  const goHome = (e) => { e.preventDefault(); navigate("/"); setIsNavOpen(false); };

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
                  <span className="header__profileArrow" aria-hidden="true">▼</span>
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

      <main className="resources">
        <div className="resources__header container">
          <div className="resources__headerContent">
            <h1 className="resources__title">Study Resources</h1>
            <p className="resources__subtitle">
              Browse, download, and share study materials — PDFs, notes, slides, videos, and links.
            </p>
          </div>
          <button className="resources__uploadBtn" onClick={handleOpenUpload}>
            + Upload Resource
          </button>
        </div>

        {/* Filter bar */}
        <div className="resources__filterBar container">
          <form className="resources__searchForm" onSubmit={handleSearch}>
            <input className="resources__searchInput" type="text" placeholder="Search title or module..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button className="resources__searchBtn" type="submit">Search</button>
          </form>

          <div className="resources__filterTabs">
            <button className={`resources__tab ${filterType === "" ? "resources__tab--active" : ""}`}
              onClick={() => setFilterType("")}>All</button>
            {RESOURCE_TYPES.map((t) => (
              <button key={t}
                className={`resources__tab ${filterType === t ? "resources__tab--active" : ""}`}
                onClick={() => setFilterType(t)}>
                {TYPE_ICONS[t].icon} {TYPE_ICONS[t].label}
              </button>
            ))}
          </div>

          <div className="resources__filterRight">
            <input className="resources__moduleInput" type="text" placeholder="Filter by module..."
              value={filterModule} onChange={(e) => setFilterModule(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchResources()} />
            <select className="resources__sortSelect" value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); fetchResources(); }}>
              <option value="newest">Newest First</option>
              <option value="downloads">Most Downloaded</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="resources__alert container">
            <div className="alert alert--warning"><span className="alert__icon">⚠️</span><span>{error}</span></div>
          </div>
        )}

        {loading ? (
          <div className="resources__loading container">
            <div className="loading__spinner"></div>
            <p className="loading__text">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="resources__empty container">
            <div className="resources__emptyIcon">📚</div>
            <h3 className="resources__emptyTitle">No resources found</h3>
            <p className="resources__emptyText">Be the first to share a study material!</p>
            <button className="resources__uploadBtn" onClick={handleOpenUpload}>+ Upload Resource</button>
          </div>
        ) : (
          <div className="resources__grid container">
            {resources.map((resource) => {
              const meta = TYPE_ICONS[resource.type] || TYPE_ICONS.pdf;
              const uploaderName = resource.uploadedBy?.fullName || "Anonymous";
              const uploadDate = new Date(resource.createdAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              });
              return (
                <article key={resource._id} className="resources__card">
                  <div className="resources__cardIcon" style={{ backgroundColor: meta.color + "18", color: meta.color }}>
                    <span className="resources__typeEmoji">{meta.icon}</span>
                  </div>
                  <div className="resources__cardBody">
                    <div className="resources__cardTop">
                      <span className="resources__typeBadge" style={{ backgroundColor: meta.color + "18", color: meta.color }}>
                        {meta.label}
                      </span>
                      <span className="resources__moduleBadge">{resource.module}</span>
                    </div>
                    <h2 className="resources__cardTitle">{resource.title}</h2>
                    {resource.description && (
                      <p className="resources__cardDesc">{resource.description}</p>
                    )}
                    <div className="resources__cardMeta">
                      <span>👤 {uploaderName}</span>
                      <span>📅 {uploadDate}</span>
                      <span>⬇️ {resource.downloadCount}</span>
                    </div>
                    {resource.groupId && (
                      <span className="resources__groupTag">
                        👥 {resource.groupId.name}
                      </span>
                    )}
                  </div>
                  <div className="resources__cardActions">
                    <button className="resources__downloadBtn" onClick={() => handleDownload(resource)}>
                      {resource.type === "link" ? "Open Link" : "Download"}
                    </button>
                    {isLoggedIn && (
                      <button className="resources__deleteBtn" onClick={() => handleDelete(resource._id)}
                        aria-label="Delete resource">🗑</button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal__overlay" onClick={closeUploadModal}>
          <div className="modal__content resources__modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header resources__modalHeader">
              <h2 className="modal__title">Upload Resource</h2>
              <button className="modal__close" onClick={closeUploadModal}>×</button>
            </div>

            <form className="resources__form" onSubmit={handleUploadSubmit}>
              <div className="resources__formRow">
                <div className="resources__formGroup">
                  <label className="resources__label">Title *</label>
                  <input className={`resources__input ${uploadErrors.title ? "resources__input--invalid" : ""}`.trim()} type="text" name="title"
                    value={uploadForm.title} onChange={handleFormChange}
                    placeholder="e.g. Chapter 3 Notes" required aria-invalid={!!uploadErrors.title} />
                  {uploadErrors.title && <p className="resources__errorText">{uploadErrors.title}</p>}
                </div>
                <div className="resources__formGroup">
                  <label className="resources__label">Module / Subject *</label>
                  <input className={`resources__input ${uploadErrors.module ? "resources__input--invalid" : ""}`.trim()} type="text" name="module"
                    value={uploadForm.module} onChange={handleFormChange}
                    placeholder="e.g. CS3043" required aria-invalid={!!uploadErrors.module} />
                  {uploadErrors.module && <p className="resources__errorText">{uploadErrors.module}</p>}
                </div>
              </div>

              <div className="resources__formRow">
                <div className="resources__formGroup">
                  <label className="resources__label">Resource Type *</label>
                  <select className={`resources__input resources__select ${uploadErrors.type ? "resources__input--invalid" : ""}`.trim()} name="type"
                    value={uploadForm.type} onChange={handleFormChange} required>
                    {RESOURCE_TYPES.map((t) => (
                      <option key={t} value={t}>{TYPE_ICONS[t].icon} {TYPE_ICONS[t].label}</option>
                    ))}
                  </select>
                  {uploadErrors.type && <p className="resources__errorText">{uploadErrors.type}</p>}
                </div>
                <div className="resources__formGroup">
                  <label className="resources__label">Share to Group (optional)</label>
                  <select className="resources__input resources__select" name="groupId"
                    value={uploadForm.groupId} onChange={handleFormChange}>
                    <option value="">No group — public</option>
                    {myGroups.map((g) => (
                      <option key={g._id} value={g._id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {uploadForm.type === "link" ? (
                <div className="resources__formGroup">
                  <label className="resources__label">URL *</label>
                  <input className={`resources__input ${uploadErrors.fileUrl ? "resources__input--invalid" : ""}`.trim()} type="url" name="fileUrl"
                    value={uploadForm.fileUrl} onChange={handleFormChange}
                    placeholder="https://..." required aria-invalid={!!uploadErrors.fileUrl} />
                  {uploadErrors.fileUrl && <p className="resources__errorText">{uploadErrors.fileUrl}</p>}
                </div>
              ) : (
                <div className="resources__formGroup">
                  <label className="resources__label">File *</label>
                  <div
                    className={`resources__dropZone ${isDragging ? "resources__dropZone--active" : ""} ${selectedFile ? "resources__dropZone--hasFile" : ""} ${uploadErrors.file ? "resources__dropZone--invalid" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input ref={fileInputRef} type="file" style={{ display: "none" }}
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.mp4,.webm" />
                    {selectedFile ? (
                      <div className="resources__fileSelected">
                        <span className="resources__fileIcon">📎</span>
                        <span className="resources__fileName">{selectedFile.name}</span>
                        <span className="resources__fileSize">
                          ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    ) : (
                      <div className="resources__dropPrompt">
                        <span className="resources__dropIcon">☁️</span>
                        <p className="resources__dropText">Drag & drop a file here, or <strong>click to browse</strong></p>
                        <p className="resources__dropHint">PDF, Word, PowerPoint, images, video — max 50 MB</p>
                      </div>
                    )}
                  </div>
                  {uploadErrors.file && <p className="resources__errorText">{uploadErrors.file}</p>}
                </div>
              )}

              <div className="resources__formGroup">
                <label className="resources__label">Description (optional)</label>
                <textarea className={`resources__input resources__textarea ${uploadErrors.description ? "resources__input--invalid" : ""}`.trim()} name="description"
                  value={uploadForm.description} onChange={handleFormChange}
                  placeholder="Brief description of this resource..." rows={3} />
                {uploadErrors.description && <p className="resources__errorText">{uploadErrors.description}</p>}
              </div>

              <div className="resources__formActions">
                <button type="button" className="resources__btn resources__btn--secondary"
                  onClick={closeUploadModal}>Cancel</button>
                <button type="submit" className="resources__btn resources__btn--primary" disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastVisible && (
        <div className="resources__toast"><p>{toastText}</p></div>
      )}

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

export default Resources;
