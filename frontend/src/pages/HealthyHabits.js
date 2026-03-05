import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./HealthyHabits.css";
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";

function HealthyHabits() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("goals");
  
  const profileDropdownRef = useRef(null);
  const toastTimerRef = useRef(null);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);

  const [goals, setGoals] = useState({
    sleepGoal: 8,
    exerciseGoal: 30,
    stressGoal: 4,
    waterGoal: 8,
    meditationGoal: 10,
  });

  const [progress, setProgress] = useState({
    sleepAvg: 7.2,
    exerciseAvg: 25,
    stressAvg: 5,
    waterAvg: 6,
    meditationAvg: 8,
  });

  const [message, setMessage] = useState("");

  // Sample data for charts
  const weeklyData = {
    sleep: [7.5, 6.8, 7.2, 8.1, 6.9, 8.5, 7.8],
    exercise: [20, 30, 15, 45, 25, 60, 30],
    stress: [6, 5, 7, 4, 6, 3, 4],
    mood: [7, 6, 8, 7, 9, 8, 8],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

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

  const showToast = (message) => {
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
    setGoals({
      ...goals,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Saved Goals:", goals);
    setMessage("Goals saved successfully! 🎯");
    showToast("Your wellness goals have been updated");
  };

  const getProgressPercentage = (current, goal) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  const generateBarChart = (value, max, color) => {
    const percentage = (value / max) * 100;
    return (
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color
          }}
        ></div>
      </div>
    );
  };

  // Dynamic insights based on data
  const getInsights = () => {
    const insights = [];
    
    if (progress.sleepAvg < goals.sleepGoal) {
      insights.push({
        type: "warning",
        icon: "😴",
        message: `You're averaging ${progress.sleepAvg.toFixed(1)} hours of sleep, ${(goals.sleepGoal - progress.sleepAvg).toFixed(1)} hours below your goal. Try establishing a consistent bedtime routine.`
      });
    } else {
      insights.push({
        type: "success",
        icon: "✨",
        message: "Great job meeting your sleep goals! You're well-rested and ready to learn."
      });
    }

    if (progress.exerciseAvg < goals.exerciseGoal) {
      insights.push({
        type: "warning",
        icon: "🏃",
        message: `You're averaging ${progress.exerciseAvg} minutes of exercise daily. Add short walks between study sessions to reach your ${goals.exerciseGoal}-minute goal.`
      });
    }

    if (progress.stressAvg > goals.stressGoal) {
      insights.push({
        type: "danger",
        icon: "😰",
        message: `Your stress levels (${progress.stressAvg}/10) are above your target (${goals.stressGoal}/10). Consider trying mindfulness exercises or speaking with a counselor.`
      });
    }

    if (progress.waterAvg < goals.waterGoal) {
      insights.push({
        type: "warning",
        icon: "💧",
        message: `You're drinking ${progress.waterAvg} glasses of water daily. Aim for ${goals.waterGoal} glasses to stay hydrated and focused.`
      });
    }

    return insights;
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
            <Link to="/health/habits" className="nav__link--active" onClick={() => setIsNavOpen(false)}>
              Healthy Habits
            </Link>
            <Link to="/health/tips" onClick={() => setIsNavOpen(false)}>
              Tips & Support
            </Link>

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

      {/* ================= HERO SECTION ================= */}
      <section className="habits-hero">
        <div className="container">
          <div className="habits-hero__content">
            <span className="habits-hero__badge">Wellness Tracker</span>
            <h1 className="habits-hero__title">Healthy Habits Dashboard</h1>
            <p className="habits-hero__subtitle">
              Build consistent habits, track your progress visually, and stay motivated 
              throughout your academic journey with personalized insights.
            </p>
            
            <div className="habits-hero__stats">
              <div className="habits-hero__stat">
                <span className="habits-hero__stat-value">{goals.sleepGoal}h</span>
                <span className="habits-hero__stat-label">Sleep Goal</span>
              </div>
              <div className="habits-hero__stat">
                <span className="habits-hero__stat-value">{goals.exerciseGoal}m</span>
                <span className="habits-hero__stat-label">Exercise Goal</span>
              </div>
              <div className="habits-hero__stat">
                <span className="habits-hero__stat-value">{goals.waterGoal}🍷</span>
                <span className="habits-hero__stat-label">Water Goal</span>
              </div>
            </div>
          </div>
        </div>
        <div className="habits-hero__pattern"></div>
      </section>

      {/* ================= TAB NAVIGATION ================= */}
      <section className="habits-tabs">
        <div className="container">
          <div className="habits-tabs__nav">
            <button 
              className={`habits-tabs__btn ${activeTab === 'goals' ? 'active' : ''}`}
              onClick={() => setActiveTab('goals')}
            >
              🎯 Set Goals
            </button>
            <button 
              className={`habits-tabs__btn ${activeTab === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              📈 Progress Tracking
            </button>
            <button 
              className={`habits-tabs__btn ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              💡 Insights & Analytics
            </button>
          </div>
        </div>
      </section>

      {/* ================= GOALS TAB ================= */}
      {activeTab === 'goals' && (
        <section className="habits-section">
          <div className="container">
            <div className="habits-card habits-card--goals">
              <div className="habits-card__header">
                <h2 className="habits-card__title">
                  <span className="habits-card__icon">🎯</span>
                  Personal Wellness Goals
                </h2>
                <p className="habits-card__subtitle">
                  Set daily targets to maintain a balanced and healthy lifestyle
                </p>
              </div>

              <form onSubmit={handleSave} className="goals-form">
                <div className="goals-grid">
                  <div className="goal-item">
                    <label className="goal-label">
                      <span className="goal-icon">🛌</span>
                      <span className="goal-text">Sleep (hours/day)</span>
                    </label>
                    <div className="goal-input-wrapper">
                      <input
                        type="range"
                        name="sleepGoal"
                        min="4"
                        max="12"
                        step="0.5"
                        value={goals.sleepGoal}
                        onChange={handleChange}
                        className="goal-slider"
                      />
                      <input
                        type="number"
                        name="sleepGoal"
                        value={goals.sleepGoal}
                        onChange={handleChange}
                        min="4"
                        max="12"
                        step="0.5"
                        className="goal-number"
                      />
                    </div>
                  </div>

                  <div className="goal-item">
                    <label className="goal-label">
                      <span className="goal-icon">🏃</span>
                      <span className="goal-text">Exercise (minutes/day)</span>
                    </label>
                    <div className="goal-input-wrapper">
                      <input
                        type="range"
                        name="exerciseGoal"
                        min="0"
                        max="120"
                        step="5"
                        value={goals.exerciseGoal}
                        onChange={handleChange}
                        className="goal-slider"
                      />
                      <input
                        type="number"
                        name="exerciseGoal"
                        value={goals.exerciseGoal}
                        onChange={handleChange}
                        min="0"
                        max="120"
                        step="5"
                        className="goal-number"
                      />
                    </div>
                  </div>

                  <div className="goal-item">
                    <label className="goal-label">
                      <span className="goal-icon">😌</span>
                      <span className="goal-text">Target Stress (1-10)</span>
                    </label>
                    <div className="goal-input-wrapper">
                      <input
                        type="range"
                        name="stressGoal"
                        min="1"
                        max="10"
                        step="1"
                        value={goals.stressGoal}
                        onChange={handleChange}
                        className="goal-slider"
                      />
                      <input
                        type="number"
                        name="stressGoal"
                        value={goals.stressGoal}
                        onChange={handleChange}
                        min="1"
                        max="10"
                        step="1"
                        className="goal-number"
                      />
                    </div>
                  </div>

                  <div className="goal-item">
                    <label className="goal-label">
                      <span className="goal-icon">💧</span>
                      <span className="goal-text">Water (glasses/day)</span>
                    </label>
                    <div className="goal-input-wrapper">
                      <input
                        type="range"
                        name="waterGoal"
                        min="4"
                        max="12"
                        step="1"
                        value={goals.waterGoal}
                        onChange={handleChange}
                        className="goal-slider"
                      />
                      <input
                        type="number"
                        name="waterGoal"
                        value={goals.waterGoal}
                        onChange={handleChange}
                        min="4"
                        max="12"
                        step="1"
                        className="goal-number"
                      />
                    </div>
                  </div>

                  <div className="goal-item goal-item--full">
                    <label className="goal-label">
                      <span className="goal-icon">🧘</span>
                      <span className="goal-text">Meditation (minutes/day)</span>
                    </label>
                    <div className="goal-input-wrapper">
                      <input
                        type="range"
                        name="meditationGoal"
                        min="0"
                        max="30"
                        step="5"
                        value={goals.meditationGoal}
                        onChange={handleChange}
                        className="goal-slider"
                      />
                      <input
                        type="number"
                        name="meditationGoal"
                        value={goals.meditationGoal}
                        onChange={handleChange}
                        min="0"
                        max="30"
                        step="5"
                        className="goal-number"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn--primary btn--lg goals-submit">
                  Save All Goals
                </button>

                {message && (
                  <div className="success-message">
                    <span className="success-icon">✅</span>
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      )}

      {/* ================= PROGRESS TAB ================= */}
      {activeTab === 'progress' && (
        <section className="habits-section">
          <div className="container">
            <div className="habits-card">
              <div className="habits-card__header">
                <h2 className="habits-card__title">
                  <span className="habits-card__icon">📊</span>
                  Weekly Progress Dashboard
                </h2>
                <p className="habits-card__subtitle">
                  Track your daily habits and see how you're progressing toward your goals
                </p>
              </div>

              <div className="progress-grid">
                <div className="progress-card">
                  <div className="progress-card__header">
                    <span className="progress-card__icon">😴</span>
                    <h3 className="progress-card__title">Sleep</h3>
                    <span className="progress-card__value">{progress.sleepAvg}h / {goals.sleepGoal}h</span>
                  </div>
                  {generateBarChart(progress.sleepAvg, goals.sleepGoal, '#4299e1')}
                  <div className="progress-card__footer">
                    <span className="progress-percentage">{getProgressPercentage(progress.sleepAvg, goals.sleepGoal)}% of goal</span>
                  </div>
                </div>

                <div className="progress-card">
                  <div className="progress-card__header">
                    <span className="progress-card__icon">🏃</span>
                    <h3 className="progress-card__title">Exercise</h3>
                    <span className="progress-card__value">{progress.exerciseAvg}m / {goals.exerciseGoal}m</span>
                  </div>
                  {generateBarChart(progress.exerciseAvg, goals.exerciseGoal, '#48bb78')}
                  <div className="progress-card__footer">
                    <span className="progress-percentage">{getProgressPercentage(progress.exerciseAvg, goals.exerciseGoal)}% of goal</span>
                  </div>
                </div>

                <div className="progress-card">
                  <div className="progress-card__header">
                    <span className="progress-card__icon">😓</span>
                    <h3 className="progress-card__title">Stress Level</h3>
                    <span className="progress-card__value">{progress.stressAvg} / {goals.stressGoal}</span>
                  </div>
                  {generateBarChart(progress.stressAvg, 10, '#f56565')}
                  <div className="progress-card__footer">
                    <span className="progress-percentage">Target: ≤{goals.stressGoal}</span>
                  </div>
                </div>

                <div className="progress-card">
                  <div className="progress-card__header">
                    <span className="progress-card__icon">💧</span>
                    <h3 className="progress-card__title">Water</h3>
                    <span className="progress-card__value">{progress.waterAvg} / {goals.waterGoal}</span>
                  </div>
                  {generateBarChart(progress.waterAvg, goals.waterGoal, '#4299e1')}
                  <div className="progress-card__footer">
                    <span className="progress-percentage">{getProgressPercentage(progress.waterAvg, goals.waterGoal)}% of goal</span>
                  </div>
                </div>

                <div className="progress-card progress-card--full">
                  <div className="progress-card__header">
                    <span className="progress-card__icon">🧘</span>
                    <h3 className="progress-card__title">Meditation</h3>
                    <span className="progress-card__value">{progress.meditationAvg}m / {goals.meditationGoal}m</span>
                  </div>
                  {generateBarChart(progress.meditationAvg, goals.meditationGoal, '#9f7aea')}
                  <div className="progress-card__footer">
                    <span className="progress-percentage">{getProgressPercentage(progress.meditationAvg, goals.meditationGoal)}% of goal</span>
                  </div>
                </div>
              </div>

              {/* Weekly Chart */}
              <div className="weekly-chart">
                <h3 className="weekly-chart__title">This Week's Trends</h3>
                <div className="chart-grid">
                  {weeklyData.days.map((day, index) => (
                    <div key={day} className="chart-column">
                      <div className="chart-bars">
                        <div 
                          className="chart-bar chart-bar--sleep" 
                          style={{ height: `${weeklyData.sleep[index] * 10}px` }}
                          title={`Sleep: ${weeklyData.sleep[index]}h`}
                        ></div>
                        <div 
                          className="chart-bar chart-bar--exercise" 
                          style={{ height: `${weeklyData.exercise[index] * 0.8}px` }}
                          title={`Exercise: ${weeklyData.exercise[index]}m`}
                        ></div>
                        <div 
                          className="chart-bar chart-bar--stress" 
                          style={{ height: `${weeklyData.stress[index] * 8}px` }}
                          title={`Stress: ${weeklyData.stress[index]}/10`}
                        ></div>
                      </div>
                      <span className="chart-label">{day}</span>
                    </div>
                  ))}
                </div>
                <div className="chart-legend">
                  <span className="legend-item"><span className="legend-color sleep"></span> Sleep</span>
                  <span className="legend-item"><span className="legend-color exercise"></span> Exercise</span>
                  <span className="legend-item"><span className="legend-color stress"></span> Stress</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= INSIGHTS TAB ================= */}
      {activeTab === 'insights' && (
        <section className="habits-section">
          <div className="container">
            <div className="habits-card">
              <div className="habits-card__header">
                <h2 className="habits-card__title">
                  <span className="habits-card__icon">💡</span>
                  Personalized Insights
                </h2>
                <p className="habits-card__subtitle">
                  AI-powered recommendations based on your progress patterns
                </p>
              </div>

              <div className="insights-container">
                {getInsights().map((insight, index) => (
                  <div key={index} className={`insight-card insight-card--${insight.type}`}>
                    <div className="insight-card__icon">{insight.icon}</div>
                    <div className="insight-card__content">
                      <p className="insight-card__message">{insight.message}</p>
                    </div>
                  </div>
                ))}

                <div className="insight-card insight-card--tip">
                  <div className="insight-card__icon">⭐</div>
                  <div className="insight-card__content">
                    <p className="insight-card__message">
                      <strong>Weekly Challenge:</strong> Try to increase your water intake by 1 glass each day this week. 
                      Proper hydration can improve focus by up to 20%!
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="recommendations">
                <h3 className="recommendations__title">Recommended Actions</h3>
                <div className="recommendations-grid">
                  <div className="recommendation-card">
                    <span className="recommendation-icon">🌙</span>
                    <h4 className="recommendation-title">Improve Sleep</h4>
                    <p className="recommendation-text">Try going to bed 15 minutes earlier each night this week</p>
                    <button className="recommendation-btn" onClick={() => showToast("Sleep reminder set!")}>
                      Set Reminder
                    </button>
                  </div>
                  <div className="recommendation-card">
                    <span className="recommendation-icon">🚶</span>
                    <h4 className="recommendation-title">Movement Break</h4>
                    <p className="recommendation-text">Take a 5-minute walk break every 2 hours of study</p>
                    <button className="recommendation-btn" onClick={() => showToast("Movement reminder set!")}>
                      Set Reminder
                    </button>
                  </div>
                  <div className="recommendation-card">
                    <span className="recommendation-icon">🧘</span>
                    <h4 className="recommendation-title">Mindfulness</h4>
                    <p className="recommendation-text">Try a 5-minute guided meditation before bed</p>
                    <button className="recommendation-btn" onClick={() => showToast("Meditation reminder set!")}>
                      Start Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="container footer__panel">
          <div className="footer__support">
            <p className="footer__kicker">Stay Healthy</p>
            <h3 className="footer__heading">Wellness Tracking</h3>
            <a className="footer__contact footer__contact--accent" href="#">
              🌐 wellness.campuszone.lk
            </a>
            <a className="footer__contact" href="tel:+94117544801">
              📞 +94 11 754 0000
            </a>
          </div>

          <div className="footer__calendar">
            <h3 className="footer__calendarTitle">Quick Links</h3>
            <div className="footer__quick-links">
              <Link to="/health" className="footer__quick-link">Health Dashboard</Link>
              <Link to="/daily-health" className="footer__quick-link">Daily Check-in</Link>
              <Link to="/health/tips" className="footer__quick-link">Tips & Support</Link>
              <button className="footer__quick-link footer__quick-link--btn" onClick={() => showToast("Resources coming soon")}>
                Wellness Resources
              </button>
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
              <Link to="/" onClick={goToHome} aria-label="Facebook" className="footer__social-link">
                <img src={facebookIcon} alt="facebook" className="footer__socialIcon"/>
              </Link>
              <Link to="/" onClick={goToHome} aria-label="Instagram" className="footer__social-link">
                <img src={instagramIcon} alt="instagram" className="footer__socialIcon"/>
              </Link>
              <Link to="/" onClick={goToHome} aria-label="LinkedIn" className="footer__social-link">
                <img src={linkedinIcon} alt="linkedin" className="footer__socialIcon"/>
              </Link>
              <Link to="/" onClick={goToHome} aria-label="YouTube" className="footer__social-link">
                <img src={youtubeIcon} alt="youtube" className="footer__socialIcon"/>
              </Link>
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

export default HealthyHabits;