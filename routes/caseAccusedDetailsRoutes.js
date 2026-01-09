const express = require('express');
const router = express.Router();
const {
  getAllAccusedDetails,
  getAccusedDetailsById,
  getAccusedDetailsByCaseId,
  getAccusedDetailsByAccusedNo,
  createAccusedDetails,
  updateAccusedDetails,
  deleteAccusedDetails
} = require('../controllers/caseAccusedDetailsController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
// GET /api/case-accused-details - Get all accused details (optional query: ?caseId=1 or ?createdBy=user123)
router.get('/', authenticate, getAllAccusedDetails);

// GET /api/case-accused-details/case/:caseId - Get accused details by case ID
router.get('/case/:caseId', authenticate, getAccusedDetailsByCaseId);

// GET /api/case-accused-details/accused/:accusedNo - Get accused details by accused number
router.get('/accused/:accusedNo', authenticate, getAccusedDetailsByAccusedNo);

// GET /api/case-accused-details/:id - Get accused details by ID (or accused_no if not numeric)
router.get('/:id', authenticate, getAccusedDetailsById);

// POST /api/case-accused-details - Create new accused details
router.post('/', authenticate, createAccusedDetails);

// PUT /api/case-accused-details/:id - Update accused details
router.put('/:id', authenticate, updateAccusedDetails);

// DELETE /api/case-accused-details/:id - Delete accused details
router.delete('/:id', authenticate, deleteAccusedDetails);

module.exports = router;

