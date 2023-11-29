const prisma = require("../libs/prisma");
const { getPagination } = require("../helpers/pagination");
const path = require("path");

const getAllKecamatan = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = Number(page);
    limit = Number(limit);
    try {
      const kecamatan = await prisma.kecamatan.findMany({});

      const { _count } = await prisma.kecamatan.aggregate({
        _count: true,
      });

      const pagination = getPagination(req, res, _count.id, page, limit);

      res.status(200).json({
        status: true,
        message: "Success!",
        data: { pagination, kecamatan },
      });
    } catch (err) {
      res.status(400).json({
        status: false,
        message: "Bad request!",
        err: err.message,
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

const getKecamatanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      const kecamatan = await prisma.kecamatan.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      res.status(200).json({
        status: true,
        message: "Success!",
        data: kecamatan,
      });
    } catch (err) {
      res.status(400).json({
        status: false,
        message: "Bad request!",
        err: err.message,
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

const createKecamatan = async (req, res, next) => {
  try {
    const { nama } = req.body;
    try {
      const kecamatan = await prisma.kecamatan.create({
        data: {
          nama,
        },
      });
      res.status(200).json({
        status: true,
        message: "Success create kecamatan!",
        err: null,
        data: kecamatan,
      });
    } catch (err) {
      res.status(400).json({
        status: false,
        message: "Bad request!",
        err: err.message,
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

const updateKecamatan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;
    try {
      const kecamatan = await prisma.kecamatan.update({
        where: {
          id: parseInt(id),
        },
        data: {
          nama,
        },
      });

      res.status(200).json({
        status: true,
        message: "Success update kecamatan!",
        err: null,
        data: kecamatan,
      });
    } catch (err) {
      res.status(400).json({
        status: false,
        message: "Bad request!",
        err: err.message,
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

const deleteKecamatan = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      const kecamatan = await prisma.kecamatan.delete({
        where: {
          id: parseInt(id),
        },
      });

      res.status(200).json({
        status: true,
        message: "Success delete kecamatan!",
        err: null,
        data: kecamatan,
      });
    } catch (err) {
      res.status(400).json({
        status: false,
        message: "Bad request!",
        err: err.message,
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

const getAllKecamatanAndCountHotelOrWisata = async (req, res, next) => {
  try {
    try {
      const kecamatan = await prisma.kecamatan.findMany({
        include: {
          _count: {
            select: { hotel: true, wisata: true },
          },
        },
      });

      kecamatan.map((item) => {
        item.jumlah_hotel = item._count.hotel;
        item.jumlah_wisata = item._count.wisata;
        delete item._count;
      });

      res.status(200).json({
        status: true,
        message: "OK!",
        err: null,
        data: kecamatan,
      });
    } catch (err) {
      res.status(400).json({
        status: false,
        message: "Bad request!",
        err: err.message,
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

const getAllHotelByKecamatan = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { page = 1, limit = 10 } = req.query;
    page = Number(page);
    limit = Number(limit);
    try {
      const getKecamatan = await prisma.kecamatan.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          hotel: {
            include: {
              gambar: true,
              fasilitas: true,
            },
          },
        },
      });

      if (!getKecamatan) {
        return res.status(400).json({
          status: false,
          message: "Bad request!",
          err: "Kecamatan not found!",
          data: null,
        });
      }

      // // jadikan 1 object
      const hotelObject = getKecamatan.hotel.map((h) => {
        const { gambar, fasilitas, ...rest } = h;
        const filteredItem = {
          ...rest,
          gambar: gambar.map((g) => g.url),
          fasilitas: {
            wifi: fasilitas.wifi,
            bar: fasilitas.bar,
            roomService: fasilitas.roomService,
            breakfast: fasilitas.breakfast,
            restaurant: fasilitas.restaurant,
            pool: fasilitas.pool,
            parkir: fasilitas.parkir,
            bathrom: fasilitas.bathrom,
            bedroom: fasilitas.bedroom,
          },
        };
        return Object.fromEntries(
          Object.entries(filteredItem).filter(([_, value]) => value !== undefined)
        );
      });

      const kecamatan = {
        id: getKecamatan.id,
        nama: getKecamatan.nama,
        hotel: hotelObject,
      };

      const { _count } = await prisma.hotel.aggregate({
        _count: { id: true },
      });

      const pagination = getPagination(req, res, _count.id, page, limit);

      res.status(200).json({
        status: true,
        message: "OK!",
        err: null,
        data: {pagination, kecamatan},
      });
    } catch (err) {
      res.status(400).json({
        status: false,
        message: "Bad request!",
        err: err.message,
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

const getAllWisataByKecamatan = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { page = 1, limit = 10 } = req.query;
    page = Number(page);
    limit = Number(limit);
    try {
      const getKecamatan = await prisma.kecamatan.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          wisata: {
            include: {
              gambar: true,
              keterangan: true,
            },
          },
        },
      });

      if (!getKecamatan) {
        return res.status(400).json({
          status: false,
          message: "Bad request!",
          err: "Kecamatan not found!",
          data: null,
        });
      }

      // jadikan 1 object
      const wisataObject = getKecamatan.wisata.map((w) => {
        const { gambar, keterangan, kecamatan, ...rest } = w;
        const filteredItem = {
          ...rest,
          gambar: gambar.map((g) => g.url),
          keterangan: {
            jarak: keterangan.jarak,
            buka: keterangan.buka,
            tutup: keterangan.tutup,
            akomodasi: keterangan.akomodasi,
            kolam: keterangan.kolam,
            parkir: keterangan.parkir,
            tiket: keterangan.tiket,
          },
        };
        return Object.fromEntries(
          Object.entries(filteredItem).filter(
            ([_, value]) => value !== undefined
          )
        );
      });

      const kecamatan = {
        id: getKecamatan.id,
        nama: getKecamatan.nama,
        wisata: wisataObject,
      };

      const { _count } = await prisma.wisata.aggregate({
        _count: { id: true },
      });

      const pagination = getPagination(req, res, _count.id, page, limit);

      res.status(200).json({
        status: true,
        message: "OK!",
        err: null,
        data: {pagination, kecamatan},
      });
    } catch (err) {
      res.status(400).json({
        status: false,
        message: "Bad request!",
        err: err.message,
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllKecamatan,
  getKecamatanById,
  createKecamatan,
  updateKecamatan,
  deleteKecamatan,
  getAllKecamatanAndCountHotelOrWisata,
  getAllHotelByKecamatan,
  getAllWisataByKecamatan,
};