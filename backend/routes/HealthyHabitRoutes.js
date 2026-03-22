const express = require('express');
const router = express.Router();
const {
  getHealthyHabits,
  createHealthyHabits,
  updateGoals,
  updateProgress,
  updateWeeklyData,
  addDailyLog,
  getDailyLogs,
  updateDailyLog,
  deleteDailyLog,
  deleteHealthyHabits,
  getInsights
} = require('../controllers/HealthyHabitController');

// Public routes (no authentication required)

// Main habits routes
router.route('/')
  .post(createHealthyHabits);  // Create new profile

router.route('/:userId')
  .get(getHealthyHabits)        // Get profile by userId
  .delete(deleteHealthyHabits); // Delete profile by userId

// Goals and progress routes
router.put('/goals/:userId', updateGoals);
router.put('/progress/:userId', updateProgress);
router.put('/weekly/:userId', updateWeeklyData);

// Insights route
router.get('/insights/:userId', getInsights);

// Daily logs routes
router.route('/daily-logs/:userId')
  .get(getDailyLogs)            // Get all logs for user
  .post(addDailyLog);           // Add new log for user

router.route('/daily-log/:userId/:logId')
  .put(updateDailyLog)          // Update specific log
  .delete(deleteDailyLog);      // Delete specific log

module.exports = router;