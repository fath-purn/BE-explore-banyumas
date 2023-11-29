/*
  Warnings:

  - A unique constraint covering the columns `[idImagekit]` on the table `Gambar` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idImagekit` to the `Gambar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gambar" ADD COLUMN     "idImagekit" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Gambar_idImagekit_key" ON "Gambar"("idImagekit");
