const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify token middleware
const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send({
    code: 401,
    message: 'Access denied. No token provided.',
  });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token matches the one stored in the user's document
    const user = await User.findById(decoded._id);
    if (!user || user.tokens !== token) {
      return res.status(401).send({
        code: 401,
        message: 'Invalid token',
      });
    }

    req.user = decoded; // Attach user data to the request object
    next();
  } catch (err) {
    res.status(400).send({
      code: 400,
      message: 'Invalid token',
    });
  }
};


// Verify admin middleware
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access forbidden: Admins only' });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };
