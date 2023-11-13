// seed.js
// imports the neccessary modules
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Thought = require('../models/thoughtModel');
const Reaction = require('../models/reactionModel');
const Friendship = require('../models/friendshipModel'); 
const userData = require('./user.json');
const thoughtData = require('./thought.json');
const reactionData = require('./reactions.json');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/social-network', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected successfully to MongoDB');

    // Clear existing users, thoughts, reactions, and friendships
    await User.deleteMany({});
    await Thought.deleteMany({});
    await Reaction.deleteMany({});
    await Friendship.deleteMany({});  // Clear friendships

    // Seed the users
    const insertedUsers = await User.insertMany(userData);
    console.log('Users successfully added!');
    insertedUsers.forEach(user => {
      console.log(`User: ${user.username}, ID: ${user._id}`);
    });

    // Map through the thoughtData & replace with actual user IDs
    const preparedThoughts = thoughtData.map(thought => {
      const user = insertedUsers.find(u => u.username === thought.username);
      if (!user) {
        throw new Error(`User not found for the thought: ${thought.thoughtText}`);
      }
      return { ...thought, userId: user._id };
    });

    // Seed the thoughts with updated user IDs
    const insertedThoughts = await Thought.insertMany(preparedThoughts);
    console.log('Thoughts successfully added!');

    // Seed the reactions
    const preparedReactions = reactionData.map(reaction => {
      const user = insertedUsers.find(u => u.username === reaction.user);
      if (!user) {
        throw new Error(`User not found for the reaction: ${reaction.reactionText}`);
      }
      return { ...reaction, user: user._id };
    });

    // Seed the reactions with updated user IDs
    const insertedReactions = await Reaction.insertMany(preparedReactions);
    console.log('Reactions successfully added!');

    // Seed friendships
    const friendships = [
      { user: insertedUsers[0]._id, friend: insertedUsers[1]._id },
      { user: insertedUsers[0]._id, friend: insertedUsers[2]._id },
    ];

    await Friendship.insertMany(friendships);
    console.log('Friendships successfully added!');

    // When seeding is done, log the users, thoughts, reactions, and friendships
    const users = await User.find();
    users.forEach(user => {
      console.log(`User: ${user.username}, ID: ${user._id}`);
    });

    const thoughts = await Thought.find();
    thoughts.forEach(thought => {
      console.log(`Thought: ${thought.thoughtText}, ID: ${thought._id}`);
    });

    const reactions = await Reaction.find();
    reactions.forEach(reaction => {
      console.log(`Reaction: ${reaction.comment}, ID: ${reaction._id}`);
    });

    const friendRelations = await Friendship.find();
    friendRelations.forEach(friendship => {
      console.log(`Friendship: User ${friendship.user} is friends with ${friendship.friend}`);
    });

    console.log('Database seeded with users, thoughts, reactions, and friendships!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Call the seeding function
seedDatabase();
