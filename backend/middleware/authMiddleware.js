import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'Enter_Your_Secret_key';

/**
 * Middleware to verify JWT token and attach user ID to the request object.
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization token provided" });
    }
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Invalid token format. Use 'Bearer TOKEN'" });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error in authentication" });
  }
};

/**
 * Middleware to optionally authenticate a user.
 * If a valid JWT is present, attaches user ID and sets isAuthenticated to true.
 * Otherwise, continues without authentication.
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.isAuthenticated = false;
      return next();
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      req.isAuthenticated = false;
      return next();
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.userId;
      req.isAuthenticated = true;
    } catch (error) {
      req.isAuthenticated = false;
    }
    next();
  } catch (error) {
    req.isAuthenticated = false;
    next();
  }
};
