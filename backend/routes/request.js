const express = require('express');
const Request = require('../models/Request');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/request
// @desc    Send a skill request
// @access  Private
router.post('/', auth, async (req, res) => {
  const { receiver_id, skill } = req.body;

  if (!receiver_id || !skill) {
    return res.status(400).json({ msg: 'Please provide receiver_id and skill' });
  }

  try {
    // Prevent duplicate requests
    const existingRequest = await Request.findOne({
      sender_id: req.user.id,
      receiver_id,
      skill,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ msg: 'A pending request already exists for this skill' });
    }

    const newRequest = new Request({
      sender_id: req.user.id,
      receiver_id,
      skill
    });

    const savedRequest = await newRequest.save();
    res.json(savedRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/request
// @desc    Get all incoming requests for logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const requests = await Request.find({ receiver_id: req.user.id })
      .populate('sender_id', 'name email skills_offered role')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/request/:id
// @desc    Update request status (accept/reject)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }

  try {
    let request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    // Ensure user is the receiver
    if (request.receiver_id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
