const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventcontrollers");

// Middleware for admin authentication (you'll need to implement this)
// const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Admin routes (add protect and adminOnly middleware when auth is implemented)
router.post("/", createEvent); // Add: protect, adminOnly
router.put("/:id", updateEvent); // Add: protect, adminOnly
router.delete("/:id", deleteEvent); // Add: protect, adminOnly

module.exports = router;
