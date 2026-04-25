import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sportsAPI } from "../services/api";
import "./Sports.css";
import "./Home.css";
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";
import sportIcon from "../images/sport.png";
import cricketImg from "../images/cricket.png";
import swimmingImg from "../images/swimming.png";
import chessImg from "../images/chess.png";
import badmintonImg from "../images/badminton.png";
import carromImg from "../images/carrom.png";
import footballImg from "../images/football.png";
import volleyballImg from "../images/volleyball.png";
import netballImg from "../images/netball.png";

// Sports data with registration periods
const initialSportsData = [
  {
    id: "cricket",
    name: "Cricket Team Selection",
    category: "Team Selection",
    description: "Join the university cricket team and represent us in inter-university tournaments.",
    registrationOpen: "2026-01-01",
    registrationClose: "2026-02-05",
    venue: "Cricket Ground",
    coach: "Coach Rajitha Silva",
    maxCapacity: 100,
    registered: 100,
    eligibility: "All students with basic cricket knowledge",
    selectionCriteria: "Batting, Bowling, Fielding skills assessment",
    requiresMedical: true,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://www.sliit.lk/student-life/sports/",
    image: cricketImg,
  },
  {
    id: "volleyball",
    name: "Volleyball Tournament",
    category: "Tournament",
    description: "Compete in the annual inter-batch volleyball tournament.",
    registrationOpen: "2026-03-05",
    registrationClose: "2026-03-30",
    venue: "Indoor Sports Complex",
    coach: "Coach Nimal Fernando",
    maxCapacity: 80,
    registered: 62,
    eligibility: "All students",
    selectionCriteria: "Team formation and skill assessment",
    requiresMedical: false,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://www.sliit.lk/student-life/sports/",
    image: volleyballImg,
  },
  {
    id: "netball",
    name: "Netball Team Trials",
    category: "Team Selection",
    description: "Try out for the university netball team.",
    registrationOpen: "2026-06-10",
    registrationClose: "2026-07-05",
    venue: "Netball Court",
    coach: "Coach Sanduni Perera",
    maxCapacity: 60,
    registered: 38,
    eligibility: "Female students only",
    selectionCriteria: "Agility, teamwork, and game knowledge",
    requiresMedical: true,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://www.sliit.lk/student-life/sports/",
    image: netballImg,
  },
  {
    id: "badminton",
    name: "Badminton Championship",
    category: "Tournament",
    description: "Annual badminton singles and doubles championship.",
    registrationOpen: "2026-02-25",
    registrationClose: "2026-03-20",
    venue: "Indoor Sports Hall",
    coach: "Coach Kasun Jayawardena",
    maxCapacity: 120,
    registered: 98,
    eligibility: "All students",
    selectionCriteria: "Singles and doubles matches",
    requiresMedical: false,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://www.sliit.lk/student-life/sports/",
    image: badmintonImg,
  },
  {
    id: "chess",
    name: "Chess Tournament",
    category: "Tournament",
    description: "Strategic chess tournament for all skill levels.",
    registrationOpen: "2026-03-08",
    registrationClose: "2026-04-10",
    venue: "Chess Club Room",
    coach: "Instructor Pradeep Kumar",
    maxCapacity: 50,
    registered: 33,
    eligibility: "All students",
    selectionCriteria: "Round-robin tournament format",
    requiresMedical: false,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://www.sliit.lk/student-life/sports/",
    image: chessImg,
  },
  {
    id: "carrom",
    name: "Carrom Championship",
    category: "Tournament",
    description: "Inter-batch carrom singles and doubles tournament.",
    registrationOpen: "2026-03-15",
    registrationClose: "2026-04-15",
    venue: "Recreation Center",
    coach: "Coordinator Ruwan Silva",
    maxCapacity: 40,
    registered: 25,
    eligibility: "All students",
    selectionCriteria: "Tournament knockout rounds",
    requiresMedical: false,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://www.sliit.lk/student-life/sports/",
    image: carromImg,
  },
  {
    id: "football",
    name: "Football Team Selection",
    category: "Team Selection",
    description: "Selection for university football team.",
    registrationOpen: "2026-02-28",
    registrationClose: "2026-03-28",
    venue: "Football Field",
    coach: "Coach Dilshan Wickramasinghe",
    maxCapacity: 70,
    registered: 54,
    eligibility: "All students",
    selectionCriteria: "Singles matches and reaction time",
    requiresMedical: false,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://www.sliit.lk/student-life/sports/",
    image: footballImg,
  },
  {
    id: "swimming",
    name: "Swimming Team Selection",
    category: "Team Selection",
    description: "Join the university swimming team for competitive events.",
    registrationOpen: "2026-06-20",
    registrationClose: "2026-07-20",
    venue: "University Pool",
    coach: "Coach Nimali Wickramarachchi",
    maxCapacity: 50,
    registered: 12,
    eligibility: "Students with swimming certification",
    selectionCriteria: "Freestyle, backstroke, breaststroke trials",
    requiresMedical: true,
    skillLevels: ["Intermediate", "Advanced"],
    registrationLink: "https://www.sliit.lk/student-life/sports/",
    image: swimmingImg,
  },
];

const normalizeSportKey = (sport) =>
  String(sport?.id || sport?._id || sport?.name || "")
    .trim()
    .toLowerCase();

const loadStoredSports = () => {
  try {
    const storedSports = localStorage.getItem("campuszone_sports");
    if (!storedSports) {
      return initialSportsData;
    }

    const parsedSports = JSON.parse(storedSports);
    return Array.isArray(parsedSports) && parsedSports.length > 0 ? parsedSports : initialSportsData;
  } catch (error) {
    console.error("Failed to read stored sports:", error);
    return initialSportsData;
  }
};

const mergeSports = (baseSports, incomingSports) => {
  const mergedMap = new Map();

  baseSports.forEach((sport) => {
    mergedMap.set(normalizeSportKey(sport), sport);
  });

  incomingSports.forEach((sport) => {
    const key = normalizeSportKey(sport);
    const existing = mergedMap.get(key);
    mergedMap.set(key, existing ? { ...existing, ...sport } : sport);
  });

  return Array.from(mergedMap.values());
};

