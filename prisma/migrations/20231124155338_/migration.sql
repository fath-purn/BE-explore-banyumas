-- CreateTable
CREATE TABLE "Kecamatan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kecamatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wisata" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "maps" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "idKecamatan" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wisata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hotel" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "maps" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "idKecamatan" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gambar" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "wisataId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hotelId" INTEGER,

    CONSTRAINT "Gambar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keterangan" (
    "id" SERIAL NOT NULL,
    "jarak" INTEGER NOT NULL,
    "buka" TEXT NOT NULL,
    "tutup" TEXT NOT NULL,
    "akomodasi" INTEGER NOT NULL,
    "kolam" BOOLEAN NOT NULL,
    "parkir" BOOLEAN NOT NULL,
    "tiket" INTEGER NOT NULL,
    "idWisata" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Keterangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fasilitas" (
    "id" SERIAL NOT NULL,
    "wifi" BOOLEAN NOT NULL,
    "bar" BOOLEAN NOT NULL,
    "roomService" BOOLEAN NOT NULL,
    "breakfast" BOOLEAN NOT NULL,
    "restaurant" BOOLEAN NOT NULL,
    "pool" BOOLEAN NOT NULL,
    "parkir" BOOLEAN NOT NULL,
    "bathrom" BOOLEAN NOT NULL,
    "bedroom" BOOLEAN NOT NULL,
    "idHotel" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fasilitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ulasan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "ulasan" TEXT NOT NULL,
    "wisataId" INTEGER,
    "hotelId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ulasan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Keterangan_idWisata_key" ON "Keterangan"("idWisata");

-- CreateIndex
CREATE UNIQUE INDEX "Fasilitas_idHotel_key" ON "Fasilitas"("idHotel");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- AddForeignKey
ALTER TABLE "Wisata" ADD CONSTRAINT "Wisata_idKecamatan_fkey" FOREIGN KEY ("idKecamatan") REFERENCES "Kecamatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_idKecamatan_fkey" FOREIGN KEY ("idKecamatan") REFERENCES "Kecamatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gambar" ADD CONSTRAINT "Gambar_wisataId_fkey" FOREIGN KEY ("wisataId") REFERENCES "Wisata"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gambar" ADD CONSTRAINT "Gambar_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keterangan" ADD CONSTRAINT "Keterangan_idWisata_fkey" FOREIGN KEY ("idWisata") REFERENCES "Wisata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fasilitas" ADD CONSTRAINT "Fasilitas_idHotel_fkey" FOREIGN KEY ("idHotel") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ulasan" ADD CONSTRAINT "Ulasan_wisataId_fkey" FOREIGN KEY ("wisataId") REFERENCES "Wisata"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ulasan" ADD CONSTRAINT "Ulasan_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
