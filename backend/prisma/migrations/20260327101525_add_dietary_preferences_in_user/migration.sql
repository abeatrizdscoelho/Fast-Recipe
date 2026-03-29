-- AlterTable
ALTER TABLE "users" ADD COLUMN     "dietaryPreferences" TEXT[] DEFAULT ARRAY[]::TEXT[];
