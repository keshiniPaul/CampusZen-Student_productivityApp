const Assignment = require("../models/assignmentmodel");

// Auto-mark overdue assignments (status != completed and dueDate < now)
const markOverdue = async (userId) => {
  await Assignment.updateMany(
    { userId, status: { $in: ["pending", "in-progress"] }, dueDate: { $lt: new Date() } },
    { $set: { status: "overdue" } }
  );
};

// @desc    Get all assignments for user
// @route   GET /api/assignments
const getAssignments = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { status, priority, module } = req.query;

    if (userId) await markOverdue(userId);

    let query = {};
    if (userId) query.userId = userId;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (module) query.module = { $regex: module, $options: "i" };

    const assignments = await Assignment.find(query)
      .sort({ dueDate: 1 })
      .select("-__v");

    res.status(200).json({ success: true, count: assignments.length, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching assignments", error: error.message });
  }
};

// @desc    Create assignment
// @route   POST /api/assignments
const createAssignment = async (req, res) => {
  try {
    const { title, module, dueDate, priority, notes } = req.body;

    if (!title || !module || !dueDate || !priority) {
      return res.status(400).json({ success: false, message: "Title, module, dueDate, and priority are required" });
    }

    const due = new Date(dueDate);
    const status = due < new Date() ? "overdue" : "pending";

    const assignment = new Assignment({
      title,
      module,
      dueDate: due,
      status,
      priority,
      notes,
      userId: req.user ? req.user.id : null,
    });

    await assignment.save();
    res.status(201).json({ success: true, data: assignment, message: "Assignment created" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating assignment", error: error.message });
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:assignmentId
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId).select("-__v");
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching assignment", error: error.message });
  }
};

// @desc    Update full assignment
// @route   PUT /api/assignments/:assignmentId
const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });

    const { title, module, dueDate, status, priority, notes } = req.body;
    if (title) assignment.title = title;
    if (module) assignment.module = module;
    if (dueDate) assignment.dueDate = new Date(dueDate);
    if (status) assignment.status = status;
    if (priority) assignment.priority = priority;
    if (notes !== undefined) assignment.notes = notes;

    await assignment.save();
    res.status(200).json({ success: true, data: assignment, message: "Assignment updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating assignment", error: error.message });
  }
};

// @desc    Update status only
// @route   PATCH /api/assignments/:assignmentId
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["pending", "in-progress", "completed", "overdue"];
    if (!status || !valid.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const assignment = await Assignment.findByIdAndUpdate(
      req.params.assignmentId,
      { status },
      { new: true }
    );
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
    res.status(200).json({ success: true, data: assignment, message: "Status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating status", error: error.message });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:assignmentId
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
    await assignment.deleteOne();
    res.status(200).json({ success: true, message: "Assignment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting assignment", error: error.message });
  }
};

module.exports = { getAssignments, createAssignment, getAssignmentById, updateAssignment, updateStatus, deleteAssignment };
