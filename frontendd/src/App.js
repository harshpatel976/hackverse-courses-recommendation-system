import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './component/login/Login';
import Register from './component/registration/Registration';
import Profile from './component/profile/Profile';
import Header from './component/header/Header';
import { AuthProvider } from './component/context/AuthContext';
import Dashboard from './component/dashboard/Dashboard';
import Courses from './component/courses/Courses';
import Practice from './component/practise/Practice';
import Feedback from './component/feedback/Feedback';
import EnrollCourses from './component/enrollcourses/Enrollcourses';
import CoursePlayer from './component/coursesexample/Examples';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<div><Dashboard/></div>} />
          <Route path="/courses" element={<div><Courses/> </div>} />
          <Route path="/feedback" element={<div><Feedback/></div>} />
          <Route path="/enroll" element={<div><EnrollCourses/></div>} />
          <Route path="/practice" element={<div><Practice/> </div>} />
          <Route path="/course/1" element={<div><CoursePlayer/> </div>} />
          <Route path="/about" element={<div>About Us (Placeholder)</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;