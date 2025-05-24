import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './enrollcourses.css';

function EnrollCourses() {
  const [userInfo, setUserInfo] = useState({ biodata: { fullName: '' }, enrolledCourses: [] });
  const [problem, setProblem] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const goToPage = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data || { biodata: { fullName: '' }, enrolledCourses: [] };
        setUserInfo(data);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Cannot load data';
        setProblem(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    getUserInfo();
  }, []);

  const courseList = [
    { id: '1', title: 'Learn JavaScript', description: 'Start with JavaScript basics.' },
    { id: '2', title: 'React Basics', description: 'Make your first React app.' },
    { id: '3', title: 'Python for Data', description: 'Use Python to study data.' },
  ];

  const joinCourse = async (course) => {
    try {
      const token = localStorage.getItem('token');
      const enrollResponse = await axios.post(
        'http://localhost:5000/api/enroll',
        {
          courseId: course.id,
          title: course.title,
          description: course.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Course saved in database:', enrollResponse.data);
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data || { biodata: { fullName: '' }, enrolledCourses: [] });
      console.log('Updated user info with enrolled course:', response.data);
      alert('You joined the course! It is saved in the database.');
    } catch (error) {
      console.error('Problem saving course:', error);
      alert(error.response?.data?.message || 'Cannot join the course');
    }
  };

  return (
    <div className="enroll-courses-container">
      <button
        className="back-button button"
        onClick={() => goToPage('/dashboard')}
      >
        Back to Dashboard
      </button>

      <h2 className="enroll-courses-title">
        Join Courses, {userInfo.biodata.fullName || 'User'}!
      </h2>

      {problem && <p className="error-message">{problem}</p>}

      {isLoading ? (
        <p className="loading-message">Loading courses...</p>
      ) : (
        <div className="courses-list">
          {courseList.map(course => {
            const alreadyJoined = userInfo.enrolledCourses?.some(
              enrolled => enrolled.courseId === course.id
            ) || false;
            return (
              <div key={course.id} className="course-item">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
                {alreadyJoined ? (
                  <p className="enrolled-message">Enrolled</p>
                ) : (
                  <button
                    className="enroll-button button"
                    onClick={() => joinCourse(course)}
                  >
                    Enroll
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default EnrollCourses;
