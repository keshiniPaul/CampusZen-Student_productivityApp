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
  const [formData, setFormData] = useState({
    sleepHours: "",
    exerciseMinutes: "",
    mood: "",
    stress: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const profileDropdownRef = useRef(null);
  const toastTimerRef = useRef(null);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Check login status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields are filled
    const isComplete = Object.values(formData).every(value => value !== "");
    
    if (!isComplete) {
      showToast("Please complete all sections before saving", "error");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      date: new Date().toISOString(),
      timestamp: Date.now(),
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Health entry saved:", payload);
    showToast("Health entry saved successfully! 🎉");
    
    setTimeout(() => {
      navigate("/health");
    }, 1500);
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
                <span className="daily-health-hero__stat-value">92%</span>
                <span className="daily-health-hero__stat-label">Weekly Completion</span>
              </div>
              <div className="daily-health-hero__stat">
                <span className="daily-health-hero__stat-value">5</span>
                <span className="daily-health-hero__stat-label">Day Streak</span>
              </div>
              <div className="daily-health-hero__stat">
                <span className="daily-health-hero__stat-value">🏆</span>
                <span className="daily-health-hero__stat-label">Top 10%</span>
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
                  <div className="daily-health-sidebar__activity-item">
                    <span className="daily-health-sidebar__activity-day">Mon</span>
                    <span className="daily-health-sidebar__activity-status completed"></span>
                  </div>
                  <div className="daily-health-sidebar__activity-item">
                    <span className="daily-health-sidebar__activity-day">Tue</span>
                    <span className="daily-health-sidebar__activity-status completed"></span>
                  </div>
                  <div className="daily-health-sidebar__activity-item">
                    <span className="daily-health-sidebar__activity-day">Wed</span>
                    <span className="daily-health-sidebar__activity-status completed"></span>
                  </div>
                  <div className="daily-health-sidebar__activity-item">
                    <span className="daily-health-sidebar__activity-day">Thu</span>
                    <span className="daily-health-sidebar__activity-status completed"></span>
                  </div>
                  <div className="daily-health-sidebar__activity-item">
                    <span className="daily-health-sidebar__activity-day">Fri</span>
                    <span className="daily-health-sidebar__activity-status completed"></span>
                  </div>
                  <div className="daily-health-sidebar__activity-item">
                    <span className="daily-health-sidebar__activity-day">Sat</span>
                    <span className="daily-health-sidebar__activity-status"></span>
                  </div>
                  <div className="daily-health-sidebar__activity-item">
                    <span className="daily-health-sidebar__activity-day">Sun</span>
                    <span className="daily-health-sidebar__activity-status"></span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Side - Form */}
            <div className="daily-health-form-container">
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
                        {isSubmitting ? 'Saving...' : 'Complete Check-in ✓'}
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Summary Card (visible when all steps completed) */}
              {Object.values(formData).every(value => value !== "") && (
                <div className="daily-health-summary">
                  <h3 className="daily-health-summary__title">Today's Summary</h3>
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
            </div>
          </div>
        </div>
      </main>

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
    </>
  );
}

export default DailyHealth;