const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({
    code: 401,
    message: 'Unauthorized'
  });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({
      code: 400,
      message: 'Invalid token'
    });
  }
};

module.exports = authenticate;