const router = require("express").Router();
const verifyToken = require('../libs/verifyToken');

const {
  getAllKecamatan,
  getKecamatanById,
  createKecamatan,
  updateKecamatan,
  deleteKecamatan,
  getAllKecamatanAndCountHotelOrWisata,
  getAllHotelByKecamatan,
  getAllWisataByKecamatan
} = require("../controllers/kecamatan.controller");
const {upload} = require("../libs/multer");

router.get("/", getAllKecamatanAndCountHotelOrWisata);
router.get("/hotel/:id", getAllHotelByKecamatan);
router.get("/wisata/:id", getAllWisataByKecamatan);
router.get("/:id", getKecamatanById);
router.post("/", upload.single('ads'), verifyToken, createKecamatan);
router.put("/:id", upload.single('ads'), verifyToken, updateKecamatan);
router.delete("/:id", verifyToken, deleteKecamatan);

module.exports = router;
