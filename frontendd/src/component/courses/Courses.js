import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './courses.css';
import RecommendResults from '../context/Recommendationpart';

function Courses() {
  const [userData, setUserData] = useState({ biodata: { fullName: '' }, enrolledCourses: [] });
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [fetchedCourse, setFetchedCourse] = useState(null);
  const [playlistCourses, setPlaylistCourses] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [fetchType, setFetchType] = useState('course');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingEnrollment, setLoadingEnrollment] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    provider: '',
    lessons: [{ title: '', videoUrl: '' }],
  });

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
        setUserData(response.data || { biodata: { fullName: '' }, enrolledCourses: [] });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user data');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };

   

    fetchUserData();
   
  }, [navigate]);

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!urlInput) {
      setError('Please enter a URL');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (fetchType === 'course') {
        const response = await axios.post(
          'http://localhost:5000/api/fetch-course',
          { url: urlInput },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFetchedCourse(response.data);
      } else if (fetchType === 'playlist') {
        const response = await axios.post(
          'http://localhost:5000/api/fetch-playlist',
          { url: urlInput },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPlaylistCourses([...playlistCourses, response.data]);
      }
      setError('');
      setUrlInput('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch details');
    }
  };

  const handleEnroll = async (course) => {
    setLoadingEnrollment({ ...loadingEnrollment, [course.id]: true });
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await axios.post(
        'http://localhost:5000/api/enroll',
        {
          courseId: course.id,
          title: course.title,
          description: course.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(response.data.message);
      // Refresh user data to update enrolled courses
      const userResponse = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(userResponse.data || { biodata: { fullName: '' }, enrolledCourses: [] });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to enroll in the course');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoadingEnrollment({ ...loadingEnrollment, [course.id]: false });
    }
  };

  const handleNewCourseChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleLessonChange = (index, e) => {
    const updatedLessons = [...newCourse.lessons];
    updatedLessons[index] = { ...updatedLessons[index], [e.target.name]: e.target.value };
    setNewCourse({ ...newCourse, lessons: updatedLessons });
  };

  const addLesson = () => {
    setNewCourse({
      ...newCourse,
      lessons: [...newCourse.lessons, { title: '', videoUrl: '' }],
    });
  };

  const removeLesson = (index) => {
    const updatedLessons = newCourse.lessons.filter((_, i) => i !== index);
    setNewCourse({ ...newCourse, lessons: updatedLessons });
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/create-course',
        newCourse,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCreatedCourses([...createdCourses, response.data]);
      setNewCourse({ title: '', description: '', provider: '', lessons: [{ title: '', videoUrl: '' }] });
      setShowCreateForm(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    }
  };

  return (
    <div className="courses-container">
      <h2 className="courses-title">
        Courses for You, {userData.biodata.fullName || 'User'}!
      </h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {/* Toggle "Make New Course" Form */}
      <div className="create-course-toggle">
        <button
          className="toggle-create-button button"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Make New Course'}
        </button>
      </div>

      {/* Make New Course Form */}
      {showCreateForm && (
        <div className="create-course-form">
          <h3 className="create-form-title">Create a New Course</h3>
          <form onSubmit={handleCreateCourse}>
            <div className="form-group">
              <label htmlFor="course-title">Course Title:</label>
              <input
                type="text"
                id="course-title"
                name="title"
                value={newCourse.title}
                onChange={handleNewCourseChange}
                placeholder="Enter course title"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="course-description">Description:</label>
              <textarea
                id="course-description"
                name="description"
                value={newCourse.description}
                onChange={handleNewCourseChange}
                placeholder="Enter course description"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="course-provider">Provider:</label>
              <input
                type="text"
                id="course-provider"
                name="provider"
                value={newCourse.provider}
                onChange={handleNewCourseChange}
                placeholder="Enter provider name"
                className="form-input"
                required
              />
            </div>
            <h4 className="lessons-title">Lessons</h4>
            {newCourse.lessons.map((lesson, index) => (
              <div key={index} className="lesson-input-group">
                <div className="form-group">
                  <label htmlFor={`lesson-title-${index}`}>Lesson {index + 1} Title:</label>
                  <input
                    type="text"
                    id={`lesson-title-${index}`}
                    name="title"
                    value={lesson.title}
                    onChange={(e) => handleLessonChange(index, e)}
                    placeholder="Enter lesson title"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`lesson-videoUrl-${index}`}>Video URL:</label>
                  <input
                    type="url"
                    id={`lesson-videoUrl-${index}`}
                    name="videoUrl"
                    value={lesson.videoUrl}
                    onChange={(e) => handleLessonChange(index, e)}
                    placeholder="Enter YouTube video URL"
                    className="form-input"
                    required
                  />
                </div>
                {newCourse.lessons.length > 1 && (
                  <button
                    type="button"
                    className="remove-lesson-button button"
                    onClick={() => removeLesson(index)}
                  >
                    Remove Lesson
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-lesson-button button" onClick={addLesson}>
              Add Another Lesson
            </button>
            <button type="submit" className="create-course-button button">
              Create Course
            </button>
          </form>
        </div>
      )}

      {/* Display Playlist Courses */}
      {playlistCourses.length > 0 && (
        <div className="course-section">
          <h3 className="section-title">YouTube Playlist Courses</h3>
          {playlistCourses.map((course, index) => (
            <div key={index} className="course-item">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">{course.description}</p>
              <p className="course-provider">Provider: {course.provider}</p>
              {course.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="lesson-content">
                  <h4 className="lesson-title">{lesson.title}</h4>
                  <p className="lesson-description">{lesson.description}</p>
                  <div className="video-container">
                    <iframe
                      src={lesson.videoUrl.replace('watch?v=', 'embed/')}
                      title={lesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              ))}
              {userData.enrolledCourses.some(enrolled => enrolled.courseId === course.id) ? (
                <div className="course-actions">
                  <p className="enrolled-message">Enrolled</p>
                  <Link to="/feedback" className="feedback-link button">
                    Provide Feedback
                  </Link>
                </div>
              ) : (
                <button
                  className="enroll-button button"
                  onClick={() => handleEnroll(course)}
                  disabled={loadingEnrollment[course.id]}
                >
                  {loadingEnrollment[course.id] ? 'Enrolling...' : 'Enroll'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Fetch Course/Playlist Form */}
      <div className="fetch-course-form">
        <h3 className="fetch-form-title">Add a Course or Playlist by URL</h3>
        <form onSubmit={handleFetch}>
          <div className="form-group">
            <label htmlFor="fetch-type">Fetch Type:</label>
            <select
              id="fetch-type"
              value={fetchType}
              onChange={(e) => setFetchType(e.target.value)}
              className="fetch-type-select"
            >
              <option value="course">Single Course</option>
              <option value="playlist">YouTube Playlist</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="course-url">URL:</label>
            <input
              type="url"
              id="course-url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={
                fetchType === 'course'
                  ? 'Paste the course URL (e.g., from Coursera)'
                  : 'Paste the YouTube playlist URL'
              }
              className="url-input"
            />
          </div>
          <button type="submit" className="fetch-button button">
            Fetch {fetchType === 'course' ? 'Course' : 'Playlist'}
          </button>
        </form>
      </div>

      {/* Display Fetched Single Course */}
      {fetchedCourse && (
        <div className="course-section">
          <h3 className="section-title">{fetchedCourse.title}</h3>
          <div className="course-item">
            <p className="course-description">{fetchedCourse.description}</p>
            <p className="course-provider">Provider: {fetchedCourse.provider}</p>
            <p className="course-url">
              <a href={fetchedCourse.url} target="_blank" rel="noopener noreferrer">
                View Course Page
              </a>
            </p>
            {userData.enrolledCourses.some(enrolled => enrolled.courseId === fetchedCourse.id) ? (
              <div className="course-actions">
                <p className="enrolled-message">Enrolled</p>
                <Link to="/feedback" className="feedback-link button">
                  Provide Feedback
                </Link>
              </div>
            ) : (
              <button
                className="enroll-button button"
                onClick={() => handleEnroll(fetchedCourse)}
                disabled={loadingEnrollment[fetchedCourse.id]}
              >
                {loadingEnrollment[fetchedCourse.id] ? 'Enrolling...' : 'Enroll'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Display Created Courses */}
      {createdCourses.map((course, index) => (
        <div key={index} className="course-section">
          <h3 className="section-title">{course.title}</h3>
          <div className="course-item">
            <p className="course-description">{course.description}</p>
            <p className="course-provider">Provider: {course.provider}</p>
            {course.lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="lesson-content">
                <h4 className="lesson-title">{lesson.title}</h4>
                <div className="video-container">
                  <iframe
                    src={lesson.videoUrl.replace('watch?v=', 'embed/')}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))}
            {userData.enrolledCourses.some(enrolled => enrolled.courseId === course.id) ? (
              <div className="course-actions">
                <p className="enrolled-message">Enrolled</p>
                <Link to="/feedback" className="feedback-link button">
                  Provide Feedback
                </Link>
              </div>
            ) : (
              <button
                className="enroll-button button"
                onClick={() => handleEnroll(course)}
                disabled={loadingEnrollment[course.id]}
              >
                {loadingEnrollment[course.id] ? 'Enrolling...' : 'Enroll'}
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Display Recommended Courses */}
      <div className="course-section">
        <h3 className="section-title">Google-Recommended Courses</h3>
        {recommendedCourses.length > 0 ? (
          recommendedCourses.map(course => (
            <div key={course.id} className="course-item">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">{course.description}</p>
              <p className="course-provider">Provider: {course.provider}</p>
              {userData.enrolledCourses.some(enrolled => enrolled.courseId === course.id) ? (
                <div className="course-actions">
                  <p className="enrolled-message">Enrolled</p>
                  <Link to="/feedback" className="feedback-link button">
                    Provide Feedback
                  </Link>
                </div>
              ) : (
                <button
                  className="enroll-button button"
                  onClick={() => handleEnroll(course)}
                  disabled={loadingEnrollment[course.id]}
                >
                  {loadingEnrollment[course.id] ? 'Enrolling...' : 'Enroll'}
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="no-courses">No course recommendations available.</p>
        )}
      </div>
      <RecommendResults/>
    </div>
  );
}

export default Courses;