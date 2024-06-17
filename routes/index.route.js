const router = require("express").Router();
const prisma = require("../libs/prisma");

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to API",
  });
});

router.get("/all", async (req, res, next) => {
  try {
    try {
      const hotel = await prisma.hotel.count();
      const kecamatan = await prisma.kecamatan.count();
      const wisata = await prisma.wisata.count();
      const ulasan = await prisma.ulasan.count();

      res.status(200).json({
        status: true,
        message: "Succes!",
        err: null,
        data: { hotel, wisata, kecamatan, ulasan },
      });
    } catch (error) {
      res.status(404).json({
        status: false,
        message: "Bad request!",
        err: err.message,
        data: null,
      });
    }
  } catch (error) {
    next();
  }
});
router.use("/admin", require("./admin.route"));
router.use("/kecamatan", require("./kecamatan.route"));
router.use("/hotel", require("./hotel.route"));
router.use("/wisata", require("./wisata.route"));
router.use("/ulasan", require("./ulasan.route"));
router.use("/food", require("./food.route"));

module.exports = router;
