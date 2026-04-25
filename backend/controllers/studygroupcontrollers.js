const StudyGroup = require("../models/studygroupmodel");

// @desc    Get all study groups
// @route   GET /api/study-groups
// @access  Public
const getStudyGroups = async (req, res) => {
  try {
    const { module, type, search } = req.query;

    let query = { isActive: true, type: "public" };

    if (type === "private") {
      query.type = "private";
    } else if (type === "all") {
      delete query.type;
    }

    if (module) {
      query.module = { $regex: module, $options: "i" };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { module: { $regex: search, $options: "i" } },
      ];
    }

    const groups = await StudyGroup.find(query)
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching study groups",
      error: error.message,
    });
  }
};

// @desc    Get single study group
// @route   GET /api/study-groups/:groupId
// @access  Public
const getStudyGroupById = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.groupId)
      .populate("members.userId", "fullName email")
      .populate("createdBy", "fullName email")
      .select("-__v");

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Study group not found",
      });
    }

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching study group",
      error: error.message,
    });
  }
};

// @desc    Create a study group
// @route   POST /api/study-groups
// @access  Private (logged in users)
const createStudyGroup = async (req, res) => {
  try {
    const { name, module, description, type, maxMembers } = req.body;

    if (!name || !module || !type || !maxMembers) {
      return res.status(400).json({
        success: false,
        message: "Name, module, type, and maxMembers are required",
      });
    }

    const creatorId = req.user ? req.user.id : null;

    const group = new StudyGroup({
      name,
      module,
      description,
      type,
      maxMembers,
      createdBy: creatorId,
      members: creatorId
        ? [{ userId: creatorId, role: "admin" }]
        : [],
    });

    await group.save();

    res.status(201).json({
      success: true,
      data: group,
      message: "Study group created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating study group",
      error: error.message,
    });
  }
};

// @desc    Update a study group
// @route   PUT /api/study-groups/:groupId
// @access  Private (admin only)
const updateStudyGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Study group not found",
      });
    }

    const { name, module, description, type, maxMembers } = req.body;
    if (name) group.name = name;
    if (module) group.module = module;
    if (description !== undefined) group.description = description;
    if (type) group.type = type;
    if (maxMembers) group.maxMembers = maxMembers;

    await group.save();

    res.status(200).json({
      success: true,
      data: group,
      message: "Study group updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating study group",
      error: error.message,
    });
  }
};

// @desc    Delete a study group
// @route   DELETE /api/study-groups/:groupId
// @access  Private (admin only)
const deleteStudyGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Study group not found",
      });
    }

    group.isActive = false;
    await group.save();

    res.status(200).json({
      success: true,
      message: "Study group deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting study group",
      error: error.message,
    });
  }
};

// @desc    Get group members
// @route   GET /api/study-groups/:groupId/members
// @access  Public
const getGroupMembers = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.groupId)
      .populate("members.userId", "fullName email")
      .select("members name");

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Study group not found",
      });
    }

    res.status(200).json({
      success: true,
      count: group.members.length,
      data: group.members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching group members",
      error: error.message,
    });
  }
};

// @desc    Join a study group
// @route   POST /api/study-groups/:groupId/members
// @access  Private
const joinStudyGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Study group not found",
      });
    }

    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({
        success: false,
        message: "Study group is full",
      });
    }

    const userId = req.user ? req.user.id : null;

    if (userId) {
      const alreadyMember = group.members.some(
        (m) => m.userId.toString() === userId
      );
      if (alreadyMember) {
        return res.status(400).json({
          success: false,
          message: "You are already a member of this group",
        });
      }
      group.members.push({ userId, role: "member" });
    }

    await group.save();

    res.status(200).json({
      success: true,
      message: "Joined study group successfully",
      data: group,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error joining study group",
      error: error.message,
    });
  }
};

// @desc    Leave or remove a member
// @route   DELETE /api/study-groups/:groupId/members/:userId
// @access  Private
const leaveStudyGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Study group not found",
      });
    }

    group.members = group.members.filter(
      (m) => m.userId.toString() !== req.params.userId
    );

    await group.save();

    res.status(200).json({
      success: true,
      message: "Left study group successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error leaving study group",
      error: error.message,
    });
  }
};

module.exports = {
  getStudyGroups,
  getStudyGroupById,
  createStudyGroup,
  updateStudyGroup,
  deleteStudyGroup,
  getGroupMembers,
  joinStudyGroup,
  leaveStudyGroup,
};
