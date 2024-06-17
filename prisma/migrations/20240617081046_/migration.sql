-- AlterTable
ALTER TABLE "Gambar" ADD COLUMN     "makananKhasId" INTEGER;

-- CreateTable
CREATE TABLE "MakananKhas" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "idKecamatan" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MakananKhas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Gambar" ADD CONSTRAINT "Gambar_makananKhasId_fkey" FOREIGN KEY ("makananKhasId") REFERENCES "MakananKhas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MakananKhas" ADD CONSTRAINT "MakananKhas_idKecamatan_fkey" FOREIGN KEY ("idKecamatan") REFERENCES "Kecamatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
