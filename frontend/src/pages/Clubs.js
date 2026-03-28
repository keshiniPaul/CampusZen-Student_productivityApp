import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clubsAPI } from "../services/api";
import "./Clubs.css";
import "./Home.css";
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";
import clubImg from "../images/club.png";
import leoImg from "../images/LEO.png";
import sisImg from "../images/SIS.png";
import mediaImg from "../images/media.png";
import ieeeImg from "../images/IEEE.png";
import aiesecImg from "../images/AIESEC.png";
import societyImg from "../images/society.png";

// Initial clubs data with registration periods
const initialClubsData = [
  {
    id: "ieee",
    name: "IEEE Student Branch",
    category: "Technical",
    description: "Institute of Electrical and Electronics Engineers - Advancing technology for humanity.",
    registrationOpen: "2026-03-20",
    registrationClose: "2026-04-20",
    president: "Kasun Perera",
    advisor: "Dr. Chaminda Silva",
    maxMembers: 150,
    currentMembers: 87,
    vision: "To be the leading technical society fostering innovation and excellence in electrical and electronics engineering.",
    mission: "Empowering students through technical workshops, competitions, and industry connections.",
    upcomingEvents: ["Tech Talk Series", "Hackathon 2026", "Industry Visit"],
    socialMedia: {
      facebook: "https://facebook.com/ieee.sliit",
      instagram: "https://instagram.com/ieee.sliit",
      linkedin: "https://linkedin.com/company/ieee-sliit"
    },
    registrationLink: "https://ieeesliit.com",
    image: ieeeImg,
  },
  {
    id: "leo",
    name: "Leo Club",
    category: "Social Service",
    description: "Leadership, Experience, Opportunity - Youth empowerment through community service.",
    registrationOpen: "2026-03-01",
    registrationClose: "2026-05-01",
    president: "Nethmi Jayasinghe",
    advisor: "Ms. Sanduni Perera",
    maxMembers: 100,
    currentMembers: 68,
    vision: "Creating compassionate leaders who serve their communities with dedication.",
    mission: "Developing leadership skills through meaningful community service projects.",
    upcomingEvents: ["Blood Donation Camp", "Environmental Cleanup", "Charity Drive"],
    socialMedia: {
      facebook: "https://facebook.com/leo.sliit",
      instagram: "https://instagram.com/leo.sliit",
      linkedin: "https://linkedin.com/company/leo-sliit"
    },
    registrationLink: "https://sliitleo.org",
    image: leoImg,
  },
  {
    id: "aiesec",
    name: "AIESEC",
    category: "Professional",
    description: "Global youth-led organization for leadership development and international exchanges.",
    registrationOpen: "2026-01-05",
    registrationClose: "2026-02-05",
    president: "Dinuka Fernando",
    advisor: "Mr. Rohan Wickramasinghe",
    maxMembers: 80,
    currentMembers: 52,
    vision: "Peace and fulfillment of humankind's potential through youth leadership.",
    mission: "Activating leadership potential through cross-cultural exchanges and social impact.",
    upcomingEvents: ["Global Village", "Leadership Summit", "Exchange Info Session"],
    socialMedia: {
      facebook: "https://facebook.com/aiesec.sliit",
      instagram: "https://instagram.com/aiesec.sliit",
      linkedin: "https://linkedin.com/company/aiesec-sliit"
    },
    registrationLink: "https://www.sliit.lk/blog/aiesec-in-sliit-wins-the-most-outstanding-expansion-of-the-year-award/attachment/aiesec/",
    image: aiesecImg,
  },
  {
    id: "sis",
    name: "Students Interactive Society",
    category: "Cultural",
    description: "Promoting cultural diversity and student interaction through creative events.",
    registrationOpen: "2026-03-05",
    registrationClose: "2026-04-05",
    president: "Tharushi Dissanayake",
    advisor: "Dr. Nirmal Gunawardena",
    maxMembers: 120,
    currentMembers: 95,
    vision: "Building a vibrant campus culture celebrating diversity and creativity.",
    mission: "Creating memorable experiences through cultural events and student engagement.",
    upcomingEvents: ["Cultural Night", "Talent Show", "Food Festival"],
    socialMedia: {
      facebook: "https://facebook.com/sis.sliit",
      instagram: "https://instagram.com/sis.sliit",
      linkedin: "https://linkedin.com/company/sis-sliit"
    },
    registrationLink: "https://forms.gle/sis-registration",
    image: sisImg,
  },
  {
    id: "media",
    name: "Media Unit",
    category: "Creative",
    description: "Capturing moments, telling stories - The official media unit of the university.",
    registrationOpen: "2026-06-10",
    registrationClose: "2026-07-10",
    president: "Sachini Wijesinghe",
    advisor: "Mr. Lasitha Bandara",
    maxMembers: 60,
    currentMembers: 45,
    vision: "Being the premier student media organization documenting campus life.",
    mission: "Delivering high-quality content through photography, videography, and journalism.",
    upcomingEvents: ["Photography Workshop", "Video Production Bootcamp", "Media Exhibition"],
    socialMedia: {
      facebook: "https://facebook.com/media.sliit",
      instagram: "https://instagram.com/media.sliit",
      linkedin: "https://linkedin.com/company/media-sliit"
    },
    registrationLink: "https://forms.gle/media-registration",
    image: mediaImg,
  },
  {
    id: "community",
    name: "Student Community",
    category: "Community",
    description: "Building bridges between students through social initiatives and welfare programs.",
    registrationOpen: "2026-02-28",
    registrationClose: "2026-03-28",
    president: "Ravindu Lakshan",
    advisor: "Ms. Priyanka Amarasinghe",
    maxMembers: 30,
    currentMembers: 25,
    vision: "Creating an inclusive and supportive student community.",
    mission: "Enhancing student welfare and fostering connections across batches.",
    upcomingEvents: ["Freshers' Welcome", "Mental Health Awareness Week", "Career Fair"],
    socialMedia: {
      facebook: "https://facebook.com/community.sliit",
      instagram: "https://instagram.com/community.sliit",
      linkedin: "https://linkedin.com/company/community-sliit"
    },
    registrationLink: "https://forms.gle/community-registration",
    image: societyImg,
  },
];

