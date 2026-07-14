const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/ai/suggestions
// @desc    Get AI-based skill and tutor suggestions
// @access  Private
router.get('/suggestions', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const { skills_offered, skills_wanted } = user;
    let skillSuggestions = new Set();

    // 1. Skill Suggestion Logic
    // If user knows "Python" -> Suggest: ["Machine Learning", "AI"]
    if (skills_offered.some(s => s.toLowerCase().includes('python'))) {
      skillSuggestions.add('Machine Learning');
      skillSuggestions.add('AI');
    }

    // If user knows "HTML" -> Suggest: ["CSS", "JavaScript"]
    if (skills_offered.some(s => s.toLowerCase().includes('html'))) {
      skillSuggestions.add('CSS');
      skillSuggestions.add('JavaScript');
    }

    // If user wants "React" -> Suggest: ["JavaScript"]
    if (skills_wanted.some(s => s.toLowerCase().includes('react'))) {
      skillSuggestions.add('JavaScript');
    }

    // 2. Tutor Suggestions (Top 3 users matching user's skills_wanted)
    const tutorSuggestions = await User.find({
      _id: { $ne: req.user.id },
      skills_offered: { $in: skills_wanted }
    })
    .select('name skills_offered')
    .limit(3);

    res.json({
      skillSuggestions: Array.from(skillSuggestions),
      tutorSuggestions
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
