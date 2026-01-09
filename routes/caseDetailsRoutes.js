const express = require('express');
const router = express.Router();
const {
  getAllCaseDetails,
  getCaseDetailsById,
  getCaseDetailsByScNo,
  createCaseDetails,
  updateCaseDetails,
  deleteCaseDetails
} = require('../controllers/caseDetailsController');
const { authenticate } = require('../middleware/auth');

// All case details routes require authentication
// GET /api/case-details - Get all case details (optional query: ?status=active)
router.get('/', authenticate, getAllCaseDetails);

// GET /api/case-details/sc/:scNo - Get case details by SC Number
router.get('/sc/:scNo', authenticate, getCaseDetailsByScNo);

// GET /api/case-details/:id - Get case details by ID
router.get('/:id', authenticate, getCaseDetailsById);

// POST /api/case-details - Create new case details
router.post('/', authenticate, createCaseDetails);

// PUT /api/case-details/:id - Update case details
router.put('/:id', authenticate, updateCaseDetails);

// DELETE /api/case-details/:id - Delete case details
router.delete('/:id', authenticate, deleteCaseDetails);

module.exports = router;

