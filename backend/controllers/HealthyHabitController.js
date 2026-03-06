const HealthyHabit = require('../models/HealthyHabitModel');

// @desc    Get user's healthy habits
// @route   GET /api/health/habits/:userId
// @access  Public
const getHealthyHabits = async (req, res) => {
  try {
    const { userId } = req.params;
    
    let habits = await HealthyHabit.findOne({ user: userId });
    
    // If no habits document exists for user, create one with defaults
    if (!habits) {
      habits = await HealthyHabit.create({
        user: userId
      });
    }
    
    res.status(200).json({
      success: true,
      data: habits
    });
  } catch (error) {
    console.error('Error fetching healthy habits:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new healthy habits profile
// @route   POST /api/health/habits
// @access  Public
const createHealthyHabits = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }
    
    // Check if user already has a habits document
    const existingHabits = await HealthyHabit.findOne({ user: userId });
    
    if (existingHabits) {
      return res.status(400).json({
        success: false,
        message: 'Habits profile already exists for this user'
      });
    }
    
    const habits = await HealthyHabit.create({
      user: userId,
      ...req.body
    });
    
    res.status(201).json({
      success: true,
      data: habits,
      message: 'Healthy habits profile created successfully'
    });
  } catch (error) {
    console.error('Error creating healthy habits:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user's healthy habits goals
// @route   PUT /api/health/habits/goals/:userId
// @access  Public
const updateGoals = async (req, res) => {
  try {
    const { userId } = req.params;
    
    let habits = await HealthyHabit.findOne({ user: userId });
    
    if (!habits) {
      // Create new habits profile if it doesn't exist
      habits = await HealthyHabit.create({
        user: userId,
        goals: req.body
      });
      
      return res.status(201).json({
        success: true,
        data: habits,
        message: 'Goals created successfully'
      });
    }
    
    // Update only the goals field
    habits.goals = {
      ...habits.goals.toObject(),
      ...req.body
    };
    
    await habits.save();
    
    res.status(200).json({
      success: true,
      data: habits,
      message: 'Goals updated successfully'
    });
  } catch (error) {
    console.error('Error updating goals:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user's healthy habits progress
// @route   PUT /api/health/habits/progress/:userId
// @access  Public
const updateProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const habits = await HealthyHabit.findOne({ user: userId });
    
    if (!habits) {
      return res.status(404).json({
        success: false,
        message: 'Habits profile not found'
      });
    }
    
    // Update only the progress field
    habits.progress = {
      ...habits.progress.toObject(),
      ...req.body
    };
    
    await habits.save();
    
    res.status(200).json({
      success: true,
      data: habits,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update weekly data
// @route   PUT /api/health/habits/weekly/:userId
// @access  Public
const updateWeeklyData = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const habits = await HealthyHabit.findOne({ user: userId });
    
    if (!habits) {
      return res.status(404).json({
        success: false,
        message: 'Habits profile not found'
      });
    }
    
    // Update weekly data fields
    if (req.body.sleep) habits.weeklyData.sleep = req.body.sleep;
    if (req.body.exercise) habits.weeklyData.exercise = req.body.exercise;
    if (req.body.stress) habits.weeklyData.stress = req.body.stress;
    if (req.body.mood) habits.weeklyData.mood = req.body.mood;
    
    await habits.save();
    
    res.status(200).json({
      success: true,
      data: habits,
      message: 'Weekly data updated successfully'
    });
  } catch (error) {
    console.error('Error updating weekly data:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add daily log entry
// @route   POST /api/health/habits/daily-log/:userId
// @access  Public
const addDailyLog = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const habits = await HealthyHabit.findOne({ user: userId });
    
    if (!habits) {
      return res.status(404).json({
        success: false,
        message: 'Habits profile not found'
      });
    }
    
    // Check if log for today already exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingTodayLog = habits.dailyLogs.find(log => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });
    
    if (existingTodayLog) {
      return res.status(400).json({
        success: false,
        message: 'A log for today already exists. Use update instead.'
      });
    }
    
    // Add new daily log
    habits.dailyLogs.push({
      date: req.body.date || Date.now(),
      sleep: req.body.sleep,
      exercise: req.body.exercise,
      stress: req.body.stress,
      water: req.body.water,
      meditation: req.body.meditation,
      mood: req.body.mood,
      notes: req.body.notes
    });
    
    // Keep only last 90 days of logs
    if (habits.dailyLogs.length > 90) {
      habits.dailyLogs = habits.dailyLogs.slice(-90);
    }
    
    // Recalculate averages
    habits.calculateAverages();
    
    await habits.save();
    
    res.status(201).json({
      success: true,
      data: habits,
      message: 'Daily log added successfully'
    });
  } catch (error) {
    console.error('Error adding daily log:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get daily logs
// @route   GET /api/health/habits/daily-logs/:userId
// @access  Public
const getDailyLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, limit = 30 } = req.query;
    
    const habits = await HealthyHabit.findOne({ user: userId });
    
    if (!habits) {
      return res.status(404).json({
        success: false,
        message: 'Habits profile not found'
      });
    }
    
    let logs = habits.dailyLogs;
    
    // Filter by date range if provided
    if (startDate || endDate) {
      logs = logs.filter(log => {
        const logDate = new Date(log.date);
        if (startDate && endDate) {
          return logDate >= new Date(startDate) && logDate <= new Date(endDate);
        } else if (startDate) {
          return logDate >= new Date(startDate);
        } else if (endDate) {
          return logDate <= new Date(endDate);
        }
        return true;
      });
    }
    
    // Sort by date descending and limit
    logs.sort((a, b) => new Date(b.date) - new Date(a.date));
    logs = logs.slice(0, parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching daily logs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update a specific daily log
// @route   PUT /api/health/habits/daily-log/:userId/:logId
// @access  Public
const updateDailyLog = async (req, res) => {
  try {
    const { userId, logId } = req.params;
    
    const habits = await HealthyHabit.findOne({ user: userId });
    
    if (!habits) {
      return res.status(404).json({
        success: false,
        message: 'Habits profile not found'
      });
    }
    
    const logIndex = habits.dailyLogs.findIndex(
      log => log._id.toString() === logId
    );
    
    if (logIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Daily log not found'
      });
    }
    
    // Update the specific log
    habits.dailyLogs[logIndex] = {
      ...habits.dailyLogs[logIndex].toObject(),
      ...req.body,
      _id: habits.dailyLogs[logIndex]._id // Preserve the original ID
    };
    
    // Recalculate averages
    habits.calculateAverages();
    
    await habits.save();
    
    res.status(200).json({
      success: true,
      data: habits,
      message: 'Daily log updated successfully'
    });
  } catch (error) {
    console.error('Error updating daily log:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete a specific daily log
// @route   DELETE /api/health/habits/daily-log/:userId/:logId
// @access  Public
const deleteDailyLog = async (req, res) => {
  try {
    const { userId, logId } = req.params;
    
    const habits = await HealthyHabit.findOne({ user: userId });
    
    if (!habits) {
      return res.status(404).json({
        success: false,
        message: 'Habits profile not found'
      });
    }
    
    const logIndex = habits.dailyLogs.findIndex(
      log => log._id.toString() === logId
    );
    
    if (logIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Daily log not found'
      });
    }
    
    habits.dailyLogs.splice(logIndex, 1);
    
    // Recalculate averages
    habits.calculateAverages();
    
    await habits.save();
    
    res.status(200).json({
      success: true,
      data: habits,
      message: 'Daily log deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting daily log:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete entire healthy habits profile
// @route   DELETE /api/health/habits/:userId
// @access  Public
const deleteHealthyHabits = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const habits = await HealthyHabit.findOneAndDelete({ user: userId });
    
    if (!habits) {
      return res.status(404).json({
        success: false,
        message: 'Habits profile not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Healthy habits profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting healthy habits:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get insights based on user data
// @route   GET /api/health/habits/insights/:userId
// @access  Public
const getInsights = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const habits = await HealthyHabit.findOne({ user: userId });
    
    if (!habits) {
      return res.status(404).json({
        success: false,
        message: 'Habits profile not found'
      });
    }
    
    const insights = [];
    const goals = habits.goals;
    const progress = habits.progress;
    
    // Convert exercise goal to minutes for comparison
    const exerciseGoalInMinutes = goals.exerciseUnit === 'hours' ? 
      goals.exerciseGoal * 60 : goals.exerciseGoal;
    
    // Convert meditation goal to minutes for comparison
    const meditationGoalInMinutes = goals.meditationUnit === 'hours' ?
      goals.meditationGoal * 60 : goals.meditationGoal;
    
    // Sleep insight
    if (progress.sleepAvg < goals.sleepGoal) {
      insights.push({
        type: "warning",
        icon: "😴",
        message: `You're averaging ${progress.sleepAvg.toFixed(1)} hours of sleep, ${(goals.sleepGoal - progress.sleepAvg).toFixed(1)} hours below your goal. Try establishing a consistent bedtime routine.`
      });
    } else {
      insights.push({
        type: "success",
        icon: "✨",
        message: "Great job meeting your sleep goals! You're well-rested and ready to learn."
      });
    }
    
    // Exercise insight
    if (progress.exerciseAvg < exerciseGoalInMinutes) {
      const displayGoal = goals.exerciseUnit === 'hours' ? 
        `${goals.exerciseGoal}h` : `${goals.exerciseGoal}m`;
      insights.push({
        type: "warning",
        icon: "🏃",
        message: `You're averaging ${progress.exerciseAvg} minutes of exercise daily. Add short walks between study sessions to reach your ${displayGoal} goal.`
      });
    }
    
    // Stress insight
    if (progress.stressAvg > goals.stressGoal) {
      insights.push({
        type: "danger",
        icon: "😰",
        message: `Your stress levels (${progress.stressAvg}/10) are above your target (${goals.stressGoal}/10). Consider trying mindfulness exercises or speaking with a counselor.`
      });
    }
    
    // Water insight
    if (progress.waterAvg < goals.waterGoal) {
      insights.push({
        type: "warning",
        icon: "💧",
        message: `You're drinking ${progress.waterAvg} glasses of water daily. Aim for ${goals.waterGoal} glasses to stay hydrated and focused.`
      });
    }
    
    // Meditation insight
    if (progress.meditationAvg < meditationGoalInMinutes) {
      const displayGoal = goals.meditationUnit === 'hours' ? 
        `${goals.meditationGoal}h` : `${goals.meditationGoal}m`;
      insights.push({
        type: "warning",
        icon: "🧘",
        message: `You're averaging ${progress.meditationAvg} minutes of meditation daily. Try to reach your ${displayGoal} goal for better mindfulness.`
      });
    }
    
    res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
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
};