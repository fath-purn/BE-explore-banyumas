const joi = require("joi");

const createHotelSchema = joi.object({
  nama: joi.string().required(),
  deskripsi: joi.string().required(),
  alamat: joi.string().required(),
  maps: joi.string().required(),
  price: joi.number().required(),
  idKecamatan: joi.number().required(),
});

const createWisataSchema = joi.object({
  nama: joi.string().required(),
  deskripsi: joi.string().required(),
  alamat: joi.string().required(),
  maps: joi.string().required(),
  price: joi.number().required(),
  idKecamatan: joi.number().required(),
  jarak: joi.number().required(),
  buka: joi.string().required(),
  tutup: joi.string().required(),
  akomodasi: joi.number().required(),
  tiket: joi.number().required(),
});

const createUlasanSchema = joi.object({
  nama: joi.string().required(),
  ulasan: joi.string().required(),
  wisataId: joi.number(),
  hotelId: joi.number(),
});

module.exports = {
  createHotelSchema,
  createWisataSchema,
  createUlasanSchema,
};
