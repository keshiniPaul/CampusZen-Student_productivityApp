const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

// Routes
router.route("/").get(protect, getNotifications);
router.route("/:id/read").put(protect, markAsRead);
router.route("/:id").delete(protect, deleteNotification);

module.exports = router;
