const prisma = require("../libs/prisma");
const { createUlasanSchema } = require("../validations/validation");

const getAllUlasan = async (req, res, next) => {
  try {
    try {
      const ulasan = await prisma.ulasan.findMany({
        include: {
          wisata: {
            select: {
              nama: true,
            },
          },
          Hotel: {
            select: {
              nama: true,
            },
          },
        },
      });

      const filteredUlasan = ulasan.map((item) => {
        const { wisata, Hotel, ...rest } = item;
        const filteredItem = {
          ...rest,
          wisata: wisata ? wisata.nama : undefined,
          Hotel: Hotel ? Hotel.nama : undefined,
        };
        return Object.fromEntries(
          Object.entries(filteredItem).filter(
            ([_, value]) => value !== undefined
          )
        );
      });

      res.status(200).json({
        success: true,
        message: "OK",
        err: null,
        data: filteredUlasan,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Bad Request!",
        err: error.message,
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

const getUlasanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      const ulasan = await prisma.ulasan.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          wisata: {
            select: {
              nama: true,
            },
          },
          Hotel: {
            select: {
              nama: true,
            },
          },
        },
      });

      if (!ulasan) {
        return res.status(404).json({
          success: false,
          message: "Bad Request!",
          err: "Ulasan tidak ditemukan",
          data: null,
        });
      }

      const filteredUlasan = {
        ...ulasan,
        wisata: ulasan.wisata ? ulasan.wisata.nama : undefined,
        Hotel: ulasan.Hotel ? ulasan.Hotel.nama : undefined,
      };

      res.status(200).json({
        success: true,
        message: "OK",
        err: null,
        data: filteredUlasan,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Bad Request!",
        err: error.message,
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

const createUlasan = async (req, res, next) => {
  try {
    const { nama, ulasan, wisataId, hotelId } = req.body;

    try {
      await createUlasanSchema.validateAsync({
        nama,
        ulasan,
        wisataId,
        hotelId,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Bad Request!",
        err: err.message,
        data: null,
      });
    }

    const newUlasan = await prisma.ulasan.create({
      data: {
        nama,
        ulasan,
        wisataId: Number(wisataId),
        hotelId: Number(hotelId),
      },
    });
    res.status(201).json({
      success: true,
      message: "OK",
      err: null,
      data: newUlasan,
    });
  } catch (err) {
    next(err);
  }
};

const updateUlasan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama, ulasan, wisataId, hotelId } = req.body;

    try {
      const {value, error} = await createUlasanSchema.validateAsync({
        nama,
        ulasan,
        wisataId,
        hotelId,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Bad Request!",
          err: error.message,
          data: null,
        });
      }

      const getUlasan = await prisma.ulasan.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!getUlasan) {
        return res.status(404).json({
          success: false,
          message: "Bad Request!",
          err: "Ulasan tidak ditemukan",
          data: null,
        });
      }

      const updatedUlasan = await prisma.ulasan.update({
        where: {
          id: Number(id),
        },
        data: {
          nama,
          ulasan: ulasan,
          wisataId: Number(wisataId),
          hotelId: Number(hotelId),
        },
      });

      res.status(200).json({
        success: true,
        message: "OK",
        err: null,
        data: updatedUlasan,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Bad Request!",
        err: err.message,
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

const deleteUlasan = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      const deletedUlasan = await prisma.ulasan.delete({
        where: {
          id: Number(id),
        },
      });

      if (!deletedUlasan) {
        return res.status(404).json({
          success: false,
          message: "Bad Request!",
          err: "Ulasan tidak ditemukan",
          data: null,
        });
      }

      res.status(200).json({
        success: true,
        message: "Ulasan berhasil dihapus",
        err: null,
        data: null,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Bad Request!",
        err: error.message,
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUlasan,
  getUlasanById,
  createUlasan,
  updateUlasan,
  deleteUlasan,
};
