const express = require('express');
const Session = require('../models/Session');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/session
// @desc    Create a live session (Tutor only)
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, meet_link } = req.body;

  if (!title || !meet_link) {
    return res.status(400).json({ msg: 'Please provide session title and meet link' });
  }

  // Ensure user is a tutor
  if (req.user.role !== 'tutor') {
    return res.status(401).json({ msg: 'Only tutors can create live sessions' });
  }

  try {
    const newSession = new Session({
      tutor_id: req.user.id,
      title,
      meet_link
    });

    const savedSession = await newSession.save();
    
    // Populate tutor info for the response
    const populatedSession = await Session.findById(savedSession._id).populate('tutor_id', 'name');
    
    res.json(populatedSession);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/session
// @desc    Get all live sessions
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('tutor_id', 'name')
      .sort({ created_at: -1 });
    res.json(sessions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
