const Event = require("../models/eventmodel");

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const events = await Event.find(query)
      .sort({ date: 1 })
      .select("-__v");
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching event",
      error: error.message,
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Admin only
const createEvent = async (req, res) => {
  try {
    const { title, shortDescription, category, date, venue, image } = req.body;
    
    // Validate required fields
    if (!title || !shortDescription || !date || !venue) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    
    const event = await Event.create({
      title,
      shortDescription,
      category,
      date,
      venue,
      image,
      createdBy: req.user?.id, // Assumes user auth middleware
    });
    
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating event",
      error: error.message,
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Admin only
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    
    const { title, shortDescription, category, date, venue, image } = req.body;
    
    // Update fields
    if (title) event.title = title;
    if (shortDescription) event.shortDescription = shortDescription;
    if (category) event.category = category;
    if (date) event.date = date;
    if (venue) event.venue = venue;
    if (image) event.image = image;
    
    const updatedEvent = await event.save();
    
    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating event",
      error: error.message,
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Admin only
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    
    // Soft delete - just mark as inactive
    event.isActive = false;
    await event.save();
    
    // For hard delete, use:
    // await event.deleteOne();
    
    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting event",
      error: error.message,
    });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
