const express = require("express");
const router = express.Router();
const {
  getAssignments,
  createAssignment,
  getAssignmentById,
  updateAssignment,
  updateStatus,
  deleteAssignment,
} = require("../controllers/assignmentcontrollers");

router.get("/", getAssignments);
router.post("/", createAssignment);
router.get("/:assignmentId", getAssignmentById);
router.put("/:assignmentId", updateAssignment);
router.patch("/:assignmentId", updateStatus);
router.delete("/:assignmentId", deleteAssignment);

module.exports = router;
