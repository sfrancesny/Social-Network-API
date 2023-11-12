// seed.js
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Thought = require('../models/thoughtModel');
const userData = require('./user.json');
const thoughtData = require('./thought.json');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/social-network', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected successfully to MongoDB');

    // Clear existing users and thoughts
    await User.deleteMany({});
    await Thought.deleteMany({});

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

    // When seeding is done, log the users and thoughts
    const users = await User.find();
    users.forEach(user => {
      console.log(`User: ${user.username}, ID: ${user._id}`);
    });

    const thoughts = await Thought.find();
    thoughts.forEach(thought => {
      console.log(`Thought: ${thought.thoughtText}, ID: ${thought._id}`);
    });

    console.log('Database seeded with users and thoughts!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Call the seeding function
seedDatabase();
