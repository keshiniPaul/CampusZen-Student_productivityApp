const Sport = require("../models/sportmodel");
const Notification = require("../models/notificationmodel");

// @desc    Get all sports
// @route   GET /api/sports
// @access  Public
const getSports = async (req, res) => {
  try {
    const { category, status } = req.query;

    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    const sports = await Sport.find(query)
      .sort({ registrationOpen: 1 })
      .select("-__v");

    // Filter by status if provided
    let filteredSports = sports;
    if (status) {
      filteredSports = sports.filter((sport) => sport.status === status);
    }

    res.status(200).json({
      success: true,
      count: filteredSports.length,
      data: filteredSports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching sports",
      error: error.message,
    });
  }
};

// @desc    Get single sport by ID
// @route   GET /api/sports/:id
// @access  Public
const getSportById = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: "Sport not found",
      });
    }

    res.status(200).json({
      success: true,
      data: sport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching sport",
      error: error.message,
    });
  }
};

// @desc    Create new sport
// @route   POST /api/sports
// @access  Admin only
const createSport = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      registrationOpen,
      registrationClose,
      venue,
      coach,
      maxCapacity,
      eligibility,
      selectionCriteria,
      requiresMedical,
      skillLevels,
      registrationLink,
      image,
    } = req.body;

    // Validate required fields
    if (!name || !description || !registrationOpen || !registrationClose || !venue || !coach || !maxCapacity) {
      const missingFields = [];
      if (!name) missingFields.push("name");
      if (!description) missingFields.push("description");
      if (!registrationOpen) missingFields.push("registrationOpen");
      if (!registrationClose) missingFields.push("registrationClose");
      if (!venue) missingFields.push("venue");
      if (!coach) missingFields.push("coach");
      if (!maxCapacity) missingFields.push("maxCapacity");

      console.error("Missing required fields:", missingFields);
      return res.status(400).json({
        success: false,
        message: `Please provide all required fields: ${missingFields.join(", ")}`,
      });
    }

    // Validate dates
    if (new Date(registrationOpen) >= new Date(registrationClose)) {
      return res.status(400).json({
        success: false,
        message: "Registration close date must be after open date",
      });
    }

    const sport = await Sport.create({
      name,
      category,
      description,
      registrationOpen,
      registrationClose,
      venue,
      coach,
      maxCapacity,
      eligibility,
      selectionCriteria,
      requiresMedical,
      skillLevels: skillLevels && skillLevels.length > 0 ? skillLevels : ["Beginner", "Intermediate", "Advanced"],
      registrationLink,
      image,
      createdBy: req.user?.id,
    });

    console.log("Sport created successfully:", sport._id);

    // Create notification for sport opening (don't fail if this fails)
    try {
      await createSportNotification(sport, "CREATED");
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
      // Don't throw - notification failure shouldn't prevent sport creation
    }

    res.status(201).json({
      success: true,
      message: "Sport created successfully",
      data: sport,
    });
  } catch (error) {
    console.error("Error creating sport:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      errors: error.errors,
    });
    res.status(500).json({
      success: false,
      message: "Error creating sport",
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : null,
    });
  }
};

// @desc    Update sport
// @route   PUT /api/sports/:id
// @access  Admin only
const updateSport = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: "Sport not found",
      });
    }

    const allowedUpdates = [
      "name",
      "category",
      "description",
      "registrationOpen",
      "registrationClose",
      "venue",
      "coach",
      "maxCapacity",
      "eligibility",
      "selectionCriteria",
      "requiresMedical",
      "skillLevels",
      "registrationLink",
      "image",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        sport[field] = req.body[field];
      }
    });

    const updatedSport = await sport.save();

    res.status(200).json({
      success: true,
      message: "Sport updated successfully",
      data: updatedSport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating sport",
      error: error.message,
    });
  }
};

// @desc    Delete sport
// @route   DELETE /api/sports/:id
// @access  Admin only
const deleteSport = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: "Sport not found",
      });
    }

    // Soft delete - mark as inactive
    sport.isActive = false;
    await sport.save();

    res.status(200).json({
      success: true,
      message: "Sport deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting sport",
      error: error.message,
    });
  }
};

// @desc    Register student for sport
// @route   POST /api/sports/:id/register
// @access  Student only
const registerForSport = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: "Sport not found",
      });
    }

    // Check if registration is open
    const today = new Date();
    const openDate = new Date(sport.registrationOpen);
    const closeDate = new Date(sport.registrationClose);

    if (today < openDate) {
      return res.status(400).json({
        success: false,
        message: "Registration has not opened yet",
      });
    }

    if (today > closeDate) {
      return res.status(400).json({
        success: false,
        message: "Registration has closed",
      });
    }

    if (sport.registered >= sport.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: "Registration is full",
      });
    }

    // Increment registered count
    sport.registered += 1;
    await sport.save();

    // TODO: Create student registration record in separate collection
    // TODO: Send confirmation email/notification

    res.status(200).json({
      success: true,
      message: "Successfully registered for sport",
      data: sport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering for sport",
      error: error.message,
    });
  }
};

// @desc    Send notification for sport
// @route   POST /api/sports/:id/notify
// @access  Admin only
const sendSportNotification = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: "Sport not found",
      });
    }

    const { message, type } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Notification message is required",
      });
    }

    // Create notification
    const notification = await Notification.create({
      sportId: sport._id,
      sportName: sport.name,
      message,
      type: type || "info",
      createdBy: req.user?.id,
    });

    // TODO: Send push notifications, emails, etc.

    res.status(200).json({
      success: true,
      message: "Notification sent successfully",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending notification",
      error: error.message,
    });
  }
};

// Helper function to create notifications
async function createSportNotification(sport, action) {
  try {
    let message = "";
    let type = "info";

    switch (action) {
      case "CREATED":
        message = `New sport added: ${sport.name}. Registration opens on ${new Date(sport.registrationOpen).toLocaleDateString()}`;
        type = "success";
        break;
      case "OPENING":
        message = `${sport.name} registration is now OPEN!`;
        type = "success";
        break;
      case "CLOSING_SOON":
        message = `${sport.name} registration closes soon!`;
        type = "warning";
        break;
      case "LAST_DAY":
        message = `LAST DAY! ${sport.name} registration closes today!`;
        type = "urgent";
        break;
      case "CLOSED":
        message = `${sport.name} registration has closed.`;
        type = "info";
        break;
    }

    if (message) {
      await Notification.create({
        sportId: sport._id,
        sportName: sport.name,
        message,
        type,
      });
    }
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

module.exports = {
  getSports,
  getSportById,
  createSport,
  updateSport,
  deleteSport,
  registerForSport,
  sendSportNotification,
};
