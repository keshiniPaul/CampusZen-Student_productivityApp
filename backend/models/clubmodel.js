const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Club name is required"],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: [true, "Club category is required"],
      enum: ["Technical", "Cultural", "Social Service", "Professional", "Creative", "Community"],
    },
    description: {
      type: String,
      required: [true, "Club description is required"],
      trim: true,
    },
    vision: {
      type: String,
      required: [true, "Club vision is required"],
      trim: true,
    },
    mission: {
      type: String,
      required: [true, "Club mission is required"],
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
    president: {
      type: String,
      required: [true, "President name is required"],
      trim: true,
    },
    advisor: {
      type: String,
      required: [true, "Faculty advisor name is required"],
      trim: true,
    },
    maxMembers: {
      type: Number,
      required: [true, "Maximum members limit is required"],
      min: 1,
    },
    currentMembers: {
      type: Number,
      default: 0,
      min: 0,
    },
    members: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum: ["Member", "Executive Member", "President", "Secretary", "Treasurer"],
        default: "Member",
      },
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
      joinedDate: {
        type: Date,
        default: Date.now,
      },
    }],
    upcomingEvents: {
      type: [String],
      default: [],
    },
    socialMedia: {
      facebook: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
      linkedin: {
        type: String,
        trim: true,
      },
    },
    registrationLink: {
      type: String,
      required: [true, "Registration link is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "club.png",
    },
    announcements: [{
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      postedDate: {
        type: Date,
        default: Date.now,
      },
    }],
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

// Add indexes for faster queries
clubSchema.index({ registrationOpen: 1, registrationClose: 1 });
clubSchema.index({ category: 1 });
clubSchema.index({ isActive: 1 });
clubSchema.index({ name: 1 });

// Virtual field for registration status
clubSchema.virtual("status").get(function () {
  const today = new Date();
  const openDate = new Date(this.registrationOpen);
  const closeDate = new Date(this.registrationClose);

  if (this.currentMembers >= this.maxMembers) {
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
clubSchema.set("toJSON", { virtuals: true });
clubSchema.set("toObject", { virtuals: true });

const Club = mongoose.model("Club", clubSchema);

module.exports = Club;
