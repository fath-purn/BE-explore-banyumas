const router = require("express").Router();
const { upload } = require("../libs/multer");
const verifyToken = require('../libs/verifyToken');

const {
    getFoodById,
  getAllFood,
  createFood,
  updateFood,
  deleteFood,
  ongkir,
} = require("../controllers/food.controller");

router.get("/", getAllFood);
router.get("/:id", getFoodById);
router.post("/", upload.array("image"), verifyToken, createFood);
router.put("/:id", upload.array("image"), verifyToken, updateFood);
router.delete("/:id", verifyToken, deleteFood);
router.post("/ongkir", ongkir);


module.exports = router;
