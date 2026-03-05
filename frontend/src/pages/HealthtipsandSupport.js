import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./HealthtipsandSupport.css";
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";

function HealthtipsandSupport() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedTip, setExpandedTip] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const profileDropdownRef = useRef(null);
  const toastTimerRef = useRef(null);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);

  const resources = [
    {
      category: "Study Tips",
      icon: "📚",
      color: "#4299e1",
      bgColor: "#ebf8ff",
      items: [
        { 
          tip: "Active recall & spaced repetition", 
          description: "Boost memory retention by testing yourself regularly",
          detailedInfo: "Active recall involves actively stimulating memory during learning. Instead of passively reading notes, close the book and recite key concepts. Spaced repetition involves reviewing information at increasing intervals. Combine these by using flashcards (physical or apps like Anki) and testing yourself 1 day, 3 days, 1 week, and 1 month after learning. This technique leverages the psychological spacing effect and is proven to dramatically improve long-term retention compared to cramming."
        },
        { 
          tip: "Break study sessions into 45-min blocks", 
          description: "Improve focus with structured study intervals",
          detailedInfo: "Research shows the brain's optimal focus duration is 45-50 minutes before attention begins to decline. Structure your study sessions into 45-minute blocks followed by 10-15 minute breaks. During breaks, step away from your desk, stretch, hydrate, or do a quick mindfulness exercise. After 4 blocks (about 3 hours of total study), take a longer 30-minute break. This pattern aligns with your brain's ultradian rhythm and prevents mental fatigue while maximizing information processing."
        },
        { 
          tip: "Use digital planners to track deadlines", 
          description: "Stay organized with calendar tools",
          detailedInfo: "Digital planners like Google Calendar, Notion, or Trello help visualize your semester at a glance. Create a master spreadsheet with all course deadlines at the start of term, then transfer tasks to weekly planners. Use color-coding by course priority, set reminder notifications 1 week, 3 days, and 1 day before deadlines, and block specific 'work sessions' for each task. This externalizes your memory load and reduces anxiety about forgetting assignments, while helping you realistically assess your workload each week."
        },
        { 
          tip: "Create mind maps for complex topics", 
          description: "Visualize connections between concepts",
          detailedInfo: "Mind mapping is a visual note-taking technique that mirrors how your brain naturally connects ideas. Start with a central concept, then branch out to related subtopics, using colors, images, and keywords rather than full sentences. This method activates both hemispheres of your brain and helps you see relationships between concepts that linear notes might miss. Tools like MindMeister or simple pen and paper work well. Review mind maps before exams to quickly refresh entire topic structures."
        },
        { 
          tip: "Join study groups for collaborative learning", 
          description: "Share knowledge and clarify doubts",
          detailedInfo: "Effective study groups (3-5 people) provide multiple benefits: explaining concepts to others solidifies your own understanding, you gain exposure to different perspectives and problem-solving approaches, and the social commitment keeps you accountable. Structure sessions by assigning each member a topic to teach for 15 minutes, then open for questions. Use the 'think-pair-share' method: individuals solve problems alone, then compare approaches with a partner, then discuss as a group."
        },
      ],
    },
    {
      category: "Stress Management",
      icon: "🧘",
      color: "#48bb78",
      bgColor: "#f0fff4",
      items: [
        { 
          tip: "Practice 5-minute breathing exercises", 
          description: "Deep breathing activates parasympathetic nervous system",
          detailedInfo: "The 4-7-8 breathing technique is scientifically proven to reduce stress: inhale quietly through your nose for 4 seconds, hold your breath for 7 seconds, exhale completely through your mouth for 8 seconds. Repeat 4-5 times. This pattern stimulates the vagus nerve, lowering heart rate and cortisol levels. Practice during study breaks, before exams, or when feeling overwhelmed. For ongoing stress management, try box breathing (4-4-4-4) or alternate nostril breathing to balance your nervous system."
        },
        { 
          tip: "Daily gratitude journaling", 
          description: "Write 3 things you're grateful for each day",
          detailedInfo: "Gratitude journaling rewires your brain to focus on positive experiences rather than threats or stressors. Each evening, write down three specific things you're grateful for (e.g., 'a friend helped me understand a difficult concept' rather than just 'friends'). Include why each happened. Research shows this practice increases optimism by 15%, improves sleep quality, and reduces stress hormones within 21 days of consistent practice. Keep a small notebook by your bed or use a gratitude app with daily reminders."
        },
        { 
          tip: "Take short mental reset walks", 
          description: "10-minute walks can reduce stress levels",
          detailedInfo: "Even brief walks in nature or green spaces significantly lower cortisol and improve mood. The combination of physical movement, change of scenery, and exposure to natural elements triggers a relaxation response. Walk without your phone, pay attention to your surroundings (birds, trees, sky), and focus on deep breathing. Research from Stanford shows that walking boosts creative thinking by up to 60% and can prevent mental burnout during intensive study periods."
        },
        { 
          tip: "Progressive muscle relaxation", 
          description: "Release tension by tensing and relaxing muscle groups",
          detailedInfo: "PMR involves systematically tensing and then relaxing different muscle groups. Start with your feet: tense for 5 seconds, then release for 30 seconds, noticing the contrast. Move upward through calves, thighs, abdomen, chest, hands, arms, shoulders, neck, and face. This technique reduces physical symptoms of stress, improves body awareness, and can be done in 10-15 minutes before bed or between study sessions. Regular practice decreases overall anxiety levels and tension headaches."
        },
        { 
          tip: "Listen to calming music or nature sounds", 
          description: "Create a relaxing study environment",
          detailedInfo: "Music without lyrics (classical, ambient, lo-fi) or nature sounds (rain, ocean waves, forest) can reduce stress by up to 65% while studying. The frequency of certain music (like 432 Hz or binaural beats) may promote focus and calm. Create playlists specifically for different activities: upbeat instrumental for active studying, ambient sounds for reading, and calming nature sounds for breaks. Use noise-cancelling headphones to create a consistent auditory environment that signals 'study mode' to your brain."
        },
      ],
    },
    {
      category: "Time Management",
      icon: "⏳",
      color: "#ed8936",
      bgColor: "#fffaf0",
      items: [
        { 
          tip: "Use the Pomodoro technique", 
          description: "25 min focus, 5 min break intervals",
          detailedInfo: "The Pomodoro Technique breaks work into 25-minute focused sessions followed by 5-minute breaks. After 4 'Pomodoros,' take a longer 15-30 minute break. This method works because it creates urgency (you only need to focus for 25 minutes), prevents burnout, and makes large tasks feel manageable. Use a physical timer or app like Focus Keeper. During breaks, completely disconnect from work—stretch, hydrate, or do something enjoyable. Track completed Pomodoros to estimate future task durations accurately."
        },
        { 
          tip: "Prioritize tasks using Eisenhower Matrix", 
          description: "Sort by urgent vs important",
          detailedInfo: "The Eisenhower Matrix helps you decide on and prioritize tasks by urgency and importance. Draw a 2x2 grid: Do First (urgent & important) - complete these immediately; Schedule (important but not urgent) - put these in your calendar; Delegate (urgent but not important) - can someone else help?; Eliminate (neither urgent nor important) - remove these entirely. Review and sort all tasks each morning. This prevents spending time on urgent-but-trivial tasks at the expense of important long-term goals."
        },
        { 
          tip: "Set realistic daily goals", 
          description: "Break large tasks into smaller achievable steps",
          detailedInfo: "The '1-3-5 Rule' suggests planning 1 big task, 3 medium tasks, and 5 small tasks per day. This prevents overcommitment while ensuring progress. Use the 'eat the frog' technique: complete your most challenging task first when your energy is highest. Break larger projects into specific, measurable actions (e.g., 'write introduction paragraph' instead of 'work on essay'). Review your goals each evening and adjust tomorrow's list based on what was actually achievable."
        },
        { 
          tip: "Time blocking your calendar", 
          description: "Schedule specific tasks for each time slot",
          detailedInfo: "Time blocking involves dividing your day into dedicated blocks for specific activities rather than working from a to-do list. Create a weekly template: assign blocks for classes, study sessions, exercise, meals, and social time. Be realistic about task duration (most people underestimate by 30%). Include buffer blocks for unexpected tasks and transition time between activities. Color-code by category (academic, self-care, social) to visualize balance. Review and adjust your schedule each Sunday for the upcoming week."
        },
        { 
          tip: "Review and plan each evening", 
          description: "5-minute planning saves hours of confusion",
          detailedInfo: "End each day with a 5-minute review: check off completed tasks, note what worked well and what didn't, and create tomorrow's priority list. This practice, called 'implementation intention,' increases follow-through by 200-300%. Review your calendar for the next day to mentally prepare for commitments. Keep a small journal or use a planning app. This evening ritual signals your brain that work is done, improving sleep quality, and ensures you start each day with clarity rather than decision fatigue."
        },
      ],
    },
    {
      category: "Professional Support",
      icon: "🏥",
      color: "#9f7aea",
      bgColor: "#faf5ff",
      items: [
        { 
          tip: "University counselling appointments", 
          description: "Free confidential sessions with professionals",
          detailedInfo: "Most universities offer free, confidential counselling services for students. Sessions typically address anxiety, depression, academic stress, relationship issues, and adjustment concerns. Appointments usually last 50 minutes, with options for short-term therapy (6-12 sessions) or referrals for longer-term support. Many now offer virtual appointments for flexibility. To access services, visit your university health center website or call directly. Crisis appointments are usually available within 24-48 hours. All sessions are protected by confidentiality laws."
        },
        { 
          tip: "Mental health hotline access", 
          description: "24/7 support for crisis situations",
          detailedInfo: "Crisis hotlines provide immediate, confidential support from trained counselors. Save these numbers in your phone: National Suicide Prevention Lifeline (988), Crisis Text Line (text HOME to 741741), or your university's after-hours crisis line. These services are free, confidential, and available 24/7. Counselors can help with suicidal thoughts, panic attacks, trauma responses, or overwhelming stress. They provide immediate de-escalation, safety planning, and referrals to ongoing support. Don't hesitate to call—crises are temporary, and help is always available."
        },
        { 
          tip: "Wellness workshops & seminars", 
          description: "Learn coping strategies from experts",
          detailedInfo: "Universities regularly offer free workshops on topics like mindfulness, stress management, time management, and resilience building. These group sessions (1-2 hours) provide practical skills in a supportive environment. Topics often include: meditation basics, exam anxiety management, sleep hygiene, healthy relationships, and cultural adjustment. Workshops let you learn from experts while connecting with peers facing similar challenges. Check your university's wellness center calendar, student affairs website, or counseling center newsletter for upcoming sessions."
        },
        { 
          tip: "Peer support groups", 
          description: "Connect with students facing similar challenges",
          detailedInfo: "Peer support groups bring together students with shared experiences (academic stress, anxiety, grief, identity exploration, etc.) in a facilitated, confidential setting. Groups are typically led by trained peer supporters or mental health professionals. Benefits include reduced isolation, learning coping strategies from others, and practicing vulnerability in a safe space. Many universities offer groups for specific populations (graduate students, international students, LGBTQ+ students). Meetings usually occur weekly or bi-weekly for 60-90 minutes."
        },
        { 
          tip: "Online therapy resources", 
          description: "Digital platforms for remote counseling",
          detailedInfo: "Online therapy platforms like BetterHelp, Talkspace, and 7 Cups offer flexible, affordable counseling options. Features include messaging, live chat, phone sessions, and video calls with licensed therapists. Many platforms offer student discounts or work with university insurance plans. Some apps provide specific support: Calm and Headspace for meditation, Woebot for CBT techniques, and Youper for mood tracking. Check if your university provides free access to any platforms. Online options are particularly helpful for students with busy schedules or those who prefer text-based communication."
        },
      ],
    },
    {
      category: "Physical Health",
      icon: "💪",
      color: "#f56565",
      bgColor: "#fff5f5",
      items: [
        { 
          tip: "Maintain consistent sleep schedule", 
          description: "7-9 hours of sleep improves cognitive function",
          detailedInfo: "Sleep is critical for memory consolidation, emotional regulation, and physical recovery. Aim for 7-9 hours nightly, going to bed and waking at consistent times (even weekends). Create a wind-down routine 30-60 minutes before bed: dim lights, avoid screens (blue light disrupts melatonin), read a physical book, or do light stretching. Avoid caffeine after 2pm and large meals within 3 hours of bedtime. Poor sleep reduces focus by 30% and increases irritability. Use apps like Sleep Cycle to track patterns and wake during light sleep phases."
        },
        { 
          tip: "Stay hydrated throughout the day", 
          description: "Aim for 8 glasses of water daily",
          detailedInfo: "Even mild dehydration (1-2% fluid loss) impairs cognitive function, concentration, and physical performance. The general guideline is 8 cups (2 liters) daily, but needs vary by activity level and climate. Keep a reusable water bottle at your desk and refill it 3-4 times daily. Set phone reminders, use water-tracking apps, or drink a glass before each meal and study session. Add lemon, cucumber, or herbal tea for variety. Signs of adequate hydration: clear to light-yellow urine, regular bathroom breaks, and no excessive thirst."
        },
        { 
          tip: "Incorporate movement between study sessions", 
          description: "Stretching prevents physical strain",
          detailedInfo: "Prolonged sitting causes muscle tension, back pain, and reduced circulation. During study breaks, do 2-3 minutes of movement: neck rolls, shoulder shrugs, wrist stretches, standing backbends, or walking in place. Set a timer to stand up every 30-45 minutes. Consider a standing desk converter or alternating between sitting and standing. Regular movement improves blood flow to the brain, increasing alertness and reducing fatigue. Simple exercises like desk pushups or chair squats can also maintain muscle tone during long study days."
        },
        { 
          tip: "Healthy snack options for energy", 
          description: "Nuts, fruits, and yogurt boost concentration",
          detailedInfo: "Blood sugar crashes cause fatigue and poor focus. Choose snacks combining protein, healthy fats, and complex carbs: apple slices with peanut butter, Greek yogurt with berries, hummus with vegetables, trail mix (unsalted nuts + dark chocolate), or hard-boiled eggs. Avoid sugary snacks and simple carbs (candy, chips, soda) that cause energy spikes and crashes. Prep snacks in advance and keep them in your backpack. Eat small snacks every 3-4 hours to maintain steady energy levels during study sessions."
        },
        { 
          tip: "Regular exercise routine", 
          description: "30 minutes of activity reduces anxiety",
          detailedInfo: "Exercise releases endorphins, reduces stress hormones, and improves sleep quality. Aim for 150 minutes of moderate activity weekly (30 minutes, 5 days/week). This could be brisk walking, jogging, cycling, swimming, or gym workouts. Even short 10-minute bursts of activity are beneficial. Join university fitness classes, intramural sports, or find a workout buddy for accountability. Exercise also provides a mental break from academics and can be a form of active meditation. Schedule workouts like classes to ensure consistency."
        },
      ],
    },
    {
      category: "Mental Wellness",
      icon: "🧠",
      color: "#38b2ac",
      bgColor: "#e6fffa",
      items: [
        { 
          tip: "Practice mindfulness meditation", 
          description: "5-10 minutes daily improves focus",
          detailedInfo: "Mindfulness involves paying attention to the present moment without judgment. Start with 5 minutes daily: sit comfortably, focus on your breath, and when your mind wanders (it will!), gently bring attention back. Use apps like Headspace, Calm, or Insight Timer for guided sessions. Benefits include reduced stress, improved concentration, better emotional regulation, and increased self-awareness. Research shows 8 weeks of regular practice can change brain structure, reducing amygdala size (fear center) and increasing prefrontal cortex thickness (executive function)."
        },
        { 
          tip: "Set boundaries with technology", 
          description: "Digital detox hours improve sleep",
          detailedInfo: "Constant notifications fragment attention and increase anxiety. Implement 'tech-free' periods: no phones during meals, the first hour after waking, or the last hour before bed. Use built-in screen time features to block distracting apps during study hours. Turn off all notifications except essential calls/messages. Designate phone-free zones (bedroom, study desk). Try a 'digital Sunday' once monthly with minimal technology. These boundaries restore attention span, improve face-to-face relationships, and reduce the compulsive checking that drains mental energy."
        },
        { 
          tip: "Connect with friends regularly", 
          description: "Social support is crucial for mental health",
          detailedInfo: "Strong social connections buffer against stress and increase resilience. Schedule regular time with friends: weekly coffee, study dates, or phone calls with distant friends. Join student organizations, clubs, or study groups to build community. Quality matters more than quantity—focus on a few meaningful relationships rather than many superficial ones. Be vulnerable and share struggles, not just successes. Research shows people with strong social support have lower cortisol levels, better immune function, and recover faster from setbacks."
        },
        { 
          tip: "Challenge negative thoughts", 
          description: "Cognitive restructuring techniques",
          detailedInfo: "Cognitive restructuring helps identify and challenge unhelpful thought patterns. Common distortions include catastrophizing (assuming worst case), all-or-nothing thinking, and overgeneralization. When you notice negative thoughts, write them down, identify the distortion, and generate balanced alternatives. For example, change 'I'll fail this course' to 'I'm struggling with one assignment, but I've passed similar courses before.' This CBT technique reduces anxiety and builds realistic thinking. Practice regularly until it becomes automatic."
        },
        { 
          tip: "Celebrate small achievements", 
          description: "Acknowledge progress, not just results",
          detailedInfo: "Our brains are wired for negativity bias—we focus on what went wrong rather than right. Counter this by deliberately acknowledging daily wins, no matter how small: finishing a reading, asking a question in class, or going to the gym. Keep a 'win list' and review it when discouraged. Reward yourself for completing tasks (not just perfect outcomes). This builds intrinsic motivation and resilience. Research shows people who celebrate progress are more persistent and satisfied, even when facing setbacks."
        },
      ],
    },
  ];

  const categories = ["all", ...new Set(resources.map(r => r.category))];

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

  const toggleTip = (tipId) => {
    if (expandedTip === tipId) {
      setExpandedTip(null);
    } else {
      setExpandedTip(tipId);
    }
  };

  const filteredResources = resources.filter((section) => {
    const matchesSearch = section.category.toLowerCase().includes(search.toLowerCase()) ||
      section.items.some(item => item.tip.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || section.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveTip = (tip, e) => {
    e.stopPropagation();
    showToast(`✨ Tip saved: "${tip}"`);
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
            <Link to="/health/tips" className="nav__link--active" onClick={() => setIsNavOpen(false)}>
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
      <section className="tips-hero">
        <div className="container">
          <div className="tips-hero__content">
            <span className="tips-hero__badge">Wellness Resources</span>
            <h1 className="tips-hero__title">Health Tips & Support</h1>
            <p className="tips-hero__subtitle">
              Evidence-based strategies and professional resources to support your mental 
              and physical wellbeing throughout your academic journey.
            </p>
            
            <div className="tips-hero__stats">
              <div className="tips-hero__stat">
                <span className="tips-hero__stat-value">50+</span>
                <span className="tips-hero__stat-label">Expert Tips</span>
              </div>
              <div className="tips-hero__stat">
                <span className="tips-hero__stat-value">24/7</span>
                <span className="tips-hero__stat-label">Support Available</span>
              </div>
              <div className="tips-hero__stat">
                <span className="tips-hero__stat-value">6</span>
                <span className="tips-hero__stat-label">Wellness Categories</span>
              </div>
            </div>
          </div>
        </div>
        <div className="tips-hero__pattern"></div>
      </section>

      {/* ================= SEARCH & FILTERS ================= */}
      <section className="tips-filters">
        <div className="container">
          <div className="tips-filters__wrapper">
            <div className="tips-search">
              <span className="tips-search__icon">🔍</span>
              <input
                type="text"
                placeholder="Search tips, strategies, or resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="tips-search__input"
              />
              {search && (
                <button 
                  className="tips-search__clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="tips-categories">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`tips-categories__btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "all" ? "🎯 All Topics" : category}
                </button>
              ))}
            </div>
          </div>

          <div className="tips-results-count">
            Showing <strong>{filteredResources.length}</strong> {filteredResources.length === 1 ? 'category' : 'categories'}
            {search && ` matching "${search}"`}
          </div>
        </div>
      </section>

      {/* ================= RESOURCE CARDS ================= */}
      <section className="tips-content">
        <div className="container">
          {filteredResources.length > 0 ? (
            <div className="tips-grid">
              {filteredResources.map((section) => (
                <div className="tips-card" key={section.category}>
                  <div className="tips-card__header" style={{ backgroundColor: section.bgColor }}>
                    <span className="tips-card__icon" style={{ color: section.color }}>
                      {section.icon}
                    </span>
                    <h3 className="tips-card__title" style={{ color: section.color }}>
                      {section.category}
                    </h3>
                  </div>
                  
                  <div className="tips-card__body">
                    <ul className="tips-card__list">
                      {section.items.map((item, index) => {
                        const tipId = `${section.category}-${index}`;
                        const isExpanded = expandedTip === tipId;
                        
                        return (
                          <li key={index} className="tips-card__item">
                            <div 
                              className="tips-card__item-content"
                              onClick={() => toggleTip(tipId)}
                              style={{ cursor: 'pointer' }}
                            >
                              <span className="tips-card__item-bullet" style={{ backgroundColor: section.color }}></span>
                              <div className="tips-card__item-text">
                                <strong className="tips-card__item-title">{item.tip}</strong>
                                <p className="tips-card__item-description">{item.description}</p>
                                
                                {isExpanded && (
                                  <div className="tips-card__item-detailed">
                                    <p>{item.detailedInfo}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <button 
                              className="tips-card__save-btn"
                              onClick={(e) => handleSaveTip(item.tip, e)}
                              aria-label="Save tip"
                            >
                              📌
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  
                  <div className="tips-card__footer">
                    <span className="tips-card__count">{section.items.length} tips</span>
                    <button 
                      className="tips-card__explore-btn"
                      onClick={() => setSelectedCategory(section.category)}
                    >
                      Explore All →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="tips-no-results">
              <div className="tips-no-results__icon">🔍</div>
              <h3 className="tips-no-results__title">No resources found</h3>
              <p className="tips-no-results__text">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button 
                className="btn btn--primary"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================= EMERGENCY SUPPORT BANNER ================= */}
      <section className="tips-emergency">
        <div className="container">
          <div className="tips-emergency__content">
            <div className="tips-emergency__icon">🆘</div>
            <div className="tips-emergency__text">
              <h3 className="tips-emergency__title">Need Immediate Support?</h3>
              <p className="tips-emergency__subtitle">
                Our crisis support team is available 24/7 for confidential assistance.
              </p>
            </div>
            <div className="tips-emergency__actions">
              <a href="tel:+94117544801" className="tips-emergency__phone">
                📞 Call Now
              </a>
              <button 
                className="tips-emergency__chat"
                onClick={() => showToast("Live chat connecting...")}
              >
                💬 Live Chat
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="container footer__panel">
          <div className="footer__support">
            <p className="footer__kicker">Need Support?</p>
            <h3 className="footer__heading">Wellness Resources</h3>
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
              <button className="footer__quick-link footer__quick-link--btn" onClick={() => showToast("Workshops coming soon")}>
                Wellness Workshops
              </button>
              <button className="footer__quick-link footer__quick-link--btn" onClick={() => showToast("Resources coming soon")}>
                Downloadable Guides
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

export default HealthtipsandSupport;