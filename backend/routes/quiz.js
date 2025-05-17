const express = require('express');
const router = express.Router();


const authMiddleware = require('../middlewares/auth');
const { getQuizzes, submitQuiz } = require('../controllers/quizController');

router.get('/', authMiddleware, getQuizzes);
router.post('/submit', authMiddleware, submitQuiz);

module.exports = router;