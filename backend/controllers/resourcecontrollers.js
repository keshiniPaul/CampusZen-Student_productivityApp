const path = require("path");
const Resource = require("../models/resourcemodel");

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
  try {
    const { module, type, search, groupId } = req.query;
    let query = {};

    if (module) query.module = { $regex: module, $options: "i" };
    if (type) query.type = type;
    if (groupId) query.groupId = groupId;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { module: { $regex: search, $options: "i" } },
      ];
    }

    const resources = await Resource.find(query)
      .populate("uploadedBy", "fullName")
      .populate("groupId", "name")
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching resources", error: error.message });
  }
};

// @desc    Upload a resource
// @route   POST /api/resources
// @access  Private
const createResource = async (req, res) => {
  try {
    const { title, type, module, description, groupId } = req.body;

    if (!title || !type || !module) {
      return res.status(400).json({ success: false, message: "Title, type, and module are required" });
    }

    let fileUrl;
    if (type === "link") {
      fileUrl = req.body.fileUrl;
      if (!fileUrl) {
        return res.status(400).json({ success: false, message: "URL is required for link type" });
      }
    } else {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "File is required" });
      }
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const resource = new Resource({
      title,
      type,
      module,
      fileUrl,
      description,
      groupId: groupId || null,
      uploadedBy: req.user ? req.user.id : null,
    });

    await resource.save();

    res.status(201).json({ success: true, data: resource, message: "Resource uploaded successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error uploading resource", error: error.message });
  }
};

// @desc    Get single resource
// @route   GET /api/resources/:resourceId
// @access  Public
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId)
      .populate("uploadedBy", "fullName")
      .populate("groupId", "name")
      .select("-__v");

    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching resource", error: error.message });
  }
};

// @desc    Update resource metadata
// @route   PATCH /api/resources/:resourceId
// @access  Private (owner)
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    const { title, module, description } = req.body;
    if (title) resource.title = title;
    if (module) resource.module = module;
    if (description !== undefined) resource.description = description;

    await resource.save();
    res.status(200).json({ success: true, data: resource, message: "Resource updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating resource", error: error.message });
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:resourceId
// @access  Private (owner)
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    await resource.deleteOne();
    res.status(200).json({ success: true, message: "Resource deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting resource", error: error.message });
  }
};

// @desc    Increment download count
// @route   PATCH /api/resources/:resourceId/download
// @access  Public
const incrementDownload = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.resourceId,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }
    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating download count", error: error.message });
  }
};

module.exports = { getResources, createResource, getResourceById, updateResource, deleteResource, incrementDownload };
