-- AlterTable
ALTER TABLE "Ulasan" ADD COLUMN     "makananId" INTEGER;

-- AddForeignKey
ALTER TABLE "Ulasan" ADD CONSTRAINT "Ulasan_makananId_fkey" FOREIGN KEY ("makananId") REFERENCES "MakananKhas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
