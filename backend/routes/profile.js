const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/profile
// @desc    Get current users profile
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const profile = await User.findById(req.user.id).select('-password');
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/profile
// @desc    Update user profile (skills_offered and skills_wanted)
// @access  Private
router.put('/', auth, async (req, res) => {
  const { skills_offered, skills_wanted } = req.body;

  // Build profile object dynamically based on fields submitted
  const profileFields = {};
  if (skills_offered) profileFields.skills_offered = skills_offered;
  if (skills_wanted) profileFields.skills_wanted = skills_wanted;

  try {
    let profile = await User.findById(req.user.id);
    if (!profile) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update
    profile = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true } // returns the updated document
    ).select('-password');

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
