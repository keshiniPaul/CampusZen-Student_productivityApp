const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "campuszone_secret";

const protect = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization || "";
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized, no token provided" 
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Attach user to request
    req.user = { 
      id: decoded.id,
      role: decoded.role,
    };

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
      message: "Not authorized. Token expired or invalid." 
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  return next();
};

const studentOnly = (req, res, next) => {
  if (req.user?.role !== "user") {
    return res.status(403).json({
      success: false,
      message: "Student access required",
    });
  }

  return next();
};

module.exports = { protect, adminOnly, studentOnly };