const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const thoughtRoutes = require('./routes/thoughtRoutes');
const { User, Thought } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

mongoose.connect('mongodb://localhost/socialnetworkdb', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/users', userRoutes);
app.use('/api/thoughts', thoughtRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
