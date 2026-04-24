const express = require("express");
const router = express.Router();
const { getTimetable, createSlot, updateSlot, deleteSlot } = require("../controllers/timetablecontrollers");

router.get("/", getTimetable);
router.post("/", createSlot);
router.put("/:slotId", updateSlot);
router.delete("/:slotId", deleteSlot);

module.exports = router;
