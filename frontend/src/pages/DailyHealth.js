import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./DailyHealth.css";
import campusLogo from "../images/campus_logo.png";

function DailyHealth() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sleepHours: "",
    exerciseMinutes: "",
    mood: "",
    stress: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      date: today,
    };

    console.log(payload);

    alert("Health entry saved successfully!");
    navigate("/");
  };

  /* ================= MCQ DATA ================= */

  const sleepOptions = [
    "😴 Less than 5 hours",
    "🌤️ 5 – 6 hours",
    "🌥️ 6 – 7 hours",
    "😊 7 – 8 hours",
    "🌟 More than 8 hours"
  ];

  const exerciseOptions = [
    "🚫 None (0 minutes)",
    "🚶 1 – 30 minutes",
    "🏃 31 – 60 minutes",
    "🔥 61 – 90 minutes",
    "💪 More than 90 minutes"
  ];

  const moodOptions = [
    "😞 Very low mood",
    "🙂 Low mood",
    "😐 Neutral",
    "😃 Good",
    "🤩 Very happy"
  ];

  const stressOptions = [
    "🟢 Very low stress",
    "🟡 Low stress",
    "🟠 Moderate stress",
    "🔴 High stress",
    "⚠️ Very high stress"
  ];

  const renderMCQ = (name, options) => (
    <div className="mcq-options">
      {options.map(option => (
        <label key={option} className="mcq-item">
          <input
            type="radio"
            name={name}
            value={option}
            onChange={handleChange}
            required
          />
          {option}
        </label>
      ))}
    </div>
  );

  return (
    <>
      {/* Header */}
      <header className="topbar">
        <nav className="nav container">
          <Link className="brand" to="/">
            <img
              className="brand__logo--img"
              src={campusLogo}
              alt="CampusZen Logo"
            />
          </Link>
        </nav>
      </header>

      {/* ===== Banner Section ===== */}
      <section className="health-banner">
        <div className="banner-overlay">
          <h1>Daily Health Tracking</h1>
          <p>
            A simple self-monitoring tool to help you balance academic
            responsibilities with physical and mental wellbeing.
          </p>
        </div>
      </section>

      {/* Info Section */}
      <section className="health-info container">
        <div className="health-info__card">
          <h3>Why This Matters</h3>
          <ul>
            <li>Academic pressure</li>
            <li>Deadlines & exams</li>
            <li>Lack of sleep</li>
            <li>Stress & anxiety</li>
          </ul>

          <p>
            Tracking daily habits helps identify unhealthy patterns like
            low sleep + high stress, and encourages accountability.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="health-form-section">
        <div className="container">
          <div className="health-card">
            <h2>Log Today’s Health</h2>

            <form onSubmit={handleSubmit} className="health-form">

              <div className="mcq-block">
                <label>🌙 Sleep Hours</label>
                {renderMCQ("sleepHours", sleepOptions)}
              </div>

              <div className="mcq-block">
                <label>🏃 Exercise (minutes per day)</label>
                {renderMCQ("exerciseMinutes", exerciseOptions)}
              </div>

              <div className="mcq-block">
                <label>😊 Mood Level</label>
                {renderMCQ("mood", moodOptions)}
              </div>

              <div className="mcq-block">
                <label>😓 Stress Level</label>
                {renderMCQ("stress", stressOptions)}
              </div>

              <button type="submit" className="btn btn--primary btn--lg">
                Save Entry
              </button>

            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer__inner">
          <div>
            <div className="footer__name">CampusZen</div>
            <div className="footer__small">
              Supporting student mental & physical health
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default DailyHealth;