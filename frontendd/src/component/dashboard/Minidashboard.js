import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './minidashboard.css';

function MiniDashboard() {
  const [userData, setUserData] = useState({ biodata: { fullName: '' } });
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
        setUserData(response.data || { biodata: { fullName: '' } });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user data');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchUserData();
  }, [navigate]);

  // Mock data for stats and notifications (replace with API calls if available)
  const quickStats = {
    coursesEnrolled: 3,
    hoursThisWeek: 5,
  };

  const notifications = [
    { id: 1, message: 'Complete JavaScript quiz by May 18', type: 'deadline' },
    { id: 2, message: 'New course available: Advanced React', type: 'update' },
  ];

  return (
    <div className="mini-dashboard-container">
      {error && <p className="error-message">{error}</p>}

      {/* User Snapshot */}
      <div className="mini-dashboard-section user-snapshot">
        <div className="user-avatar">👤</div>
        <h3 className="user-name">{userData.biodata.fullName || 'User'}</h3>
      </div>

      {/* Quick Stats */}
      <div className="mini-dashboard-section quick-stats">
        <h4 className="mini-section-title">Quick Stats</h4>
        <p className="stat-item">Courses Enrolled: {quickStats.coursesEnrolled}</p>
        <p className="stat-item">Hours This Week: {quickStats.hoursThisWeek}h</p>
      </div>

      {/* Notifications */}
      <div className="mini-dashboard-section notifications">
        <h4 className="mini-section-title">Notifications</h4>
        <ul className="notification-list">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <li key={notification.id} className={`notification-item ${notification.type}`}>
                <span className="notification-icon">
                  {notification.type === 'deadline' ? '⏰' : '🔔'}
                </span>
                <span className="notification-message">{notification.message}</span>
              </li>
            ))
          ) : (
            <p className="no-notifications">No notifications</p>
          )}
        </ul>
      </div>

      {/* Quick Links */}
      <div className="mini-dashboard-section quick-links">
        <h4 className="mini-section-title">Quick Links</h4>
        <button
          className="link-button button"
          onClick={() => navigate('/profile')}
        >
          Profile
        </button>
        <button
          className="link-button button"
          onClick={() => navigate('/courses')}
        >
          Courses
        </button>
        <button
          className="link-button button"
          onClick={() => navigate('/timeline')}
        >
          Timeline
        </button>
      </div>
    </div>
  );
}

export default MiniDashboard;