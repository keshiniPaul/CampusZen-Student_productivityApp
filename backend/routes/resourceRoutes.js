const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { 
  createResource, 
  getAllResources, 
  getResourceById, 
  updateResource, 
  deleteResource, 
  saveResource, 
  unsaveResource, 
  getSavedResources 
} = require("../controllers/resourceController");

// 1. Multer configuration (diskStorage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Local "uploads/" folder in backend
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Unique filename using timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  // Limit file size to 20MB
  limits: { fileSize: 20 * 1024 * 1024 },
  // Only allow specified file types
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt|jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only documents and images are allowed!"));
    }
  },
});

// Route configurations
router.get("/saved", protect, getSavedResources);
router.post("/save/:id", protect, saveResource);
router.delete("/save/:id", protect, unsaveResource);

router.get("/", getAllResources);
router.get("/:id", getResourceById);

// Admin can upload resource using multer
router.post("/", protect, adminOnly, upload.single("file"), createResource);
router.put("/:id", protect, adminOnly, upload.single("file"), updateResource);
router.delete("/:id", protect, adminOnly, deleteResource);

module.exports = router;
