const jwt = require('jsonwebtoken');

const JWT_SECRET = 'hostel_cms_secret_key_2024';

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const wardenOnly = (req, res, next) => {
  if (req.user.role !== 'warden') {
    return res.status(403).json({ error: 'Warden access only' });
  }
  next();
};

module.exports = { authenticate, wardenOnly, JWT_SECRET };
