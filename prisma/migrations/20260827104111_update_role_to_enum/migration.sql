-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'BUYER');

-- AlterTable
ALTER TABLE "CompanyProfile" ALTER COLUMN "headerSubtitle" SET DEFAULT 'Dari kebun petani di Jawa Timur sampai kontainer yang berangkat dari Tanjung Perak, semuanya kami tangani sendiri.',
ALTER COLUMN "headerTitle" SET DEFAULT 'Kami mengolah karet alam sejak awal 2000-an';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'BUYER';

