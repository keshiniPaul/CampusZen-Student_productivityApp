const Career = require("../models/CareerModel");

// @desc    Get all careers
// @route   GET /api/careers
// @access  Public
const getCareers = async (req, res) => {
  try {
    const careers = await Career.find({ isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: careers.length,
      data: careers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching careers",
      error: error.message,
    });
  }
};

// @desc    Create new career item
// @route   POST /api/careers
// @access  Admin only
const createCareer = async (req, res) => {
  console.log("Create Career Request Body:", req.body);
  console.log("Uploaded File:", req.file);
  try {
    const body = req.body || {};
    const { title, description, company, location, duration, color, link, category } = body;
    let imageUrl = "";

    if (req.file) {
      imageUrl = `/images/${req.file.filename}`;
    }

    if (!title || !description || !category) {
      console.log("Missing fields in createCareer:", { title, description, category });
      return res.status(400).json({
        success: false,
        message: "Please provide title, description, and category",
      });
    }

    const career = await Career.create({
      title,
      description,
      company,
      location,
      duration,
      image: imageUrl,
      color: color || "#60a5fa",
      link: link || "#",
      category,
      createdBy: req.user?.id,
    });
    
    console.log("Career Created Successfully:", career._id);

    res.status(201).json({
      success: true,
      message: "Career created successfully",
      data: career,
    });
  } catch (error) {
    console.error("Error creating career:", error);
    res.status(500).json({
      success: false,
      message: "Error creating career",
      error: error.message,
    });
  }
};


// @desc    Update career item
// @route   PUT /api/careers/:id
// @access  Admin only
const updateCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    const body = req.body || {};
    const { title, description, company, location, duration, color, link, category } = body;

    if (title) career.title = title;
    if (description) career.description = description;
    if (company) career.company = company;
    if (location) career.location = location;
    if (duration) career.duration = duration;
    if (color) career.color = color;
    if (link) career.link = link;
    if (category) career.category = category;

    if (req.file) {
      career.image = `/images/${req.file.filename}`;
    }

    const updatedCareer = await career.save();

    res.status(200).json({
      success: true,
      message: "Career updated successfully",
      data: updatedCareer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating career",
      error: error.message,
    });
  }
};

// @desc    Delete career item
// @route   DELETE /api/careers/:id
// @access  Admin only
const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    // Soft delete
    career.isActive = false;
    await career.save();

    res.status(200).json({
      success: true,
      message: "Career deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting career",
      error: error.message,
    });
  }
};

module.exports = {
  getCareers,
  createCareer,
  updateCareer,
  deleteCareer,
};
