const Resume = require('../models/ResumeModel');

exports.saveResume = async (req, res) => {
  try {
    const { id, ...resumeData } = req.body;
    const userId = req.user.id;

    if (id) {
      // Update existing resume
      const updatedResume = await Resume.findOneAndUpdate(
        { _id: id, userId },
        { ...resumeData, updatedAt: Date.now() },
        { new: true }
      );
      if (!updatedResume) return res.status(404).json({ message: 'Resume not found' });
      return res.status(200).json(updatedResume);
    } else {
      // Create new resume
      const newResume = new Resume({
        userId,
        ...resumeData
      });
      await newResume.save();
      return res.status(201).json(newResume);
    }
  } catch (error) {
    console.error('Save Resume Error:', error);
    res.status(500).json({ message: 'Error saving resume draft' });
  }
};

exports.getResumesByUser = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.status(200).json(resumes);
  } catch (error) {
    console.error('Get Resumes Error:', error);
    res.status(500).json({ message: 'Error fetching resumes' });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.status(200).json(resume);
  } catch (error) {
    console.error('Get Resume Detail Error:', error);
    res.status(500).json({ message: 'Error fetching resume' });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const deleted = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Resume not found' });
    res.status(200).json({ message: 'Resume draft deleted' });
  } catch (error) {
    console.error('Delete Resume Error:', error);
    res.status(500).json({ message: 'Error deleting resume' });
  }
};
