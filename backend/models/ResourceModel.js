const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Adding non-required fields mentioned previously for backward compatibility with my plan
    type: { type: String },
    category: { type: String },
    tags: [String],
    link: String,
    fileName: String,
    fileType: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resource", ResourceSchema);
