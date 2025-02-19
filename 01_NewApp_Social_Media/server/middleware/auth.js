const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the import based on your project structure

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'YOUR_SECRET_KEY'); // Replace with your secret key
    const user = await User.findById(decoded.id); // Ensure you correctly access the ID
    console.log(user);
    
    if (!user) {
      return res.status(401).send({ error: 'Invalid token.' });
    }

    req.user = user; // Attach user to request
    next(); // Proceed to next middleware
  } catch (error) {
    res.status(400).send({ error: 'Invalid token.' });
  }
};

module.exports = auth;
