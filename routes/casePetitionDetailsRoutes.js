const express = require('express');
const router = express.Router();
const {
  createCasePetitionDetails,
  getCasePetitionDetails,
  getCasePetitionDetailsByCaseId,
  getCasePetitionDetailsById,
  updateCasePetitionDetails,
  deleteCasePetitionDetails
} = require('../controllers/casePetitionDetailsController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
// GET /api/case-petition-details - Get all case petition details (with optional query params: caseId, createdBy)
router.get('/', authenticate, getCasePetitionDetails);

// GET /api/case-petition-details/case/:caseId - Get case petition details by case ID
router.get('/case/:caseId', authenticate, getCasePetitionDetailsByCaseId);

// GET /api/case-petition-details/:id - Get case petition details by ID
router.get('/:id', authenticate, getCasePetitionDetailsById);

// POST /api/case-petition-details - Create new case petition details and generate PDF
router.post('/', authenticate, createCasePetitionDetails);

// PUT /api/case-petition-details/:id - Update case petition details
router.put('/:id', authenticate, updateCasePetitionDetails);

// DELETE /api/case-petition-details/:id - Delete case petition details
router.delete('/:id', authenticate, deleteCasePetitionDetails);

module.exports = router;


