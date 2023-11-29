const router = require("express").Router();
const { upload } = require("../libs/multer");

const {
  getAllWisata,
  getWisataById,
  createWisata,
  updateWisata,
  deleteWisata,
} = require("../controllers/wisata.controller");

router.get("/", getAllWisata);
router.get("/:id", getWisataById);
router.post("/", upload.array("image"), createWisata);
router.put("/:id", upload.array("image"), updateWisata);
router.delete("/:id", deleteWisata);

router.post('/keterangan, ')


module.exports = router;
