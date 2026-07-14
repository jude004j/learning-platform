const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Request = require('../models/Request');

// @route   GET /api/connections
// @desc    Get all accepted connections for logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const connections = await Request.find({
      $and: [
        { status: 'accepted' },
        { 
          $or: [
            { sender_id: req.user.id },
            { receiver_id: req.user.id }
          ]
        }
      ]
    })
    .populate('sender_id', 'name email')
    .populate('receiver_id', 'name email');

    const formattedConnections = connections.map(conn => ({
      sender: conn.sender_id,
      receiver: conn.receiver_id,
      skill: conn.skill,
      _id: conn._id
    }));

    res.json(formattedConnections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
