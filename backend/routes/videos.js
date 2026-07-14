const express = require('express');
const Video = require('../models/Video');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/videos
// @desc    Upload a video link (Tutor only)
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, video_link } = req.body;

  if (!title || !video_link) {
    return res.status(400).json({ msg: 'Please provide video title and a valid link' });
  }

  if (req.user.role !== 'tutor') {
    return res.status(401).json({ msg: 'Only tutors can upload session records' });
  }

  try {
    const newVideo = new Video({
      tutor_id: req.user.id,
      title,
      video_link
    });

    const savedVideo = await newVideo.save();
    const populatedVideo = await Video.findById(savedVideo._id).populate('tutor_id', 'name');
    
    res.json(populatedVideo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/videos
// @desc    Get all recorded videos
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('tutor_id', 'name')
      .sort({ created_at: -1 });
    res.json(videos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
