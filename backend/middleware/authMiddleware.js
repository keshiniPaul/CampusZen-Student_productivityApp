const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "campuszone_secret";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Token missing or invalid.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Token expired or invalid.",
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
