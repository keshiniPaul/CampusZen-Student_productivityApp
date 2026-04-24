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

// Import auth middleware (when implemented)
// const { protect, adminOnly, studentOnly, presidentOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getClubs);
router.get("/:id", getClubById);

// Student routes (add protect middleware when auth is ready)
router.post("/:id/join", joinClub); // Add: protect, studentOnly

// Admin/President routes (add protect and adminOnly/presidentOnly middleware when auth is ready)
router.post("/", createClub); // Add: protect, adminOnly
router.put("/:id", updateClub); // Add: protect, adminOnly or presidentOnly
router.delete("/:id", deleteClub); // Add: protect, adminOnly
router.put("/:id/members/:memberId", manageMember); // Add: protect, adminOnly or presidentOnly
router.post("/:id/announcements", postAnnouncement); // Add: protect, adminOnly or presidentOnly

module.exports = router;
