import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './feedback.css';

function Feedback() {
  const [userData, setUserData] = useState({ biodata: { fullName: '' }, enrolledCourses: [] });
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, redirecting to login');
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('API Response:', response.data); // Log the API response
        const data = response.data || { biodata: { fullName: '' }, enrolledCourses: [] };
        setUserData(data);
        console.log('Enrolled Courses:', data.enrolledCourses); // Log enrolled courses
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to load user data';
        console.error('Error fetching user data:', err); // Log the error
        setError(errorMessage);
        if (err.response?.status === 401) {
          console.log('Unauthorized, redirecting to login');
          navigate('/login');
        }
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleFeedbackChange = (courseId, field, value) => {
    setFeedback(prev => ({
      ...prev,
      [courseId]: { ...prev[courseId], [field]: value },
    }));
  };

  const handleFeedbackSubmit = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const courseFeedback = feedback[courseId] || { rating: 0, comment: '' };
      if (!courseFeedback.rating || courseFeedback.rating < 1 || courseFeedback.rating > 5) {
        alert('Please provide a rating between 1 and 5');
        return;
      }

      await axios.post(
        'http://localhost:5000/api/feedback',
        {
          courseId: courseId.toString(),
          rating: parseInt(courseFeedback.rating),
          comment: courseFeedback.comment || '',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Feedback submitted successfully!');
      setFeedback(prev => ({
        ...prev,
        [courseId]: { ...prev[courseId], submitted: true },
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit feedback');
    }
  };

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">
        Provide Feedback, {userData.biodata.fullName || 'User'}!
      </h2>
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p className="loading-message">Loading enrolled courses...</p>
      ) : (
        <div className="feedback-list">
          {userData.enrolledCourses && userData.enrolledCourses.length > 0 ? (
            userData.enrolledCourses.map(course => (
              <div key={course.courseId} className="feedback-item">
                <h3 className="course-title">{course.title}</h3>
                {feedback[course.courseId]?.submitted ? (
                  <p className="feedback-submitted">Thank you for your feedback!</p>
                ) : (
                  <div className="feedback-form">
                    <div className="feedback-rating">
                      <label>Rating (1-5): </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={feedback[course.courseId]?.rating || ''}
                        onChange={(e) => handleFeedbackChange(course.courseId, 'rating', e.target.value)}
                        className="feedback-input"
                      />
                    </div>
                    <div className="feedback-comment">
                      <label>Comment (optional): </label>
                      <textarea
                        value={feedback[course.courseId]?.comment || ''}
                        onChange={(e) => handleFeedbackChange(course.courseId, 'comment', e.target.value)}
                        className="feedback-textarea"
                        placeholder="Your feedback..."
                      />
                    </div>
                    <button
                      className="feedback-submit button"
                      onClick={() => handleFeedbackSubmit(course.courseId)}
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-courses">No enrolled courses. Enroll in a course from the dashboard to provide feedback.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Feedback;