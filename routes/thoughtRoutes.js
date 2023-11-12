const express = require('express');
const router = express.Router();
const { Thought, User } = require('../models');

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

// POST to create a reaction
router.post('/:thoughtId/reactions', async (req, res) => {
  const { thoughtId } = req.params;
  const { reactionBody, username } = req.body;

  try {
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    // Create a reaction
    thought.reactions.push({ reactionBody, username });
    await thought.save();

    res.json(thought);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE to remove a thought by its _id
router.delete('/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    // Remove associated reactions
    await thought.reactions.forEach(async (reaction) => {
      await thought.reactions.id(reaction._id).remove();
    });

    // Remove thought
    await thought.remove();

    res.json({ message: 'Thought and associated reactions removed' });
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

