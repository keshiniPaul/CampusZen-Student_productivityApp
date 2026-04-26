const mongoose = require("mongoose");
const crypto = require("crypto");

const groupMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "mentor", "member"],
    default: "member",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const studyGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
    },
    module: {
      type: String,
      required: [true, "Module/Subject is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    maxMembers: {
      type: Number,
      required: [true, "Max members is required"],
      min: 2,
      default: 20,
    },
    members: [groupMemberSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    inviteCode: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(6).toString("hex"),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

studyGroupSchema.index({ module: 1 });
studyGroupSchema.index({ type: 1 });
studyGroupSchema.index({ name: "text", module: "text" });

studyGroupSchema.virtual("memberCount").get(function () {
  return this.members ? this.members.length : 0;
});

studyGroupSchema.set("toJSON", { virtuals: true });
studyGroupSchema.set("toObject", { virtuals: true });

const StudyGroup = mongoose.model("StudyGroup", studyGroupSchema);

module.exports = StudyGroup;
