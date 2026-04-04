const Resource = require("../models/ResourceModel");
const User = require("../models/usermodels");
const Notification = require("../models/notificationmodel");

// Score a resource by how many of its tags overlap with user skills
const scoreBySkills = (resource, skills = []) => {
  if (!skills.length || !resource.tags.length) return 0;
  const lowerSkills = skills.map((s) => s.toLowerCase());
  return resource.tags.filter((t) => lowerSkills.includes(t.toLowerCase()))
    .length;
};

// ─── GET /api/resources ──────────────────────────────────────
// Public. Supports ?search=, ?type=, ?category=, ?recommend=true&userId=
exports.getAllResources = async (req, res) => {
  try {
    const { search, type, category, recommend, userId } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    let resources = await Resource.find(filter)
      .sort({ createdAt: -1 })
      .populate("createdBy", "fullName");

    // Basic recommendation: sort by tag-skill overlap
    if (recommend === "true" && userId && userId !== "undefined" && userId !== "null") {
      try {
        const user = await User.findById(userId).select("skills");
        const skills = user ? user.skills || [] : [];
        resources = resources
          .map((r) => ({ ...r.toObject(), _score: scoreBySkills(r, skills) }))
          .sort((a, b) => b._score - a._score);
      } catch (userErr) {
        // If userId is invalid, just skip recommendation scoring
        console.warn("Recommendation scoring skipped – invalid userId:", userId);
      }
    }

    res.status(200).json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    console.error("getAllResources Error:", error);
    res.status(500).json({ success: false, message: "Error fetching resources" });
  }
};

// ─── GET /api/resources/:id ───────────────────────────────────
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate(
      "createdBy",
      "fullName"
    );
    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }
    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    console.error("getResourceById Error:", error);
    res.status(500).json({ success: false, message: "Error fetching resource" });
  }
};

// ─── POST /api/resources ─────────────────────────────────────
// Admin only — handles file upload via multer
exports.createResource = async (req, res) => {
  try {
    const { title, description, type, category, tags, link } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide title and description",
      });
    }

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    let fileUrl = "";
    let fileName = "";
    let fileType = "";

    if (req.file) {
      // Save the file URL in MongoDB (e.g., /uploads/filename.pdf)
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
      fileType = req.file.mimetype;
    }

    const resource = await Resource.create({
      title,
      description,
      type: type || "Article",
      category: category || "Career Growth",
      tags: parsedTags,
      link: link || "",
      fileUrl,
      fileName,
      fileType,
      createdBy: req.user.id,
    });

    // Create a global notification for students about the new resource
    await Notification.create({
      title: "New Career Resource Available",
      message: `A new ${resource.type} titled "${resource.title}" has been added. Check it out!`,
      type: "info",
      global: true,
      link: `/career/resources?id=${resource._id}`,
      // Optionally link a referenceId, though not strictly required here
      referenceId: resource._id,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    console.error("createResource Error:", error);
    res.status(500).json({ success: false, message: "Error creating resource" });
  }
};

// ─── PUT /api/resources/:id ───────────────────────────────────
// Admin only
exports.updateResource = async (req, res) => {
  try {
    const { title, description, type, category, tags, link } = req.body;

    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (type) updates.type = type;
    if (category) updates.category = category;
    if (link !== undefined) updates.link = link;
    
    if (tags) {
      updates.tags = Array.isArray(tags) 
        ? tags 
        : tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    if (req.file) {
      updates.fileUrl = `/uploads/${req.file.filename}`;
      updates.fileName = req.file.originalname;
      updates.fileType = req.file.mimetype;
    }

    const resource = await Resource.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    console.error("updateResource Error:", error);
    res.status(500).json({ success: false, message: "Error updating resource" });
  }
};

// ─── DELETE /api/resources/:id ────────────────────────────────
// Admin only
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    // Remove this resource from all users' savedResources
    await User.updateMany(
      { savedResources: req.params.id },
      { $pull: { savedResources: req.params.id } }
    );

    res.status(200).json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    console.error("deleteResource Error:", error);
    res.status(500).json({ success: false, message: "Error deleting resource" });
  }
};

// ─── POST /api/resources/save/:id ────────────────────────────
// Save (bookmark) a resource — student
exports.saveResource = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const resourceId = req.params.id;

    // Check resource exists
    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });

    if (user.savedResources.map(String).includes(String(resourceId))) {
      return res.status(400).json({ success: false, message: "Resource already saved" });
    }

    user.savedResources.push(resourceId);
    await user.save();

    res.status(200).json({ success: true, message: "Resource saved", savedResources: user.savedResources });
  } catch (error) {
    console.error("saveResource Error:", error);
    res.status(500).json({ success: false, message: "Error saving resource" });
  }
};

// ─── DELETE /api/resources/save/:id ──────────────────────────
// Unsave (remove bookmark) — student
exports.unsaveResource = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.savedResources = user.savedResources.filter(
      (id) => String(id) !== String(req.params.id)
    );
    await user.save();

    res.status(200).json({ success: true, message: "Resource unsaved", savedResources: user.savedResources });
  } catch (error) {
    console.error("unsaveResource Error:", error);
    res.status(500).json({ success: false, message: "Error unsaving resource" });
  }
};

// ─── GET /api/resources/saved ─────────────────────────────────
// Get all saved resources for current user
exports.getSavedResources = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "savedResources",
      model: "Resource",
    });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user.savedResources || [] });
  } catch (error) {
    console.error("getSavedResources Error:", error);
    res.status(500).json({ success: false, message: "Error fetching saved resources" });
  }
};
