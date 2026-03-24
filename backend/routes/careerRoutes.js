const express = require("express");
const router = express.Router();
const { getCareers, createCareer, updateCareer, deleteCareer } = require("../controllers/careerController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Multer integration for career images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Only image formats allowed (jpeg, jpg, png, webp)"));
  }
});

// Route configurations
router.route("/")
  .get(getCareers) // Public view
  .post(protect, adminOnly, upload.single("image"), createCareer); // Admin only add

router.route("/:id")
  .put(protect, adminOnly, upload.single("image"), updateCareer) // Admin only edit
  .delete(protect, adminOnly, deleteCareer); // Admin only delete

module.exports = router;
