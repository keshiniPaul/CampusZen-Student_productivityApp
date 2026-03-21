const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
} = require("../controllers/usercontrollers");

/* ======================
Public Routes
====================== */

/* Register User */
router.post("/register", registerUser);
router.post("/register/student", registerUser);
router.post("/register/admin", registerAdmin);

/* Login User */
router.post("/login", loginUser);
router.post("/login/student", loginUser);
router.post("/login/admin", loginAdmin);

module.exports = router;
