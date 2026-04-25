const mongoose = require("mongoose");

const SESSION_TYPES = ["lecture", "study", "group-session", "revision"];

const timetableSlotSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, trim: true, minlength: 2 },
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 }, // 0=Mon … 6=Sun
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true },   // "11:00"
    type: { type: String, enum: SESSION_TYPES, required: true },
    color: { type: String, default: "#4F46E5" },
    repeat: { type: Boolean, default: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

timetableSlotSchema.index({ userId: 1, dayOfWeek: 1, startTime: 1 });

module.exports = mongoose.model("TimetableSlot", timetableSlotSchema);
