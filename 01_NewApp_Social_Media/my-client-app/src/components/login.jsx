import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token); // Save token
        navigate('/feed'); // Redirect to feed
      } else {
        console.error('No token received');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      {/* Title and Tagline Section */}
      <div className="text-center mb-4">
        <h1 style={{ fontSize: '2.5em', color: '#333' }}>TexmojiPedia😊</h1>
        <p style={{ fontSize: '1.2em', color: '#666' }}>Share your stories with texmojis!</p>
      </div>

      {/* Login Form */}
      <div className="card p-4" style={{ width: '400px' }}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="text-center mt-3">New user? <Link to="/signup">Sign up here</Link></p>
      </div>
    </div>
  );
};

export default Login;
