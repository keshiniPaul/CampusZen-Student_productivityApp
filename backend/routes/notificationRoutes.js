const express = require("express");
const router = express.Router();
const {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Routes
router.route("/").post(protect, adminOnly, createNotification);
router.route("/").get(protect, getNotifications);
router.route("/:id/read").put(protect, markAsRead);
router.route("/:id").delete(protect, deleteNotification);

module.exports = router;
