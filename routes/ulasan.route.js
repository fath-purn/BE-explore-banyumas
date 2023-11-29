const router = require("express").Router();
const {upload} = require("../libs/multer");

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
router.delete("/:id", deleteUlasan);

module.exports = router;
