// healthController.js
const mongoose = require('mongoose');
const HealthEntry = require('../models/HealthEntryModel');

// CREATE health entry
exports.createHealthEntry = async (req, res) => {
  try {
    const { mood, sleepHours, exerciseMinutes, notes, stress } = req.body;

    // 🔴 Replace this with a REAL user ID from MongoDB
    const userId = new mongoose.Types.ObjectId("660ad9c0f12a8c001f2eabcd");

    // Normalize today's date (remove time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if there's an existing entry for today
    const existingEntry = await HealthEntry.findOne({
      user: userId,
      date: today,
    });

    // If there's an existing entry, return error
    // The user should use the edit functionality instead
    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: "You already have an entry for today. Please edit the existing entry instead.",
      });
    }

    // Create new entry
    const entry = await HealthEntry.create({
      user: userId,
      date: today,
      mood,
      sleepHours,
      exerciseMinutes,
      stress,
      notes,
    });

    res.status(201).json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET all entries
exports.getAllEntries = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId("660ad9c0f12a8c001f2eabcd");

    const entries = await HealthEntry.find({ user: userId }).sort({
      date: -1,
    });

    res.json({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET single entry by ID
exports.getEntryById = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId("660ad9c0f12a8c001f2eabcd");
    const entry = await HealthEntry.findOne({ 
      _id: req.params.id,
      user: userId 
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Entry not found",
      });
    }

    res.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE health entry
exports.updateHealthEntry = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId("660ad9c0f12a8c001f2eabcd");
    const { mood, sleepHours, exerciseMinutes, notes, stress } = req.body;

    const entry = await HealthEntry.findOneAndUpdate(
      { 
        _id: req.params.id,
        user: userId 
      },
      {
        mood,
        sleepHours,
        exerciseMinutes,
        stress,
        notes,
      },
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Entry not found",
      });
    }

    res.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE health entry
exports.deleteHealthEntry = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId("660ad9c0f12a8c001f2eabcd");

    const entry = await HealthEntry.findOneAndDelete({ 
      _id: req.params.id,
      user: userId 
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Entry not found",
      });
    }

    res.json({
      success: true,
      message: "Entry deleted successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET user stats
exports.getUserStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId("660ad9c0f12a8c001f2eabcd");
    
    // Get all entries for the user
    const entries = await HealthEntry.find({ user: userId });
    
    // Calculate weekly completion (entries in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const entriesLast7Days = entries.filter(entry => 
      new Date(entry.date) >= sevenDaysAgo
    ).length;
    
    const weeklyCompletion = Math.min(Math.round((entriesLast7Days / 7) * 100), 100);
    
    // Calculate streak
    let streak = 0;
    if (entries.length > 0) {
      // Sort entries by date (newest first)
      const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Check if there's an entry today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayStr = today.toDateString();
      const hasEntryToday = sortedEntries.some(entry => 
        new Date(entry.date).toDateString() === todayStr
      );
      
      if (hasEntryToday) {
        streak = 1;
        // Count consecutive days
        for (let i = 1; i < sortedEntries.length; i++) {
          const prevDate = new Date(sortedEntries[i-1].date);
          const currDate = new Date(sortedEntries[i].date);
          
          prevDate.setHours(0, 0, 0, 0);
          currDate.setHours(0, 0, 0, 0);
          
          const diffDays = Math.round((prevDate - currDate) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }
    
    // Calculate rank based on streak
    let rank = 'New';
    if (streak >= 30) rank = 'Champion';
    else if (streak >= 14) rank = 'Pro';
    else if (streak >= 7) rank = 'Regular';
    else if (streak >= 3) rank = 'Getting Started';
    
    res.json({
      success: true,
      data: {
        weeklyCompletion,
        streak,
        rank
      }
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};