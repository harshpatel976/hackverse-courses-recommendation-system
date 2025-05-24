require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const enrollRoutes = require('./routes/enroll');
const profileRoutes = require('./routes/profile'); 
const fetchCourseRoutes = require('./routes/fetchCourse');
const fetchPlaylistRoutes = require('./routes/fetchPlaylist');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes); 
app.use('/api/enroll', enrollRoutes);
app.use('/api/fetch-course', fetchCourseRoutes);
app.use('/api/fetch-playlist', fetchPlaylistRoutes) 
app.use('/api/quizzes', quizRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));