const User = require('../models/User');

// @desc    Get all users for admin panel
// @access  Admin
exports.getUsers = async (req, res) => {
  try {
    // Find all users but exclude the password field for security
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
