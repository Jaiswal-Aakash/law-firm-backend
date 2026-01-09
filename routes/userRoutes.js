const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationEmail,
  getAllUsers,
  getUserById,
  updateUser,
  changePassword,
  deleteUser
} = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// Public routes (no authentication required)
// POST /api/users/register - Register a new user
router.post('/register', registerUser);

// POST /api/users/login - Login user
router.post('/login', loginUser);

// GET /api/users/verify-email - Verify email with token (query param: ?token=...)
router.get('/verify-email', verifyEmail);

// POST /api/users/resend-verification - Resend verification email
router.post('/resend-verification', resendVerificationEmail);

// Protected routes (authentication required)
// GET /api/users - Get all users
router.get('/', authenticate, getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', authenticate, getUserById);

// PUT /api/users/:id - Update user
router.put('/:id', authenticate, updateUser);

// PATCH /api/users/:id/change-password - Change user password
router.patch('/:id/change-password', authenticate, changePassword);

// DELETE /api/users/:id - Delete user
router.delete('/:id', authenticate, deleteUser);

module.exports = router;
