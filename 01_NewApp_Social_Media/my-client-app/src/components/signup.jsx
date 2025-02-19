import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { username, email, password });
      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token); // Save token
        navigate('/feed'); // Redirect to feed
      } else {
        console.error('No token received');
      }
    } catch (error) {
      console.error('Signup error:', error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      {/* Title and Tagline Section */}
      <div className="text-center mb-4">
        <h1 style={{ fontSize: '2.5em', color: '#333' }}>TexmojiPedia😊</h1>
        <p style={{ fontSize: '1.2em', color: '#666' }}>Join us and start sharing your texmojis!</p>
      </div>

      {/* Signup Form */}
      <div className="card p-4" style={{ width: '400px' }}>
        <h3 className="text-center mb-4">Sign Up</h3>
        <form onSubmit={handleSignup}>
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
          <div className="form-group mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
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
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
        <p className="text-center mt-3">Already registered? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
};

export default Signup;
