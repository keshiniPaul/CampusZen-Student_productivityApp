import { useNavigate } from "react-router-dom";
import "./Home.css";   // reuse same theme
import campusLogo from "../images/campus_logo.png";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import linkedinIcon from "../images/linkedin.png";
import youtubeIcon from "../images/youtube.png";

function Health() {

  const navigate = useNavigate();

  /* ---------- Navigation Helpers ---------- */

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToEventsDashboard = (e) => {
    e.preventDefault();
    navigate("/events");
  };

  /* ---------- Calendar (Same as Home Footer) ---------- */

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
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="topbar">
        <nav className="nav container">

          <a className="brand" href="/" onClick={(e)=>{
            e.preventDefault();
            navigate("/");
          }}>
            <img
              className="brand__logo--img"
              src={campusLogo}
              alt="CampusZone Logo"
            />
          </a>

          <div className="nav__links is-open">

            <a href="/" onClick={(e)=>{
              e.preventDefault();
              navigate("/");
            }}>
              Home
            </a>

            <a href="/health" onClick={(e)=>{
              e.preventDefault();
              navigate("/health");
            }}>
              Health
            </a>

            <a href="/events" onClick={goToEventsDashboard}>
              Events
            </a>

          </div>
        </nav>
      </header>

      {/* ================= MAIN HEALTH DASHBOARD ================= */}

      <main className="section">
        <div className="container">

          <div className="section__head">
            <h2 className="section__title">
              Student Health &amp; Wellbeing
            </h2>

            <p className="section__desc">
              Maintain physical and mental wellness through campus support resources.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="posts">

            {/* Wellbeing Checkins */}
            <article className="post">
              <div className="post__media">
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773"
                  alt="Wellbeing checkin"
                />
              </div>

              <div className="post__body">
                <h3 className="post__title">Wellbeing Check-ins</h3>
                <p className="post__text">
                  Track mood, stress level, and daily wellness progress.
                </p>

                <a
                  className="post__link"
                  href="/daily-health"
                  onClick={(e)=>{
                    e.preventDefault();
                    navigate("/daily-health");
                  }}
                >
                  Explore →
                </a>
              </div>
            </article>

            {/* Counselling */}
            <article className="post">
              <div className="post__media">
                <img
                  src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a"
                  alt="Counselling support"
                />
              </div>

              <div className="post__body">
                <h3 className="post__title">Counselling & Support</h3>
                <p className="post__text">
                  Connect with campus wellbeing support services.
                </p>

                <a
                  className="post__link"
                  href="/health-resources"
                  onClick={(e)=>{
                    e.preventDefault();
                    navigate("/health-resources");
                  }}
                >
                  Explore →
                </a>
              </div>
            </article>

            {/* Healthy Habits */}
            <article className="post">
              <div className="post__media">
                <img
                  src="https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38"
                  alt="Healthy habits"
                />
              </div>

              <div className="post__body">
                <h3 className="post__title">Healthy Habits</h3>
                <p className="post__text">
                  Set sleep, exercise, and lifestyle wellness goals.
                </p>

                <a
                  className="post__link"
                  href="/healthy-habits"
                  onClick={(e)=>{
                    e.preventDefault();
                    navigate("/healthy-habits");
                  }}
                >
                  Explore →
                </a>
              </div>
            </article>

          </div>

        </div>
      </main>

      {/* ================= FOOTER (Same Style as Home) ================= */}

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

          {/* Calendar */}
          <div className="footer__calendar">
            <h3 className="footer__calendarTitle">Calendar</h3>

            <div className="footer__calendarHead">
              <strong>{monthLabel}</strong>
            </div>

            <div className="footer__weekdays">
              {weekdayLabels.map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className="footer__days">
              {calendarDays.map((day, index) => {

                if (!day) {
                  return <span className="is-muted" key={index}></span>;
                }

                const isToday = day === currentDay;

                return (
                  <span
                    key={index}
                    className={isToday ? "is-active" : ""}
                  >
                    {day}
                  </span>
                );

              })}
            </div>

            <a
              className="footer__fullCalendar"
              href="/events"
              onClick={goToEventsDashboard}
            >
              Full calendar
            </a>

          </div>
        </div>

        <div className="footer__bottom">
          <div className="container footer__inner">

            <div className="footer__brand">
              <div>
                <div className="footer__name">CampusZone</div>
                <div className="footer__small">
                  Student Productivity Platform
                </div>
              </div>
            </div>

            <div className="footer__socials">

              <a href="#" onClick={scrollToTop}>
                <img src={facebookIcon} alt="facebook" className="footer__socialIcon"/>
              </a>

              <a href="#" onClick={scrollToTop}>
                <img src={instagramIcon} alt="instagram" className="footer__socialIcon"/>
              </a>

              <a href="#" onClick={scrollToTop}>
                <img src={linkedinIcon} alt="linkedin" className="footer__socialIcon"/>
              </a>

              <a href="#" onClick={scrollToTop}>
                <img src={youtubeIcon} alt="youtube" className="footer__socialIcon"/>
              </a>

            </div>

          </div>
        </div>

      </footer>

    </>
  );
}

export default Health;