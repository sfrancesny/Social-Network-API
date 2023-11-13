const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Thought = require('../models/thoughtModel');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('thoughts friends');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET a single user by its _id and populated thought and friend data
router.get('/:userId', async (req, res) => {
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

// PUT (update user)
router.put('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST (create user)
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST (create thought)
router.post('/:userId/thoughts', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newThought = await Thought.create(req.body);
    user.thoughts.push(newThought._id);
    await user.save();

    res.status(201).json(newThought);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST (create 2nd user)
router.post('/second-user', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST (create 3rd user)
router.post('/third-user', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST (add friend)
router.post('/:userId/friends', async (req, res) => {
  const { userId } = req.params;
  const { friendId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Assuming you have a "friends" field in your User model
    user.friends.push(friendId);
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE (remove friend)
router.delete('/:userId/friends/:friendId', async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

