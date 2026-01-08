require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/recommend', require('./routes/recommendationRoutes'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI||"mongodb+srv://gokulnaathn64_db_user:Gokul123@cluster0.inxcm34.mongodb.net/")
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
