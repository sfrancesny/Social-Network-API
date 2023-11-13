// friendshipModel.js
const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  friend: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Friendship = mongoose.model('Friendship', friendshipSchema);

module.exports = Friendship;
