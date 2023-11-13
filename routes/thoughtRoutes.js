const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Thought = require('../models/thoughtModel');
const Reaction = require('../models/reactionModel');

router.get('/', async (req, res) => {
  // GET all thoughts
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:thoughtId', async (req, res) => {
  // GET a single thought by its _id
  const { thoughtId } = req.params;

  try {
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST to create a new thought
router.post('/', async (req, res) => {
  const { thoughtText, username, userId } = req.body;

  try {
    const thought = await Thought.create({ thoughtText, username, userId });
    
    // Push the created thought's _id to the associated user's thoughts array field
    const user = await User.findById(userId);
    user.thoughts.push(thought._id);
    await user.save();

    res.json(thought);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST (create reaction)
router.post('/:thoughtId/reactions', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    // Find the user by username
    const user = await User.findOne({ username: req.body.user });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new Reaction with the user's ObjectId
    const newReaction = new Reaction({
      emoji: req.body.emoji,
      user: user._id,
      reactionText: req.body.reactionText,
      timestamp: req.body.timestamp,
    });

    // Find the thought by ID and push the new reaction
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $push: { reactions: newReaction } },
      { new: true }
    );

    // Check if the thought exists
    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    res.status(201).json(newReaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT to update a thought by its _id
router.put('/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params;
  const { thoughtText } = req.body;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { thoughtText },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    res.json(updatedThought);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE (remove reaction)
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  const { thoughtId, reactionId } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $pull: { reactions: reactionId } },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    res.json({ message: 'Reaction removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE to remove a reaction by its reactionId value
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  const { thoughtId, reactionId } = req.params;

  try {
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    // Remove reaction by reactionId
    thought.reactions.id(reactionId).remove();
    await thought.save();

    res.json(thought);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

