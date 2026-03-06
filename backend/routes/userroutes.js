const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser
} = require("../controllers/usercontrollers");

/* ======================
Public Routes
====================== */

/* Register User */
router.post("/register", registerUser);

/* Login User */
router.post("/login", loginUser);

module.exports = router;
