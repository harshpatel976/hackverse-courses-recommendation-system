const UserProfile = require('../models/Userprofile');

// Simulated quiz data based on course ID
const getQuizzesForCourse = (courseId) => {
  const quizzes = {
    'g1': [
      { id: 'q1', question: 'What is the primary tool used in Google Data Analytics?', options: ['Excel', 'Python', 'R', 'Tableau'], correct: 'Tableau' },
      { id: 'q2', question: 'Which phase involves cleaning data?', options: ['Prepare', 'Analyze', 'Share', 'Act'], correct: 'Prepare' },
    ],
    'g2': [
      { id: 'q1', question: 'What does SEO stand for?', options: ['Search Engine Optimization', 'Social Engagement Online', 'Search Engine Operations', 'Social Engine Optimization'], correct: 'Search Engine Optimization' },
      { id: 'q2', question: 'Which platform is used for Google Ads?', options: ['Google Analytics', 'Google Ads Manager', 'Google Search Console', 'Google Trends'], correct: 'Google Ads Manager' },
    ],
    'g3': [
      { id: 'q1', question: 'What is a common ML algorithm?', options: ['Linear Regression', 'Bubble Sort', 'Quick Sort', 'DFS'], correct: 'Linear Regression' },
      { id: 'q2', question: 'What does ML stand for?', options: ['Machine Learning', 'Manual Learning', 'Memory Logic', 'Main Loop'], correct: 'Machine Learning' },
    ],
  };
  return quizzes[courseId] || [];
};

// GET /api/quizzes - Fetch quizzes for enrolled courses
exports.getQuizzes = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserProfile.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const quizzes = [];
    user.enrolledCourses.forEach(course => {
      const courseQuizzes = getQuizzesForCourse(course.courseId);
      if (courseQuizzes.length > 0) {
        quizzes.push({ courseId: course.courseId, courseTitle: course.title, questions: courseQuizzes });
      }
    });

    res.status(200).json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
};

// POST /api/quizzes/submit - Submit quiz results
exports.submitQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, score, totalQuestions } = req.body;

    const user = await UserProfile.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update quiz progress
    const existingProgress = user.quizProgress || [];
    const progressIndex = existingProgress.findIndex(p => p.courseId === courseId);
    if (progressIndex !== -1) {
      existingProgress[progressIndex] = { courseId, score, totalQuestions, completed: true };
    } else {
      existingProgress.push({ courseId, score, totalQuestions, completed: true });
    }

    user.quizProgress = existingProgress;
    await user.save();

    res.status(200).json({ message: 'Quiz progress saved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save quiz progress' });
  }
};