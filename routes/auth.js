const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, role, name, contactNumber } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ email, password: hashedPassword, role, name, contactNumber });
  await user.save();
  res.send('User created');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid credentials');

    // Generate JWT
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);

    // Save the token in the user's document
    user.tokens = token;
    await user.save();

    res.status(200).send({
      token: user.tokens,
      user: {
        email: user.email,
        name: user.name, 
        contactNumber: user.contactNumber, 
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// Token Validation Route
router.post('/validate', async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify the token exists in the database
    const user = await User.findOne({ _id: decoded._id, tokens: token });
    if (!user) return res.status(401).send('Invalid token');

    res.status(200).send({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        contactNumber: user.contactNumber,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(400).send('Invalid or expired token');
  }
});


module.exports = router;