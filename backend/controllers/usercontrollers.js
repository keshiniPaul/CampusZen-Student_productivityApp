const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/usermodels");

const SECRET_KEY = process.env.JWT_SECRET || "campuszone_secret";
const ADMIN_REGISTRATION_KEY = process.env.ADMIN_REGISTRATION_KEY || "campuszone_admin_key";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

const buildAuthPayload = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  skills: user.skills || [],
});

const createToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

const registerByRole = async (req, res, role) => {
  try {
    const { fullName, email, password, adminKey } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedName = typeof fullName === "string" ? fullName.trim() : "";

    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (normalizedName.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Full name must be at least 3 characters long",
      });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      });
    }

    if (role === "admin" && adminKey !== ADMIN_REGISTRATION_KEY) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin registration key",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      token,
      user: buildAuthPayload(user),
      message: role === "admin" ? "Admin registration successful" : "Registration successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const loginByRole = async (req, res, role) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: role === "admin" ? "This account is not an admin account" : "This account is not a student account",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      success: true,
      token,
      user: buildAuthPayload(user),
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/* ===============================
REGISTER USER
================================ */

const registerUser = async (req, res) => {
  return registerByRole(req, res, "user");
};


/* ===============================
LOGIN USER (UPDATED)
================================ */

const loginUser = async (req, res) => {
  return loginByRole(req, res, "user");
};

const registerAdmin = async (req, res) => registerByRole(req, res, "admin");
const loginAdmin = async (req, res) => loginByRole(req, res, "admin");


/* ===============================
EXPORTS
================================ */

module.exports = {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
};