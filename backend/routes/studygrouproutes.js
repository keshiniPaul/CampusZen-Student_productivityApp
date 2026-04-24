const express = require("express");
const router = express.Router();
const {
  getStudyGroups,
  getStudyGroupById,
  createStudyGroup,
  updateStudyGroup,
  deleteStudyGroup,
  getGroupMembers,
  joinStudyGroup,
  leaveStudyGroup,
} = require("../controllers/studygroupcontrollers");

// Public routes
router.get("/", getStudyGroups);
router.get("/:groupId", getStudyGroupById);
router.get("/:groupId/members", getGroupMembers);

// Protected routes (auth middleware to be added when auth is ready)
router.post("/", createStudyGroup);
router.put("/:groupId", updateStudyGroup);
router.delete("/:groupId", deleteStudyGroup);
router.post("/:groupId/members", joinStudyGroup);
router.delete("/:groupId/members/:userId", leaveStudyGroup);

module.exports = router;