const addActivityNotification = ({ title, message, category }) => {
  try {
    const existing = JSON.parse(localStorage.getItem("campuszone_notifications") || "[]");
    const next = [
      {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        message,
        category,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...(Array.isArray(existing) ? existing : []),
    ].slice(0, 100);
    localStorage.setItem("campuszone_notifications", JSON.stringify(next));
  } catch (error) {
    console.error("Failed to save notification:", error);
  }
};

function Sports() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const authToken = localStorage.getItem("token");
  const isAdmin = currentUser?.role === "admin";
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sports, setSports] = useState(loadStoredSports);
  const [selectedSport, setSelectedSport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSportFormModal, setShowSportFormModal] = useState(false);
  const [editingSport, setEditingSport] = useState(null);
  const [sportFormData, setSportFormData] = useState({
    name: "",
    category: "Tournament",
    description: "",
    registrationOpen: "",
    registrationClose: "",
    venue: "",
    coach: "",
    maxCapacity: 50,
    eligibility: "All students",
    selectionCriteria: "Skill assessment",
    requiresMedical: false,
    registrationLink: "#",
    skillLevelsText: "Beginner, Intermediate, Advanced",
  });
  const [sportFormErrors, setSportFormErrors] = useState({});
  const [sportFormTouched, setSportFormTouched] = useState({});
  const [sportSubmitAttempted, setSportSubmitAttempted] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const profileRef = useRef(null);
  const sportImageInputRef = useRef(null);
  const sportFieldRefs = useRef({});
  const hasFetchedSportsRef = useRef(false);
  const [sportImagePreview, setSportImagePreview] = useState("");
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isSubmittingSport, setIsSubmittingSport] = useState(false);

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  // Debug: Log when Sports page loads
  useEffect(() => {
    console.log('Sports page loaded successfully!');
    console.log('Initial sports data:', initialSportsData.length, 'items');
    document.title = 'Sports - CampusZone';
  }, []);

  // Fetch sports data from API
  useEffect(() => {
    if (hasFetchedSportsRef.current) {
      return;
    }
    hasFetchedSportsRef.current = true;

    const fetchSports = async () => {
      try {
        console.log('Fetching sports from API...');
        const response = await sportsAPI.getAllSports();

        if (response.success && response.data && response.data.length > 0) {
          // Map backend data to match frontend format
          const mappedSports = response.data.map((sport) => {
            // Find matching initial data for image fallback
            const initialSport = initialSportsData.find(s => s.id === sport._id || s.name === sport.name);
            return {
              id: sport._id,
              name: sport.name,
              category: sport.category,
              description: sport.description,
              registrationOpen: sport.registrationOpen,
              registrationClose: sport.registrationClose,
              venue: sport.venue,
              coach: sport.coach,
              maxCapacity: sport.maxCapacity,
              registered: sport.registered,
              eligibility: sport.eligibility,
              selectionCriteria: sport.selectionCriteria,
              requiresMedical: sport.requiresMedical,
              skillLevels: sport.skillLevels,
              registrationLink: sport.registrationLink,
              image: sport.image || (initialSport ? initialSport.image : sportIcon),
            };
          });
          console.log('API sports loaded:', mappedSports.length);
          setSports((prev) => mergeSports(prev, mappedSports));
        } else {
          // API returned no data, keep initial data
          console.log('API returned no data, keeping initial sports data');
          setError('Using sample sports data.');
        }
      } catch (err) {
        console.error('Error fetching sports:', err);
        setError('Failed to load sports. Showing sample data.');
        console.log('Using initial sports data due to error');
        // Don't call setSports, keep the initial data
      } finally {
        setLoading(false);
      }
    };

    // Set initial loading state
    setLoading(true);
    setError(null);
    fetchSports();
  }, []);

  useEffect(() => {
    localStorage.setItem("campuszone_sports", JSON.stringify(sports));
  }, [sports]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsNavOpen(false);
        setIsProfileOpen(false);
        setShowDetailsModal(false);
        setShowSportFormModal(false);
        setShowNotifications(false);
      }
    };

    const onDocumentClick = (event) => {
      const target = event.target;
      if (!target || !navLinksRef.current || !navToggleRef.current) return;
      const clickedInsideNav =
        navLinksRef.current.contains(target) || navToggleRef.current.contains(target);
      const clickedInsideProfile = profileRef.current && profileRef.current.contains(target);
      if (!clickedInsideNav) setIsNavOpen(false);
      if (!clickedInsideProfile) setIsProfileOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onDocumentClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocumentClick);
    };
  }, []);

  // Check registration status and generate notifications
  useEffect(() => {
    const today = new Date();
    const newNotifications = [];

    sports.forEach((sport) => {
      const openDate = new Date(sport.registrationOpen);
      const closeDate = new Date(sport.registrationClose);
      const twoDaysBefore = new Date(closeDate);
      twoDaysBefore.setDate(closeDate.getDate() - 2);
      const twoDaysBeforeOpen = new Date(openDate);
      twoDaysBeforeOpen.setDate(openDate.getDate() - 2);

      // Registration opening today
      if (today.toDateString() === openDate.toDateString()) {
        newNotifications.push({
          id: `open-${sport.id}`,
          type: "success",
          message: `${sport.name} registration is now OPEN!`,
          sport: sport.name,
          date: today,
        });
      }

      // Registration opening soon
      if (today >= twoDaysBeforeOpen && today < openDate) {
        const daysUntilOpen = Math.ceil((openDate - today) / (1000 * 60 * 60 * 24));
        newNotifications.push({
          id: `opening-${sport.id}`,
          type: "warning",
          message: `${sport.name} registration opens in ${daysUntilOpen} day${daysUntilOpen > 1 ? "s" : ""}.`,
          sport: sport.name,
          date: today,
        });
      }

      // 2 days before closing
      if (today >= twoDaysBefore && today < closeDate) {
        const daysLeft = Math.ceil((closeDate - today) / (1000 * 60 * 60 * 24));
        newNotifications.push({
          id: `warning-${sport.id}`,
          type: "warning",
          message: `${sport.name} registration closes in ${daysLeft} day${daysLeft > 1 ? 's' : ''}!`,
          sport: sport.name,
          date: today,
        });
      }

      // Last day
      if (today.toDateString() === closeDate.toDateString()) {
        newNotifications.push({
          id: `lastday-${sport.id}`,
          type: "urgent",
          message: `LAST DAY! ${sport.name} registration closes today!`,
          sport: sport.name,
          date: today,
        });
      }
    });

    setNotifications(newNotifications);
  }, [sports]);

  const validateSportField = (fieldName, value, allValues) => {
    const trimmed = typeof value === "string" ? value.trim() : value;
    const hasLetters = typeof trimmed === "string" && /[A-Za-z]/.test(trimmed);

    switch (fieldName) {
      case "name":
        if (!trimmed) return "Sport name is required.";
        if (trimmed.length < 3) return "Name must be at least 3 characters.";
        if (trimmed.length > 100) return "Name cannot exceed 100 characters.";
        if (!hasLetters) return "Name cannot contain only numbers or symbols.";
        return "";
      case "category":
        if (!trimmed) return "Category is required.";
        return "";
      case "description":
        if (!trimmed) return "Description is required.";
        if (trimmed.length < 20) return "Description must be at least 20 characters.";
        if (trimmed.length > 1000) return "Description cannot exceed 1000 characters.";
        if (!hasLetters) return "Description cannot contain only numbers or symbols.";
        return "";
      case "venue":
        if (!trimmed) return "Venue is required.";
        if (trimmed.length < 3) return "Venue must be at least 3 characters.";
        if (!hasLetters) return "Venue cannot contain only numbers or symbols.";
        return "";
      case "coach":
        if (!trimmed) return "Coach name is required.";
        if (trimmed.length < 3) return "Coach name must be at least 3 characters.";
        if (!hasLetters) return "Coach name cannot contain only numbers or symbols.";
        return "";
      case "registrationOpen": {
        if (!trimmed) return "Registration open date is required.";
        const openDate = new Date(`${trimmed}T00:00:00`);
        if (Number.isNaN(openDate.getTime())) return "Please provide a valid open date.";
        if (trimmed < getTodayDate()) return "Registration open date cannot be in the past.";
        return "";
      }
      case "registrationClose": {
        if (!trimmed) return "Registration close date is required.";
        const closeDate = new Date(`${trimmed}T00:00:00`);
        const openDate = new Date(`${allValues.registrationOpen}T00:00:00`);
        if (Number.isNaN(closeDate.getTime())) return "Please provide a valid close date.";
        if (trimmed < getTodayDate()) return "Registration close date cannot be in the past.";
        if (!Number.isNaN(openDate.getTime()) && closeDate < openDate) {
          return "Close date must be the same as or after open date.";
        }
        return "";
      }
      case "maxCapacity": {
        const max = Number(value);
        if (!Number.isFinite(max) || max < 1) return "Max capacity must be at least 1.";
        if (max > 10000) return "Max capacity cannot exceed 10000.";
        return "";
      }
      case "eligibility":
        if (!trimmed) return "Eligibility is required.";
        if (trimmed.length < 5) return "Eligibility must be at least 5 characters.";
        return "";
      case "selectionCriteria":
        if (!trimmed) return "Selection criteria is required.";
        if (trimmed.length < 5) return "Selection criteria must be at least 5 characters.";
        return "";
      case "skillLevelsText":
        if (!trimmed) return "Skill levels are required.";
        if (trimmed.length < 3) return "Skill levels must be at least 3 characters.";
        return "";
      case "registrationLink":
        if (!trimmed || trimmed === "#") return "";
        if (!/^https?:\/\//i.test(trimmed)) return "Registration link must start with http:// or https://.";
        return "";
      default:
        return "";
    }
  };

  const validateSportForm = (values) => ({
    name: validateSportField("name", values.name, values),
    category: validateSportField("category", values.category, values),
    description: validateSportField("description", values.description, values),
    venue: validateSportField("venue", values.venue, values),
    coach: validateSportField("coach", values.coach, values),
    registrationOpen: validateSportField("registrationOpen", values.registrationOpen, values),
    registrationClose: validateSportField("registrationClose", values.registrationClose, values),
    maxCapacity: validateSportField("maxCapacity", values.maxCapacity, values),
    eligibility: validateSportField("eligibility", values.eligibility, values),
    selectionCriteria: validateSportField("selectionCriteria", values.selectionCriteria, values),
    skillLevelsText: validateSportField("skillLevelsText", values.skillLevelsText, values),
    registrationLink: validateSportField("registrationLink", values.registrationLink, values),
  });

  const shouldShowSportError = (fieldName) =>
    Boolean((sportFormTouched[fieldName] || sportSubmitAttempted) && sportFormErrors[fieldName]);

  const getRegistrationStatus = (sport) => {
    const now = new Date();

    // Normalize to date-only boundaries to avoid timezone/time-of-day issues.
    const openDate = new Date(`${String(sport.registrationOpen).slice(0, 10)}T00:00:00`);
    const closeDate = new Date(`${String(sport.registrationClose).slice(0, 10)}T23:59:59`);

    if (Number.isNaN(openDate.getTime()) || Number.isNaN(closeDate.getTime())) {
      return { status: "CLOSED", class: "status--closed", disabled: true };
    }

    if (now < openDate) {
      return { status: "COMING SOON", class: "status--comingSoon", disabled: true };
    } else if (now >= openDate && now <= closeDate) {
      if (sport.registered >= sport.maxCapacity) {
        return { status: "FULL", class: "status--full", disabled: true };
      }
      return { status: "OPEN", class: "status--open", disabled: false };
    } else {
      return { status: "CLOSED", class: "status--closed", disabled: true };
    }
  };

  const handleViewDetails = (sport) => {
    setSelectedSport(sport);
    setShowDetailsModal(true);
  };

  const handleRegister = (sport) => {
    const statusInfo = getRegistrationStatus(sport);

    if (statusInfo.disabled) {
      alert(`Registration is ${statusInfo.status}. Cannot register at this time.`);
      return;
    }

    // Open the registration link in a new tab
    window.open(sport.registrationLink, '_blank');
  };

  const handleEditSport = async (sport) => {
    if (!isAdmin) {
      alert("Only administrators can update sports.");
      return;
    }

    setEditingSport(sport);
    setSportFormData({
      name: sport.name || "",
      category: sport.category || "Tournament",
      description: sport.description || "",
      registrationOpen: sport.registrationOpen ? String(sport.registrationOpen).slice(0, 10) : "",
      registrationClose: sport.registrationClose ? String(sport.registrationClose).slice(0, 10) : "",
      venue: sport.venue || "",
      coach: sport.coach || "",
      maxCapacity: sport.maxCapacity || 50,
      eligibility: sport.eligibility || "All students",
      selectionCriteria: sport.selectionCriteria || "Skill assessment",
      requiresMedical: Boolean(sport.requiresMedical),
      registrationLink: sport.registrationLink || "#",
      skillLevelsText: Array.isArray(sport.skillLevels) ? sport.skillLevels.join(", ") : "Beginner, Intermediate, Advanced",
    });
    setSportFormErrors({});
    setSportFormTouched({});
    setSportSubmitAttempted(false);
    setSportImagePreview(sport.image || "");
    setShowSportFormModal(true);
  };

  const resetSportForm = () => {
    setSportFormData({
      name: "",
      category: "Tournament",
      description: "",
      registrationOpen: "",
      registrationClose: "",
      venue: "",
      coach: "",
      maxCapacity: 50,
      eligibility: "All students",
      selectionCriteria: "Skill assessment",
      requiresMedical: false,
      registrationLink: "https://forms.google.com",
      skillLevelsText: "Beginner, Intermediate, Advanced",
    });
    setSportFormErrors({});
    setSportFormTouched({});
    setSportSubmitAttempted(false);
    setSportImagePreview("");
    setEditingSport(null);
    if (sportImageInputRef.current) {
      sportImageInputRef.current.value = "";
    }
  };

  const openAddSportModal = () => {
    resetSportForm();
    setShowSportFormModal(true);
  };

  const closeSportFormModal = () => {
    setShowSportFormModal(false);
    setEditingSport(null);
  };

  const handleSportImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSportImagePreview(reader.result ? String(reader.result) : "");
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteSport = async (sportId) => {
    if (!isAdmin) {
      alert("Only administrators can delete sports.");
      return;
    }

    if (!window.confirm("Delete this sport?")) return;

    if (!authToken) {
      setToastText("❌ Please login as admin to delete sports.");
      setToastVisible(true);
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      await sportsAPI.deleteSport(sportId, authToken);
      setSports((prev) => prev.filter((item) => item.id !== sportId));
      setToastText("✅ Sport deleted successfully!");
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    } catch (error) {
      console.error("API delete sport failed:", error);
      const errorMessage = error?.message || "Failed to delete sport";

      if (/token expired|not authorized|invalid token/i.test(errorMessage)) {
        localStorage.removeItem("token");
        setToastText("❌ Session expired. Please login again.");
        setToastVisible(true);
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      setToastText(`❌ ${errorMessage}`);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    }
  };

  const handleSportFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSportFormData((prev) => {
      const nextValues = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (sportFormTouched[name] || sportSubmitAttempted) {
        setSportFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validateSportField(name, nextValues[name], nextValues),
          ...(name === "registrationOpen"
            ? { registrationClose: validateSportField("registrationClose", nextValues.registrationClose, nextValues) }
            : {}),
        }));
      }

      return nextValues;
    });
  };

  const handleSportFormBlur = (e) => {
    const { name } = e.target;
    setSportFormTouched((prev) => ({ ...prev, [name]: true }));
    setSportFormErrors((prev) => ({
      ...prev,
      [name]: validateSportField(name, sportFormData[name], sportFormData),
    }));
  };

  const handleSportFormSubmit = async (e) => {
    e.preventDefault();

    if (isSubmittingSport) {
      return;
    }

    if (!editingSport && !sportImagePreview) {
      alert("Please upload an image for the sport.");
      return;
    }

    const nextErrors = validateSportForm(sportFormData);
    setSportFormErrors(nextErrors);
    setSportSubmitAttempted(true);
    setSportFormTouched({
      name: true,
      category: true,
      description: true,
      venue: true,
      coach: true,
      registrationOpen: true,
      registrationClose: true,
      maxCapacity: true,
      eligibility: true,
      selectionCriteria: true,
      skillLevelsText: true,
      registrationLink: true,
    });

    const fieldOrder = [
      "name",
      "category",
      "description",
      "venue",
      "coach",
      "registrationOpen",
      "registrationClose",
      "maxCapacity",
      "eligibility",
      "selectionCriteria",
      "skillLevelsText",
      "registrationLink",
    ];

    const firstErrorField = fieldOrder.find((fieldName) => nextErrors[fieldName]);
    if (firstErrorField) {
      const firstField = sportFieldRefs.current[firstErrorField];
      if (firstField) {
        firstField.scrollIntoView({ behavior: "smooth", block: "center" });
        if (typeof firstField.focus === "function") {
          firstField.focus();
        }
      }
      return;
    }

    const skillLevels = sportFormData.skillLevelsText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      name: sportFormData.name,
      category: sportFormData.category,
      description: sportFormData.description,
      registrationOpen: sportFormData.registrationOpen,
      registrationClose: sportFormData.registrationClose,
      venue: sportFormData.venue,
      coach: sportFormData.coach,
      maxCapacity: Number(sportFormData.maxCapacity),
      eligibility: sportFormData.eligibility,
      selectionCriteria: sportFormData.selectionCriteria,
      requiresMedical: sportFormData.requiresMedical,
      registrationLink: sportFormData.registrationLink || "#",
      skillLevels,
      image: sportImagePreview || (editingSport?.image || ""),
    };

    setIsSubmittingSport(true);

    try {
      if (editingSport) {
        if (authToken) {
          try {
            await sportsAPI.updateSport(editingSport.id, payload, authToken);
          } catch (error) {
            console.error("API update sport failed, using local update:", error);
          }
        }

        setSports((prev) => prev.map((item) => (item.id === editingSport.id ? { ...item, ...payload, skillLevels } : item)));
        const updatedSports = sports.map((item) => (item.id === editingSport.id ? { ...item, ...payload, skillLevels, registered: item.registered } : item));
        setSports(updatedSports);
        localStorage.setItem("campuszone_sports", JSON.stringify(updatedSports));
        setShowSportFormModal(false);
        resetSportForm();
        setToastText("✅ Sport updated successfully!");
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
        return;
      }

      if (authToken) {
        try {
          const response = await sportsAPI.createSport(payload, authToken);
          const created = response?.data;
          if (created) {
            setSports((prev) => [
              {
                ...created,
                id: created._id,
                image: created.image || payload.image || sportIcon,
                registered: created.registered || 0,
              },
              ...prev,
            ]);
            const updatedSports = [
              {
                ...created,
                id: created._id,
                image: created.image || payload.image || sportIcon,
                registered: created.registered || 0,
              },
              ...sports,
            ];
            localStorage.setItem("campuszone_sports", JSON.stringify(updatedSports));
            addActivityNotification({
              title: `New sport added: ${created.name || payload.name}`,
              message: `${created.name || payload.name} has been added to the sports list.`,
              category: "sport",
            });
            setShowSportFormModal(false);
            resetSportForm();
            setToastText("✅ Sport added successfully!");
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 3000);
            return;
          }
        } catch (error) {
          console.error("API create sport failed, using local add:", error);
          const errorMessage = error?.message || "Failed to add sport";
          if (/token expired|not authorized|invalid token/i.test(errorMessage)) {
            localStorage.removeItem("token");
            setToastText("❌ Session expired. Please login again.");
            setToastVisible(true);
            setTimeout(() => navigate("/login"), 1500);
            return;
          }
        }
      }

      const newSport = { ...payload, id: `sport-${Date.now()}`, image: payload.image || sportIcon, registered: 0 };
      const updatedSports = [newSport, ...sports];
      setSports(updatedSports);
      localStorage.setItem("campuszone_sports", JSON.stringify(updatedSports));
      addActivityNotification({
        title: `New sport added: ${newSport.name}`,
        message: `${newSport.name} has been added to the sports list.`,
        category: "sport",
      });
      setShowSportFormModal(false);
      resetSportForm();
      setToastText("✅ Sport added successfully!");
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    } finally {
      setIsSubmittingSport(false);
    }
  };

  const scrollToTop = (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsNavOpen(false);
  };

  const goHome = (event) => {
    event.preventDefault();
    navigate("/");
    setIsNavOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsProfileOpen(false);
    navigate("/");
  };

  const goToDashboard = () => {
    setIsProfileOpen(false);
    navigate("/dashboard");
  };

  const goToProfile = () => {
    setIsProfileOpen(false);
    navigate("/profile");
  };

  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  const monthLabel = today.toLocaleString("en-US", {
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

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredSports = sports.filter((sport) => {
    if (!normalizedSearch) return true;

    const status = getRegistrationStatus(sport).status.toLowerCase();
    const searchableText = [
      sport.name,
      sport.category,
      sport.description,
      sport.venue,
      sport.coach,
      sport.eligibility,
      status,
      Array.isArray(sport.skillLevels) ? sport.skillLevels.join(" ") : "",
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearch);
  });

  return (
    <>
      <header className="topbar" id="top">
        <nav className="nav container">
          <Link className="brand" to="/" aria-label="CampusZone Home" onClick={scrollToTop}>
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
            <Link to="/" onClick={goHome}>
              Home
            </Link>
            <a href="#health" onClick={() => setIsNavOpen(false)}>
              Health
            </a>
            <Link to="/events" onClick={() => setIsNavOpen(false)}>
              Events
            </Link>
            <a href="#career" onClick={() => setIsNavOpen(false)}>
              Career
            </a>
            <a href="#study" onClick={() => setIsNavOpen(false)}>
              Study
            </a>
          </div>

          <div className="nav__cta">
            <button
              className="header__notificationBtn"
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg className="header__notificationIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
                <path d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" />
              </svg>
              {notifications.length > 0 && (
                <span className="header__notificationBadge">{notifications.length}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notifications__dropdown">
                <div className="notifications__header">
                  <h3>Notifications</h3>
                  <button onClick={() => setShowNotifications(false)}>×</button>
                </div>
                <div className="notifications__list">
                  {notifications.length === 0 && (
                    <p className="notifications__empty">No sports notifications right now.</p>
                  )}
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`notification__item notification__item--${notif.type}`}>
                      <div className="notification__icon">
                        {notif.type === "success" && "🔔"}
                        {notif.type === "warning" && "⚠️"}
                        {notif.type === "urgent" && "🚨"}
                      </div>
                      <div className="notification__content">
                        <p className="notification__message">{notif.message}</p>
                        <span className="notification__sport">{notif.sport}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="profile-dropdown" ref={profileRef}>
              <button
                className="profile-icon-btn"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                aria-label="Profile menu"
              >
                👤
              </button>
              {isProfileOpen && (
                <div className="profile-dropdown-menu">
                  <button onClick={goToProfile} className="dropdown-item" type="button">
                    <span className="dropdown-icon">👤</span>
                    My Profile
                  </button>
                  <button onClick={goToDashboard} className="dropdown-item" type="button">
                    <span className="dropdown-icon">📊</span>
                    Dashboard
                  </button>
                  <button className="dropdown-item" type="button" onClick={() => setIsProfileOpen(false)}>
                    <span className="dropdown-icon">🏅</span>
                    My Sports
                  </button>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout" type="button">
                    <span className="dropdown-icon">🚪</span>
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="sports">
        <div className="sports__header container">
          <div className="sports__headerContent">
            <Link to="/events" className="sports__backBtn">
              ← Back to Events
            </Link>
            <h1 className="sports__title">University Sports Programs</h1>
            <p className="sports__subtitle">
              Join our sports teams and tournaments. Register during open periods to participate in university sports activities.
            </p>
          </div>
          {isAdmin && (
            <div className="sports__headerActions">
              <button type="button" className="sports__addBtn" onClick={openAddSportModal}>
                + Add Sport
              </button>
            </div>
          )}
        </div>

        <div className="sports__searchWrap container">
          <div className="sports__searchBar" role="search">
            <span className="sports__searchIcon" aria-hidden="true">⌕</span>
            <input
              type="search"
              className="sports__searchInput"
              placeholder="Search by sport, venue, coach, category, status..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search sports"
            />
            {searchQuery && (
              <button
                type="button"
                className="sports__searchClear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>
          <p className="sports__searchMeta">
            Showing {filteredSports.length} of {sports.length} sports programs
          </p>
        </div>

        {error && (
          <div className="sports__alertBanner container">
            <div className="alert alert--warning">
              <span className="alert__icon">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {notifications.length > 0 && (
          <div className="sports__alertBanner container">
            <div className="alert alert--info">
              <span className="alert__icon">📢</span>
              <span>You have {notifications.length} active sports notification{notifications.length > 1 ? 's' : ''}!</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="sports__loading container">
            <div className="loading__spinner"></div>
            <p className="loading__text">Loading sports programs...</p>
          </div>
        ) : filteredSports.length > 0 ? (
          <div className="sports__grid container">
            {filteredSports.map((sport) => {
              const statusInfo = getRegistrationStatus(sport);
              const filledPercentage = (sport.registered / sport.maxCapacity) * 100;

              return (
                <article key={sport.id} className="sports__card">
                  <div className="sports__cardImage">
                    {isAdmin && (
                      <div className="sports__adminActions">
                        <button
                          className="sports__actionBtn sports__actionBtn--edit"
                          onClick={() => handleEditSport(sport)}
                          title="Update Sport"
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button
                          className="sports__actionBtn sports__actionBtn--delete"
                          onClick={() => handleDeleteSport(sport.id)}
                          title="Delete Sport"
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 5.98001C17.67 5.65001 14.32 5.48001 10.98 5.48001C9 5.48001 7.02 5.58001 5.04 5.78001L3 5.98001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <img src={sport.image} alt={sport.name} className="sports__image" />
                    <div className="sports__cardBadges">
                      <span className="sports__categoryBadge">{sport.category}</span>
                      <span className={`sports__status ${statusInfo.class}`}>
                        {statusInfo.status}
                      </span>
                    </div>
                  </div>

                  <div className="sports__content">
                    <h2 className="sports__name">{sport.name}</h2>
                    <p className="sports__description">{sport.description}</p>

                    <div className="sports__meta">
                      <div className="sports__metaItem">
                        <svg className="sports__metaIcon" viewBox="0 0 24 24" fill="none">
                          <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="sports__metaText">
                          <span className="sports__metaLabel">Opens:</span>
                          <span className="sports__metaValue">
                            {new Date(sport.registrationOpen).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>

                      <div className="sports__metaItem">
                        <svg className="sports__metaIcon" viewBox="0 0 24 24" fill="none">
                          <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="sports__metaText">
                          <span className="sports__metaLabel">Closes:</span>
                          <span className="sports__metaValue">
                            {new Date(sport.registrationClose).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>

                      <div className="sports__metaItem sports__metaItem--full">
                        <svg className="sports__metaIcon" viewBox="0 0 24 24" fill="none">
                          <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M3.62 8.49C5.59 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        <div className="sports__metaText">
                          <span className="sports__metaLabel">Venue:</span>
                          <span className="sports__metaValue">{sport.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="sports__capacitySection">
                      <div className="sports__capacityHeader">
                        <span className="sports__capacityLabel">Registered</span>
                        <span className="sports__capacityValue">
                          {sport.registered} / {sport.maxCapacity}
                        </span>
                      </div>
                      <div className="sports__progressBar">
                        <div
                          className="sports__progress"
                          style={{
                            width: `${filledPercentage}%`,
                            backgroundColor: filledPercentage >= 90 ? '#e74c3c' : filledPercentage >= 70 ? '#f39c12' : '#27ae60'
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="sports__actions">
                      <button
                        className="sports__btn sports__btn--secondary"
                        onClick={() => handleViewDetails(sport)}
                      >
                        View Details
                      </button>
                      <button
                        className={`sports__btn sports__btn--primary ${statusInfo.disabled ? 'sports__btn--disabled' : ''}`}
                        onClick={() => handleRegister(sport)}
                        disabled={statusInfo.disabled}
                      >
                        {statusInfo.status === "FULL" ? "Registration Full" :
                          statusInfo.status === "CLOSED" ? "Registration Closed" :
                            statusInfo.status === "COMING SOON" ? "Coming Soon" : "Register Now"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="sports__empty container">
            <p className="sports__emptyTitle">No sports matched your search</p>
            <p className="sports__emptyText">Try a different keyword like "tournament", "open", or a venue name.</p>
          </div>
        )}
      </main>

      {/* Add/Edit Sport Modal */}
      {showSportFormModal && (
        <div className="modal__overlay" onClick={closeSportFormModal}>
          <div className="sportsForm__content" onClick={(e) => e.stopPropagation()}>
            <div className="sportsForm__header">
              <h2>{editingSport ? "Update Sport" : "Add New Sport"}</h2>
              <button className="sportsForm__close" onClick={closeSportFormModal} aria-label="Close modal">×</button>
            </div>

            <form className="sportsForm" onSubmit={handleSportFormSubmit}>
              <div className="sportsForm__field">
                <label className="sportsForm__label">Sport Image *</label>
                <input
                  ref={sportImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSportImageChange}
                />
                {sportImagePreview && (
                  <img src={sportImagePreview} alt="Sport preview" className="sportsForm__previewImage" />
                )}
              </div>

              <div className="sportsForm__field">
                <input
                  ref={(el) => (sportFieldRefs.current.name = el)}
                  name="name"
                  value={sportFormData.name}
                  onChange={handleSportFormChange}
                  onBlur={handleSportFormBlur}
                  placeholder="Sport name"
                  className={shouldShowSportError("name") ? "sportsForm__input--error" : ""}
                  required
                />
                {shouldShowSportError("name") && (
                  <span className="sportsForm__error">{sportFormErrors.name}</span>
                )}
              </div>

              <div className="sportsForm__field">
                <select
                  ref={(el) => (sportFieldRefs.current.category = el)}
                  name="category"
                  value={sportFormData.category}
                  onChange={handleSportFormChange}
                  onBlur={handleSportFormBlur}
                  className={shouldShowSportError("category") ? "sportsForm__input--error" : ""}
                >
                  <option value="Tournament">Tournament</option>
                  <option value="Team Selection">Team Selection</option>
                </select>
                {shouldShowSportError("category") && (
                  <span className="sportsForm__error">{sportFormErrors.category}</span>
                )}
              </div>

              <div className="sportsForm__field">
                <textarea
                  ref={(el) => (sportFieldRefs.current.description = el)}
                  name="description"
                  value={sportFormData.description}
                  onChange={handleSportFormChange}
                  onBlur={handleSportFormBlur}
                  placeholder="Description"
                  className={shouldShowSportError("description") ? "sportsForm__input--error" : ""}
                  required
                />
                {shouldShowSportError("description") && (
                  <span className="sportsForm__error">{sportFormErrors.description}</span>
                )}
              </div>

              <div className="sportsForm__row">
                <div className="sportsForm__field">
                  <label className="sportsForm__label">Registration Open Date *</label>
                  <input
                    ref={(el) => (sportFieldRefs.current.registrationOpen = el)}
                    type="date"
                    name="registrationOpen"
                    value={sportFormData.registrationOpen}
                    onChange={handleSportFormChange}
                    onBlur={handleSportFormBlur}
                    placeholder="mm/dd/yyyy"
                    min={getTodayDate()}
                    className={shouldShowSportError("registrationOpen") ? "sportsForm__input--error" : ""}
                    required
                  />
                  {shouldShowSportError("registrationOpen") && (
                    <span className="sportsForm__error">{sportFormErrors.registrationOpen}</span>
                  )}
                </div>
                <div className="sportsForm__field">
                  <label className="sportsForm__label">Registration Close Date *</label>
                  <input
                    ref={(el) => (sportFieldRefs.current.registrationClose = el)}
                    type="date"
                    name="registrationClose"
                    value={sportFormData.registrationClose}
                    onChange={handleSportFormChange}
                    onBlur={handleSportFormBlur}
                    placeholder="mm/dd/yyyy"
                    min={sportFormData.registrationOpen || getTodayDate()}
                    className={shouldShowSportError("registrationClose") ? "sportsForm__input--error" : ""}
                    required
                  />
                  {shouldShowSportError("registrationClose") && (
                    <span className="sportsForm__error">{sportFormErrors.registrationClose}</span>
                  )}
                </div>
              </div>

              <div className="sportsForm__row">
                <div className="sportsForm__field">
                  <input
                    ref={(el) => (sportFieldRefs.current.venue = el)}
                    name="venue"
                    value={sportFormData.venue}
                    onChange={handleSportFormChange}
                    onBlur={handleSportFormBlur}
                    placeholder="Venue"
                    className={shouldShowSportError("venue") ? "sportsForm__input--error" : ""}
                    required
                  />
                  {shouldShowSportError("venue") && (
                    <span className="sportsForm__error">{sportFormErrors.venue}</span>
                  )}
                </div>
                <div className="sportsForm__field">
                  <input
                    ref={(el) => (sportFieldRefs.current.coach = el)}
                    name="coach"
                    value={sportFormData.coach}
                    onChange={handleSportFormChange}
                    onBlur={handleSportFormBlur}
                    placeholder="Coach"
                    className={shouldShowSportError("coach") ? "sportsForm__input--error" : ""}
                    required
                  />
                  {shouldShowSportError("coach") && (
                    <span className="sportsForm__error">{sportFormErrors.coach}</span>
                  )}
                </div>
              </div>

              <div className="sportsForm__row">
                <div className="sportsForm__field">
                  <input
                    ref={(el) => (sportFieldRefs.current.maxCapacity = el)}
                    type="number"
                    min="1"
                    name="maxCapacity"
                    value={sportFormData.maxCapacity}
                    onChange={handleSportFormChange}
                    onBlur={handleSportFormBlur}
                    placeholder="Max capacity"
                    className={shouldShowSportError("maxCapacity") ? "sportsForm__input--error" : ""}
                    required
                  />
                  {shouldShowSportError("maxCapacity") && (
                    <span className="sportsForm__error">{sportFormErrors.maxCapacity}</span>
                  )}
                </div>
                <div className="sportsForm__field">
                  <input
                    ref={(el) => (sportFieldRefs.current.registrationLink = el)}
                    name="registrationLink"
                    value={sportFormData.registrationLink}
                    onChange={handleSportFormChange}
                    onBlur={handleSportFormBlur}
                    placeholder="Registration link"
                    className={shouldShowSportError("registrationLink") ? "sportsForm__input--error" : ""}
                  />
                  {shouldShowSportError("registrationLink") && (
                    <span className="sportsForm__error">{sportFormErrors.registrationLink}</span>
                  )}
                </div>
              </div>

              <div className="sportsForm__field">
                <input
                  ref={(el) => (sportFieldRefs.current.eligibility = el)}
                  name="eligibility"
                  value={sportFormData.eligibility}
                  onChange={handleSportFormChange}
                  onBlur={handleSportFormBlur}
                  placeholder="Eligibility"
                  className={shouldShowSportError("eligibility") ? "sportsForm__input--error" : ""}
                />
                {shouldShowSportError("eligibility") && (
                  <span className="sportsForm__error">{sportFormErrors.eligibility}</span>
                )}
              </div>

              <div className="sportsForm__field">
                <input
                  ref={(el) => (sportFieldRefs.current.selectionCriteria = el)}
                  name="selectionCriteria"
                  value={sportFormData.selectionCriteria}
                  onChange={handleSportFormChange}
                  onBlur={handleSportFormBlur}
                  placeholder="Selection criteria"
                  className={shouldShowSportError("selectionCriteria") ? "sportsForm__input--error" : ""}
                />
                {shouldShowSportError("selectionCriteria") && (
                  <span className="sportsForm__error">{sportFormErrors.selectionCriteria}</span>
                )}
              </div>

              <div className="sportsForm__field">
                <input
                  ref={(el) => (sportFieldRefs.current.skillLevelsText = el)}
                  name="skillLevelsText"
                  value={sportFormData.skillLevelsText}
                  onChange={handleSportFormChange}
                  onBlur={handleSportFormBlur}
                  placeholder="Skill levels (comma separated)"
                  className={shouldShowSportError("skillLevelsText") ? "sportsForm__input--error" : ""}
                />
                {shouldShowSportError("skillLevelsText") && (
                  <span className="sportsForm__error">{sportFormErrors.skillLevelsText}</span>
                )}
              </div>

              <label className="sportsForm__checkbox">
                <input
                  type="checkbox"
                  name="requiresMedical"
                  checked={sportFormData.requiresMedical}
                  onChange={handleSportFormChange}
                />
                Medical certificate required
              </label>

              <div className="sportsForm__actions">
                <button type="button" className="sports__btn sports__btn--secondary" onClick={closeSportFormModal}>Cancel</button>
                <button type="submit" className="sports__btn sports__btn--primary" disabled={isSubmittingSport}>
                  {isSubmittingSport
                    ? editingSport
                      ? "Updating..."
                      : "Adding..."
                    : editingSport
                      ? "Update Sport"
                      : "Add Sport"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sports Details Modal */}
      {showDetailsModal && selectedSport && (
        <div className="modal__overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal__content modal__content--large" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <div className="modal__headerImage">
                <img src={selectedSport.image} alt={selectedSport.name} className="modal__sportImage" />
              </div>
              <div className="modal__headerContent">
                <div>
                  <h2 className="modal__title">{selectedSport.name}</h2>
                  <span className="modal__category">{selectedSport.category}</span>
                </div>
              </div>
              <button
                className="modal__close"
                onClick={() => setShowDetailsModal(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="modal__body">
              <div className="sportDetails__section">
                <h3 className="sportDetails__heading">Description</h3>
                <p className="sportDetails__text">{selectedSport.description}</p>
              </div>

              <div className="sportDetails__grid">
                <div className="sportDetails__item">
                  <span className="sportDetails__label">Coach/Instructor</span>
                  <span className="sportDetails__value">{selectedSport.coach}</span>
                </div>
                <div className="sportDetails__item">
                  <span className="sportDetails__label">Venue</span>
                  <span className="sportDetails__value">{selectedSport.venue}</span>
                </div>
                <div className="sportDetails__item">
                  <span className="sportDetails__label">Max Capacity</span>
                  <span className="sportDetails__value">{selectedSport.maxCapacity} participants</span>
                </div>
                <div className="sportDetails__item">
                  <span className="sportDetails__label">Currently Registered</span>
                  <span className="sportDetails__value">{selectedSport.registered} students</span>
                </div>
              </div>

              <div className="sportDetails__section">
                <h3 className="sportDetails__heading">Eligibility Requirements</h3>
                <p className="sportDetails__text">{selectedSport.eligibility}</p>
              </div>

              <div className="sportDetails__section">
                <h3 className="sportDetails__heading">Selection Criteria</h3>
                <p className="sportDetails__text">{selectedSport.selectionCriteria}</p>
              </div>

              <div className="sportDetails__section">
                <h3 className="sportDetails__heading">Skill Levels Accepted</h3>
                <div className="sportDetails__skillLevels">
                  {selectedSport.skillLevels.map((level) => (
                    <span key={level} className="sportDetails__skillBadge">
                      {level}
                    </span>
                  ))}
                </div>
              </div>

              {selectedSport.requiresMedical && (
                <div className="sportDetails__alert">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 9V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 21.41H5.94C2.47 21.41 1.02 18.93 2.7 15.9L5.82 10.28L8.76 5.00003C10.54 1.79003 13.46 1.79003 15.24 5.00003L18.18 10.29L21.3 15.91C22.98 18.94 21.52 21.42 18.06 21.42H12V21.41Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11.995 17H12.004" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Medical certificate required for registration</span>
                </div>
              )}

              <div className="sportDetails__registration">
                <div className="sportDetails__dates">
                  <div className="sportDetails__dateItem">
                    <span className="sportDetails__dateLabel">Registration Opens</span>
                    <span className="sportDetails__dateValue">
                      {new Date(selectedSport.registrationOpen).toLocaleDateString("en-US", {
                        weekday: "long", month: "long", day: "numeric", year: "numeric"
                      })}
                    </span>
                  </div>
                  <div className="sportDetails__dateItem">
                    <span className="sportDetails__dateLabel">Registration Closes</span>
                    <span className="sportDetails__dateValue">
                      {new Date(selectedSport.registrationClose).toLocaleDateString("en-US", {
                        weekday: "long", month: "long", day: "numeric", year: "numeric"
                      })}
                    </span>
                  </div>
                </div>

                <button
                  className={`sports__btn sports__btn--primary sports__btn--large ${getRegistrationStatus(selectedSport).disabled ? 'sports__btn--disabled' : ''
                    }`}
                  onClick={() => handleRegister(selectedSport)}
                  disabled={getRegistrationStatus(selectedSport).disabled}
                >
                  {getRegistrationStatus(selectedSport).status === "FULL" ? "Registration Full" :
                    getRegistrationStatus(selectedSport).status === "CLOSED" ? "Registration Closed" :
                      getRegistrationStatus(selectedSport).status === "COMING SOON" ? "Coming Soon" : "Register Now →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <Link className="footer__fullCalendar" to="/events">
              Full calendar
            </Link>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="container footer__inner">
            <div className="footer__brand">
              <div>
                <div className="footer__name">CampusZone</div>
                <div className="footer__small">Student Productivity Platform</div>
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

      <div
        className={`toast ${toastVisible ? "is-visible" : ""}`.trim()}
        id="toast"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {toastText}
      </div>
    </>
  );
}

export default Sports;
