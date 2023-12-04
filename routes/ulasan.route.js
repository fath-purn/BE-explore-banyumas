const router = require("express").Router();
const {upload} = require("../libs/multer");
const verifyToken = require('../libs/verifyToken');

const {
  getAllUlasan,
  getUlasanById,
  createUlasan,
  updateUlasan,
  deleteUlasan,
} = require("../controllers/ulasan.controller");

router.get("/", getAllUlasan);
router.get("/:id", getUlasanById);
router.post("/", upload.single(''), createUlasan);
router.put("/:id", upload.single(''), updateUlasan);
router.delete("/:id", verifyToken, deleteUlasan);

module.exports = router;
