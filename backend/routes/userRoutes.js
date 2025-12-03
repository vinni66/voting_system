const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// @route   GET api/users
// @desc    Get all users (for admins)
// @access  Admin
router.get('/', [authMiddleware, adminMiddleware], getUsers);

module.exports = router;
