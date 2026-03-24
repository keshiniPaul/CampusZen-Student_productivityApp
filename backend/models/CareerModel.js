const mongoose = require("mongoose");

const CareerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    company: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    duration: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "#60a5fa"
    },
    link: {
      type: String,
      default: "#"
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["internship", "guidance", "resource", "management"]
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Career", CareerSchema);
