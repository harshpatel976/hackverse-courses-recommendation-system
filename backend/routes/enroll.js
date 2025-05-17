const express = require('express');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();


// POST /api/enroll - Enroll in a course
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { courseId, title, description } = req.body;

    console.log('Enroll Request Body:', req.body); // Log the request
    if (!courseId || !title || !description) {
      return res.status(400).json({ message: 'Course details are required' });
    }

    const userProfile = await userProfile.findOne({ userId: req.user.userId });
    if (!userProfile) {
      console.log('User profile not found for userId:', req.user.userId);
      return res.status(404).json({ message: 'User profile not found' });
    }

    const alreadyEnrolled = userProfile.enrolledCourses.some(
      course => course.courseId === courseId
    );
    if (alreadyEnrolled) {
      console.log('User already enrolled in courseId:', courseId);
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    userProfile.enrolledCourses.push({ courseId, title, description });
    await userProfile.save();
    console.log('Successfully enrolled user in courseId:', courseId);

    res.status(201).json({ message: 'Successfully enrolled in the course' });
  } catch (error) {
    console.error('Error in /api/enroll:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;