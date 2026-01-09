const express = require('express');
const router = express.Router();
const {
  getAllLawFirms,
  getLawFirmById,
  createLawFirm,
  deleteLawFirm
} = require('../controllers/lawFirmController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
// GET /api/law-firms - Get all law firms (with optional search query)
router.get('/',  getAllLawFirms);

// GET /api/law-firms/:id - Get law firm by ID
router.get('/:id', authenticate, getLawFirmById);

// POST /api/law-firms - Create new law firm
router.post('/',  createLawFirm);

// DELETE /api/law-firms/:id - Delete law firm
router.delete('/:id', authenticate, deleteLawFirm);

module.exports = router;

