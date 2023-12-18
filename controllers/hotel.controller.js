const prisma = require("../libs/prisma");
const imagekit = require("../libs/imagekit");
const path = require("path");
const { getPagination } = require("../helpers/pagination");
const { createHotelSchema } = require("../validations/validation");

const getAllHotel = async (req, res, next) => {
  try {
    try {
      if ((req.query.page || req.query.limit) && req.query.search) {
        let { page = 1, limit = 10 } = req.query;
        page = Number(page);
        limit = Number(limit);
        const getHotel = await prisma.hotel.findMany({
          where: {
            OR: [
              {
                nama: {
                  contains: req.query.search,
                  mode: "insensitive",
                },
              },
              {
                alamat: {
                  contains: req.query.search,
                  mode: "insensitive",
                },
              },
            ],
          },
          include: {
            gambar: true,
            fasilitas: true,
            kecamatan: true,
          },
          skip: (page - 1) * limit,
          take: limit,
        });
        
        // jadikan 1 object
        const hotel = getHotel.map((h) => {
          const { gambar, fasilitas, kecamatan, ...rest } = h;
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
            kecamatan: kecamatan.nama,
          };
          return Object.fromEntries(
            Object.entries(filteredItem).filter(([_, value]) => value !== undefined)
          );
        });
  
        const { _count } = await prisma.hotel.aggregate({
          _count: { id: true },
        });
  
        const pagination = getPagination(req, res, _count.id, page, limit);
  
        return res.status(200).json({
          success: true,
          message: "OK",
          err: null,
          data: { pagination, hotel },
        });
      }

      if (req.query.page || req.query.limit) {
        let { page = 1, limit = 10 } = req.query;
        page = Number(page);
        limit = Number(limit);
        const getHotel = await prisma.hotel.findMany({
          include: {
            gambar: true,
            fasilitas: true,
            kecamatan: true,
          },
          skip: (page - 1) * limit,
          take: limit,
        });
        
        
        // jadikan 1 object
        const hotel = getHotel.map((h) => {
          const { gambar, fasilitas, kecamatan, ...rest } = h;
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
            kecamatan: kecamatan.nama,
          };
          return Object.fromEntries(
            Object.entries(filteredItem).filter(([_, value]) => value !== undefined)
          );
        });
  
        const { _count } = await prisma.hotel.aggregate({
          _count: { id: true },
        });
  
        const pagination = getPagination(req, res, _count.id, page, limit);
  
        return res.status(200).json({
          success: true,
          message: "OK",
          err: null,
          data: { pagination, hotel },
        });
      }

      if (req.query.search) {
        const { search } = req.query;
        const getHotel = await prisma.hotel.findMany({
          where: {
            OR: [
              {
                nama: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                alamat: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
          include: {
            gambar: true,
            fasilitas: true,
            kecamatan: true,
          },
        });
        
        
        // jadikan 1 object
        const hotel = getHotel.map((h) => {
          const { gambar, fasilitas, kecamatan, ...rest } = h;
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
            kecamatan: kecamatan.nama,
          };
          return Object.fromEntries(
            Object.entries(filteredItem).filter(([_, value]) => value !== undefined)
          );
        });
  
        return res.status(200).json({
          success: true,
          message: "OK",
          err: null,
          data: hotel ,
        });
      }

      const getHotel = await prisma.hotel.findMany({
        include: {
          gambar: true,
          fasilitas: true,
          kecamatan: true,
        },
      });

      // jadikan 1 object
      const hotel = getHotel.map((h) => {
        const { gambar, fasilitas, kecamatan, ...rest } = h;
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
          kecamatan: kecamatan.nama,
        };
        return Object.fromEntries(
          Object.entries(filteredItem).filter(([_, value]) => value !== undefined)
        );
      });


      return res.status(200).json({
        success: true,
        message: "OK",
        err: null,
        data: hotel,
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

const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      const hotel = await prisma.hotel.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          gambar: true,
          fasilitas: true,
          kecamatan: true,
        },
      });

      const hotelTerdekat = await prisma.kecamatan.findUnique({
        where: {
          id: hotel.idKecamatan,
        },
        include: {
          hotel: {
            include: {
              gambar: true,
            },
          },
          take: 2,
        },
      });

      // jadikan 1 object
      const hotelObject = {
        ...hotel,
        gambar: hotel.gambar.map((g) => g.url),
        fasilitas: {
          wifi: hotel.fasilitas.wifi,
          bar: hotel.fasilitas.bar,
          roomService: hotel.fasilitas.roomService,
          breakfast: hotel.fasilitas.breakfast,
          restaurant: hotel.fasilitas.restaurant,
          pool: hotel.fasilitas.pool,
          parkir: hotel.fasilitas.parkir,
          bathrom: hotel.fasilitas.bathrom,
          bedroom: hotel.fasilitas.bedroom,
        },
        kecamatan: hotel.kecamatan.nama,
      };

      const dataHotelTerdekat = hotelTerdekat.hotel.map((h) => {
        const { gambar, ...rest } = h;
        const filteredItem = {
          id: rest.id,
          nama: rest.nama,
          gambar: gambar[0].url,
        };
        return Object.fromEntries(
          Object.entries(filteredItem).filter(([_, value]) => value !== undefined)
        );
      });


      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: "Bad Request!",
          err: "Hotel tidak ditemukan",
          data: null,
        });
      }

      res.status(200).json({
        success: true,
        message: "OK",
        err: null,
        data: {hotelObject, hotelTerdekat: dataHotelTerdekat},
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

const createHotel = async (req, res, next) => {
  try {
    const {
      nama,
      deskripsi,
      alamat,
      maps,
      price,
      idKecamatan,
      wifi,
      bar,
      roomService,
      breakfast,
      restaurant,
      pool,
      parkir,
      bathrom,
      bedroom,
    } = req.body;

    try {
      createHotelSchema.validateAsync({
        nama,
        deskripsi,
        alamat,
        maps,
        price,
        idKecamatan,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Bad Request!",
        err: err.message,
        data: null,
      });
    }

    try {
      const srcRegex = /src="([^"]*)"/;
      const srcMatch = maps.match(srcRegex);

      const linkMaps = srcMatch ? srcMatch[1] : null;

      const kecamatan = await prisma.kecamatan.findUnique({
        where: {
          id: Number(idKecamatan),
        },
      });

      if (!kecamatan) {
        return res.status(404).json({
          success: false,
          message: "Bad Request!",
          err: "Kecamatan tidak ditemukan",
          data: null,
        });
      }

      // fungsi uploadFiles untuk imagekit
      const uploadFiles = async (files, idHotel, nama) => {
        try {
          const gambarPromises = files.map(async (file) => {
            let strFile = file.buffer.toString("base64");

            let { url, fileId } = await imagekit.upload({
              fileName: Date.now() + path.extname(file.originalname),
              file: strFile,
            });

            const gambar = await prisma.gambar.create({
              data: {
                idImagekit: fileId,
                nama: nama + path.extname(file.originalname),
                url,
                hotelId: idHotel,
              },
            });

            return gambar;
          });

          return Promise.all(gambarPromises);
        } catch (err) {
          throw err;
        }
      };

      // buat hotel baru
      const hotel = await prisma.hotel.create({
        data: {
          nama,
          deskripsi,
          alamat,
          maps: linkMaps,
          price: Number(price),
          idKecamatan: Number(idKecamatan),
        },
      });

      // buat Fasilitas baru
      const fasilitas = await prisma.fasilitas.create({
        data: {
          idHotel: hotel.id,
          wifi: Boolean(wifi),
          bar: Boolean(bar),
          roomService: Boolean(roomService),
          breakfast: Boolean(breakfast),
          restaurant: Boolean(restaurant),
          pool: Boolean(pool),
          parkir: Boolean(parkir),
          bathrom: Boolean(bathrom),
          bedroom: Boolean(bedroom),
        },
      });

      // panggil fungsi uploadFiles untuk imagekit
      const gambar = await uploadFiles(req.files, hotel.id, hotel.nama);

      res.status(201).json({
        success: true,
        message: "Hotel berhasil ditambahkan",
        err: null,
        data: {
          hotel,
          gambar,
          fasilitas,
        },
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

const updateHotel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nama,
      deskripsi,
      alamat,
      maps,
      price,
      idKecamatan,
      wifi,
      bar,
      roomService,
      breakfast,
      restaurant,
      pool,
      parkir,
      bathrom,
      bedroom,
    } = req.body;

    try {
      await createHotelSchema.validateAsync({
        nama,
        deskripsi,
        alamat,
        maps,
        price,
        idKecamatan,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Bad Request!",
        err: err.message,
        data: null,
      });
    }

    try {
      const srcRegex = /src="([^"]*)"/;
      const srcMatch = maps.match(srcRegex);

      const linkMaps = srcMatch ? srcMatch[1] : null;

      // cek Hotel
      const hotel = await prisma.hotel.findUnique({
        where: {
          id: Number(id),
        },
      });

      // cek gambar
      const gambarLama = await prisma.gambar.findMany({
        where: {
          hotelId: Number(id),
        },
      });

      // delete gambar di imagekit
      const deleteGambar = async (gambar) => {
        try {
          const gambarPromises = gambar.map(async (g) => {
            await imagekit.deleteFile(g.idImagekit);
          });

          return Promise.all(gambarPromises);
        } catch (err) {
          throw err;
        }
      };

      await deleteGambar(gambarLama);

      // delete gambar di database
      await prisma.gambar.deleteMany({
        where: {
          hotelId: Number(id),
        },
      });

      // fungsi uploadFiles untuk imagekit
      const uploadFiles = async (files, idHotel, nama) => {
        try {
          const gambarPromises = files.map(async (file) => {
            let strFile = file.buffer.toString("base64");

            let { url, fileId } = await imagekit.upload({
              fileName: Date.now() + path.extname(file.originalname),
              file: strFile,
            });

            const gambar = await prisma.gambar.create({
              data: {
                idImagekit: fileId,
                nama: nama + path.extname(file.originalname),
                url,
                hotelId: idHotel,
              },
            });

            return gambar;
          });

          return Promise.all(gambarPromises);
        } catch (err) {
          throw err;
        }
      };

      // buat Hotel baru
      const updateHotel = await prisma.hotel.update({
        where: {
          id: Number(id),
        },
        data: {
          nama,
          deskripsi,
          alamat,
          maps: linkMaps,
          price: Number(price),
          idKecamatan: Number(idKecamatan),
        },
      });

      // buat Fasilitas baru
      const updateFasilitas = await prisma.fasilitas.update({
        where: {
          idHotel: Number(id),
        },
        data: {
          wifi: Boolean(wifi),
          bar: Boolean(bar),
          roomService: Boolean(roomService),
          breakfast: Boolean(breakfast),
          restaurant: Boolean(restaurant),
          pool: Boolean(pool),
          parkir: Boolean(parkir),
          bathrom: Boolean(bathrom),
          bedroom: Boolean(bedroom),
        },
      });

      // panggil fungsi uploadFiles untuk imagekit
      const gambar = await uploadFiles(req.files, hotel.id, hotel.nama);

      res.status(201).json({
        success: true,
        message: "Hotel berhasil diupdate",
        err: null,
        data: {
          updateHotel,
          gambar,
          updateFasilitas,
        },
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

const deleteHotel = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      // cek hotel
      const hotel = await prisma.hotel.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: "Bad Request!",
          err: "hotel tidak ditemukan",
          data: null,
        });
      }

      // cek gambar
      const gambar = await prisma.gambar.findMany({
        where: {
          hotelId: Number(id),
        },
      });

      // delete gambar di imagekit
      const deleteGambar = async (gambar) => {
        try {
          const gambarPromises = gambar.map(async (g) => {
            await imagekit.deleteFile(g.idImagekit);
          });

          return Promise.all(gambarPromises);
        } catch (err) {
          throw err;
        }
      };

      await deleteGambar(gambar);

      // delete gambar di database
      await prisma.gambar.deleteMany({
        where: {
          hotelId: Number(id),
        },
      });

      // delete fasilitas
      await prisma.fasilitas.delete({
        where: {
          idHotel: Number(id),
        },
      });

      // delete hotel
      await prisma.hotel.delete({
        where: {
          id: Number(id),
        },
      });

      res.status(200).json({
        success: true,
        message: "Hotel berhasil dihapus",
        err: null,
        data: null,
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

module.exports = {
  getAllHotel,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};
