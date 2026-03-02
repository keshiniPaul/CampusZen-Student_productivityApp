import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";
import learningImage from "../images/learning.png";

const stats = [
  { label: "Hour access", value: 24 },
  { label: "Core services", value: 4 },
  { label: "Student-first", value: 100 },
];

function Home() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const toastTimerRef = useRef(null);
  const navLinksRef = useRef(null);
  const navToggleRef = useRef(null);
  const counterRefs = useRef([]);

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

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const counters = counterRefs.current.filter(Boolean);
    if (!counters.length) return;

    const animateCounter = (element, end) => {
      if (prefersReduced) {
        element.textContent = String(end);
        return;
      }

      const duration = 900;
      const start = performance.now();

      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = Math.round(end * eased);
        element.textContent = String(value);
        if (t < 1) window.requestAnimationFrame(tick);
      };

      window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const end = Number(entry.target.getAttribute("data-counter") || "0");
          if (Number.isFinite(end)) animateCounter(entry.target, end);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counterEl) => observer.observe(counterEl));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (message) => {
    setToastText(message || "Coming soon");
    setToastVisible(true);

    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 2200);
  };

  const scrollToSection = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsNavOpen(false);
  };

  const scrollToTop = (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsNavOpen(false);
  };

  const goToEventsDashboard = (event) => {
    event.preventDefault();
    navigate("/events");
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

  return (
    <>
      <header className="topbar" id="top">
        <nav className="nav container">
          <a className="brand" href="#top" aria-label="CampusZone Home" onClick={scrollToTop}>
            <img 
              className="brand__logo--img" 
              src={campusLogo} 
              alt="CampusZone Logo"
            />
          </a>

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
            {/* Header links */}
            <a href="#top" onClick={scrollToTop}>
              Home
            </a>
            <a href="#health" onClick={(e) => {
                      e.preventDefault();
                  navigate("/health");
                   setIsNavOpen(false);
              }}
               >
              Health
            </a>
            <a href="/events" onClick={goToEventsDashboard}>
              Events
            </a>
            <a href="#career" onClick={(e) => scrollToSection(e, "career")}>
              Career
            </a>
            <a href="#study" onClick={(e) => scrollToSection(e, "study")}>
              Study
            </a>

            <div className="nav__cta">
              <button className="header__notificationBtn" aria-label="Notifications">
                <svg className="header__notificationIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"/>
                  <path d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"/>
                </svg>
                <span className="header__notificationBadge">3</span>
              </button>
              <a className="btn btn--ghost" href="/login" onClick={() => setIsNavOpen(false)}>
                Login
              </a>
              <a className="btn btn--primary" href="/register" onClick={() => setIsNavOpen(false)}>
                Register
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero__bg" aria-hidden="true">
            <div className="blob blob--1"></div>
            <div className="blob blob--2"></div>
            <div className="grid"></div>
          </div>

          <div className="container hero__content">
            <div className="hero__text">
              <h1 className="hero__title">
                Campus services made <span className="accent">simple</span> for students.
              </h1>

              <p className="hero__subtitle">
                Health &amp; wellbeing, events, career growth, and study management—organized in one place.
              </p>

              {/* Added bullet points */}
              <ul className="hero__bullets" aria-label="Key benefits">
                <li>Fast access to student support &amp; wellbeing services</li>
                <li>Events &amp; extra-curricular activities in one calendar</li>
                <li>Career planning tools: CV, internships, and skills</li>
                <li>Study planner for deadlines and learning goals</li>
              </ul>

              <div className="hero__actions">
                <a
                  className="btn btn--primary btn--lg"
                  href="#study"
                  onClick={(e) => scrollToSection(e, "study")}
                >
                  Get Started
                </a>
                <a
                  className="btn btn--ghost btn--lg"
                  href="#health"
                  onClick={(e) => scrollToSection(e, "health")}
                >
                  Explore Features
                </a>
              </div>

              <div className="hero__stats" role="list" aria-label="Quick stats">
                {stats.map((item, index) => (
                  <div className="stat" role="listitem" key={item.label}>
                    <div
                      className="stat__num"
                      data-counter={item.value}
                      ref={(element) => {
                        counterRefs.current[index] = element;
                      }}
                    >
                      0
                    </div>
                    <div className="stat__label">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right hero image */}
            <div className="hero__media" aria-label="CampusZone banner image">
              <div className="heroCard">
                <img
                  className="heroCard__img"
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
                  alt="Campus students"
                  loading="lazy"
                />
                <div className="heroCard__float heroCard__float--left">
                  <div className="floatIcon" aria-hidden="true">🎓</div>
                  <div>
                    <div className="floatTitle">Student Hub</div>
                    <div className="floatText">All-in-one services</div>
                  </div>
                </div>
                <div className="heroCard__float heroCard__float--right">
                  <div className="floatIcon" aria-hidden="true">✅</div>
                  <div>
                    <div className="floatTitle">Easy Access</div>
                    <div className="floatText">Modern &amp; secure</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HEALTH */}
        <section className="section" id="health">
          <div className="container">
            <div className="section__head">
              <h2 className="section__title">Student Health &amp; Wellbeing</h2>
              <p className="section__desc">
                Support services for mental wellbeing, counselling, and healthy campus life.
              </p>
            </div>

            <div className="cards cards--oneRow">
              <article className="card">
                <div className="card__icon" aria-hidden="true">
                  🩺
                </div>
                <h3 className="card__title">Wellbeing Check-ins</h3>
                <p className="card__text">Track your wellbeing and get guidance based on your needs.</p>
                <a
                  className="card__link"
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/daily-health");
                    setIsNavOpen(false);
                  }}
                >
                  Learn more →
                </a>
              </article>

              <article className="card">
                <div className="card__icon" aria-hidden="true">
                  🧠
                </div>
                <h3 className="card__title">Counselling &amp; Support</h3>
                <p className="card__text">Request appointments and view helpful resources anytime.</p>
                <a
                  className="card__link"
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/health-resources");
                    setIsNavOpen(false);
                  }}
                >
                  Learn more →
                </a>
              </article>

              <article className="card">
                <div className="card__icon" aria-hidden="true">
                  🍎
                </div>
                <h3 className="card__title">Healthy Habits</h3>
                <p className="card__text">Tips, reminders, and campus health announcements.</p>
                <a
                  className="card__link"
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/healthy-habits");
                    setIsNavOpen(false);
                  }}
                >
                  Learn more →
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* EVENT */}
        <section className="section section--soft" id="event">
          <div className="container">
            <div className="section__head">
              <h2 className="section__title">Extra Curricular Activities &amp; Events</h2>
              <p className="section__desc">Clubs, competitions, volunteering, and campus events.</p>
            </div>

            <div className="posts">
              <article className="post">
                <div className="post__media">
                  <img
                    src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80"
                    alt="Campus event"
                    loading="lazy"
                  />
                  <span className="tag tag--activity">Event</span>
                </div>
                <div className="post__body">
                  <h3 className="post__title">Club registrations open</h3>
                  <p className="post__text">
                    Discover clubs and join activities that match your interests.
                  </p>
                  <a
                    className="post__link"
                    href="/events"
                    onClick={goToEventsDashboard}
                  >
                    Read more →
                  </a>
                </div>
              </article>

              <article className="post">
                <div className="post__media">
                  <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                    alt="Team activity"
                    loading="lazy"
                  />
                  <span className="tag tag--activity">Activity</span>
                </div>
                <div className="post__body">
                  <h3 className="post__title">Upcoming competitions</h3>
                  <p className="post__text">
                    Track competitions and register quickly using CampusZone.
                  </p>
                  <a
                    className="post__link"
                    href="/events"
                    onClick={goToEventsDashboard}
                  >
                    Read more →
                  </a>
                </div>
              </article>

              <article className="post">
                <div className="post__media">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                    alt="Student community"
                    loading="lazy"
                  />
                  <span className="tag tag--activity">Community</span>
                </div>
                <div className="post__body">
                  <h3 className="post__title">Volunteer opportunities</h3>
                  <p className="post__text">
                    Build experience and make a difference in your campus community.
                  </p>
                  <a
                    className="post__link"
                    href="/events"
                    onClick={goToEventsDashboard}
                  >
                    Read more →
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* CAREER */}
        <section className="section" id="career">
          <div className="container">
            <div className="section__head">
              <h2 className="section__title">Career Planning &amp; Professional Development</h2>
              <p className="section__desc">
                Plan your future with internships, CV tools, and skill tracking.
              </p>
            </div>

            <div className="cards">
              <article className="card">
                <div className="card__icon" aria-hidden="true">💼</div>
                <h3 className="card__title">Internships</h3>
                <p className="card__text">Save internship posts and track application status.</p>
                <a
                  className="card__link"
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast("Internships module coming soon");
                  }}
                >
                  Learn more →
                </a>
              </article>

              <article className="card">
                <div className="card__icon" aria-hidden="true">🧾</div>
                <h3 className="card__title">CV &amp; Portfolio</h3>
                <p className="card__text">Build a clean CV and organize your achievements.</p>
                <a
                  className="card__link"
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast("CV builder coming soon");
                  }}
                >
                  Learn more →
                </a>
              </article>

              <article className="card">
                <div className="card__icon" aria-hidden="true">🎯</div>
                <h3 className="card__title">Goals &amp; Skills</h3>
                <p className="card__text">Set goals and track skills for your dream career.</p>
                <a
                  className="card__link"
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast("Goals tracker coming soon");
                  }}
                >
                  Learn more →
                </a>
              </article>

              <article className="card">
                <div className="card__icon" aria-hidden="true">🗣️</div>
                <h3 className="card__title">Interview Prep</h3>
                <p className="card__text">Practice questions and prepare confidently.</p>
                <a
                  className="card__link"
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast("Interview prep coming soon");
                  }}
                >
                  Learn more →
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* STUDY */}
        <section className="section section--soft" id="study">
          <div className="container">
            <div className="section__head">
              <h2 className="section__title">Learning &amp; Study Management</h2>
              <p className="section__desc">
                Organize study schedules, deadlines, and learning progress.
              </p>
            </div>

            <div className="gallery">
              <figure className="gallery__item">
                <img
                  src={learningImage}
                  alt="Study planning"
                  loading="lazy"
                />
              </figure>
              <figure className="gallery__item">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                  alt="Study group"
                  loading="lazy"
                />
              </figure>
              <figure className="gallery__item">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                  alt="Learning"
                  loading="lazy"
                />
              </figure>
              <figure className="gallery__item">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                  alt="Collaboration"
                  loading="lazy"
                />
              </figure>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section section--cta" id="about">
          <div className="container cta">
            <div className="cta__text">
              <h2 className="cta__title">Join CampusZone today</h2>
              <p className="cta__desc">
                Login or create an account to access health, events, career, and study tools.
              </p>
              <div className="cta__actions">
                <a className="btn btn--dark btn--lg" href="/register">
                  Create account
                </a>
                <a className="btn btn--ghostOnDark btn--lg" href="/login">
                  Login
                </a>
              </div>
            </div>

            <div className="cta__card" aria-label="Security and privacy note">
              <div className="cta__cardIcon" aria-hidden="true">
                🔒
              </div>
              <div>
                <h3 className="cta__cardTitle">Secure login &amp; privacy</h3>
                <p className="cta__cardText">
                  Built with clear navigation and a modern, student-friendly interface.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

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

export default Home;
