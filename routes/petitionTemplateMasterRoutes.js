const express = require('express');
const router = express.Router();
const {
  getAllPetitionTemplates,
  getPetitionTemplateById,
  getPetitionTemplateByNumber
} = require('../controllers/petitionTemplateMasterController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
// GET /api/petition-templates - Get all active petition templates
router.get('/', authenticate, getAllPetitionTemplates);

// GET /api/petition-templates/number/:number - Get template by petition number
router.get('/number/:number', authenticate, getPetitionTemplateByNumber);

// GET /api/petition-templates/:id - Get petition template by ID
router.get('/:id', authenticate, getPetitionTemplateById);

module.exports = router;

