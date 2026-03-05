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

// Import auth middleware (when implemented)
// const { protect, adminOnly, studentOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getSports);
router.get("/:id", getSportById);

// Student routes (add protect middleware when auth is ready)
router.post("/:id/register", registerForSport); // Add: protect, studentOnly

// Admin routes (add protect and adminOnly middleware when auth is ready)
router.post("/", createSport); // Add: protect, adminOnly
router.put("/:id", updateSport); // Add: protect, adminOnly
router.delete("/:id", deleteSport); // Add: protect, adminOnly
router.post("/:id/notify", sendSportNotification); // Add: protect, adminOnly

module.exports = router;
