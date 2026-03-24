const express = require("express");
const cors = require("cors");
const requestLogger = require("./middleware/requestLogger");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const healthyHabitRoutes = require("./routes/HealthyHabitRoutes");
const careerRoutes = require("./routes/careerRoutes");
const app = express();
const path = require("path");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(requestLogger);
app.use("/api/health/habits", healthyHabitRoutes);
app.use("/api/careers", careerRoutes);


// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend connected successfully!",
    endpoints: {
      auth: "/api/auth",
      events: "/api/events",
      health: "/api/health"
    }
  });
});

// User authentication routes
const userRoutes = require("./routes/userroutes");
app.use("/api/auth", userRoutes);

// Event routes
const eventRoutes = require("./routes/eventroutes");
app.use("/api/events", eventRoutes);

// Health routes (Daily Health Check-in CRUD)
const healthRoutes = require("./routes/healthRoutes");
app.use("/api/health", healthRoutes);

// Health check endpoint (separate from the main routes)
app.get("/api/health-check", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    services: {
      database: "connected",
      server: "operational"
    }
  });
});

// Sport routes
const sportRoutes = require("./routes/sportroutes");
app.use("/api/sports", sportRoutes);

// Club routes
const clubRoutes = require("./routes/clubroutes");
app.use("/api/clubs", clubRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;