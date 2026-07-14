const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/match
// @desc    Get matching users based on skills wanted
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // 1. Get logged in user data to know what skills they want
    const currentUser = await User.findById(req.user.id);
    
    if (!currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!currentUser.skills_wanted || currentUser.skills_wanted.length === 0) {
      return res.json([]); // No skills wanted, so no matches
    }

    // 2. Find users where their skills_offered match any of current user's skills_wanted
    // Note: $in matches if the array contains ANY of the values
    // Also ensuring we don't match the current user with themselves!
    const matches = await User.find({
      _id: { $ne: req.user.id }, // Exclude current user
      skills_offered: { $in: currentUser.skills_wanted }
    }).select('_id name skills_offered skills_wanted role'); // Only pick necessary fields

    res.json(matches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
