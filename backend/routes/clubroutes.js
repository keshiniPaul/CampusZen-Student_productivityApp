const express = require("express");
const router = express.Router();
const {
  getClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
  joinClub,
  manageMember,
  postAnnouncement,
} = require("../controllers/clubcontrollers");
const { protect, adminOnly, studentOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getClubs);
router.get("/:id", getClubById);

// Student routes
router.post("/:id/join", protect, studentOnly, joinClub);

// Admin routes
router.post("/", protect, adminOnly, createClub);
router.put("/:id", protect, adminOnly, updateClub);
router.delete("/:id", protect, adminOnly, deleteClub);
router.put("/:id/members/:memberId", protect, adminOnly, manageMember);
router.post("/:id/announcements", protect, adminOnly, postAnnouncement);

module.exports = router;
