const mongoose = require("mongoose");

const internshipApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: [true, "Company Name is required"],
      trim: true,
    },
    roleTitle: {
      type: String,
      required: [true, "Role Title is required"],
      trim: true,
    },
    jobPostingLink: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Applied", "Interviewing", "Offered", "Rejected"],
      default: "Draft",
    },
    nextImportantDate: {
      type: Date,
    },
    nextDateContext: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InternshipApplication", internshipApplicationSchema);
