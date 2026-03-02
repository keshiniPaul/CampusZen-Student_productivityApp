const express = require("express");
const cors = require("cors");
const requestLogger = require("./middleware/requestLogger");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get("/", (req, res) => {
	res.status(200).json({
		message: "Backend connected successfully!"
	});
});

// Event routes
const eventRoutes = require("./routes/eventroutes");
app.use("/api/events", eventRoutes);

// Sport routes
const sportRoutes = require("./routes/sportroutes");
app.use("/api/sports", sportRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
