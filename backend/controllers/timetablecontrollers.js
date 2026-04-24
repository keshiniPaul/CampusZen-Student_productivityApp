const TimetableSlot = require("../models/timetablemodel");
const jwt = require("jsonwebtoken");

const getUserId = (req) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  try {
    const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET || "campuszone_secret");
    return decoded.id || decoded._id || decoded.userId;
  } catch {
    return null;
  }
};

// GET /api/timetable
const getTimetable = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
  try {
    const slots = await TimetableSlot.find({ userId }).sort({ dayOfWeek: 1, startTime: 1 });
    res.json({ success: true, data: slots });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/timetable
const createSlot = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
  try {
    const { subject, dayOfWeek, startTime, endTime, type, color, repeat } = req.body;
    if (!subject || dayOfWeek === undefined || !startTime || !endTime || !type) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }
    if (endTime <= startTime) {
      return res.status(400).json({ success: false, message: "End time must be after start time." });
    }
    const slot = await TimetableSlot.create({
      subject, dayOfWeek, startTime, endTime, type,
      color: color || "#4F46E5",
      repeat: repeat !== undefined ? repeat : true,
      userId,
    });
    res.status(201).json({ success: true, data: slot });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/timetable/:slotId
const updateSlot = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
  try {
    const { startTime, endTime } = req.body;
    if (startTime && endTime && endTime <= startTime) {
      return res.status(400).json({ success: false, message: "End time must be after start time." });
    }
    const slot = await TimetableSlot.findOneAndUpdate(
      { _id: req.params.slotId, userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found." });
    res.json({ success: true, data: slot });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/timetable/:slotId
const deleteSlot = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
  try {
    const slot = await TimetableSlot.findOneAndDelete({ _id: req.params.slotId, userId });
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found." });
    res.json({ success: true, message: "Slot deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getTimetable, createSlot, updateSlot, deleteSlot };
