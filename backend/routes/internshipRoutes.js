const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { 
  getApplications, 
  getApplicationById, 
  createApplication, 
  updateApplication, 
  deleteApplication 
} = require("../controllers/internshipController");

// All routes are protected as they belong to specific users
router.get("/", protect, getApplications);
router.get("/:id", protect, getApplicationById);
router.post("/", protect, createApplication);
router.put("/:id", protect, updateApplication);
router.delete("/:id", protect, deleteApplication);

module.exports = router;
