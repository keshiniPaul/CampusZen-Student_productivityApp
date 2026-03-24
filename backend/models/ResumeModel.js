const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeName: {
    type: String,
    required: true,
    default: 'Untitled Resume'
  },
  personal: {
    fullName: String,
    email: String,
    phone: String,
    linkedin: String,
    address: String
  },
  objective: String,
  education: [{
    degree: String,
    university: String,
    gpa: String,
    year: String
  }],
  skills: [String],
  projects: [{
    title: String,
    description: String,
    link: String
  }],
  experience: [{
    role: String,
    company: String,
    duration: String,
    description: String
  }],
  certifications: [{
    name: String,
    date: String
  }],
  extracurricular: [{
    activity: String,
    description: String
  }],
  references: [{
    name: String,
    contact: String
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
