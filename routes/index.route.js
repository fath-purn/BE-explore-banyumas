const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to API",
  });
});

router.use("/admin", require("./admin.route"));
router.use("/kecamatan", require("./kecamatan.route"));
router.use("/hotel", require("./hotel.route"));
router.use("/wisata", require("./wisata.route"));
router.use("/ulasan", require("./ulasan.route"));

module.exports = router;
