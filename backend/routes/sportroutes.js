const express = require("express");
const router = express.Router();
const {
  getSports,
  getSportById,
  createSport,
  updateSport,
  deleteSport,
  registerForSport,
  sendSportNotification,
} = require("../controllers/sportcontrollers");
const { protect, adminOnly, studentOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getSports);
router.get("/:id", getSportById);

// Student routes
router.post("/:id/register", protect, studentOnly, registerForSport);

// Admin routes
router.post("/", protect, adminOnly, createSport);
router.put("/:id", protect, adminOnly, updateSport);
router.delete("/:id", protect, adminOnly, deleteSport);
router.post("/:id/notify", protect, adminOnly, sendSportNotification);

module.exports = router;
