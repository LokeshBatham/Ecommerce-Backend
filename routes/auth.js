const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ email, password: hashedPassword, role });
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
      email: user.email,
      role: user.role,
      token: user.tokens });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});


module.exports = router;