-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "dietaryRestrictions" TEXT[] DEFAULT ARRAY[]::TEXT[];
