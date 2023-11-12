const express = require('express');
const router = express.Router();
const { User, Thought } = require('../models');

router.get('/', async (req, res) => {
  // GET all users
  try {
    const users = await User.find().populate('thoughts friends');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:userId', async (req, res) => {
  // GET a single user by its _id and populated thought and friend data
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('thoughts friends');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
