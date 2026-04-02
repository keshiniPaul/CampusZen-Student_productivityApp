const Notification = require("../models/notificationmodel");

// Create a notification
exports.createNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      type = "info",
      global = false,
      recipient,
      recipients,
      link,
      referenceId,
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const notification = await Notification.create({
      title,
      message,
      type,
      global: Boolean(global),
      recipient,
      recipients: Array.isArray(recipients) ? recipients : [],
      link,
      referenceId,
      createdBy: req.user?.id,
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Create Notification Error:", error);
    res.status(500).json({ message: "Error creating notification" });
  }
};

// Get notifications for the logged in user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find notifications that are either directly for this user, entirely global, or user is in recipients
    const notifications = await Notification.find({
      $or: [
        { recipient: userId },
        { recipients: userId },
        { global: true }
      ]
    }).sort({ createdAt: -1 }).limit(50);
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Get Notifications Error:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    // For individual user-targeted notifications
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    // NOTE: This marks it as read for everyone if it's a global notification.
    // In a more complex app, we'd have a separate ReadReceipts collection. For simplicity, we just mark it read.
    notification.isRead = true;
    await notification.save();
    
    res.status(200).json(notification);
  } catch (error) {
    console.error("Mark Notification Read Error:", error);
    res.status(500).json({ message: "Error marking notification as read" });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Delete Notification Error:", error);
    res.status(500).json({ message: "Error deleting notification" });
  }
};
