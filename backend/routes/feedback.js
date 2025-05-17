const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const CourseFeedback = require('../models/CourseFeedback');
const UserProfile = require('../models/UserProfile');

// POST /api/feedback - Submit feedback for a course
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;

    // Validate input
    if (!courseId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid feedback data' });
    }

    // Check if the user is enrolled in the course
    const userProfile = await UserProfile.findOne({ userId: req.user.userId });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const isEnrolled = userProfile.enrolledCourses.some(
      course => course.courseId === courseId
    );
    if (!isEnrolled) {
      return res.status(403).json({ message: 'You must enroll in the course to provide feedback' });
    }

    const feedback = new CourseFeedback({
      userId: req.user.userId,
      courseId,
      rating,
      comment: comment || '',
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;