const mongoose = require('mongoose');

const healthyHabitSchema = new mongoose.Schema({
  user: {
    type: String, // Changed from ObjectId to String for flexibility
    required: true,
    unique: true // One habit document per user
  },
  goals: {
    sleepGoal: {
      type: Number,
      default: 8,
      min: 0,
      max: 24
    },
    exerciseGoal: {
      type: Number,
      default: 30,
      min: 0,
      max: 1440
    },
    exerciseUnit: {
      type: String,
      enum: ['minutes', 'hours'],
      default: 'minutes'
    },
    stressGoal: {
      type: Number,
      default: 4,
      min: 1,
      max: 10
    },
    waterGoal: {
      type: Number,
      default: 8,
      min: 0,
      max: 20
    },
    meditationGoal: {
      type: Number,
      default: 10,
      min: 0,
      max: 1440
    },
    meditationUnit: {
      type: String,
      enum: ['minutes', 'hours'],
      default: 'minutes'
    }
  },
  progress: {
    sleepAvg: {
      type: Number,
      default: 7.2
    },
    exerciseAvg: {
      type: Number,
      default: 25
    },
    stressAvg: {
      type: Number,
      default: 5
    },
    waterAvg: {
      type: Number,
      default: 6
    },
    meditationAvg: {
      type: Number,
      default: 8
    }
  },
  weeklyData: {
    sleep: {
      type: [Number],
      default: [7.5, 6.8, 7.2, 8.1, 6.9, 8.5, 7.8]
    },
    exercise: {
      type: [Number],
      default: [20, 30, 15, 45, 25, 60, 30]
    },
    stress: {
      type: [Number],
      default: [6, 5, 7, 4, 6, 3, 4]
    },
    mood: {
      type: [Number],
      default: [7, 6, 8, 7, 9, 8, 8]
    },
    days: {
      type: [String],
      default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  },
  dailyLogs: [{
    date: {
      type: Date,
      default: Date.now
    },
    sleep: Number,
    exercise: Number,
    stress: Number,
    water: Number,
    meditation: Number,
    mood: Number,
    notes: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
healthyHabitSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to calculate averages from daily logs
healthyHabitSchema.methods.calculateAverages = function() {
  const logs = this.dailyLogs;
  if (logs.length === 0) return;
  
  const totals = logs.reduce((acc, log) => {
    if (log.sleep) acc.sleep += log.sleep;
    if (log.exercise) acc.exercise += log.exercise;
    if (log.stress) acc.stress += log.stress;
    if (log.water) acc.water += log.water;
    if (log.meditation) acc.meditation += log.meditation;
    return acc;
  }, { sleep: 0, exercise: 0, stress: 0, water: 0, meditation: 0 });
  
  const counts = logs.length;
  
  this.progress.sleepAvg = totals.sleep / counts || this.progress.sleepAvg;
  this.progress.exerciseAvg = totals.exercise / counts || this.progress.exerciseAvg;
  this.progress.stressAvg = totals.stress / counts || this.progress.stressAvg;
  this.progress.waterAvg = totals.water / counts || this.progress.waterAvg;
  this.progress.meditationAvg = totals.meditation / counts || this.progress.meditationAvg;
};

module.exports = mongoose.model('HealthyHabit', healthyHabitSchema);
