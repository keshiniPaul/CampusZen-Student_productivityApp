const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized, no token provided" 
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Attach user to request
    req.user = { id: decoded.id };

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized, invalid token" 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized, token expired" 
      });
    }

    res.status(401).json({ 
      success: false, 
      message: "Not authorized" 
    });
  }
};

const adminOnly = (req, res, next) => {
  // This would check if user has admin role
  // For now, just pass through
  next();
};

module.exports = { protect, adminOnly };