import { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./ActivityDetails.css";
import "../pages/Home.css";
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";
import wiramaya1Image from "../images/wiramaya1.png";
import ganthersImage from "../images/ganthera.png";
import lantharumaImage from "../images/lantharuma.png";
import opendayImage from "../images/openday.png";
import careerdayImage from "../images/careerday.png";
import convacationImage from "../images/convacation.png";

// Sample activity data - replace with API calls later
const activitiesData = {
  "event": {
    id: "event-1",
    title: "Web Development Workshop",
    category: "Event",
    shortDescription: "Learn modern web development with React and Node.js in this hands-on workshop.",
    date: "2026-03-15",
    time: "10:00 AM - 1:00 PM",
    venue: "Main Auditorium, Building A",
    description:
      "Learn modern web development with React and Node.js. This workshop covers the fundamentals of full-stack web development and includes hands-on coding exercises. Perfect for beginners and intermediate developers. You'll learn about component-based architecture, state management, API integration, and deployment strategies. Bring your laptop and be ready to code!",
    registrationOpen: "2026-03-01",
    registrationClose: "2026-03-10",
    image: require("../images/event1.png"),
    isNew: true,
  },
  "sports": {
    id: "sports-1",
    title: "Cricket Tournament Registration",
    category: "Sports",
    shortDescription: "Join the annual inter-batch cricket tournament and compete for trophies.",
    date: "2026-04-05",
    time: "2:00 PM",
    venue: "Sports Field, Campus Ground",
    description:
      "Join the annual inter-batch cricket tournament. Teams of 11 players per batch. Register your team before the deadline. Winners will receive trophies and certificates. This is a great opportunity to showcase your cricketing skills and represent your batch. The tournament will be held over multiple days with knockout rounds leading to the grand finale.",
    registrationOpen: "2026-03-08",
    registrationClose: "2026-03-25",
    capacity: 200,
    registered: 180,
    image: require("../images/sport.png"),
    isNew: false,
  },
  "club-&-society": {
    id: "community-1",
    title: "IEEE Student Chapter Meetup",
    category: "Club & Society",
    shortDescription: "Network with IEEE members and explore engineering career opportunities.",
    date: "2026-03-20",
    time: "3:30 PM - 5:00 PM",
    venue: "Digital Lab, Building B",
    description:
      "Meet with IEEE student chapter members. Discuss upcoming projects, network with industry professionals, and explore career opportunities in engineering and technology. This meetup features guest speakers from leading tech companies, interactive sessions on emerging technologies, and networking opportunities with alumni working in the industry.",
    registrationOpen: "2026-03-05",
    registrationClose: "2026-03-18",
    image: require("../images/club.png"),
    isNew: false,
  },
  "viramaya": {
    id: "viramaya",
    title: "Viramaya Music Festival",
    category: "Event",
    shortDescription: "Annual music festival featuring live performances and cultural shows.",
    date: "2026-03-22",
    time: "6:00 PM - 11:00 PM",
    venue: "SLIIT, Main Auditorium",
    description:
      "Experience the magic of Viramaya, SLIIT's premier music festival! This annual celebration brings together talented student performers, live bands, and cultural dance troupes for an unforgettable night of entertainment. Enjoy diverse musical genres from classical to contemporary, witness spectacular stage performances, and immerse yourself in the vibrant campus culture. This year's lineup includes special guest performances and surprise acts that you won't want to miss!",
    registrationOpen: "2026-03-01",
    registrationClose: "2026-03-20",
    image: wiramaya1Image,
    isNew: true,
  },
  "lantharuma": {
    id: "lantharuma",
    title: "Lantharuma Drama Festival",
    category: "Event",
    shortDescription: "Showcase of theatrical performances by student drama societies.",
    date: "2026-04-10",
    time: "5:00 PM - 9:00 PM",
    venue: "SLIIT, Drama Theatre",
    description:
      "Lantharuma is SLIIT's celebrated drama festival showcasing the finest theatrical talents from our student community. Watch as drama societies present compelling narratives, powerful performances, and creative storytelling through various theatrical forms. From contemporary plays to classic adaptations, this festival celebrates the art of drama and provides a platform for budding actors, directors, and playwrights to showcase their creativity. Experience thought-provoking performances that will leave you moved and inspired.",
    registrationOpen: "2026-03-15",
    registrationClose: "2026-04-08",
    image: lantharumaImage,
    isNew: false,
  },
  "get": {
    id: "convacation",
    title: "March Convacation",
    category: "Event",
    shortDescription: "Celebrate the achievements of our graduates at the March Convacation ceremony.",
    date: "2026-03-28",
    time: "9:00 AM - 5:00 PM",
    venue: "SLIIT, Convention Center",
    description:
      "Join us for the March Convacation ceremony, a prestigious event celebrating the achievements of our graduates. Witness the culmination of years of hard work as students receive their degrees in a grand ceremony filled with tradition and pride. The event features keynote speeches from distinguished alumni and industry leaders, cultural performances, and the formal conferring of degrees. This is a momentous occasion for graduates, their families, and the entire SLIIT community to come together and celebrate academic excellence.",
    registrationOpen: "2026-03-01",
    registrationClose: "2026-03-26",
    image: convacationImage,
    isNew: true,
  },
  "career-day": {
    id: "career-day",
    title: "Career Day",
    category: "Event",
    shortDescription: "Meet recruiters from top companies and explore career opportunities.",
    date: "2026-04-05",
    time: "10:00 AM - 4:00 PM",
    venue: "SLIIT, Main Building",
    description:
      "Career Day at SLIIT is your gateway to professional success! Meet with recruiters from top multinational companies and local industry leaders. Explore internship and full-time job opportunities across various sectors including IT, Engineering, Finance, Marketing, and more. Participate in mock interviews, CV review sessions, and career counseling workshops. Learn about company cultures, growth opportunities, and what employers are looking for in candidates. Dress professionally and bring multiple copies of your CV. This is your chance to make a lasting impression and kickstart your career!",
    registrationOpen: "2026-03-10",
    registrationClose: "2026-04-03",
    image: careerdayImage,
    isNew: false,
  },
  "open-day": {
    id: "open-day",
    title: "Open Day",
    category: "Event",
    shortDescription: "Campus open day for prospective students and parents to visit.",
    date: "2026-04-15",
    time: "8:00 AM - 3:00 PM",
    venue: "SLIIT, Campus Grounds",
    description:
      "Join us for SLIIT Open Day, where prospective students and their families can explore our world-class campus facilities! Tour our state-of-the-art laboratories, libraries, and innovation centers. Meet with faculty members and current students to learn about our diverse degree programs. Attend information sessions about admissions, scholarships, student life, and career prospects. Experience campus culture through live demonstrations, club exhibitions, and interactive sessions. Whether you're considering undergraduate or postgraduate studies, Open Day provides everything you need to make an informed decision about your educational future. Free campus tours run throughout the day!",
    registrationOpen: "2026-03-20",
    registrationClose: "2026-04-13",
    image: opendayImage,
    isNew: false,
  },
  "ganthera": {
    id: "ganthera",
    title: "Ganthera Cultural Show",
    category: "Event",
    shortDescription: "Celebration of diverse cultures through music, dance, and art.",
    date: "2026-04-20",
    time: "6:30 PM - 10:00 PM",
    venue: "SLIIT, Amphitheatre",
    description:
      "Ganthera is SLIIT's vibrant celebration of cultural diversity and artistic expression! Experience the rich tapestry of Sri Lankan culture alongside international performances. Watch mesmerizing traditional dance performances, listen to soulful music from around the world, and admire artistic displays from talented student artists. The event features cultural food stalls, traditional craft exhibitions, and interactive cultural workshops. Ganthera brings together students from all backgrounds to celebrate unity in diversity. Whether you're a performer or an audience member, this cultural extravaganza promises an evening of beauty, tradition, and community spirit. Traditional attire is encouraged but not required!",
    registrationOpen: "2026-03-25",
    registrationClose: "2026-04-18",
    image: ganthersImage,
    isNew: false,
  },
};

const FIELD_ORDER = ["title", "description", "category", "date", "venue", "image"];

const validateField = (fieldName, value, formValues) => {
  const trimmedValue = typeof value === "string" ? value.trim() : value;

  switch (fieldName) {
    case "title": {
      if (!trimmedValue) return "Title is required.";
      if (trimmedValue.length < 3) return "Title must be at least 3 characters.";
      if (trimmedValue.length > 100) return "Title cannot exceed 100 characters.";
      return "";
    }
    case "description": {
      if (!trimmedValue) return "Description is required.";
      if (trimmedValue.length < 20) return "Description must be at least 20 characters.";
      if (trimmedValue.length > 1000) return "Description cannot exceed 1000 characters.";
      return "";
    }
    case "category": {
      if (!trimmedValue) return "Category is required.";
      return "";
    }
    case "date": {
      if (!trimmedValue) return "Date is required.";
      const selectedDate = new Date(`${trimmedValue}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (Number.isNaN(selectedDate.getTime())) return "Please enter a valid date.";
      if (selectedDate <= today) return "Date must be in the future.";
      return "";
    }
    case "venue": {
      if (!trimmedValue) return "Venue is required.";
      if (trimmedValue.length < 5) return "Venue must be at least 5 characters.";
      if (trimmedValue.length > 150) return "Venue cannot exceed 150 characters.";
      return "";
    }
    case "image": {
      if (!trimmedValue) return "Image is required.";
      return "";
    }
    default:
      return "";
  }
};

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="modal__errorMsg" role="alert">
      <span className="modal__errorIcon" aria-hidden="true">!</span>
      {message}
    </p>
  );
}

function ActivityDetails() {
  const { activityType } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const displayName = currentUser?.fullName || currentUser?.email || "User";
  const [activity, setActivity] = useState(null);
  const [showClosedMessage] = useState(false);
  const [showSuccessMessage] = useState(false);
  const [showNewActivityBanner, setShowNewActivityBanner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    venue: "",
    image: "",
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const profileRef = useRef(null);
  const successTimerRef = useRef(null);
  const fieldRefs = useRef({});

  useEffect(() => {
    const data =
      activitiesData[activityType] || activitiesData["event"];
    setActivity(data);

    // Show new activity banner if activity is new
    if (data.isNew) {
      setShowNewActivityBanner(true);
    }
  }, [activityType]);

  useEffect(() => {
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;

    const onModalEscape = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
        setShowModalSuccess(false);
      }
    };

    document.addEventListener("keydown", onModalEscape);
    return () => document.removeEventListener("keydown", onModalEscape);
  }, [isModalOpen]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsNavOpen(false);
        setIsProfileOpen(false);
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

  const getAllFieldErrors = (values) => {
    return FIELD_ORDER.reduce((accumulator, fieldName) => {
      accumulator[fieldName] = validateField(fieldName, values[fieldName], values);
      return accumulator;
    }, {});
  };

  const shouldShowError = (fieldName) => {
    return Boolean((touched[fieldName] || submitAttempted) && errors[fieldName]);
  };

  const handleOpenModal = () => {
    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current);
    }
    setShowModalSuccess(false);
    setSubmitAttempted(false);
    setTouched({});
    setErrors({});
    setFormData({
      title: "",
      description: "",
      category: "",
      date: "",
      venue: "",
      image: "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current);
    }
    setShowModalSuccess(false);
    setIsModalOpen(false);
  };

  const handleChange = (eventOrField, valueOverride) => {
    const fieldName = typeof eventOrField === "string" ? eventOrField : eventOrField.target.name;
    const fieldValue = typeof eventOrField === "string" ? valueOverride : eventOrField.target.value;

    setFormData((previous) => {
      const nextValues = { ...previous, [fieldName]: fieldValue };

      if (touched[fieldName] || submitAttempted) {
        setErrors((previousErrors) => ({
          ...previousErrors,
          [fieldName]: validateField(fieldName, nextValues[fieldName], nextValues),
        }));
      }

      return nextValues;
    });
  };

  const handleBlur = (eventOrField) => {
    const fieldName = typeof eventOrField === "string" ? eventOrField : eventOrField.target.name;

    setTouched((previous) => ({ ...previous, [fieldName]: true }));
    setErrors((previous) => ({
      ...previous,
      [fieldName]: validateField(fieldName, formData[fieldName], formData),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = getAllFieldErrors(formData);
    setErrors(nextErrors);
    setSubmitAttempted(true);
    setTouched(
      FIELD_ORDER.reduce((accumulator, fieldName) => {
        accumulator[fieldName] = true;
        return accumulator;
      }, {})
    );

    const firstErrorField = FIELD_ORDER.find((fieldName) => nextErrors[fieldName]);
    if (firstErrorField) {
      const firstFieldElement = fieldRefs.current[firstErrorField];
      if (firstFieldElement) {
        firstFieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
        if (typeof firstFieldElement.focus === "function") {
          firstFieldElement.focus();
        }
      }
      return;
    }

    setShowModalSuccess(true);
    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current);
    }
    successTimerRef.current = window.setTimeout(() => {
      handleCloseModal();
    }, 1400);
  };


  if (!activity) {
    return <div>Loading...</div>;
  }

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
            <a href="#event" onClick={() => setIsNavOpen(false)}>
              Events
            </a>
            <a href="#career" onClick={() => setIsNavOpen(false)}>
              Career
            </a>
            <a href="#study" onClick={() => setIsNavOpen(false)}>
              Study
            </a>
          </div>

          <button className="header__notificationBtn" aria-label="Notifications">
            <svg className="header__notificationIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
              <path d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"/>
            </svg>
            <span className="header__notificationBadge">3</span>
          </button>

          <div className="header__profileDropdown" ref={profileRef}>
            <button
              className="header__profileBtn"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-expanded={isProfileOpen}
            >
              <span className="header__profileText">{displayName}</span>
              <span className="header__profileArrow" aria-hidden="true">▼</span>
            </button>
            {isProfileOpen && (
              <div className="header__profileMenu">
                <a href="#profile" className="header__profileMenuItem">Profile</a>
                <a href="#password change" className="header__profileMenuItem">Password Change</a>
                <a href="#logout" className="header__profileMenuItem header__profileMenuItem--danger">Logout</a>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="activityDetails">
        {showNewActivityBanner && (
          <div className="activityDetails__alertBanner">
            <div className="container">
              <div className="activityDetails__notification activityDetails__notification--info">
                <span className="activityDetails__notificationIcon">🎉</span>
                <span><strong>New Activity Alert!</strong> This is a recently added activity. Register now to secure your spot!</span>
                <button 
                  className="activityDetails__closeBtn" 
                  onClick={() => setShowNewActivityBanner(false)}
                  aria-label="Close notification"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="activityDetails__layout">
          <div className="activityDetails__contentWrapper container">
            <div className="activityDetails__mainContent">
              <div className="activityDetails__imageSection">
                <img 
                  src={activity.image} 
                  alt={activity.title}
                  className="activityDetails__heroImage"
                />
                <div className="activityDetails__imageOverlay">
                  <div className="activityDetails__titleSection">
                    <h1 className="activityDetails__mainTitle">{activity.title}</h1>
                    <p className="activityDetails__shortDesc">{activity.shortDescription}</p>
                  </div>
                </div>
              </div>

              <div className="activityDetails__infoGrid">
                <div className="activityDetails__infoCard">
                  <div className="activityDetails__iconWrapper activityDetails__iconWrapper--date">
                    <svg className="activityDetails__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="activityDetails__infoContent">
                    <span className="activityDetails__label">DATE</span>
                    <p className="activityDetails__value">{new Date(activity.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</p>
                  </div>
                </div>

                <div className="activityDetails__infoCard">
                  <div className="activityDetails__iconWrapper activityDetails__iconWrapper--time">
                    <svg className="activityDetails__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="activityDetails__infoContent">
                    <span className="activityDetails__label">TIME</span>
                    <p className="activityDetails__value">{activity.time}</p>
                  </div>
                </div>

                <div className="activityDetails__infoCard">
                  <div className="activityDetails__iconWrapper activityDetails__iconWrapper--venue">
                    <svg className="activityDetails__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M3.62 8.49C5.59 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <div className="activityDetails__infoContent">
                    <span className="activityDetails__label">VENUE</span>
                    <p className="activityDetails__value">{activity.venue}</p>
                  </div>
                </div>

                <div className="activityDetails__infoCard">
                  <div className="activityDetails__iconWrapper activityDetails__iconWrapper--capacity">
                    <svg className="activityDetails__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 7.16C17.94 7.15 17.87 7.15 17.81 7.16C16.43 7.11 15.33 5.98 15.33 4.58C15.33 3.15 16.48 2 17.91 2C19.34 2 20.49 3.16 20.49 4.58C20.48 5.98 19.38 7.11 18 7.16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.97 14.44C18.34 14.67 19.85 14.43 20.91 13.72C22.32 12.78 22.32 11.24 20.91 10.3C19.84 9.59 18.31 9.35 16.94 9.59" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5.97 7.16C6.03 7.15 6.1 7.15 6.16 7.16C7.54 7.11 8.64 5.98 8.64 4.58C8.64 3.15 7.49 2 6.06 2C4.63 2 3.48 3.16 3.48 4.58C3.49 5.98 4.59 7.11 5.97 7.16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 14.44C5.63 14.67 4.12 14.43 3.06 13.72C1.65 12.78 1.65 11.24 3.06 10.3C4.13 9.59 5.66 9.35 7.03 9.59" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 14.63C11.94 14.62 11.87 14.62 11.81 14.63C10.43 14.58 9.33 13.45 9.33 12.05C9.33 10.62 10.48 9.47 11.91 9.47C13.34 9.47 14.49 10.63 14.49 12.05C14.48 13.45 13.38 14.59 12 14.63Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.09 17.78C7.68 18.72 7.68 20.26 9.09 21.2C10.69 22.27 13.31 22.27 14.91 21.2C16.32 20.26 16.32 18.72 14.91 17.78C13.32 16.72 10.69 16.72 9.09 17.78Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="activityDetails__infoContent">
                    <span className="activityDetails__label">CAPACITY</span>
                    <p className="activityDetails__value">{activity.registered} / {activity.capacity} attendees</p>
                    <div className="activityDetails__progressBar">
                      <div 
                        className="activityDetails__progress"
                        style={{ width: `${(activity.registered / activity.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="activityDetails__descriptionSection">
                <h2 className="activityDetails__sectionTitle">About This Activity</h2>
                <p className="activityDetails__description">{activity.description}</p>
              </div>

              {(showClosedMessage || showSuccessMessage) && (
                <div className="activityDetails__messages">
                  {showClosedMessage && (
                    <div className="activityDetails__notification activityDetails__notification--error">
                      <span className="activityDetails__notificationIcon">⚠️</span>
                      <span>Registration period is closed. Please check back during the registration window.</span>
                    </div>
                  )}

                  {showSuccessMessage && (
                    <div className="activityDetails__notification activityDetails__notification--success">
                      <span className="activityDetails__notificationIcon">✓</span>
                      <span><strong>Registration Successful!</strong> You have been registered for this activity. Check your email for confirmation details.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <aside className="activityDetails__sidebar">
              <div className="activityDetails__registerCard">
                <div className="activityDetails__sidebarInfo">
                  <h3 className="activityDetails__sidebarTitle">Event Information</h3>
                  <p className="activityDetails__helperText">
                    For more details about this activity, please check the information on the left or contact the organizers.
                  </p>
                </div>

                <button type="button" className="activityDetails__addBtn" onClick={handleOpenModal}>
                  + Add New Event
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div
          className="modal__overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <div className="modal__header">
              <h2 className="modal__title" id="modalTitle">Create New Event</h2>
              <button type="button" className="modal__close" onClick={handleCloseModal} aria-label="Close modal">
                ×
              </button>
            </div>

            {showModalSuccess && (
              <div className="modal__successBanner" role="status" aria-live="polite">
                Event created successfully. Closing modal...
              </div>
            )}

            <form className="modal__form" onSubmit={handleSubmit} noValidate>
              <label className="modal__label" htmlFor="eventTitle">Title</label>
              <input
                id="eventTitle"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`modal__input ${shouldShowError("title") ? "modal__input--error" : ""}`.trim()}
                ref={(element) => {
                  fieldRefs.current.title = element;
                }}
                maxLength={100}
                placeholder="Enter event title"
              />
              <FieldError message={shouldShowError("title") ? errors.title : ""} />

              <label className="modal__label" htmlFor="eventDescription">Description</label>
              <textarea
                id="eventDescription"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`modal__input modal__textarea ${shouldShowError("description") ? "modal__input--error" : ""}`.trim()}
                ref={(element) => {
                  fieldRefs.current.description = element;
                }}
                maxLength={1000}
                placeholder="Write a detailed event description"
              />
              <p className="modal__charCount">{formData.description.length}/1000</p>
              <FieldError message={shouldShowError("description") ? errors.description : ""} />

              <span className="modal__label">Category</span>
              <div
                className={`modal__chips ${shouldShowError("category") ? "modal__chip--error" : ""}`.trim()}
                ref={(element) => {
                  fieldRefs.current.category = element;
                }}
                tabIndex={-1}
              >
                {["Event", "Sports", "Club & Society"].map((categoryOption) => (
                  <button
                    type="button"
                    key={categoryOption}
                    className={`modal__chip ${formData.category === categoryOption ? "is-active" : ""}`.trim()}
                    onClick={() => {
                      handleChange("category", categoryOption);
                      handleBlur("category");
                    }}
                  >
                    {categoryOption}
                  </button>
                ))}
              </div>
              <FieldError message={shouldShowError("category") ? errors.category : ""} />

              <label className="modal__label" htmlFor="eventDate">Date</label>
              <input
                id="eventDate"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`modal__input ${shouldShowError("date") ? "modal__input--error" : ""}`.trim()}
                ref={(element) => {
                  fieldRefs.current.date = element;
                }}
              />
              <FieldError message={shouldShowError("date") ? errors.date : ""} />

              <label className="modal__label" htmlFor="eventVenue">Venue</label>
              <input
                id="eventVenue"
                name="venue"
                type="text"
                value={formData.venue}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`modal__input ${shouldShowError("venue") ? "modal__input--error" : ""}`.trim()}
                ref={(element) => {
                  fieldRefs.current.venue = element;
                }}
                maxLength={150}
                placeholder="Enter event venue"
              />
              <FieldError message={shouldShowError("venue") ? errors.venue : ""} />

              <label className="modal__label" htmlFor="eventImage">Image URL</label>
              <input
                id="eventImage"
                name="image"
                type="text"
                value={formData.image}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`modal__input ${shouldShowError("image") ? "modal__input--error" : ""}`.trim()}
                ref={(element) => {
                  fieldRefs.current.image = element;
                }}
                placeholder="https://example.com/event-image.jpg"
              />
              <FieldError message={shouldShowError("image") ? errors.image : ""} />

              <div className="modal__actions">
                <button type="button" className="modal__btn modal__btn--ghost" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="modal__btn modal__btn--primary">
                  Save Event
                </button>
              </div>
            </form>
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
    </>
  );
}

export default ActivityDetails;
