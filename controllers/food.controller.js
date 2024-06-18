const prisma = require("../libs/prisma");
const imagekit = require("../libs/imagekit");
const path = require("path");
const { getPagination } = require("../helpers/pagination");
const { creatFoodSchema } = require("../validations/validation");

const getAllFood = async (req, res, next) => {
  try {
    if ((req.query.page || req.query.limit) && req.query.search) {
      let { page = 1, limit = 10 } = req.query;
      page = Number(page);
      limit = Number(limit);
      const getFood = await prisma.makananKhas.findMany({
        where: {
          OR: [
            {
              nama: {
                contains: req.query.search,
                mode: "insensitive",
              },
            },
            {
              deskripsi: {
                contains: req.query.search,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          gambar: true,
          kecamatan: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      // Gabungkan objek dan filter hanya URL gambar
      const food = getFood.map((h) => {
        const { gambar, kecamatan, ...rest } = h;
        const filteredItem = {
          ...rest,
          gambar: gambar.map((g) => g.url),
          kecamatan: kecamatan.nama,
        };
        return Object.fromEntries(
          Object.entries(filteredItem).filter(
            ([_, value]) => value !== undefined
          )
        );
      });

      const { _count } = await prisma.makananKhas.aggregate({
        _count: { id: true },
      });

      const pagination = getPagination(req, res, _count.id, page, limit);

      return res.status(200).json({
        success: true,
        message: "OK",
        err: null,
        data: { pagination, food },
      });
    }

    if (req.query.page || req.query.limit) {
      let { page = 1, limit = 10 } = req.query;
      page = Number(page);
      limit = Number(limit);
      const getFood = await prisma.makananKhas.findMany({
        include: {
          gambar: true,
          kecamatan: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      // Gabungkan objek dan filter hanya URL gambar
      const food = getFood.map((h) => {
        const { gambar, kecamatan, ...rest } = h;
        const filteredItem = {
          ...rest,
          gambar: gambar.map((g) => g.url),
          kecamatan: kecamatan.nama,
        };
        return Object.fromEntries(
          Object.entries(filteredItem).filter(
            ([_, value]) => value !== undefined
          )
        );
      });

      const { _count } = await prisma.makananKhas.aggregate({
        _count: { id: true },
      });

      const pagination = getPagination(req, res, _count.id, page, limit);

      return res.status(200).json({
        success: true,
        message: "OK",
        err: null,
        data: { pagination, food },
      });
    }

    if (req.query.search) {
      const { search } = req.query;
      const getFood = await prisma.makananKhas.findMany({
        where: {
          OR: [
            {
              nama: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              deskripsi: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          gambar: true,
          kecamatan: true,
        },
      });

      // Gabungkan objek dan filter hanya URL gambar
      const food = getFood.map((h) => {
        const { gambar, kecamatan, ...rest } = h;
        const filteredItem = {
          ...rest,
          gambar: gambar.map((g) => g.url),
          kecamatan: kecamatan.nama,
        };
        return Object.fromEntries(
          Object.entries(filteredItem).filter(
            ([_, value]) => value !== undefined
          )
        );
      });
      return res.status(200).json({
        success: true,
        message: "OK",
        err: null,
        data: food,
      });
    }

    const getFood = await prisma.makananKhas.findMany({
      include: {
        gambar: true,
        kecamatan: true,
      },
    });

    // Gabungkan objek dan filter hanya URL gambar
    const food = getFood.map((h) => {
      const { gambar, kecamatan, ...rest } = h;
      const filteredItem = {
        ...rest,
        gambar: gambar.map((g) => g.url),
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
      data: food,
    });
  } catch (err) {
    next(err);
    return res.status(400).json({
      success: false,
      message: "Bad Request!",
      err: err.message,
      data: null,
    });
  }
};

const getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const food = await prisma.makananKhas.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        gambar: true,
        kecamatan: true,
      },
    });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Bad Request!",
        err: "Makanan tidak ditemukan",
        data: null,
      });
    }

    // Transform data
    const { gambar, kecamatan, ...rest } = food;
    const transformedFood = {
      ...rest,
      gambar: gambar.map((g) => g.url), // Hanya ambil URL dari gambar
      kecamatan: kecamatan.nama, // Hanya ambil nama kecamatan
    };

    res.status(200).json({
      success: true,
      message: "OK",
      err: null,
      data: transformedFood,
    });
  } catch (err) {
    next(err);
    return res.status(400).json({
      success: false,
      message: "Bad Request!",
      err: err.message,
      data: null,
    });
  }
};

const createFood = async (req, res, next) => {
  try {
    const { value, error } = creatFoodSchema.validate(req.body);

    // Melakukan deklarasi nilai yang dikirim
    const { nama, deskripsi, harga, idKecamatan } = value;

    // Jika tidak lolos validasi maka akan error dan mengembalikan status 400
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Bad Request!",
        err: error.message,
        data: null,
      });
    }

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
    const uploadFiles = async (files, makananKhasId, nama) => {
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
              makananKhasId: makananKhasId,
            },
          });

          return gambar;
        });

        return Promise.all(gambarPromises);
      } catch (err) {
        throw err;
      }
    };

    // buat food baru
    const food = await prisma.makananKhas.create({
      data: {
        nama,
        deskripsi,
        harga: Number(harga),
        idKecamatan: Number(idKecamatan),
      },
    });

    // panggil fungsi uploadFiles untuk imagekit
    const gambar = await uploadFiles(req.files, food.id, food.nama);

    res.status(201).json({
      success: true,
      message: "Food berhasil ditambahkan",
      err: null,
      data: {
        food,
        gambar,
      },
    });
  } catch (err) {
    next(err);
    return res.status(400).json({
      success: false,
      message: "Bad Request!",
      err: err.message,
      data: null,
    });
  }
};

const updateFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value, error } = creatFoodSchema.validate(req.body);

    // Melakukan deklarasi nilai yang dikirim
    const { nama, deskripsi, harga, idKecamatan } = value;

    // Jika tidak lolos validasi maka akan error dan mengembalikan status 400
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Bad Request!",
        err: error.message,
        data: null,
      });
    }

    // Cek food
    const food = await prisma.makananKhas.findUnique({
      where: {
        id: Number(id),
      },
    });

    // cek gambar
    const gambarLama = await prisma.gambar.findMany({
      where: {
        makananKhasId: Number(id),
      },
    });

    // delete gambar di imagekit
    // const deleteGambar = async (gambar) => {
    //   try {
    //     const gambarPromises = gambar.map(async (g) => {
    //       await imagekit.deleteFile(g.idImagekit);
    //     });

    //     return Promise.all(gambarPromises);
    //   } catch (err) {
    //     throw err;
    //   }
    // };

    // await deleteGambar(gambarLama);

    // delete gambar di database
    await prisma.gambar.deleteMany({
      where: {
        makananKhasId: Number(id),
      },
    });

    // fungsi uploadFiles untuk imagekit
    const uploadFiles = async (files, makananKhasId, nama) => {
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
              makananKhasId: makananKhasId,
            },
          });

          return gambar;
        });

        return Promise.all(gambarPromises);
      } catch (err) {
        throw err;
      }
    };

    // Buat food baru
    const updateFood = await prisma.makananKhas.update({
      where: {
        id: Number(id),
      },
      data: {
        nama,
        deskripsi,
        harga: Number(harga),
        idKecamatan: Number(idKecamatan),
      },
    });

    // panggil fungsi uploadFiles untuk imagekit
    const gambar = await uploadFiles(req.files, food.id, food.nama);

    res.status(201).json({
      success: true,
      message: "Food berhasil diupdate",
      err: null,
      data: {
        updateFood,
        gambar,
      },
    });
  } catch (err) {
    next(err);
    return res.status(400).json({
      success: false,
      message: "Bad Request!",
      err: err.message,
      data: null,
    });
  }
};

const deleteFood = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      // cek food
      const food = await prisma.makananKhas.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!food) {
        return res.status(404).json({
          success: false,
          message: "Bad Request!",
          err: "Food tidak ditemukan",
          data: null,
        });
      }

      // cek gambar
      const gambar = await prisma.gambar.findMany({
        where: {
          makananKhasId: Number(id),
        },
      });

      // delete gambar di imagekit
    //   const deleteGambar = async (gambar) => {
    //     try {
    //       const gambarPromises = gambar.map(async (g) => {
    //         await imagekit.deleteFile(g.idImagekit);
    //       });

    //       return Promise.all(gambarPromises);
    //     } catch (err) {
    //       throw err;
    //     }
    //   };

    //   await deleteGambar(gambar);

      // delete gambar di database
      await prisma.gambar.deleteMany({
        where: {
          makananKhasId: Number(id),
        },
      });

      // delete food
      await prisma.makananKhas.delete({
        where: {
          id: Number(id),
        },
      });

      res.status(200).json({
        success: true,
        message: "Food berhasil dihapus",
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

// pages/api/ongkir.js

async function ongkir(req, res) {
    try {
      const { origin, destination, weight, courier } = req.body;

      const response = await fetch(`https://api.rajaongkir.com/starter/cost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: '37389add0359d4b73a8c18ced387d76e',
          origin,
          destination,
          weight,
          courier,
        }),
      });

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {
  getFoodById,
  getAllFood,
  createFood,
  updateFood,
  deleteFood,
  ongkir,
};
