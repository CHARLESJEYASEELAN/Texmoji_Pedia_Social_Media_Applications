import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './navbar';
import Login from './login';
import Signup from './signup';
import Feed from './feed';
import Profile from './profile'; 

// Check if the user is authenticated by seeing if a token is saved in local storage
const isAuthenticated = () => !!localStorage.getItem('token');

const App = () => (
  <Router>
    <Routes>
      {/* Default route to login */}
      <Route path="/" element={<Login />} />
      
      {/* Login route */}
      <Route path="/login" element={<Login />} />
      
      {/* Signup route */}
      <Route path="/signup" element={<Signup />} />

      {/* Protected Feed route */}
      <Route 
        path="/feed" 
        element={isAuthenticated() ? (
          <>
            <Navbar />
            <Feed />
          </>
        ) : (
          <Navigate to="/login" replace />
        )}
      />

      {/* Protected Profile route */}
      <Route 
        path="/profile" 
        element={isAuthenticated() ? (
          <>
            <Navbar />
            <Profile />
          </>
        ) : (
          <Navigate to="/login" replace />
        )}
      />
    </Routes>
  </Router>
);

export default App;
