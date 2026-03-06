import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./DailyHealth.css";
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";

function DailyHealth() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    sleepHours: "",
    exerciseMinutes: "",
    mood: "",
    stress: "",
    notes: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [editingEntry, setEditingEntry] = useState(null);
  const [entries, setEntries] = useState([]);
  const [userStats, setUserStats] = useState({
    weeklyCompletion: 0,
    streak: 0,
    rank: 'New'
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const totalSteps = 4;
  
  const profileDropdownRef = useRef(null);
  const toastTimerRef = useRef(null);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const today = new Date().toLocaleDateString("en-US", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // ⭐ Step 1 — Add This Mapping (Very Important)
  const sleepNumberMap = {
    "less-than-5": 4,
    "5-6": 5.5,
    "6-7": 6.5,
    "7-8": 7.5,
    "more-than-8": 9
  };

  const exerciseNumberMap = {
    "none": 0,
    "1-30": 20,
    "31-60": 45,
    "61-90": 75,
    "more-than-90": 120
  };

  // Check login status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) {
      fetchEntries();
      fetchUserStats();
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation menu behavior
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsNavOpen(false);
    };

    const onDocumentClick = (event) => {
      const target = event.target;
      if (!target || !navLinksRef.current || !navToggleRef.current) return;

      const clickedInsideNav =
        navLinksRef.current.contains(target) || navToggleRef.current.contains(target);

      if (!clickedInsideNav) setIsNavOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onDocumentClick);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocumentClick);
    };
  }, []);

  // Toast cleanup
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (message, type = "success") => {
    setToastText(message);
    setToastVisible(true);

    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  // API Functions
  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/health/entries`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setEntries(data.data);
      } else {
        showToast(data.message || 'Failed to fetch entries', 'error');
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
      showToast('Error connecting to server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/health/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setUserStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const createEntry = async (entryData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/health/entries`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entryData)
      });

      const data = await response.json();
      
      if (response.ok) {
        showToast('Health entry saved successfully! 🎉');
        fetchEntries();
        fetchUserStats();
        resetForm();
      } else {
        showToast(data.message || 'Failed to save entry', 'error');
      }
    } catch (error) {
      console.error('Error creating entry:', error);
      showToast('Error connecting to server', 'error');
    }
  };

  const updateEntry = async (id, entryData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/health/entries/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entryData)
      });

      const data = await response.json();
      
      if (response.ok) {
        showToast('Health entry updated successfully! ✏️');
        fetchEntries();
        fetchUserStats();
        resetForm();
      } else {
        showToast(data.message || 'Failed to update entry', 'error');
      }
    } catch (error) {
      console.error('Error updating entry:', error);
      showToast('Error connecting to server', 'error');
    }
  };

  // Fixed deleteEntry function
  const deleteEntry = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/health/entries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete entry');
      }

      showToast('Entry deleted successfully');
      fetchEntries();
      fetchUserStats();
      setShowDeleteModal(false);
      setEntryToDelete(null);
    } catch (error) {
      console.error('Error deleting entry:', error);
      showToast(error.message || 'Error connecting to server', 'error');
    }
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsNavOpen(false);
  };

  const goToHome = (e) => {
    e.preventDefault();
    navigate("/");
    setIsNavOpen(false);
  };

  const goToEventsDashboard = (e) => {
    e.preventDefault();
    navigate("/events");
    setIsNavOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsProfileDropdownOpen(false);
    navigate("/");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
    setIsProfileDropdownOpen(false);
    setIsNavOpen(false);
  };

  const goToProfile = () => {
    navigate("/profile");
    setIsProfileDropdownOpen(false);
    setIsNavOpen(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      sleepHours: entry.sleepHours,
      exerciseMinutes: entry.exerciseMinutes,
      mood: entry.mood,
      stress: entry.stress,
      notes: entry.notes || ""
    });
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Editing entry from " + new Date(entry.date).toLocaleDateString(), "info");
  };

  // Fixed handleDeleteClick function
  const handleDeleteClick = (entry) => {
    setEntryToDelete(entry);
    setShowDeleteModal(true);
  };

  // Fixed confirmDelete function
  const confirmDelete = () => {
    if (entryToDelete) {
      // Use the correct ID field - check both _id and id
      const entryId = entryToDelete._id || entryToDelete.id;
      deleteEntry(entryId);
    }
  };

  const resetForm = () => {
    setFormData({
      sleepHours: "",
      exerciseMinutes: "",
      mood: "",
      stress: "",
      notes: ""
    });
    setEditingEntry(null);
    setCurrentStep(1);
  };

  // ⭐ Step 2 — Replace handleSubmit Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = ["sleepHours", "exerciseMinutes", "mood", "stress"];

    for (const field of requiredFields) {
      if (!formData[field]) {
        showToast("Please complete all sections before saving", "error");
        setIsSubmitting(false);
        return;
      }
    }

    const entryData = {
      mood: formData.mood,
      stress: formData.stress,
      notes: formData.notes || "",
      date: new Date().toISOString(),

      // ⭐ Convert MCQ string → number
      sleepHours: sleepNumberMap[formData.sleepHours] || 0,
      exerciseMinutes: exerciseNumberMap[formData.exerciseMinutes] || 0
    };

    try {
      if (editingEntry) {
        await updateEntry(editingEntry._id || editingEntry.id, entryData);
      } else {
        await createEntry(entryData);
      }
    } catch (error) {
      console.error(error);
      showToast("Submission failed", "error");
    }

    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const cancelEdit = () => {
    resetForm();
    showToast("Edit cancelled", "info");
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      'very-low': '😞',
      'low': '🙂',
      'neutral': '😐',
      'good': '😃',
      'very-happy': '🤩'
    };
    return moodMap[mood] || '😐';
  };

  const getStressEmoji = (stress) => {
    const stressMap = {
      'very-low': '😌',
      'low': '🙂',
      'moderate': '😐',
      'high': '😰',
      'very-high': '😫'
    };
    return stressMap[stress] || '😐';
  };

  const getSleepLabel = (sleepValue) => {
    const sleepMap = {
      'less-than-5': '😴 <5h',
      '5-6': '🌤️ 5-6h',
      '6-7': '🌥️ 6-7h',
      '7-8': '😊 7-8h',
      'more-than-8': '🌟 >8h'
    };
    return sleepMap[sleepValue] || sleepValue;
  };

  const getExerciseLabel = (exerciseValue) => {
    const exerciseMap = {
      'none': '🚫 None',
      '1-30': '🚶 1-30m',
      '31-60': '🏃 31-60m',
      '61-90': '🔥 61-90m',
      'more-than-90': '⚡ >90m'
    };
    return exerciseMap[exerciseValue] || exerciseValue;
  };

  /* ================= MCQ DATA ================= */
  const sleepOptions = [
    { value: "less-than-5", label: "😴 Less than 5 hours", description: "Very poor sleep", icon: "🌙" },
    { value: "5-6", label: "🌤️ 5 – 6 hours", description: "Below recommended", icon: "⏰" },
    { value: "6-7", label: "🌥️ 6 – 7 hours", description: "Minimum recommended", icon: "😐" },
    { value: "7-8", label: "😊 7 – 8 hours", description: "Optimal range", icon: "💪" },
    { value: "more-than-8", label: "🌟 More than 8 hours", description: "Excellent rest", icon: "✨" }
  ];

  const exerciseOptions = [
    { value: "none", label: "🚫 None", description: "No exercise today", icon: "😴" },
    { value: "1-30", label: "🚶 1 – 30 minutes", description: "Light activity", icon: "🚶" },
    { value: "31-60", label: "🏃 31 – 60 minutes", description: "Moderate exercise", icon: "🏃" },
    { value: "61-90", label: "🔥 61 – 90 minutes", description: "Intense workout", icon: "💪" },
    { value: "more-than-90", label: "⚡ More than 90 minutes", description: "Athlete level", icon: "🏆" }
  ];

  const moodOptions = [
    { value: "very-low", label: "😞 Very low", description: "Feeling down", icon: "🌧️" },
    { value: "low", label: "🙂 Low", description: "Slightly off", icon: "⛅" },
    { value: "neutral", label: "😐 Neutral", description: "Balanced", icon: "😐" },
    { value: "good", label: "😃 Good", description: "Positive mood", icon: "☀️" },
    { value: "very-happy", label: "🤩 Very happy", description: "Excellent mood", icon: "🌈" }
  ];

  const stressOptions = [
    { value: "very-low", label: "🟢 Very low", description: "Completely relaxed", icon: "😌" },
    { value: "low", label: "🟡 Low", description: "Minimal stress", icon: "🙂" },
    { value: "moderate", label: "🟠 Moderate", description: "Manageable", icon: "😐" },
    { value: "high", label: "🔴 High", description: "Feeling pressure", icon: "😰" },
    { value: "very-high", label: "⚠️ Very high", description: "Overwhelming", icon: "😫" }
  ];

  const renderMCQ = (name, options, currentValue) => (
    <div className="mcq-options">
      {options.map(option => (
        <label 
          key={option.value} 
          className={`mcq-item ${currentValue === option.value ? 'selected' : ''}`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={currentValue === option.value}
            onChange={handleChange}
            required
          />
          <span className="mcq-item-icon">{option.icon}</span>
          <span className="mcq-item-content">
            <span className="mcq-item-label">{option.label}</span>
            <span className="mcq-item-description">{option.description}</span>
          </span>
        </label>
      ))}
    </div>
  );

  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return "Sleep Quality";
      case 2: return "Physical Activity";
      case 3: return "Emotional State";
      case 4: return "Stress Level";
      default: return "Daily Health Check-in";
    }
  };

  const getStepIcon = () => {
    switch(currentStep) {
      case 1: return "🌙";
      case 2: return "🏃";
      case 3: return "😊";
      case 4: return "😓";
      default: return "📝";
    }
  };

  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="topbar" id="top">
        <nav className="nav container">
          <Link className="brand" to="/" onClick={goToHome}>
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
            <Link to="/" onClick={goToHome}>
              Home
            </Link>
            <Link to="/health" onClick={() => setIsNavOpen(false)}>
              Health
            </Link>
            <Link to="/events" onClick={goToEventsDashboard}>
              Events
            </Link>
            <a href="#career" onClick={(e) => {
              e.preventDefault();
              showToast("Career section coming soon");
              setIsNavOpen(false);
            }}>
              Career
            </a>
            <a href="#study" onClick={(e) => {
              e.preventDefault();
              showToast("Study section coming soon");
              setIsNavOpen(false);
            }}>
              Study
            </a>

            <div className="nav__cta">
              <button className="header__notificationBtn" aria-label="Notifications">
                <svg className="header__notificationIcon" viewBox="0 0 24 24" fill="none">
                  <path d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
                  <path d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"/>
                </svg>
                <span className="header__notificationBadge">3</span>
              </button>
              
              {isLoggedIn ? (
                <div className="profile-dropdown" ref={profileDropdownRef}>
                  <button 
                    className="profile-icon-btn"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    aria-label="Profile menu"
                  >
                    👤
                  </button>
                  
                  {isProfileDropdownOpen && (
                    <div className="profile-dropdown-menu">
                      <button onClick={goToProfile} className="dropdown-item">
                        <span className="dropdown-icon">👤</span>
                        My Profile
                      </button>
                      <button onClick={goToDashboard} className="dropdown-item">
                        <span className="dropdown-icon">📊</span>
                        Dashboard
                      </button>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item logout">
                        <span className="dropdown-icon">🚪</span>
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link className="btn btn--ghost" to="/login" onClick={() => setIsNavOpen(false)}>
                    Login
                  </Link>
                  <Link className="btn btn--primary" to="/register" onClick={() => setIsNavOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* ===== Hero Section ===== */}
      <section className="daily-health-hero">
        <div className="container">
          <div className="daily-health-hero__content">
            <span className="daily-health-hero__badge">Daily Wellness Check-in</span>
            <h1 className="daily-health-hero__title">How are you feeling today?</h1>
            <p className="daily-health-hero__date">{today}</p>
            <div className="daily-health-hero__stats">
              <div className="daily-health-hero__stat">
                <span className="daily-health-hero__stat-value">{userStats.weeklyCompletion}%</span>
                <span className="daily-health-hero__stat-label">Weekly Completion</span>
              </div>
              <div className="daily-health-hero__stat">
                <span className="daily-health-hero__stat-value">{userStats.streak}</span>
                <span className="daily-health-hero__stat-label">Day Streak</span>
              </div>
              <div className="daily-health-hero__stat">
                <span className="daily-health-hero__stat-value">🏆</span>
                <span className="daily-health-hero__stat-label">{userStats.rank}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="daily-health-hero__pattern"></div>
      </section>

      {/* ===== Main Content ===== */}
      <main className="daily-health-main">
        <div className="container">
          <div className="daily-health-layout">
            {/* Left Sidebar - Info Panel */}
            <aside className="daily-health-sidebar">
              <div className="daily-health-sidebar__card">
                <h3 className="daily-health-sidebar__title">Why Track Daily?</h3>
                <ul className="daily-health-sidebar__list">
                  <li className="daily-health-sidebar__item">
                    <span className="daily-health-sidebar__item-icon">📊</span>
                    <div>
                      <strong>Identify Patterns</strong>
                      <p>Connect sleep, mood, and stress trends</p>
                    </div>
                  </li>
                  <li className="daily-health-sidebar__item">
                    <span className="daily-health-sidebar__item-icon">🎯</span>
                    <div>
                      <strong>Set Goals</strong>
                      <p>Improve wellbeing with data-driven insights</p>
                    </div>
                  </li>
                  <li className="daily-health-sidebar__item">
                    <span className="daily-health-sidebar__item-icon">🔄</span>
                    <div>
                      <strong>Build Habits</strong>
                      <p>Create sustainable healthy routines</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="daily-health-sidebar__card daily-health-sidebar__card--tip">
                <div className="daily-health-sidebar__tip-icon">💡</div>
                <h4 className="daily-health-sidebar__tip-title">Wellness Tip</h4>
                <p className="daily-health-sidebar__tip-text">
                  Taking 5 minutes daily to reflect on your wellbeing can reduce stress by up to 30%.
                </p>
              </div>

              <div className="daily-health-sidebar__card">
                <h4 className="daily-health-sidebar__subtitle">Recent Activity</h4>
                <div className="daily-health-sidebar__activity">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const hasEntryToday = entries.some(entry => {
                      const entryDate = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' });
                      return entryDate === day;
                    });
                    
                    return (
                      <div key={day} className="daily-health-sidebar__activity-item">
                        <span className="daily-health-sidebar__activity-day">{day}</span>
                        <span className={`daily-health-sidebar__activity-status ${hasEntryToday ? 'completed' : ''}`}></span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Right Side - Form */}
            <div className="daily-health-form-container">
              {/* Edit Mode Indicator */}
              {editingEntry && (
                <div className="edit-mode-indicator">
                  <span>✏️ Editing entry from {new Date(editingEntry.date).toLocaleDateString()}</span>
                  <button onClick={cancelEdit} className="edit-mode-cancel">Cancel</button>
                </div>
              )}

              {/* Progress Bar */}
              <div className="daily-health-progress">
                <div className="daily-health-progress__bar">
                  <div 
                    className="daily-health-progress__fill" 
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                <span className="daily-health-progress__text">
                  Step {currentStep} of {totalSteps}: {getStepTitle()}
                </span>
              </div>

              {/* Form Card */}
              <div className="daily-health-form-card">
                <div className="daily-health-form-card__header">
                  <div className="daily-health-form-card__icon">{getStepIcon()}</div>
                  <div>
                    <h2 className="daily-health-form-card__title">{getStepTitle()}</h2>
                    <p className="daily-health-form-card__subtitle">
                      Select the option that best describes your {currentStep === 1 ? 'sleep' : 
                        currentStep === 2 ? 'exercise' : 
                        currentStep === 3 ? 'mood' : 'stress'} level
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="daily-health-form">
                  {/* Step 1: Sleep */}
                  <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
                    {renderMCQ("sleepHours", sleepOptions, formData.sleepHours)}
                  </div>

                  {/* Step 2: Exercise */}
                  <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
                    {renderMCQ("exerciseMinutes", exerciseOptions, formData.exerciseMinutes)}
                  </div>

                  {/* Step 3: Mood */}
                  <div className={`form-step ${currentStep === 3 ? 'active' : ''}`}>
                    {renderMCQ("mood", moodOptions, formData.mood)}
                  </div>

                  {/* Step 4: Stress */}
                  <div className={`form-step ${currentStep === 4 ? 'active' : ''}`}>
                    {renderMCQ("stress", stressOptions, formData.stress)}
                  </div>

                  {/* Notes Field (Optional) */}
                  {currentStep === 4 && (
                    <div className="notes-field">
                      <label htmlFor="notes" className="notes-label">Additional Notes (Optional)</label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Any additional thoughts about your day?"
                        rows="3"
                        className="notes-textarea"
                      />
                    </div>
                  )}

                  {/* Form Navigation */}
                  <div className="form-navigation">
                    {currentStep > 1 && (
                      <button 
                        type="button" 
                        className="btn btn--ghost" 
                        onClick={prevStep}
                      >
                        ← Previous
                      </button>
                    )}
                    
                    {currentStep < totalSteps ? (
                      <button 
                        type="button" 
                        className="btn btn--primary" 
                        onClick={nextStep}
                        disabled={!formData[
                          currentStep === 1 ? 'sleepHours' :
                          currentStep === 2 ? 'exerciseMinutes' :
                          currentStep === 3 ? 'mood' : 'stress'
                        ]}
                      >
                        Next Step →
                      </button>
                    ) : (
                      <button 
                        type="submit" 
                        className="btn btn--primary btn--lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : (editingEntry ? 'Update Entry ✏️' : 'Complete Check-in ✓')}
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Summary Card (visible when all steps completed) */}
              {Object.values(formData).every(value => value !== "") && (
                <div className="daily-health-summary">
                  <h3 className="daily-health-summary__title">
                    {editingEntry ? 'Editing Summary' : "Today's Summary"}
                  </h3>
                  <div className="daily-health-summary__grid">
                    <div className="daily-health-summary__item">
                      <span className="daily-health-summary__item-label">Sleep</span>
                      <span className="daily-health-summary__item-value">
                        {sleepOptions.find(opt => opt.value === formData.sleepHours)?.label.split(' ')[1] || '—'}
                      </span>
                    </div>
                    <div className="daily-health-summary__item">
                      <span className="daily-health-summary__item-label">Exercise</span>
                      <span className="daily-health-summary__item-value">
                        {exerciseOptions.find(opt => opt.value === formData.exerciseMinutes)?.description || '—'}
                      </span>
                    </div>
                    <div className="daily-health-summary__item">
                      <span className="daily-health-summary__item-label">Mood</span>
                      <span className="daily-health-summary__item-value">
                        {moodOptions.find(opt => opt.value === formData.mood)?.label.split(' ')[1] || '—'}
                      </span>
                    </div>
                    <div className="daily-health-summary__item">
                      <span className="daily-health-summary__item-label">Stress</span>
                      <span className="daily-health-summary__item-value">
                        {stressOptions.find(opt => opt.value === formData.stress)?.label.split(' ')[1] || '—'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Past Entries List */}
              <div className="entries-list">
                <h3 className="entries-list__title">Your Past Entries</h3>
                
                {isLoading ? (
                  <div className="entries-list__loading">Loading entries...</div>
                ) : entries.length === 0 ? (
                  <div className="entries-list__empty">
                    <p>No entries yet. Complete your first check-in!</p>
                  </div>
                ) : (
                  <div className="entries-list__grid">
                    {entries.map(entry => (
                      <div key={entry._id || entry.id} className="entry-card">
                        <div className="entry-card__header">
                          <span className="entry-card__date">{formatDate(entry.date)}</span>
                          <div className="entry-card__actions">
                            <button 
                              className="entry-card__btn entry-card__btn--edit"
                              onClick={() => handleEdit(entry)}
                              title="Edit entry"
                            >
                              ✏️
                            </button>
                            <button 
                              className="entry-card__btn entry-card__btn--delete"
                              onClick={() => handleDeleteClick(entry)}
                              title="Delete entry"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        
                        <div className="entry-card__content">
                          <div className="entry-card__item">
                            <span className="entry-card__item-label">😴 Sleep</span>
                            <span className="entry-card__item-value">{getSleepLabel(entry.sleepHours)}</span>
                          </div>
                          
                          <div className="entry-card__item">
                            <span className="entry-card__item-label">🏃 Exercise</span>
                            <span className="entry-card__item-value">{getExerciseLabel(entry.exerciseMinutes)}</span>
                          </div>
                          
                          <div className="entry-card__item">
                            <span className="entry-card__item-label">{getMoodEmoji(entry.mood)} Mood</span>
                            <span className="entry-card__item-value">{entry.mood?.replace('-', ' ')}</span>
                          </div>
                          
                          <div className="entry-card__item">
                            <span className="entry-card__item-label">{getStressEmoji(entry.stress)} Stress</span>
                            <span className="entry-card__item-value">{entry.stress?.replace('-', ' ')}</span>
                          </div>

                          {entry.notes && (
                            <div className="entry-card__notes">
                              <span className="entry-card__notes-label">📝 Notes:</span>
                              <p className="entry-card__notes-text">{entry.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal__title">Delete Entry</h3>
            <p className="modal__message">
              Are you sure you want to delete this entry from {entryToDelete && formatDate(entryToDelete.date)}?
            </p>
            <div className="modal__actions">
              <button 
                className="modal__btn modal__btn--cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal__btn modal__btn--delete"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="container footer__panel">
          <div className="footer__support">
            <p className="footer__kicker">Need Support?</p>
            <h3 className="footer__heading">Health Help</h3>
            <a className="footer__contact footer__contact--accent" href="#">
              🌐 support.campuszone.lk
            </a>
            <a className="footer__contact" href="tel:+94117544801">
              📞 +94 11 754 0000
            </a>
          </div>

          <div className="footer__calendar">
            <h3 className="footer__calendarTitle">Quick Links</h3>
            <div className="footer__quick-links">
              <Link to="/health" className="footer__quick-link">Health Dashboard</Link>
              <Link to="/events" className="footer__quick-link">Events</Link>
              <a href="#" className="footer__quick-link">Resources</a>
              <a href="#" className="footer__quick-link">Support</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="container footer__inner">
            <div className="footer__brand">
              <div>
                <div className="footer__name">CampusZone</div>
                <div className="footer__small">
                  Student Wellness Platform
                </div>
              </div>
            </div>

            <div className="footer__socials">
              <a href="/" onClick={goToHome} aria-label="Facebook">
                <img src={facebookIcon} alt="facebook" className="footer__socialIcon"/>
              </a>
              <a href="/" onClick={goToHome} aria-label="Instagram">
                <img src={instagramIcon} alt="instagram" className="footer__socialIcon"/>
              </a>
              <a href="/" onClick={goToHome} aria-label="LinkedIn">
                <img src={linkedinIcon} alt="linkedin" className="footer__socialIcon"/>
              </a>
              <a href="/" onClick={goToHome} aria-label="YouTube">
                <img src={youtubeIcon} alt="youtube" className="footer__socialIcon"/>
              </a>
            </div>

            <a className="toTop" href="#top" onClick={scrollToTop} aria-label="Back to top">
              ↑
            </a>
          </div>
        </div>
      </footer>

      {/* Toast notification */}
      <div
        className={`toast ${toastVisible ? "is-visible" : ""}`.trim()}
        role="status"
        aria-live="polite"
      >
        {toastText}
      </div>

      {/* Add CSS for new elements */}
      <style jsx>{`
        .edit-mode-indicator {
          background: #e0f2fe;
          border: 1px solid #7dd3fc;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: slideDown 0.3s ease;
        }

        .edit-mode-indicator span {
          color: #0369a1;
          font-weight: 500;
        }

        .edit-mode-cancel {
          background: none;
          border: none;
          color: #0369a1;
          font-weight: 600;
          cursor: pointer;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .edit-mode-cancel:hover {
          background: #bae6fd;
        }

        .notes-field {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .notes-label {
          display: block;
          font-weight: 500;
          color: #4a5568;
          margin-bottom: 0.5rem;
        }

        .notes-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #cbd5e0;
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.95rem;
          resize: vertical;
        }

        .notes-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .entries-list {
          margin-top: 2rem;
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .entries-list__title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .entries-list__empty,
        .entries-list__loading {
          text-align: center;
          padding: 3rem;
          background: #f8fafc;
          border-radius: 12px;
          color: #64748b;
          font-size: 1.1rem;
        }

        .entries-list__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .entry-card {
          background: #f8fafc;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }

        .entry-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border-color: #cbd5e1;
        }

        .entry-card__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .entry-card__date {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
        }

        .entry-card__actions {
          display: flex;
          gap: 0.5rem;
        }

        .entry-card__btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .entry-card__btn--edit:hover {
          background: #e0f2fe;
          transform: scale(1.1);
        }

        .entry-card__btn--delete:hover {
          background: #fee2e2;
          transform: scale(1.1);
        }

        .entry-card__content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .entry-card__item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
        }

        .entry-card__item-label {
          color: #475569;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .entry-card__item-value {
          font-weight: 600;
          color: #1e293b;
          background: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .entry-card__notes {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px dashed #cbd5e0;
        }

        .entry-card__notes-label {
          font-size: 0.85rem;
          color: #64748b;
          display: block;
          margin-bottom: 0.25rem;
        }

        .entry-card__notes-text {
          font-size: 0.9rem;
          color: #334155;
          margin: 0;
          font-style: italic;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal__title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .modal__message {
          color: #475569;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .modal__actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .modal__btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-size: 1rem;
        }

        .modal__btn--cancel {
          background: #e2e8f0;
          color: #475569;
        }

        .modal__btn--cancel:hover {
          background: #cbd5e1;
        }

        .modal__btn--delete {
          background: #ef4444;
          color: white;
        }

        .modal__btn--delete:hover {
          background: #dc2626;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .entries-list {
            padding: 1.5rem;
          }

          .entries-list__grid {
            grid-template-columns: 1fr;
          }

          .modal {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}

export default DailyHealth;


