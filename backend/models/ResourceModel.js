const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["pdf", "notes", "slides", "video", "link"],
      required: [true, "Resource type is required"],
    },
    module: {
      type: String,
      required: [true, "Module is required"],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudyGroup",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

resourceSchema.index({ module: 1 });
resourceSchema.index({ type: 1 });
resourceSchema.index({ title: "text", module: "text" });

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
