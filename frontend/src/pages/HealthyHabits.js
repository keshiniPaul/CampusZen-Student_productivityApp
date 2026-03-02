import { useState } from "react";
import { Link } from "react-router-dom";
import "./HealthyHabits.css";
import campusLogo from "../images/campus_logo.png";

function HealthyHabits() {
  const [goals, setGoals] = useState({
    sleepGoal: 8,
    exerciseGoal: 30,
    stressGoal: 4,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setGoals({
      ...goals,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    console.log("Saved Goals:", goals);

    /*
    await fetch("http://localhost:5000/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goals),
    });
    */

    setMessage("Goals saved successfully! 🎯");
  };

  // Demo insights (can later connect to real data)
  const insight = "Your stress levels increased this week. Try adding a relaxation session.";

  return (
    <>
      {/* Header */}
      <header className="topbar">
        <nav className="nav container">
          <Link className="brand" to="/">
            <img className="brand__logo--img" src={campusLogo} alt="CampusZone Logo" />
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="habits-hero">
        <div className="container">
          <h1>Healthy Habits & Progress Dashboard</h1>
          <p>
            Build consistent habits, track your progress visually,
            and stay motivated throughout your academic journey.
          </p>
        </div>
      </section>

      {/* Goal Setting */}
      <section className="habits-section container">
        <div className="habits-card">
          <h2>🎯 Personal Wellbeing Goals</h2>

          <form onSubmit={handleSave} className="habits-form">
            <label>
              🛌 Sleep Goal (hours/day)
              <input
                type="number"
                name="sleepGoal"
                value={goals.sleepGoal}
                onChange={handleChange}
                min="1"
                max="12"
              />
            </label>

            <label>
              🏃 Exercise Goal (minutes/day)
              <input
                type="number"
                name="exerciseGoal"
                value={goals.exerciseGoal}
                onChange={handleChange}
                min="0"
              />
            </label>

            <label>
              😌 Target Stress Level (1–10)
              <input
                type="number"
                name="stressGoal"
                value={goals.stressGoal}
                onChange={handleChange}
                min="1"
                max="10"
              />
            </label>

            <button type="submit" className="btn btn--primary btn--lg">
              Save Goals
            </button>

            {message && <p className="success-msg">{message}</p>}
          </form>
        </div>
      </section>

      {/* Dashboard */}
      <section className="habits-section container">
        <div className="habits-card">
          <h2>📊 Health Progress Dashboard</h2>

          <div className="dashboard-grid">
            <div className="dashboard-item">
              <h3>Sleep Trend</h3>
              <div className="fake-chart">██████░░</div>
            </div>

            <div className="dashboard-item">
              <h3>Exercise Frequency</h3>
              <div className="fake-chart">████░░░░</div>
            </div>

            <div className="dashboard-item">
              <h3>Stress Trend</h3>
              <div className="fake-chart">███░░░░░</div>
            </div>

            <div className="dashboard-item">
              <h3>Mood Pattern</h3>
              <div className="fake-chart">███████░</div>
            </div>
          </div>

          <div className="insight-box">
            💡 Insight: {insight}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer__inner">
          <div>
            <div className="footer__name">CampusZone</div>
            <div className="footer__small">
              Promoting healthy student lifestyles
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HealthyHabits;