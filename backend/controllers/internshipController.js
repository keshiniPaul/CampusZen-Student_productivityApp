const InternshipApplication = require("../models/InternshipApplicationModel");
const Notification = require("../models/notificationmodel");

// Get all applications for a user
exports.getApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await InternshipApplication.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({ message: "Error fetching applications" });
  }
};

// Get a single application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const application = await InternshipApplication.findOne({ _id: req.params.id, user: userId });
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    res.status(200).json(application);
  } catch (error) {
    console.error("Get Application Detail Error:", error);
    res.status(500).json({ message: "Error fetching application details" });
  }
};

// Create a new application
exports.createApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { companyName, roleTitle, jobPostingLink, status } = req.body;
    
    if (!companyName || !roleTitle) {
      return res.status(400).json({ message: "Company Name and Role Title are required" });
    }
    
    const newApplication = new InternshipApplication({
      user: userId,
      companyName,
      roleTitle,
      jobPostingLink,
      status: status || "Draft",
    });
    
    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (error) {
    console.error("Create Application Error:", error);
    res.status(500).json({ message: "Error creating application" });
  }
};

// Update an application
exports.updateApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      companyName, 
      roleTitle, 
      jobPostingLink, 
      status, 
      nextImportantDate, 
      nextDateContext, 
      notes 
    } = req.body;
    
    const oldApplication = await InternshipApplication.findOne({ _id: req.params.id, user: userId });
    
    if (!oldApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    const updatedApplication = await InternshipApplication.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { 
        companyName, 
        roleTitle, 
        jobPostingLink, 
        status, 
        nextImportantDate, 
        nextDateContext, 
        notes 
      },
      { new: true, runValidators: true }
    );
    
    // Check if status changed or next date changed
    if (updatedApplication) {
      try {
        if (oldApplication.status !== updatedApplication.status) {
          await Notification.create({
            title: `Application Status Update`,
            message: `Your application for ${updatedApplication.roleTitle} at ${updatedApplication.companyName} is now: ${updatedApplication.status}.`,
            type: "success",
            recipient: userId,
            link: "/dashboard/career",
            referenceId: updatedApplication._id,
          });
        } else if (
          updatedApplication.nextImportantDate &&
          (!oldApplication.nextImportantDate ||
            oldApplication.nextImportantDate.getTime() !== updatedApplication.nextImportantDate.getTime())
        ) {
          const dateStr = new Date(updatedApplication.nextImportantDate).toLocaleDateString();
          await Notification.create({
            title: `Upcoming Date Reminder`,
            message: `You have an important date (${dateStr}) for ${updatedApplication.roleTitle} at ${updatedApplication.companyName}. Context: ${updatedApplication.nextDateContext || 'None'}`,
            type: "warning",
            recipient: userId,
            link: "/dashboard/career",
            referenceId: updatedApplication._id,
          });
        }
      } catch (notifError) {
        console.error("Failed to create notification:", notifError);
      }
    }
    
    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error("Update Application Error:", error);
    res.status(500).json({ message: "Error updating application" });
  }
};

// Delete an application
exports.deleteApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const deletedApplication = await InternshipApplication.findOneAndDelete({ 
      _id: req.params.id, 
      user: userId 
    });
    
    if (!deletedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Delete Application Error:", error);
    res.status(500).json({ message: "Error deleting application" });
  }
};
