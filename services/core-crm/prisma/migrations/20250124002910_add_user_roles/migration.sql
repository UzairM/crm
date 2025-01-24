-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MANAGER', 'AGENT', 'CLIENT', 'NONE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'NONE';
