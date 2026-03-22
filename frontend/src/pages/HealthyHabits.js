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
  const [showGoalSummary, setShowGoalSummary] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // New state for workouts and mindfulness
  const [selectedWorkout, setSelectedWorkout] = useState("");
  const [addedWorkouts, setAddedWorkouts] = useState([]);
  const [selectedMindfulness, setSelectedMindfulness] = useState("");
  const [addedMindfulness, setAddedMindfulness] = useState([]);
  
  const profileDropdownRef = useRef(null);
  const toastTimerRef = useRef(null);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);

  // Calendar variables
  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const monthLabel = currentDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const leadingEmptyDays = (firstDayIndex + 6) % 7;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = [
    ...Array.from({ length: leadingEmptyDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  const [goals, setGoals] = useState({
    sleepGoal: 8,
    exerciseGoal: 30,
    exerciseUnit: 'minutes',
    stressGoal: 4,
    waterGoal: 8,
    meditationGoal: 10,
    meditationUnit: 'minutes'
  });

  const [progress, setProgress] = useState({
    sleepAvg: 7.2,
    exerciseAvg: 25,
    stressAvg: 5,
    waterAvg: 6,
    meditationAvg: 8,
  });

  const [message, setMessage] = useState("");

  // Workout options with emojis
  const workoutOptions = [
    { id: "yoga", name: "Yoga", emoji: "🧘‍♀️", description: "Improve flexibility and reduce stress" },
    { id: "pilates", name: "Pilates", emoji: "🤸‍♀️", description: "Core strength and body conditioning" },
    { id: "gym", name: "Gym Workout", emoji: "🏋️‍♂️", description: "Build strength and muscle" },
    { id: "cardio", name: "Cardio Run", emoji: "🏃‍♂️", description: "Boost heart health and endurance" }
  ];

  // Mindfulness options with emojis
  const mindfulnessOptions = [
    { id: "meditation", name: "Meditation", emoji: "🧘", description: "Calm your mind and focus" },
    { id: "breathing", name: "Breathing Exercise", emoji: "🌬️", description: "Reduce stress and anxiety" },
    { id: "journal", name: "Journalling", emoji: "📝", description: "Express thoughts and feelings" },
    { id: "gratitude", name: "Practice Gratitude", emoji: "🙏", description: "Cultivate positive mindset" }
  ];

  // Sample data for charts
  const weeklyData = {
    sleep: [7.5, 6.8, 7.2, 8.1, 6.9, 8.5, 7.8],
    exercise: [20, 30, 15, 45, 25, 60, 30],
    stress: [6, 5, 7, 4, 6, 3, 4],
    mood: [7, 6, 8, 7, 9, 8, 8],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const loadSavedData = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      
      // Load goals from localStorage
      const savedGoals = localStorage.getItem("healthyHabits_goals");
      if (savedGoals) {
        try {
          const parsedGoals = JSON.parse(savedGoals);
          setGoals(parsedGoals);
          setShowGoalSummary(true);
        } catch (e) {
          console.error("Error loading goals:", e);
        }
      }
      
      // Load workouts from localStorage
      const savedWorkouts = localStorage.getItem("healthyHabits_workouts");
      if (savedWorkouts) {
        try {
          const parsedWorkouts = JSON.parse(savedWorkouts);
          setAddedWorkouts(parsedWorkouts);
        } catch (e) {
          console.error("Error loading workouts:", e);
        }
      }
      
      // Load mindfulness from localStorage
      const savedMindfulness = localStorage.getItem("healthyHabits_mindfulness");
      if (savedMindfulness) {
        try {
          const parsedMindfulness = JSON.parse(savedMindfulness);
          setAddedMindfulness(parsedMindfulness);
        } catch (e) {
          console.error("Error loading mindfulness:", e);
        }
      }
      
      setIsLoading(false);
    };
    
    loadSavedData();
  }, []);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("healthyHabits_goals", JSON.stringify(goals));
    }
  }, [goals, isLoading]);

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("healthyHabits_workouts", JSON.stringify(addedWorkouts));
    }
  }, [addedWorkouts, isLoading]);

  // Save mindfulness to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("healthyHabits_mindfulness", JSON.stringify(addedMindfulness));
    }
  }, [addedMindfulness, isLoading]);

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
    const { name, value } = e.target;
    
    if (name === 'exerciseUnit' || name === 'meditationUnit') {
      setGoals({
        ...goals,
        [name]: value,
      });
    } else {
      setGoals({
        ...goals,
        [name]: value === "" ? "" : Number(value),
      });
    }
  };

  // Handle workout selection
  const handleWorkoutSelect = (e) => {
    setSelectedWorkout(e.target.value);
  };

  // Add workout to the list
  const handleAddWorkout = () => {
    if (selectedWorkout) {
      const workout = workoutOptions.find(w => w.id === selectedWorkout);
      if (workout && !addedWorkouts.some(w => w.id === workout.id)) {
        setAddedWorkouts([...addedWorkouts, workout]);
        showToast(`✅ ${workout.name} added to your workout routine!`);
        setSelectedWorkout("");
      } else if (addedWorkouts.some(w => w.id === workout?.id)) {
        showToast("⚠️ This workout is already added!");
      }
    }
  };

  // Remove workout from list
  const handleRemoveWorkout = (workoutId) => {
    setAddedWorkouts(addedWorkouts.filter(w => w.id !== workoutId));
    showToast("🗑️ Workout removed from your routine");
  };

  // Handle mindfulness selection
  const handleMindfulnessSelect = (e) => {
    setSelectedMindfulness(e.target.value);
  };

  // Add mindfulness to the list
  const handleAddMindfulness = () => {
    if (selectedMindfulness) {
      const mindfulness = mindfulnessOptions.find(m => m.id === selectedMindfulness);
      if (mindfulness && !addedMindfulness.some(m => m.id === mindfulness.id)) {
        setAddedMindfulness([...addedMindfulness, mindfulness]);
        showToast(`✅ ${mindfulness.name} added to your mindfulness practice!`);
        setSelectedMindfulness("");
      } else if (addedMindfulness.some(m => m.id === mindfulness?.id)) {
        showToast("⚠️ This mindfulness exercise is already added!");
      }
    }
  };

  // Remove mindfulness from list
  const handleRemoveMindfulness = (mindfulnessId) => {
    setAddedMindfulness(addedMindfulness.filter(m => m.id !== mindfulnessId));
    showToast("🗑️ Mindfulness exercise removed from your practice");
  };

  // Convert exercise value to minutes for display in progress
  const getExerciseInMinutes = () => {
    if (goals.exerciseUnit === 'hours') {
      return goals.exerciseGoal * 60;
    }
    return goals.exerciseGoal;
  };

  // Convert meditation value to minutes for display in progress
  const getMeditationInMinutes = () => {
    if (goals.meditationUnit === 'hours') {
      return goals.meditationGoal * 60;
    }
    return goals.meditationGoal;
  };

  // Format exercise display based on unit
  const getExerciseDisplay = () => {
    if (goals.exerciseUnit === 'hours') {
      return `${goals.exerciseGoal}h`;
    }
    return `${goals.exerciseGoal}m`;
  };

  // Format meditation display based on unit
  const getMeditationDisplay = () => {
    if (goals.meditationUnit === 'hours') {
      return `${goals.meditationGoal}h`;
    }
    return `${goals.meditationGoal}m`;
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Validate inputs
    const updatedGoals = { ...goals };
    let hasChanges = false;

    // Convert empty strings to default values or validate
    Object.keys(updatedGoals).forEach(key => {
      if (key !== 'exerciseUnit' && key !== 'meditationUnit' && (updatedGoals[key] === "" || isNaN(updatedGoals[key]))) {
        // Set default values based on goal type
        switch(key) {
          case 'sleepGoal':
            updatedGoals[key] = 8;
            break;
          case 'exerciseGoal':
            updatedGoals[key] = 30;
            break;
          case 'stressGoal':
            updatedGoals[key] = 4;
            break;
          case 'waterGoal':
            updatedGoals[key] = 8;
            break;
          case 'meditationGoal':
            updatedGoals[key] = 10;
            break;
          default:
            updatedGoals[key] = 0;
        }
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setGoals(updatedGoals);
    }

    // Simulate API call
    setTimeout(() => {
      console.log("Saved Goals:", updatedGoals);
      setMessage("Goals saved successfully! 🎯");
      showToast("Your wellness goals have been updated");
      setShowGoalSummary(true);
      setIsEditing(false);
    }, 500);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowGoalSummary(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to reset all your goals to defaults?")) {
      const defaultGoals = {
        sleepGoal: 8,
        exerciseGoal: 30,
        exerciseUnit: 'minutes',
        stressGoal: 4,
        waterGoal: 8,
        meditationGoal: 10,
        meditationUnit: 'minutes'
      };
      
      setGoals(defaultGoals);
      setShowGoalSummary(false);
      setIsEditing(true);
      showToast("Goals have been reset to defaults");
    }
  };

  const handleSetNewGoal = () => {
    setIsEditing(true);
    setShowGoalSummary(false);
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
    const exerciseInMinutes = getExerciseInMinutes();
    const meditationInMinutes = getMeditationInMinutes();
    
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

    if (progress.exerciseAvg < exerciseInMinutes) {
      insights.push({
        type: "warning",
        icon: "🏃",
        message: `You're averaging ${progress.exerciseAvg} minutes of exercise daily. Add short walks between study sessions to reach your ${getExerciseDisplay()} goal.`
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

    if (progress.meditationAvg < meditationInMinutes) {
      insights.push({
        type: "warning",
        icon: "🧘",
        message: `You're averaging ${progress.meditationAvg} minutes of meditation daily. Try to reach your ${getMeditationDisplay()} goal for better mindfulness.`
      });
    }

    return insights;
  };

  // Show loading state while data is being loaded
  if (isLoading) {
    return (
      <>
        <header className="topbar" id="top">
          <nav className="nav container">
            <Link className="brand" to="/">
              <img className="brand__logo--img" src={campusLogo} alt="CampusZone Logo" />
            </Link>
          </nav>
        </header>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your wellness data...</p>
        </div>
      </>
    );
  }

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
                <span className="habits-hero__stat-value">{getExerciseDisplay()}</span>
                <span className="habits-hero__stat-label">Exercise Goal</span>
              </div>
              <div className="habits-hero__stat">
                <span className="habits-hero__stat-value">{goals.waterGoal} 🥤</span>
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

              {showGoalSummary && !isEditing ? (
                <div className="goals-summary">
                  <h3 className="goals-summary__title">Your Current Goals</h3>
                  <div className="goals-summary__grid">
                    <div className="goal-summary-item">
                      <span className="goal-summary-icon">🛌</span>
                      <div className="goal-summary-content">
                        <span className="goal-summary-label">Sleep</span>
                        <span className="goal-summary-value">{goals.sleepGoal} hours</span>
                      </div>
                    </div>
                    <div className="goal-summary-item">
                      <span className="goal-summary-icon">🏃</span>
                      <div className="goal-summary-content">
                        <span className="goal-summary-label">Exercise</span>
                        <span className="goal-summary-value">{getExerciseDisplay()}</span>
                      </div>
                    </div>
                    <div className="goal-summary-item">
                      <span className="goal-summary-icon">😌</span>
                      <div className="goal-summary-content">
                        <span className="goal-summary-label">Target Stress</span>
                        <span className="goal-summary-value">{goals.stressGoal}/10</span>
                      </div>
                    </div>
                    <div className="goal-summary-item">
                      <span className="goal-summary-icon">💧</span>
                      <div className="goal-summary-content">
                        <span className="goal-summary-label">Water</span>
                        <span className="goal-summary-value">{goals.waterGoal} glasses</span>
                      </div>
                    </div>
                    <div className="goal-summary-item">
                      <span className="goal-summary-icon">🧘</span>
                      <div className="goal-summary-content">
                        <span className="goal-summary-label">Meditation</span>
                        <span className="goal-summary-value">{getMeditationDisplay()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="goals-summary__actions">
                    <button onClick={handleEdit} className="btn btn--secondary">
                      ✏️ Edit Goals
                    </button>
                    <button onClick={handleDelete} className="btn btn--danger">
                      🗑️ Reset Goals
                    </button>
                    <button onClick={handleSetNewGoal} className="btn btn--primary">
                      ➕ Set New Goal
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="goals-form">
                  <div className="goals-grid">
                    <div className="goal-item">
                      <label className="goal-label">
                        <span className="goal-icon">🛌</span>
                        <span className="goal-text">Sleep (hours/day)</span>
                      </label>
                      <div className="goal-input-wrapper">
                        <input
                          type="number"
                          name="sleepGoal"
                          value={goals.sleepGoal}
                          onChange={handleChange}
                          min="4"
                          max="12"
                          step="0.5"
                          className="goal-number"
                          placeholder="8"
                        />
                        <span className="goal-unit">hours</span>
                      </div>
                    </div>

                    <div className="goal-item">
                      <label className="goal-label">
                        <span className="goal-icon">🏃</span>
                        <span className="goal-text">Exercise</span>
                      </label>
                      <div className="goal-input-wrapper goal-input-wrapper--with-select">
                        <input
                          type="number"
                          name="exerciseGoal"
                          value={goals.exerciseGoal}
                          onChange={handleChange}
                          min="0"
                          max={goals.exerciseUnit === 'hours' ? "24" : "1440"}
                          step={goals.exerciseUnit === 'hours' ? "0.5" : "5"}
                          className="goal-number"
                          placeholder={goals.exerciseUnit === 'hours' ? "1" : "30"}
                        />
                        <select 
                          name="exerciseUnit" 
                          value={goals.exerciseUnit} 
                          onChange={handleChange}
                          className="goal-unit-select"
                        >
                          <option value="minutes">minutes</option>
                          <option value="hours">hours</option>
                        </select>
                      </div>
                    </div>

                    <div className="goal-item">
                      <label className="goal-label">
                        <span className="goal-icon">😌</span>
                        <span className="goal-text">Target Stress (1-10)</span>
                      </label>
                      <div className="goal-input-wrapper">
                        <input
                          type="number"
                          name="stressGoal"
                          value={goals.stressGoal}
                          onChange={handleChange}
                          min="1"
                          max="10"
                          step="1"
                          className="goal-number"
                          placeholder="4"
                        />
                        <span className="goal-unit">/10</span>
                      </div>
                    </div>

                    <div className="goal-item">
                      <label className="goal-label">
                        <span className="goal-icon">💧</span>
                        <span className="goal-text">Water (glasses/day)</span>
                      </label>
                      <div className="goal-input-wrapper">
                        <input
                          type="number"
                          name="waterGoal"
                          value={goals.waterGoal}
                          onChange={handleChange}
                          min="4"
                          max="12"
                          step="1"
                          className="goal-number"
                          placeholder="8"
                        />
                        <span className="goal-unit">glasses</span>
                      </div>
                    </div>

                    <div className="goal-item goal-item--full">
                      <label className="goal-label">
                        <span className="goal-icon">🧘</span>
                        <span className="goal-text">Meditation</span>
                      </label>
                      <div className="goal-input-wrapper goal-input-wrapper--with-select">
                        <input
                          type="number"
                          name="meditationGoal"
                          value={goals.meditationGoal}
                          onChange={handleChange}
                          min="0"
                          max={goals.meditationUnit === 'hours' ? "24" : "1440"}
                          step={goals.meditationUnit === 'hours' ? "0.5" : "5"}
                          className="goal-number"
                          placeholder={goals.meditationUnit === 'hours' ? "0.5" : "10"}
                        />
                        <select 
                          name="meditationUnit" 
                          value={goals.meditationUnit} 
                          onChange={handleChange}
                          className="goal-unit-select"
                        >
                          <option value="minutes">minutes</option>
                          <option value="hours">hours</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="goals-form__actions">
                    <button type="submit" className="btn btn--primary btn--lg">
                      Save All Goals
                    </button>
                    {showGoalSummary && (
                      <button type="button" onClick={() => {setIsEditing(false); setShowGoalSummary(true);}} className="btn btn--secondary">
                        Cancel
                      </button>
                    )}
                  </div>

                  {message && (
                    <div className="success-message">
                      <span className="success-icon">✅</span>
                      {message}
                    </div>
                  )}
                </form>
              )}

              {/* ================= WORKOUT GOALS SECTION ================= */}
              <div className="workout-goals-section">
                <h3 className="workout-goals__title">
                  <span className="workout-goals__icon">💪</span>
                  My Workout Goals
                </h3>
                <p className="workout-goals__subtitle">
                  Add your favourite workout routines. Practice them daily. All the best! ✨
                </p>

                <div className="workout-selector">
                  <select 
                    value={selectedWorkout} 
                    onChange={handleWorkoutSelect}
                    className="workout-select"
                  >
                    <option value="">Select a workout ⬇️</option>
                    {workoutOptions.map(workout => (
                      <option key={workout.id} value={workout.id}>
                        {workout.emoji} {workout.name}
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={handleAddWorkout}
                    className="btn btn--primary workout-add-btn"
                    disabled={!selectedWorkout}
                  >
                    ➕ Add Workout
                  </button>
                </div>

                {/* Display added workouts */}
                {addedWorkouts.length > 0 ? (
                  <div className="added-workouts-grid">
                    {addedWorkouts.map(workout => (
                      <div key={workout.id} className="workout-card">
                        <div className="workout-card__emoji">{workout.emoji}</div>
                        <div className="workout-card__content">
                          <h4 className="workout-card__title">{workout.name}</h4>
                          <p className="workout-card__description">{workout.description}</p>
                          <button 
                            onClick={() => handleRemoveWorkout(workout.id)}
                            className="workout-card__remove-btn"
                            aria-label={`Remove ${workout.name}`}
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p className="empty-state__text">✨ No workouts added yet. Select a workout above to get started!</p>
                  </div>
                )}
              </div>

              {/* ================= MINDFULNESS GOALS SECTION ================= */}
              <div className="mindfulness-goals-section">
                <h3 className="mindfulness-goals__title">
                  <span className="mindfulness-goals__icon">🧠</span>
                  My Mindfulness: Mental Health Goals
                </h3>
                <p className="mindfulness-goals__subtitle">
                  Select a mindfulness exercise to practice daily. 🌿
                </p>

                <div className="mindfulness-selector">
                  <select 
                    value={selectedMindfulness} 
                    onChange={handleMindfulnessSelect}
                    className="mindfulness-select"
                  >
                    <option value="">Select a mindfulness exercise ⬇️</option>
                    {mindfulnessOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.emoji} {option.name}
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={handleAddMindfulness}
                    className="btn btn--primary mindfulness-add-btn"
                    disabled={!selectedMindfulness}
                  >
                    ➕ Add Practice
                  </button>
                </div>

                {/* Display added mindfulness exercises */}
                {addedMindfulness.length > 0 ? (
                  <div className="added-mindfulness-grid">
                    {addedMindfulness.map(option => (
                      <div key={option.id} className="mindfulness-card">
                        <div className="mindfulness-card__emoji">{option.emoji}</div>
                        <div className="mindfulness-card__content">
                          <h4 className="mindfulness-card__title">{option.name}</h4>
                          <p className="mindfulness-card__description">{option.description}</p>
                          <button 
                            onClick={() => handleRemoveMindfulness(option.id)}
                            className="mindfulness-card__remove-btn"
                            aria-label={`Remove ${option.name}`}
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p className="empty-state__text">🧘 No mindfulness exercises added yet. Select one above to begin your journey!</p>
                  </div>
                )}
              </div>
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
                    <span className="progress-card__value">{progress.exerciseAvg}m / {getExerciseDisplay()}</span>
                  </div>
                  {generateBarChart(progress.exerciseAvg, getExerciseInMinutes(), '#48bb78')}
                  <div className="progress-card__footer">
                    <span className="progress-percentage">{getProgressPercentage(progress.exerciseAvg, getExerciseInMinutes())}% of goal</span>
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
                    <span className="progress-card__value">{progress.meditationAvg}m / {getMeditationDisplay()}</span>
                  </div>
                  {generateBarChart(progress.meditationAvg, getMeditationInMinutes(), '#9f7aea')}
                  <div className="progress-card__footer">
                    <span className="progress-percentage">{getProgressPercentage(progress.meditationAvg, getMeditationInMinutes())}% of goal</span>
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
                  <span className="legend-item"><span className="legend-color sleep"></span> Sleep 😴</span>
                  <span className="legend-item"><span className="legend-color exercise"></span> Exercise 🏃</span>
                  <span className="legend-item"><span className="legend-color stress"></span> Stress 😓</span>
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
                  Health tips for you to achieve your goals!
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
                      Proper hydration can improve focus by up to 20%! 💧
                    </p>
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
            <p className="footer__kicker">Do you need any</p>
            <h3 className="footer__heading">Support?</h3>
            <a className="footer__contact footer__contact--accent" href="https://support.sliit.lk">
              🌐 support.campuszone.lk
            </a>
            <a className="footer__contact" href="tel:+94117544801">
              📞 +94 11 754 0000
            </a>
            <a className="footer__feedback" href="https://support.sliit.lk">
              Provide Feedback to CampusZone
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
                if (!day) {
                  return <span className="is-muted" key={`empty-${index}`}></span>;
                }

                const isToday = day === currentDay;
                return (
                  <span className={isToday ? "is-active" : ""} key={`day-${day}`}>
                    {day}
                  </span>
                );
              })}
            </div>
            <a className="footer__fullCalendar" href="/events" onClick={goToEventsDashboard}>
              Full calendar
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="container footer__inner">
            <div className="footer__brand">
              <div>
                <div className="footer__name">CampusZone</div>
                <div className="footer__small">Student Wellness Platform</div>
              </div>
            </div>

            <div className="footer__socials" aria-label="Social links">
              <a href="#top" onClick={scrollToTop} aria-label="Facebook">
                <img className="footer__socialIcon" src={facebookIcon} alt="Facebook" />
              </a>
              <a href="#top" onClick={scrollToTop} aria-label="Instagram">
                <img className="footer__socialIcon" src={instagramIcon} alt="Instagram" />
              </a>
              <a href="#top" onClick={scrollToTop} aria-label="LinkedIn">
                <img className="footer__socialIcon" src={linkedinIcon} alt="LinkedIn" />
              </a>
              <a href="#top" onClick={scrollToTop} aria-label="YouTube">
                <img className="footer__socialIcon" src={youtubeIcon} alt="YouTube" />
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

export default HealthyHabits;