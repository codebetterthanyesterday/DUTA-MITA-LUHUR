-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuingBody" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logoUrl" TEXT,
    "certificateUrl" TEXT,
    "validUntil" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Certification_isActive_idx" ON "Certification"("isActive");

-- CreateIndex
CREATE INDEX "Certification_sortOrder_idx" ON "Certification"("sortOrder");
