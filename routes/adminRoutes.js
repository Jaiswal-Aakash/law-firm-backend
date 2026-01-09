const express = require('express');
const router = express.Router();
const {
  getAllFirmsWithAdvocates,
  getAllAdvocates,
  activateUser,
  deactivateUser,
  getUserWithFirm
} = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');

// All admin routes require authentication
// Get all firms with their advocates
router.get('/firms', authenticate, getAllFirmsWithAdvocates);

// Get all advocates
router.get('/advocates', authenticate, getAllAdvocates);

// Get user with firm details
router.get('/users/:id', authenticate, getUserWithFirm);

// Activate a user
router.patch('/users/:id/activate', authenticate, activateUser);

// Deactivate a user
router.patch('/users/:id/deactivate', authenticate, deactivateUser);

module.exports = router;


