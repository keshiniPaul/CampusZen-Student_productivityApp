const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { saveResume, getResumesByUser, getResumeById, deleteResume } = require('../controllers/resumeController');

router.post('/save', protect, saveResume);
router.get('/my-resumes', protect, getResumesByUser);
router.get('/:id', protect, getResumeById);
router.delete('/:id', protect, deleteResume);

module.exports = router;
