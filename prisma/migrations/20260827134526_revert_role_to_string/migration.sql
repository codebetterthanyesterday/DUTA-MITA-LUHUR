-- Revert Role enum + lastLogin back to pre-470a09c schema

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastLogin";

ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE TEXT USING "role"::TEXT;
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'ADMIN';

-- DropEnum
DROP TYPE "Role";
