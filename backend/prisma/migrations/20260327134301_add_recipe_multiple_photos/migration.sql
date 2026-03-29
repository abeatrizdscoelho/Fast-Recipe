/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `recipes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "photoUrl",
ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];
