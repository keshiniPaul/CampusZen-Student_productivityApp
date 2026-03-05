const Club = require("../models/clubmodel");
const Notification = require("../models/notificationmodel");

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
const getClubs = async (req, res) => {
  try {
    const { category, status } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    const clubs = await Club.find(query)
      .sort({ registrationOpen: 1 })
      .select("-__v");
    
    // Filter by status if provided
    let filteredClubs = clubs;
    if (status) {
      filteredClubs = clubs.filter((club) => club.status === status);
    }
    
    res.status(200).json({
      success: true,
      count: filteredClubs.length,
      data: filteredClubs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching clubs",
      error: error.message,
    });
  }
};

// @desc    Get single club by ID
// @route   GET /api/clubs/:id
// @access  Public
const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("members.userId", "name email")
      .populate("announcements.postedBy", "name");
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }
    
    res.status(200).json({
      success: true,
      data: club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching club",
      error: error.message,
    });
  }
};

// @desc    Create new club
// @route   POST /api/clubs
// @access  Admin only
const createClub = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      vision,
      mission,
      registrationOpen,
      registrationClose,
      president,
      advisor,
      maxMembers,
      upcomingEvents,
      socialMedia,
      registrationLink,
      image,
    } = req.body;
    
    // Validate required fields
    if (!name || !description || !vision || !mission || !registrationOpen || 
        !registrationClose || !president || !advisor || !maxMembers) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    
    // Validate dates
    if (new Date(registrationOpen) >= new Date(registrationClose)) {
      return res.status(400).json({
        success: false,
        message: "Registration close date must be after open date",
      });
    }
    
    // Check if club already exists
    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      return res.status(400).json({
        success: false,
        message: "Club with this name already exists",
      });
    }
    
    const club = await Club.create({
      name,
      category,
      description,
      vision,
      mission,
      registrationOpen,
      registrationClose,
      president,
      advisor,
      maxMembers,
      upcomingEvents,
      socialMedia,
      registrationLink,
      image,
      createdBy: req.user?.id,
    });
    
    // Create notification for club creation
    await createClubNotification(club, "CREATED");
    
    res.status(201).json({
      success: true,
      message: "Club created successfully",
      data: club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating club",
      error: error.message,
    });
  }
};

// @desc    Update club
// @route   PUT /api/clubs/:id
// @access  Admin only
const updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }
    
    const allowedUpdates = [
      "name",
      "category",
      "description",
      "vision",
      "mission",
      "registrationOpen",
      "registrationClose",
      "president",
      "advisor",
      "maxMembers",
      "upcomingEvents",
      "socialMedia",
      "registrationLink",
      "image",
    ];
    
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        club[field] = req.body[field];
      }
    });
    
    const updatedClub = await club.save();
    
    res.status(200).json({
      success: true,
      message: "Club updated successfully",
      data: updatedClub,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating club",
      error: error.message,
    });
  }
};

// @desc    Delete club
// @route   DELETE /api/clubs/:id
// @access  Admin only
const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }
    
    // Soft delete - mark as inactive
    club.isActive = false;
    await club.save();
    
    res.status(200).json({
      success: true,
      message: "Club deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting club",
      error: error.message,
    });
  }
};

// @desc    Join club (student registration)
// @route   POST /api/clubs/:id/join
// @access  Student only
const joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }
    
    // Check if registration is open
    const today = new Date();
    const openDate = new Date(club.registrationOpen);
    const closeDate = new Date(club.registrationClose);
    
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
    
    if (club.currentMembers >= club.maxMembers) {
      return res.status(400).json({
        success: false,
        message: "Club membership is full",
      });
    }
    
    // Check if user already joined
    const userId = req.user?.id || req.body.userId;
    const alreadyMember = club.members.some(
      (member) => member.userId && member.userId.toString() === userId
    );
    
    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: "You have already joined this club",
      });
    }
    
    // Add member to club
    club.members.push({
      userId: userId,
      role: "Member",
      status: "Pending",
      joinedDate: new Date(),
    });
    
    club.currentMembers += 1;
    await club.save();
    
    res.status(200).json({
      success: true,
      message: "Successfully joined club. Awaiting approval.",
      data: club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error joining club",
      error: error.message,
    });
  }
};

// @desc    Approve/Reject member
// @route   PUT /api/clubs/:id/members/:memberId
// @access  Admin/President only
const manageMember = async (req, res) => {
  try {
    const { status } = req.body; // "Approved" or "Rejected"
    
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'Approved' or 'Rejected'",
      });
    }
    
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }
    
    const member = club.members.id(req.params.memberId);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }
    
    member.status = status;
    await club.save();
    
    // Send notification to member
    const message = status === "Approved" 
      ? `Congratulations! Your membership to ${club.name} has been approved.`
      : `Your membership application to ${club.name} has been rejected.`;
    
    await Notification.create({
      sportId: club._id,
      sportName: club.name,
      message,
      type: status === "Approved" ? "success" : "info",
    });
    
    res.status(200).json({
      success: true,
      message: `Member ${status.toLowerCase()} successfully`,
      data: club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error managing member",
      error: error.message,
    });
  }
};

// @desc    Post announcement
// @route   POST /api/clubs/:id/announcements
// @access  Admin/President only
const postAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }
    
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }
    
    club.announcements.push({
      title,
      content,
      postedBy: req.user?.id,
      postedDate: new Date(),
    });
    
    await club.save();
    
    // Send notification to all members
    const message = `New announcement in ${club.name}: ${title}`;
    await Notification.create({
      sportId: club._id,
      sportName: club.name,
      message,
      type: "info",
    });
    
    res.status(200).json({
      success: true,
      message: "Announcement posted successfully",
      data: club,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error posting announcement",
      error: error.message,
    });
  }
};

// Helper function to create notifications
async function createClubNotification(club, action) {
  try {
    let message = "";
    let type = "info";
    
    switch (action) {
      case "CREATED":
        message = `New club added: ${club.name}. Registration opens on ${new Date(club.registrationOpen).toLocaleDateString()}`;
        type = "success";
        break;
      case "OPENING":
        message = `${club.name} registration is now OPEN!`;
        type = "success";
        break;
      case "CLOSING_SOON":
        message = `${club.name} registration closes soon!`;
        type = "warning";
        break;
      case "LAST_DAY":
        message = `LAST DAY! ${club.name} registration closes today!`;
        type = "urgent";
        break;
      case "CLOSED":
        message = `${club.name} registration has closed.`;
        type = "info";
        break;
    }
    
    if (message) {
      await Notification.create({
        sportId: club._id,
        sportName: club.name,
        message,
        type,
      });
    }
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

module.exports = {
  getClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
  joinClub,
  manageMember,
  postAnnouncement,
};
