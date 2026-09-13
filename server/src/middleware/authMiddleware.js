const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'anshika_portfolio_super_secure_jwt_secret_2025';

      // Verify token
      const decoded = jwt.verify(token, secret);

      // Fetch admin user (excluding passwordHash)
      req.admin = await Admin.findById(decoded.id).select('-passwordHash');

      if (!req.admin) {
        // Fallback for demo mock token
        if (token.startsWith('mock-jwt-token')) {
          req.admin = {
            id: 'admin-1',
            username: 'admin',
            role: 'Administrator'
          };
          return next();
        }
        return res.status(401).json({ message: 'Admin user not found' });
      }

      return next();
    } catch (error) {
      // If token is a valid mock token for testing
      if (token && token.startsWith('mock-jwt-token')) {
        req.admin = {
          id: 'admin-1',
          username: 'admin',
          role: 'Administrator'
        };
        return next();
      }
      return res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no bearer token provided' });
  }
};

module.exports = { protect };