function Clubs() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const displayName = currentUser?.fullName || currentUser?.email || "User";
  const authToken = localStorage.getItem("token");
  const isAdmin = currentUser?.role === "admin";
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [clubs, setClubs] = useState(initialClubsData);
  const [selectedClub, setSelectedClub] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showClubFormModal, setShowClubFormModal] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [clubFormData, setClubFormData] = useState({
    name: "",
    category: "Community",
    description: "",
    vision: "",
    mission: "",
    registrationOpen: "",
    registrationClose: "",
    president: "",
    advisor: "",
    maxMembers: 100,
    registrationLink: "#",
  });
  const [clubFormErrors, setClubFormErrors] = useState({});
  const [clubFormTouched, setClubFormTouched] = useState({});
  const [clubSubmitAttempted, setClubSubmitAttempted] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isSubmittingClub, setIsSubmittingClub] = useState(false);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const profileRef = useRef(null);
  const clubFieldRefs = useRef({});
  const clubImageInputRef = useRef(null);
  const hasFetchedClubsRef = useRef(false);
  const [clubImagePreview, setClubImagePreview] = useState("");

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const validateClubField = (fieldName, value, allValues) => {
    const trimmed = typeof value === "string" ? value.trim() : value;
    const hasLetters = typeof trimmed === "string" && /[A-Za-z]/.test(trimmed);

    switch (fieldName) {
      case "name":
        if (!trimmed) return "Club/Society name is required.";
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
      case "vision":
        if (!trimmed) return "Vision is required.";
        if (trimmed.length < 10) return "Vision must be at least 10 characters.";
        if (!hasLetters) return "Vision cannot contain only numbers or symbols.";
        return "";
      case "mission":
        if (!trimmed) return "Mission is required.";
        if (trimmed.length < 10) return "Mission must be at least 10 characters.";
        if (!hasLetters) return "Mission cannot contain only numbers or symbols.";
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
      case "president":
        if (!trimmed) return "President name is required.";
        if (trimmed.length < 3) return "President name must be at least 3 characters.";
        if (!hasLetters) return "President name cannot contain only numbers or symbols.";
        return "";
      case "advisor":
        if (!trimmed) return "Advisor name is required.";
        if (trimmed.length < 3) return "Advisor name must be at least 3 characters.";
        if (!hasLetters) return "Advisor name cannot contain only numbers or symbols.";
        return "";
      case "maxMembers": {
        const max = Number(value);
        if (!Number.isFinite(max) || max < 1) return "Max members must be at least 1.";
        if (max > 10000) return "Max members cannot exceed 10000.";
        return "";
      }
      case "registrationLink":
        if (!trimmed || trimmed === "#") return "";
        if (!/^https?:\/\//i.test(trimmed)) return "Registration link must start with http:// or https://.";
        return "";
      default:
        return "";
    }
  };

  const validateClubForm = (values) => ({
    name: validateClubField("name", values.name, values),
    category: validateClubField("category", values.category, values),
    description: validateClubField("description", values.description, values),
    vision: validateClubField("vision", values.vision, values),
    mission: validateClubField("mission", values.mission, values),
    registrationOpen: validateClubField("registrationOpen", values.registrationOpen, values),
    registrationClose: validateClubField("registrationClose", values.registrationClose, values),
    president: validateClubField("president", values.president, values),
    advisor: validateClubField("advisor", values.advisor, values),
    maxMembers: validateClubField("maxMembers", values.maxMembers, values),
    registrationLink: validateClubField("registrationLink", values.registrationLink, values),
  });

  const shouldShowClubError = (fieldName) =>
    Boolean((clubFormTouched[fieldName] || clubSubmitAttempted) && clubFormErrors[fieldName]);

  // Debug: Log when Clubs page loads
  useEffect(() => {
    console.log('Clubs page loaded successfully!');
    console.log('Initial clubs data:', initialClubsData.length, 'items');
    document.title = 'Clubs - CampusZone';
  }, []);

  // Fetch clubs data from API
  useEffect(() => {
    if (hasFetchedClubsRef.current) {
      return;
    }
    hasFetchedClubsRef.current = true;

    const fetchClubs = async () => {
      try {
        console.log('Fetching clubs from API...');
        const response = await clubsAPI.getAllClubs();
        
        if (response.success && response.data && response.data.length > 0) {
          const mappedClubs = response.data.map((club) => {
            // Find matching initial data for image fallback
            const initialClub = initialClubsData.find((c) => c.id === club._id);
            const hasUploadedImage =
              typeof club.image === "string" &&
              (club.image.startsWith("data:image/") || club.image.startsWith("http"));
            return {
              id: club._id,
              name: club.name,
              category: club.category,
              description: club.description,
              registrationOpen: club.registrationOpen,
              registrationClose: club.registrationClose,
              president: club.president,
              advisor: club.advisor,
              maxMembers: club.maxMembers,
              currentMembers: club.currentMembers,
              vision: club.vision,
              mission: club.mission,
              upcomingEvents: club.upcomingEvents,
              socialMedia: club.socialMedia,
              registrationLink: club.registrationLink,
              image: hasUploadedImage ? club.image : (initialClub ? initialClub.image : clubImg),
            };
          });
          console.log('API clubs loaded:', mappedClubs.length);
          setClubs(mappedClubs);
        } else {
          // API returned no data, keep initial data
          console.log('API returned no data, keeping initial clubs data');
          setError('Using sample clubs data.');
        }
      } catch (err) {
        console.error('Error fetching clubs:', err);
        setError('Failed to load clubs. Showing sample data.');
        console.log('Using initial clubs data due to error');
        // Don't call setClubs, keep the initial data
      } finally {
        setLoading(false);
      }
    };

    // Set initial loading state
    setError(null);
    fetchClubs();
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsNavOpen(false);
        setIsProfileOpen(false);
        setShowDetailsModal(false);
        setShowClubFormModal(false);
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

    clubs.forEach((club) => {
      const openDate = new Date(club.registrationOpen);
      const closeDate = new Date(club.registrationClose);
      const threeDaysBefore = new Date(closeDate);
      threeDaysBefore.setDate(closeDate.getDate() - 3);
      const oneDayBefore = new Date(closeDate);
      oneDayBefore.setDate(closeDate.getDate() - 1);

      // Registration opening today
      if (today.toDateString() === openDate.toDateString()) {
        newNotifications.push({
          id: `open-${club.id}`,
          type: "success",
          message: `${club.name} registration is now OPEN!`,
          club: club.name,
          date: today,
        });
      }

      // 3 days before closing
      if (today.toDateString() === threeDaysBefore.toDateString()) {
        newNotifications.push({
          id: `3days-${club.id}`,
          type: "warning",
          message: `${club.name} registration closes in 3 days!`,
          club: club.name,
          date: today,
        });
      }

      // 1 day before closing
      if (today.toDateString() === oneDayBefore.toDateString()) {
        newNotifications.push({
          id: `1day-${club.id}`,
          type: "urgent",
          message: `TOMORROW! ${club.name} registration closes tomorrow!`,
          club: club.name,
          date: today,
        });
      }

      // Last day
      if (today.toDateString() === closeDate.toDateString()) {
        newNotifications.push({
          id: `lastday-${club.id}`,
          type: "urgent",
          message: `LAST DAY! ${club.name} registration closes today!`,
          club: club.name,
          date: today,
        });
      }
    });

    setNotifications(newNotifications);
  }, [clubs]);

  const getRegistrationStatus = (club) => {
    const today = new Date();
    const openDate = new Date(club.registrationOpen);
    const closeDate = new Date(club.registrationClose);

    if (today < openDate) {
      return { status: "COMING SOON", class: "status--comingSoon", disabled: true };
    } else if (today >= openDate && today <= closeDate) {
      if (club.currentMembers >= club.maxMembers) {
        return { status: "FULL", class: "status--full", disabled: true };
      }
      return { status: "OPEN", class: "status--open", disabled: false };
    } else {
      return { status: "CLOSED", class: "status--closed", disabled: true };
    }
  };

  const handleViewDetails = (club) => {
    setSelectedClub(club);
    setShowDetailsModal(true);
  };

  const handleJoinClub = (club) => {
    const statusInfo = getRegistrationStatus(club);
    if (statusInfo.disabled) return;

    // Open the registration link in a new tab
    window.open(club.registrationLink, '_blank');
  };

  const handleAddClub = async () => {
    if (!isAdmin) {
      alert("Only administrators can add clubs.");
      return;
    }
    setEditingClub(null);
    setClubFormData({
      name: "",
      category: "Community",
      description: "",
      vision: "",
      mission: "",
      registrationOpen: "",
      registrationClose: "",
      president: "",
      advisor: "",
      maxMembers: 100,
      registrationLink: "https://forms.google.com",
    });
    setClubFormErrors({});
    setClubFormTouched({});
    setClubSubmitAttempted(false);
    setClubImagePreview("");
    if (clubImageInputRef.current) {
      clubImageInputRef.current.value = "";
    }
    setShowClubFormModal(true);
  };

  const handleEditClub = async (club) => {
    if (!isAdmin) {
      alert("Only administrators can update clubs.");
      return;
    }

    setEditingClub(club);
    setClubFormData({
      name: club.name || "",
      category: club.category || "Community",
      description: club.description || "",
      vision: club.vision || "",
      mission: club.mission || "",
      registrationOpen: club.registrationOpen ? String(club.registrationOpen).slice(0, 10) : "",
      registrationClose: club.registrationClose ? String(club.registrationClose).slice(0, 10) : "",
      president: club.president || "",
      advisor: club.advisor || "",
      maxMembers: club.maxMembers || 100,
      registrationLink: club.registrationLink || "#",
    });
    setClubFormErrors({});
    setClubFormTouched({});
    setClubSubmitAttempted(false);
    setClubImagePreview(club.image || "");
    if (clubImageInputRef.current) {
      clubImageInputRef.current.value = "";
    }
    setShowClubFormModal(true);
  };

  const handleClubImageChange = (event) => {
    const file = event.target.files?.[0];
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
      setClubImagePreview(reader.result ? String(reader.result) : "");
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteClub = async (clubId) => {
    if (!isAdmin) {
      alert("Only administrators can delete clubs.");
      return;
    }

    if (!window.confirm("Delete this club?")) return;

    if (authToken) {
      try {
        await clubsAPI.deleteClub(clubId, authToken);
      } catch (error) {
        console.error("API delete club failed, using local delete:", error);
      }
    }

      const updatedClubs = clubs.filter((item) => item.id !== clubId);
      setClubs(updatedClubs);
      localStorage.setItem("campuszone_clubs", JSON.stringify(updatedClubs));
      setToastText("✅ Club deleted successfully!");
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
  };

  const handleClubFormChange = (e) => {
    const { name, value } = e.target;
    setClubFormData((prev) => {
      const nextValues = { ...prev, [name]: value };

      if (clubFormTouched[name] || clubSubmitAttempted) {
        setClubFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validateClubField(name, nextValues[name], nextValues),
          ...(name === "registrationOpen"
            ? { registrationClose: validateClubField("registrationClose", nextValues.registrationClose, nextValues) }
            : {}),
        }));
      }

      return nextValues;
    });
  };

  const handleClubFormBlur = (e) => {
    const { name } = e.target;
    setClubFormTouched((prev) => ({ ...prev, [name]: true }));
    setClubFormErrors((prev) => ({
      ...prev,
      [name]: validateClubField(name, clubFormData[name], clubFormData),
    }));
  };

  const handleClubFormSubmit = async (e) => {
    e.preventDefault();

    if (isSubmittingClub) {
      return;
    }

    if (!editingClub && !clubImagePreview) {
      alert("Please upload an image for the club/society.");
      return;
    }

    const nextErrors = validateClubForm(clubFormData);
    setClubFormErrors(nextErrors);
    setClubSubmitAttempted(true);
    setClubFormTouched({
      name: true,
      category: true,
      description: true,
      vision: true,
      mission: true,
      registrationOpen: true,
      registrationClose: true,
      president: true,
      advisor: true,
      maxMembers: true,
      registrationLink: true,
    });

    const fieldOrder = [
      "name",
      "category",
      "description",
      "vision",
      "mission",
      "registrationOpen",
      "registrationClose",
      "president",
      "advisor",
      "maxMembers",
      "registrationLink",
    ];

    const firstErrorField = fieldOrder.find((fieldName) => nextErrors[fieldName]);
    if (firstErrorField) {
      const firstField = clubFieldRefs.current[firstErrorField];
      if (firstField) {
        firstField.scrollIntoView({ behavior: "smooth", block: "center" });
        if (typeof firstField.focus === "function") {
          firstField.focus();
        }
      }
      return;
    }

    const payload = {
      name: clubFormData.name,
      category: clubFormData.category,
      description: clubFormData.description,
      vision: clubFormData.vision,
      mission: clubFormData.mission,
      registrationOpen: clubFormData.registrationOpen,
      registrationClose: clubFormData.registrationClose,
      president: clubFormData.president,
      advisor: clubFormData.advisor,
      maxMembers: Number(clubFormData.maxMembers),
      registrationLink: clubFormData.registrationLink || "#",
      upcomingEvents: [],
      socialMedia: {},
      image: clubImagePreview || editingClub?.image || "",
    };

    setIsSubmittingClub(true);

    try {
      if (editingClub) {
        if (authToken) {
          try {
            await clubsAPI.updateClub(editingClub.id, payload, authToken);
          } catch (error) {
            console.error("API update club failed, using local update:", error);
          }
        }

        setClubs((prev) => prev.map((item) => (item.id === editingClub.id ? { ...item, ...payload } : item)));
        const updatedClubs = clubs.map((item) => (item.id === editingClub.id ? { ...item, ...payload, currentMembers: item.currentMembers } : item));
        setClubs(updatedClubs);
        localStorage.setItem("campuszone_clubs", JSON.stringify(updatedClubs));
        setShowClubFormModal(false);
        setEditingClub(null);
        setClubFormErrors({});
        setClubFormTouched({});
        setClubSubmitAttempted(false);
        setToastText("✅ Club updated successfully!");
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
        return;
      }

      if (authToken) {
        try {
          const response = await clubsAPI.createClub(payload, authToken);
          const created = response?.data;
          if (created) {
            setClubs((prev) => [
              {
                ...created,
                id: created._id,
                image: created.image || payload.image || clubImg,
                currentMembers: created.currentMembers || 0,
              },
              ...prev,
            ]);
            const updatedClubs = [
              {
                ...created,
                id: created._id,
                image: created.image || payload.image || clubImg,
                currentMembers: created.currentMembers || 0,
              },
              ...clubs,
            ];
            localStorage.setItem("campuszone_clubs", JSON.stringify(updatedClubs));
            setShowClubFormModal(false);
            setClubFormErrors({});
            setClubFormTouched({});
            setClubSubmitAttempted(false);
            setToastText("✅ Club added successfully!");
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 3000);
            return;
          }
        } catch (error) {
          console.error("API create club failed, using local add:", error);
        }
      }

      const newClub = { ...payload, id: `club-${Date.now()}`, image: payload.image || clubImg, currentMembers: 0 };
      const updatedClubs = [newClub, ...clubs];
      setClubs(updatedClubs);
      localStorage.setItem("campuszone_clubs", JSON.stringify(updatedClubs));
      setShowClubFormModal(false);
      setClubFormErrors({});
      setClubFormTouched({});
      setClubSubmitAttempted(false);
      setToastText("✅ Club added successfully!");
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    } finally {
      setIsSubmittingClub(false);
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
  const filteredClubs = clubs.filter((club) => {
    if (!normalizedSearch) return true;

    const status = getRegistrationStatus(club).status.toLowerCase();
    const searchableText = [
      club.name,
      club.category,
      club.description,
      club.vision,
      club.mission,
      club.president,
      club.advisor,
      status,
      Array.isArray(club.upcomingEvents) ? club.upcomingEvents.join(" ") : "",
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

          <button
            className="header__notificationBtn"
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="Notifications"
          >
            🔔
            {notifications.length > 0 && (
              <span className="header__notificationBadge">{notifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications__dropdown">
              <div className="notifications__header">
                <h3 className="notifications__title">Notifications</h3>
                <span className="notifications__count">{notifications.length} new</span>
              </div>
              <div className="notifications__list">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`notification__item notification__item--${notif.type}`}>
                    <div className="notification__icon">
                      {notif.type === "success" && "🔔"}
                      {notif.type === "warning" && "⚠️"}
                      {notif.type === "urgent" && "🚨"}
                    </div>
                    <div className="notification__content">
                      <p className="notification__message">{notif.message}</p>
                      <span className="notification__club">{notif.club}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="header__profileDropdown" ref={profileRef}>
            <button
              className="header__profileBtn"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-expanded={isProfileOpen}
            >
              <span className="header__profileText">{displayName}</span>
            </button>
            {isProfileOpen && (
              <div className="header__profileMenu">
                <a href="#profile" className="header__profileMenuItem">Profile</a>
                <a href="#myclubs" className="header__profileMenuItem">My Clubs</a>
                <a href="#password-change" className="header__profileMenuItem">Password Change</a>
                <a href="#logout" className="header__profileMenuItem header__profileMenuItem--danger">Logout</a>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="clubs">
        <div className="clubs__header container">
          <div className="clubs__headerContent">
            <Link to="/events" className="clubs__backBtn">
              ← Back to Events
            </Link>
            <h1 className="clubs__title">Clubs & Societies</h1>
            <p className="clubs__subtitle">
              Join student clubs and societies. Register during open periods to become a member and participate in exciting activities.
            </p>
          </div>
          {isAdmin && (
            <div className="clubs__headerActions">
              <button className="clubs__addBtn" onClick={handleAddClub}>
                + Add Club & Society
              </button>
            </div>
          )}
        </div>

        <div className="clubs__searchWrap container">
          <div className="clubs__searchBar" role="search">
            <span className="clubs__searchIcon" aria-hidden="true">⌕</span>
            <input
              type="search"
              className="clubs__searchInput"
              placeholder="Search by club, category, mission, advisors, status..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search clubs and societies"
            />
            {searchQuery && (
              <button
                type="button"
                className="clubs__searchClear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>
          <p className="clubs__searchMeta">
            Showing {filteredClubs.length} of {clubs.length} clubs and societies
          </p>
        </div>

        {error && (
          <div className="clubs__alertBanner container">
            <div className="alert alert--warning">
              <span className="alert__icon">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {notifications.length > 0 && (
          <div className="clubs__alertBanner container">
            <div className="alert alert--info">
              <span className="alert__icon">📢</span>
              <span>You have {notifications.length} active club notification{notifications.length > 1 ? 's' : ''}!</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="clubs__loading container">
            <div className="loading__spinner"></div>
            <p className="loading__text">Loading clubs & societies...</p>
          </div>
        ) : filteredClubs.length > 0 ? (
          <div className="clubs__grid container">
            {filteredClubs.map((club) => {
              const statusInfo = getRegistrationStatus(club);
              const filledPercentage = (club.currentMembers / club.maxMembers) * 100;

              return (
                <article key={club.id} className="clubs__card">
                  <div className="clubs__cardImage">
                    {isAdmin && (
                      <div className="clubs__adminActions">
                        <button
                          className="clubs__actionBtn clubs__actionBtn--edit"
                          onClick={() => handleEditClub(club)}
                          title="Update Club"
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button
                          className="clubs__actionBtn clubs__actionBtn--delete"
                          onClick={() => handleDeleteClub(club.id)}
                          title="Delete Club"
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 5.98001C17.67 5.65001 14.32 5.48001 10.98 5.48001C9 5.48001 7.02 5.58001 5.04 5.78001L3 5.98001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    )}
                    <img src={club.image} alt={club.name} className="clubs__image" />
                    <div className="clubs__cardBadges">
                      <span className="clubs__categoryBadge">{club.category}</span>
                      <span className={`clubs__status ${statusInfo.class}`}>
                        {statusInfo.status}
                      </span>
                    </div>
                  </div>

                  <div className="clubs__content">
                    <h2 className="clubs__name">{club.name}</h2>
                    <p className="clubs__description">{club.description}</p>

                    <div className="clubs__meta">
                      <div className="clubs__metaItem">
                        <svg className="clubs__metaIcon" viewBox="0 0 24 24" fill="none">
                          <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="clubs__metaText">
                          <span className="clubs__metaLabel">Opens:</span>
                          <span className="clubs__metaValue">
                            {new Date(club.registrationOpen).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>

                      <div className="clubs__metaItem">
                        <svg className="clubs__metaIcon" viewBox="0 0 24 24" fill="none">
                          <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="clubs__metaText">
                          <span className="clubs__metaLabel">Closes:</span>
                          <span className="clubs__metaValue">
                            {new Date(club.registrationClose).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>

                      <div className="clubs__metaItem clubs__metaItem--full">
                        <svg className="clubs__metaIcon" viewBox="0 0 24 24" fill="none">
                          <path d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C9.12 11.49 9.13 11.49 9.15 11.49C9.16 11.49 9.16 11.49 9.17 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14.08 14.15C11.29 12.29 6.73996 12.29 3.92996 14.15C2.65996 15 1.95996 16.15 1.95996 17.38C1.95996 18.61 2.65996 19.75 3.91996 20.59C5.31996 21.53 7.15996 22 8.99996 22C10.84 22 12.68 21.53 14.08 20.59C15.34 19.74 16.04 18.6 16.04 17.36C16.03 16.13 15.34 14.99 14.08 14.15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19.9901 7.34C20.1501 9.28 18.7701 10.98 16.8601 11.21C16.8501 11.21 16.8501 11.21 16.8401 11.21H16.8101C16.7501 11.21 16.6901 11.21 16.6401 11.23C15.6701 11.28 14.7801 10.97 14.1101 10.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M20.01 16.59C19.99 16.97 19.9 17.35 19.74 17.71C19.33 18.58 18.58 19.29 17.61 19.76C16.68 20.21 15.63 20.42 14.59 20.37C15.14 19.81 15.46 19.11 15.51 18.38C15.57 17.41 15.16 16.46 14.38 15.67C13.76 15.04 12.99 14.57 12.15 14.23C15.07 12.93 18.77 13.57 20.01 16.59Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="clubs__metaText">
                          <span className="clubs__metaLabel">Members:</span>
                          <span className="clubs__metaValue">{club.currentMembers} / {club.maxMembers}</span>
                        </div>
                      </div>
                    </div>

                    <div className="clubs__capacitySection">
                      <div className="clubs__capacityHeader">
                        <span className="clubs__capacityLabel">Active Members</span>
                        <span className="clubs__capacityValue">
                          {club.currentMembers} / {club.maxMembers}
                        </span>
                      </div>
                      <div className="clubs__progressBar">
                        <div 
                          className="clubs__progress"
                          style={{ 
                            width: `${filledPercentage}%`,
                            backgroundColor: filledPercentage >= 90 ? '#e74c3c' : filledPercentage >= 70 ? '#f39c12' : '#3b82f6'
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="clubs__actions">
                      <button
                        className="clubs__btn clubs__btn--secondary"
                        onClick={() => handleViewDetails(club)}
                      >
                        View Details
                      </button>
                      <button
                        className={`clubs__btn clubs__btn--primary ${statusInfo.disabled ? 'clubs__btn--disabled' : ''}`}
                        onClick={() => handleJoinClub(club)}
                        disabled={statusInfo.disabled}
                      >
                        {statusInfo.status === "FULL" ? "Membership Full" : 
                         statusInfo.status === "CLOSED" ? "Registration Closed" :
                         statusInfo.status === "COMING SOON" ? "Coming Soon" : "Join Club"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="clubs__empty container">
            <p className="clubs__emptyTitle">No clubs matched your search</p>
            <p className="clubs__emptyText">Try a different keyword like "technical", "open", or a club name.</p>
          </div>
        )}
      </main>

      {/* Add/Edit Club Modal */}
      {showClubFormModal && (
        <div className="modal__overlay" onClick={() => {
          setShowClubFormModal(false);
          setClubFormErrors({});
          setClubFormTouched({});
          setClubSubmitAttempted(false);
        }}>
          <div className="clubsForm__content" onClick={(e) => e.stopPropagation()}>
            <div className="clubsForm__header">
              <h2>{editingClub ? "Update Club & Society" : "Add Club & Society"}</h2>
              <button className="clubsForm__close" onClick={() => {
                setShowClubFormModal(false);
                setClubFormErrors({});
                setClubFormTouched({});
                setClubSubmitAttempted(false);
              }} aria-label="Close modal">×</button>
            </div>

            <form className="clubsForm" onSubmit={handleClubFormSubmit}>
              <div className="clubsForm__field">
                <label className="clubsForm__label">Club/Society Image *</label>
                <input
                  ref={clubImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleClubImageChange}
                />
                {clubImagePreview && (
                  <img src={clubImagePreview} alt="Club preview" className="clubsForm__previewImage" />
                )}
              </div>

              <input
                name="name"
                value={clubFormData.name}
                onChange={handleClubFormChange}
                onBlur={handleClubFormBlur}
                className={shouldShowClubError("name") ? "clubsForm__input--error" : ""}
                ref={(element) => {
                  clubFieldRefs.current.name = element;
                }}
                placeholder="Club/Society name"
                required
              />
              {shouldShowClubError("name") && <p className="clubsForm__error">{clubFormErrors.name}</p>}

              <select
                name="category"
                value={clubFormData.category}
                onChange={handleClubFormChange}
                onBlur={handleClubFormBlur}
                className={shouldShowClubError("category") ? "clubsForm__input--error" : ""}
                ref={(element) => {
                  clubFieldRefs.current.category = element;
                }}
              >
                <option value="Community">Community</option>
                <option value="Technical">Technical</option>
                <option value="Social Service">Social Service</option>
                <option value="Professional">Professional</option>
                <option value="Cultural">Cultural</option>
                <option value="Creative">Creative</option>
              </select>
              {shouldShowClubError("category") && <p className="clubsForm__error">{clubFormErrors.category}</p>}

              <textarea
                name="description"
                value={clubFormData.description}
                onChange={handleClubFormChange}
                onBlur={handleClubFormBlur}
                className={shouldShowClubError("description") ? "clubsForm__input--error" : ""}
                ref={(element) => {
                  clubFieldRefs.current.description = element;
                }}
                placeholder="Description"
                required
              />
              {shouldShowClubError("description") && <p className="clubsForm__error">{clubFormErrors.description}</p>}

              <textarea
                name="vision"
                value={clubFormData.vision}
                onChange={handleClubFormChange}
                onBlur={handleClubFormBlur}
                className={shouldShowClubError("vision") ? "clubsForm__input--error" : ""}
                ref={(element) => {
                  clubFieldRefs.current.vision = element;
                }}
                placeholder="Vision"
                required
              />
              {shouldShowClubError("vision") && <p className="clubsForm__error">{clubFormErrors.vision}</p>}

              <textarea
                name="mission"
                value={clubFormData.mission}
                onChange={handleClubFormChange}
                onBlur={handleClubFormBlur}
                className={shouldShowClubError("mission") ? "clubsForm__input--error" : ""}
                ref={(element) => {
                  clubFieldRefs.current.mission = element;
                }}
                placeholder="Mission"
                required
              />
              {shouldShowClubError("mission") && <p className="clubsForm__error">{clubFormErrors.mission}</p>}

              <div className="clubsForm__row">
                <div className="clubsForm__field">
                  <label className="clubsForm__label">Registration Open Date *</label>
                  <input
                    type="date"
                    name="registrationOpen"
                    value={clubFormData.registrationOpen}
                    onChange={handleClubFormChange}
                    onBlur={handleClubFormBlur}
                    placeholder="mm/dd/yyyy"
                    min={getTodayDate()}
                    className={shouldShowClubError("registrationOpen") ? "clubsForm__input--error" : ""}
                    ref={(element) => {
                      clubFieldRefs.current.registrationOpen = element;
                    }}
                    required
                  />
                  {shouldShowClubError("registrationOpen") && <p className="clubsForm__error">{clubFormErrors.registrationOpen}</p>}
                </div>
                <div className="clubsForm__field">
                  <label className="clubsForm__label">Registration Close Date *</label>
                  <input
                    type="date"
                    name="registrationClose"
                    value={clubFormData.registrationClose}
                    onChange={handleClubFormChange}
                    onBlur={handleClubFormBlur}
                    placeholder="mm/dd/yyyy"
                    min={clubFormData.registrationOpen || getTodayDate()}
                    className={shouldShowClubError("registrationClose") ? "clubsForm__input--error" : ""}
                    ref={(element) => {
                      clubFieldRefs.current.registrationClose = element;
                    }}
                    required
                  />
                  {shouldShowClubError("registrationClose") && <p className="clubsForm__error">{clubFormErrors.registrationClose}</p>}
                </div>
              </div>

              <div className="clubsForm__row">
                <div>
                  <input
                    name="president"
                    value={clubFormData.president}
                    onChange={handleClubFormChange}
                    onBlur={handleClubFormBlur}
                    className={shouldShowClubError("president") ? "clubsForm__input--error" : ""}
                    ref={(element) => {
                      clubFieldRefs.current.president = element;
                    }}
                    placeholder="President"
                    required
                  />
                  {shouldShowClubError("president") && <p className="clubsForm__error">{clubFormErrors.president}</p>}
                </div>
                <div>
                  <input
                    name="advisor"
                    value={clubFormData.advisor}
                    onChange={handleClubFormChange}
                    onBlur={handleClubFormBlur}
                    className={shouldShowClubError("advisor") ? "clubsForm__input--error" : ""}
                    ref={(element) => {
                      clubFieldRefs.current.advisor = element;
                    }}
                    placeholder="Advisor"
                    required
                  />
                  {shouldShowClubError("advisor") && <p className="clubsForm__error">{clubFormErrors.advisor}</p>}
                </div>
              </div>

              <div className="clubsForm__row">
                <div>
                  <input
                    type="number"
                    min="1"
                    name="maxMembers"
                    value={clubFormData.maxMembers}
                    onChange={handleClubFormChange}
                    onBlur={handleClubFormBlur}
                    className={shouldShowClubError("maxMembers") ? "clubsForm__input--error" : ""}
                    ref={(element) => {
                      clubFieldRefs.current.maxMembers = element;
                    }}
                    placeholder="Max members"
                    required
                  />
                  {shouldShowClubError("maxMembers") && <p className="clubsForm__error">{clubFormErrors.maxMembers}</p>}
                </div>
                <div>
                  <input
                    name="registrationLink"
                    value={clubFormData.registrationLink}
                    onChange={handleClubFormChange}
                    onBlur={handleClubFormBlur}
                    className={shouldShowClubError("registrationLink") ? "clubsForm__input--error" : ""}
                    ref={(element) => {
                      clubFieldRefs.current.registrationLink = element;
                    }}
                    placeholder="Registration link"
                  />
                  {shouldShowClubError("registrationLink") && <p className="clubsForm__error">{clubFormErrors.registrationLink}</p>}
                </div>
              </div>

              <div className="clubsForm__actions">
                <button type="button" className="clubs__btn clubs__btn--secondary" onClick={() => {
                  setShowClubFormModal(false);
                  setClubFormErrors({});
                  setClubFormTouched({});
                  setClubSubmitAttempted(false);
                }}>Cancel</button>
                <button type="submit" className="clubs__btn clubs__btn--primary" disabled={isSubmittingClub}>
                  {isSubmittingClub
                    ? editingClub
                      ? "Updating..."
                      : "Adding..."
                    : editingClub
                      ? "Update Club"
                      : "Add Club"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Club Details Modal */}
      {showDetailsModal && selectedClub && (
        <div className="modal__overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal__content modal__content--large" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <div className="modal__headerImage">
                <img src={selectedClub.image} alt={selectedClub.name} className="modal__clubImage" />
              </div>
              <div className="modal__headerContent">
                <div>
                  <h2 className="modal__title">{selectedClub.name}</h2>
                  <span className="modal__category">{selectedClub.category}</span>
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
              <div className="clubDetails__section">
                <h3 className="clubDetails__heading">Description</h3>
                <p className="clubDetails__text">{selectedClub.description}</p>
              </div>

              <div className="clubDetails__visionMission">
                <div className="clubDetails__box">
                  <h4 className="clubDetails__boxTitle">🎯 Vision</h4>
                  <p className="clubDetails__boxText">{selectedClub.vision}</p>
                </div>
                <div className="clubDetails__box">
                  <h4 className="clubDetails__boxTitle">🚀 Mission</h4>
                  <p className="clubDetails__boxText">{selectedClub.mission}</p>
                </div>
              </div>

              <div className="clubDetails__grid">
                <div className="clubDetails__item">
                  <span className="clubDetails__label">President</span>
                  <span className="clubDetails__value">{selectedClub.president}</span>
                </div>
                <div className="clubDetails__item">
                  <span className="clubDetails__label">Faculty Advisor</span>
                  <span className="clubDetails__value">{selectedClub.advisor}</span>
                </div>
                <div className="clubDetails__item">
                  <span className="clubDetails__label">Total Members</span>
                  <span className="clubDetails__value">{selectedClub.currentMembers} Active Members</span>
                </div>
                <div className="clubDetails__item">
                  <span className="clubDetails__label">Maximum Capacity</span>
                  <span className="clubDetails__value">{selectedClub.maxMembers} members</span>
                </div>
              </div>

              <div className="clubDetails__section">
                <h3 className="clubDetails__heading">Upcoming Events</h3>
                <div className="clubDetails__events">
                  {selectedClub.upcomingEvents.map((event, index) => (
                    <div key={index} className="clubDetails__eventBadge">
                      📅 {event}
                    </div>
                  ))}
                </div>
              </div>

              <div className="clubDetails__section">
                <h3 className="clubDetails__heading">Connect With Us</h3>
                <div className="clubDetails__social">
                  <a 
                    href={selectedClub.socialMedia.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="clubDetails__socialLink"
                  >
                    <img src={facebookIcon} alt="Facebook" className="clubDetails__socialIcon" />
                    Facebook
                  </a>
                  <a 
                    href={selectedClub.socialMedia.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="clubDetails__socialLink"
                  >
                    <img src={instagramIcon} alt="Instagram" className="clubDetails__socialIcon" />
                    Instagram
                  </a>
                  <a 
                    href={selectedClub.socialMedia.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="clubDetails__socialLink"
                  >
                    <img src={linkedinIcon} alt="LinkedIn" className="clubDetails__socialIcon" />
                    LinkedIn
                  </a>
                </div>
              </div>

              <div className="clubDetails__registration">
                <div className="clubDetails__dates">
                  <div className="clubDetails__dateItem">
                    <span className="clubDetails__dateLabel">Registration Opens</span>
                    <span className="clubDetails__dateValue">
                      {new Date(selectedClub.registrationOpen).toLocaleDateString("en-US", { 
                        weekday: "long", month: "long", day: "numeric", year: "numeric" 
                      })}
                    </span>
                  </div>
                  <div className="clubDetails__dateItem">
                    <span className="clubDetails__dateLabel">Registration Closes</span>
                    <span className="clubDetails__dateValue">
                      {new Date(selectedClub.registrationClose).toLocaleDateString("en-US", { 
                        weekday: "long", month: "long", day: "numeric", year: "numeric" 
                      })}
                    </span>
                  </div>
                </div>
                <button
                  className={`clubDetails__joinBtn ${getRegistrationStatus(selectedClub).disabled ? 'clubDetails__joinBtn--disabled' : ''}`}
                  onClick={() => handleJoinClub(selectedClub)}
                  disabled={getRegistrationStatus(selectedClub).disabled}
                >
                  {getRegistrationStatus(selectedClub).status === "FULL" ? "Membership Full" : 
                   getRegistrationStatus(selectedClub).status === "CLOSED" ? "Registration Closed" :
                   getRegistrationStatus(selectedClub).status === "COMING SOON" ? "Coming Soon" : "Join Club Now"}
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
            <a className="footer__contact footer__contact--accent" href="https://support.campuszone.lk">
              🌐 support.campuszone.lk
            </a>
            <a className="footer__contact" href="tel:+94117540000">
              📞 +94 11 754 0000
            </a>
            <a className="footer__feedback" href="https://support.campuszone.lk">
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
                  return <span key={index} className="footer__day--empty"></span>;
                }
                const isToday = day === currentDay;
                return (
                  <span
                    key={index}
                    className={`footer__day${isToday ? " footer__day--today" : ""}`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
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

export default Clubs;
