const mongoose = require('mongoose');

const healthEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    // Keep mood flexible → avoid enum mismatch errors
    mood: {
      type: String,
      required: true,
    },

    // Stress level
    stress: {
      type: String,
      required: true,
    },

    // Store numeric values directly
    sleepHours: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },

    exerciseMinutes: {
      type: Number,
      required: true,
      min: 0,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent duplicate health entry per user per day
healthEntrySchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("HealthEntry", healthEntrySchema);