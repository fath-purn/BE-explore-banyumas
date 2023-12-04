const router = require("express").Router();
const { upload } = require("../libs/multer");
const verifyToken = require('../libs/verifyToken');

const {
  getAllHotel,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} = require("../controllers/hotel.controller");

router.get("/", getAllHotel);
router.get("/:id", getHotelById);
router.post("/", upload.array("image"), verifyToken, createHotel);
router.put("/:id", upload.array("image"), verifyToken, updateHotel);
router.delete("/:id", verifyToken, deleteHotel);

router.post('/keterangan, ')


module.exports = router;
