const express = require("express");
const cors = require("cors");
const requestLogger = require("./middleware/requestLogger");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend connected successfully!"
  });
});

// User authentication routes
const userRoutes = require("./routes/userroutes");
app.use("/api/auth", userRoutes);

// Event routes
const eventRoutes = require("./routes/eventroutes");
app.use("/api/events", eventRoutes);

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
