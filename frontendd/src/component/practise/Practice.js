import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './practiice.css';

function Practice() {
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/quizzes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuizzes(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quizzes');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchQuizzes();
  }, [navigate]);

  const handleAnswerChange = (courseId, questionId, answer) => {
    setAnswers({
      ...answers,
      [`${courseId}-${questionId}`]: answer,
    });
  };

  const handleSubmitQuiz = async (courseId, questions) => {
    try {
      let score = 0;
      questions.forEach(q => {
        if (answers[`${courseId}-${q.id}`] === q.correct) {
          score++;
        }
      });

      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/quizzes/submit',
        { courseId, score, totalQuestions: questions.length },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(`Quiz for ${courseId} submitted! Score: ${score}/${questions.length}`);
      setAnswers({}); // Reset answers
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
    }
  };

  return (
    <div className="practice-container">
      <h2 className="practice-title">Practice Quizzes</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {quizzes.length === 0 ? (
        <p className="no-quizzes">No quizzes available. Enroll in a course to access quizzes.</p>
      ) : (
        quizzes.map(quiz => (
          <div key={quiz.courseId} className="quiz-section">
            <h3 className="quiz-title">{quiz.courseTitle} Quiz</h3>
            {quiz.questions.map(q => (
              <div key={q.id} className="question">
                <p className="question-text">{q.question}</p>
                {q.options.map(option => (
                  <label key={option} className="option-label">
                    <input
                      type="radio"
                      name={`${quiz.courseId}-${q.id}`}
                      value={option}
                      checked={answers[`${quiz.courseId}-${q.id}`] === option}
                      onChange={() => handleAnswerChange(quiz.courseId, q.id, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            ))}
            <button
              className="submit-quiz-button button"
              onClick={() => handleSubmitQuiz(quiz.courseId, quiz.questions)}
            >
              Submit Quiz
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Practice;