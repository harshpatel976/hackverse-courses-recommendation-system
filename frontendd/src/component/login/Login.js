import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './login.css';
import 'particles.js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.particlesJS.load('particles-js', 'particles.json', function () {
      console.log('callback - particles.js config loaded');
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(response.data.token);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <div id="particles-js" className="particles"></div>

      {/* Shooting Stars */}
      <div className="shootingStar star1"></div>
      <div className="shootingStar star2"></div>
      <div className="shootingStar star3"></div>

      {/* Orbiting Planets */}
      <div className="orbitContainer" style={{ top: '10%', left: '5%' }}>
        <div className="orbitRing"></div>
        <div className="planet"></div>
      </div>

      <div className="orbitContainer" style={{ top: '70%', left: '10%', width: '150px', height: '150px' }}>
        <div className="orbitRing"></div>
        <div className="planet small"></div>
      </div>

      <div className="orbitContainer" style={{ top: '20%', right: '5%', width: '180px', height: '180px' }}>
        <div className="orbitRing"></div>
        <div className="planet medium"></div>
      </div>

      <main>
        <div className="loginBox animateFade">
          <h2>Login</h2>
          {error && <p>{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="input"
            />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="input"
            />
            <button type="submit" className="button">Login</button>
          </form>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
