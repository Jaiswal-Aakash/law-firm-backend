const express = require('express');
const router = express.Router();
const {
  getAllComplainantDetails,
  getComplainantDetailsById,
  getComplainantDetailsByCaseId,
  createComplainantDetails,
  updateComplainantDetails,
  deleteComplainantDetails
} = require('../controllers/caseComplainantDetailsController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
// GET /api/case-complainant-details - Get all complainant details (optional query: ?caseId=1 or ?createdBy=user123)
router.get('/', authenticate, getAllComplainantDetails);

// GET /api/case-complainant-details/case/:caseId - Get complainant details by case ID
router.get('/case/:caseId', authenticate, getComplainantDetailsByCaseId);

// GET /api/case-complainant-details/:id - Get complainant details by ID
router.get('/:id', authenticate, getComplainantDetailsById);

// POST /api/case-complainant-details - Create new complainant details
router.post('/', authenticate, createComplainantDetails);

// PUT /api/case-complainant-details/:id - Update complainant details
router.put('/:id', authenticate, updateComplainantDetails);

// DELETE /api/case-complainant-details/:id - Delete complainant details
router.delete('/:id', authenticate, deleteComplainantDetails);

module.exports = router;

