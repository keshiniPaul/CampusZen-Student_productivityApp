const express = require('express');
const router = express.Router();

const {
  createHealthEntry,
  getAllEntries,
  getEntryById,
  updateHealthEntry,
  deleteHealthEntry,
  getUserStats
} = require('../controllers/healthController');

// Health entry routes
router.post('/entries', createHealthEntry);
router.get('/entries', getAllEntries);
router.get('/entries/:id', getEntryById);
router.put('/entries/:id', updateHealthEntry);
router.delete('/entries/:id', deleteHealthEntry);

// Stats route
router.get('/stats', getUserStats);

module.exports = router;