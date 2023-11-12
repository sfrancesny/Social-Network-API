const mongoose = require('mongoose');

// MongoDB connection URL
const mongoURI = 'mongodb://127.0.0.1:27017/social-network';

// Mongoose connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose.connect(mongoURI, mongooseOptions)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Export the Mongoose connection
module.exports = mongoose;
