-- CreateTable
CREATE TABLE "CompanyProfile" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "historyIntro" TEXT NOT NULL,
    "historyBody" TEXT NOT NULL,
    "vision" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyMissionItem" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "companyProfileId" TEXT NOT NULL,

    CONSTRAINT "CompanyMissionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacilityStat" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "companyProfileId" TEXT NOT NULL,

    CONSTRAINT "FacilityStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacilityImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "companyProfileId" TEXT NOT NULL,

    CONSTRAINT "FacilityImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompanyMissionItem" ADD CONSTRAINT "CompanyMissionItem_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacilityStat" ADD CONSTRAINT "FacilityStat_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacilityImage" ADD CONSTRAINT "FacilityImage_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
