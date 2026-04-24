const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getResources,
  createResource,
  getResourceById,
  updateResource,
  deleteResource,
  incrementDownload,
} = require("../controllers/resourcecontrollers");

router.get("/", getResources);
router.get("/:resourceId", getResourceById);
router.post("/", upload.single("file"), createResource);
router.patch("/:resourceId", updateResource);
router.delete("/:resourceId", deleteResource);
router.patch("/:resourceId/download", incrementDownload);

module.exports = router;
