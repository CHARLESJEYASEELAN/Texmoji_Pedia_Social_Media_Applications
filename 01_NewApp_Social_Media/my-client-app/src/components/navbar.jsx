// Navbar.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from './tEmOjI.png'; // Adjust the path as needed D:\7th Sem\Mean Stack\01_NewApp_Social_Media\my-client-app\src\components\tEmOjI.png

const Navbar = () => {
  const [user, setUser] = useState({ username: '' });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: token },
      });
      setUser(response.data);
    };
    fetchUserProfile();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/feed">
        <img src={logo} alt="Logo" width="30" height="30" className="d-inline-block align-top" />
        Texmojipedia
      </Link>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/feed">Feed</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/profile">{user.username}</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">Logout</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
