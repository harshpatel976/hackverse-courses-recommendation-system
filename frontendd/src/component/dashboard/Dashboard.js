import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import MiniDashboard from './Minidashboard';



function Dashboard() {
  const [userData, setUserData] = useState({ biodata: { fullName: '' }, goalSet: [] });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data || { biodata: { fullName: '' }, goalSet: [] });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchUserData();
  }, [navigate]);

  const recommendedCourses = [
    { id: 1, title: 'Introduction to JavaScript', description: 'Learn the basics of JavaScript programming.' },
    { id: 2, title: 'React for Beginners', description: 'Build your first React application.' },
    { id: 3, title: 'Python Data Science', description: 'Analyze data using Python libraries.' },
  ];

  const recentActivity = [
    { id: 1, action: 'Completed Lesson 1 in Introduction to JavaScript', date: '2025-05-15' },
    { id: 2, action: 'Started React for Beginners', date: '2025-05-14' },
  ];

  const progress = 65;

  return (
    <div className="dashboard-wrapper">
      <MiniDashboard/>
      <div className="dashboard-container">
        <h2 className="dashboard-title">
          Welcome, {userData.biodata.fullName || 'User'}!
        </h2>
        {error && <p className="error-message">{error}</p>}

        <div className="dashboard-grid">
          <div className="dashboard-section progress-section">
            <h3 className="section-title">Your Learning Progress</h3>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}>
                {progress}%
              </div>
            </div>
            <p className="progress-text">You're making great progress! Keep it up.</p>
          </div>

          <div className="dashboard-section recommended-courses">
            <h3 className="section-title">Recommended Courses</h3>
            <ul className="course-list">
              {recommendedCourses.map(course => (
                <li key={course.id} className="course-item">
                  <h4 className="course-title">{course.title}</h4>
                  <p className="course-description">{course.description}</p>
                  <button
                    className="course-button button"
                    onClick={() => navigate("/course/1")}
                  >
                    Start Course
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="dashboard-section upcoming-tasks">
            <h3 className="section-title">Upcoming Tasks</h3>
            <ul className="task-list">
              {userData.goalSet.length > 0 ? (
                userData.goalSet.map((goal, index) => (
                  <li key={index} className="task-item">
                    <p className="task-goal">{goal.goal}</p>
                    <p className="task-date">
                      Due: {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'No due date'}
                    </p>
                    <p className="task-priority">Priority: {goal.priority}</p>
                  </li>
                ))
              ) : (
                <p className="no-tasks">No upcoming tasks. Set some goals in your profile!</p>
              )}
            </ul>
          </div>

          <div className="dashboard-section recent-activity">
            <h3 className="section-title">Recent Activity</h3>
            <ul className="activity-list">
              {recentActivity.length > 0 ? (
                recentActivity.map(activity => (
                  <li key={activity.id} className="activity-item">
                    <p className="activity-action">{activity.action}</p>
                    <p className="activity-date">{activity.date}</p>
                  </li>
                ))
              ) : (
                <p className="no-activity">No recent activity.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;