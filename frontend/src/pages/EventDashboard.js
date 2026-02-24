import { Link } from "react-router-dom";
import "./EventDashboard.css";

const categories = [
  {
    title: "Event",
    emoji: "🎉",
    description: "Browse campus events, workshops, and student meetups happening this week.",
  },
  {
    title: "Sports",
    emoji: "🏅",
    description: "Find tournaments, practice sessions, and fitness challenges around the campus.",
  },
  {
    title: "Club & Society",
    emoji: "🤝",
    description: "Discover student clubs and societies to build skills, network, and have fun.",
  },
];

function EventDashboard() {
  return (
    <main className="eventDashboard">
      <div className="eventDashboard__bg" aria-hidden="true">
        <div className="eventDashboard__blob eventDashboard__blob--one"></div>
        <div className="eventDashboard__blob eventDashboard__blob--two"></div>
      </div>

      <section className="eventDashboard__hero container">
        <div className="eventDashboard__pill">CampusZone Events</div>
        <h1 className="eventDashboard__title">Event Dashboard</h1>
        <p className="eventDashboard__subtitle">
          Explore student life with quick access to events, sports, and club &amp; society activities.
        </p>

        <div className="eventDashboard__actions">
          <Link className="eventDashboard__btn eventDashboard__btn--primary" to="/">
            Back to Home
          </Link>
        </div>
      </section>

      <section className="eventDashboard__grid container" aria-label="Event categories">
        {categories.map((category) => (
          <article className="eventCard" key={category.title}>
            <div className="eventCard__icon" aria-hidden="true">
              {category.emoji}
            </div>
            <h2 className="eventCard__title">{category.title}</h2>
            <p className="eventCard__text">{category.description}</p>
            <button className="eventCard__cta" type="button">
              Explore
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

export default EventDashboard;
