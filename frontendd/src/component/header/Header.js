import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './header.css'

function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
      <div>
        <h1>
          <Link to="/">ORBITAL</Link>
        </h1>
        <nav>
          {isAuthenticated ? (
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="enroll">Enroll</Link></li>
              <li><Link to="/feedback">Feedback</Link></li>
              <li><Link to="/practice">Practice</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          ) : (
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;