const router = require("express").Router();
const { upload } = require("../libs/multer");

const {
  getAllHotel,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} = require("../controllers/hotel.controller");

router.get("/", getAllHotel);
router.get("/:id", getHotelById);
router.post("/", upload.array("image"), createHotel);
router.put("/:id", upload.array("image"), updateHotel);
router.delete("/:id", deleteHotel);

router.post('/keterangan, ')


module.exports = router;
