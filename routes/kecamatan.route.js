const router = require("express").Router();

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
router.post("/", upload.single('ads'), createKecamatan);
router.put("/:id", upload.single('ads'), updateKecamatan);
router.delete("/:id", deleteKecamatan);

module.exports = router;
