const mongoose = require("mongoose");

const sportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sport name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Sport category is required"],
      enum: ["Team Selection", "Tournament"],
      default: "Tournament",
    },
    description: {
      type: String,
      required: [true, "Sport description is required"],
      trim: true,
    },
    registrationOpen: {
      type: Date,
      required: [true, "Registration open date is required"],
    },
    registrationClose: {
      type: Date,
      required: [true, "Registration close date is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    coach: {
      type: String,
      required: [true, "Coach/Instructor name is required"],
      trim: true,
    },
    maxCapacity: {
      type: Number,
      required: [true, "Max capacity is required"],
      min: 1,
    },
    registered: {
      type: Number,
      default: 0,
      min: 0,
    },
    eligibility: {
      type: String,
      required: [true, "Eligibility requirements are required"],
      trim: true,
    },
    selectionCriteria: {
      type: String,
      required: [true, "Selection criteria is required"],
      trim: true,
    },
    requiresMedical: {
      type: Boolean,
      default: false,
    },
    skillLevels: {
      type: [String],
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: ["Beginner", "Intermediate", "Advanced"],
    },
    registrationLink: {
      type: String,
      required: [true, "Registration link is required"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries
sportSchema.index({ registrationOpen: 1, registrationClose: 1 });
sportSchema.index({ category: 1 });
sportSchema.index({ isActive: 1 });

// Virtual field for registration status
sportSchema.virtual("status").get(function () {
  const today = new Date();
  const openDate = new Date(this.registrationOpen);
  const closeDate = new Date(this.registrationClose);

  if (this.registered >= this.maxCapacity) {
    return "FULL";
  } else if (today < openDate) {
    return "COMING SOON";
  } else if (today >= openDate && today <= closeDate) {
    return "OPEN";
  } else {
    return "CLOSED";
  }
});

// Ensure virtuals are included when converting to JSON
sportSchema.set("toJSON", { virtuals: true });
sportSchema.set("toObject", { virtuals: true });

const Sport = mongoose.model("Sport", sportSchema);

module.exports = Sport;
