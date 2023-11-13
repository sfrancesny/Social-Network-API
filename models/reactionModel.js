// reactionModel.js
const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  emoji: { type: String, required: true },
  reactionText: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
});

const Reaction = mongoose.model('Reaction', reactionSchema);

module.exports = Reaction;
