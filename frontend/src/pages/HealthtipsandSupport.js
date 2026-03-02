import { useState } from "react";
import { Link } from "react-router-dom";
import "./HealthtipsandSupport.css";
import campusLogo from "../images/campus_logo.png";

function HealthtipsandSupport() {
  const [search, setSearch] = useState("");

  const resources = [
    {
      category: "Study Tips",
      icon: "📚",
      items: [
        "Active recall & spaced repetition",
        "Break study sessions into 45-min blocks",
        "Use digital planners to track deadlines",
      ],
    },
    {
      category: "Stress Management",
      icon: "🧘",
      items: [
        "Practice 5-minute breathing exercises",
        "Daily gratitude journaling",
        "Take short mental reset walks",
      ],
    },
    {
      category: "Time Management",
      icon: "⏳",
      items: [
        "Use the Pomodoro technique",
        "Prioritize tasks using Eisenhower Matrix",
        "Set realistic daily goals",
      ],
    },
    {
      category: "Professional Support",
      icon: "🏥",
      items: [
        "University counselling appointments",
        "Mental health hotline access",
        "Wellness workshops & seminars",
      ],
    },
  ];

  const filteredResources = resources.filter((section) =>
    section.category.toLowerCase().includes(search.toLowerCase())
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
              alt="CampusZone Logo"
            />
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="healthtips-hero">
        <div className="container">
          <h1>Wellbeing Tips & Support Resources</h1>
          <p>
            Immediate guidance to help you manage stress, academic pressure,
            and maintain mental & physical health.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="healthtips-search container">
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {/* Resource Cards */}
      <section className="healthtips-content container">
        {filteredResources.map((section) => (
          <div className="health-card" key={section.category}>
            <div className="health-card__header">
              <span className="health-card__icon">{section.icon}</span>
              <h3>{section.category}</h3>
            </div>
            <ul>
              {section.items.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer__inner">
          <div>
            <div className="footer__name">CampusZone</div>
            <div className="footer__small">
              Supporting student mental & physical health
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HealthtipsandSupport;