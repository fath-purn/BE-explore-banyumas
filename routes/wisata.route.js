const router = require("express").Router();
const { upload } = require("../libs/multer");
const verifyToken = require('../libs/verifyToken');

const {
  getAllWisata,
  getWisataById,
  createWisata,
  updateWisata,
  deleteWisata,
} = require("../controllers/wisata.controller");

router.get("/", getAllWisata);
router.get("/:id", getWisataById);
router.post("/", upload.array("image"), verifyToken, createWisata);
router.put("/:id", upload.array("image"), verifyToken, updateWisata);
router.delete("/:id", verifyToken, deleteWisata);

router.post('/keterangan, ')


module.exports = router;
