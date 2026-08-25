-- AlterTable
ALTER TABLE "CompanyProfile" ADD COLUMN     "exportCountries" TEXT[] DEFAULT ARRAY[]::TEXT[];
