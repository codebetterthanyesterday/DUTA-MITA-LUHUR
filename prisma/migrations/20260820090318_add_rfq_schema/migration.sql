-- CreateEnum
CREATE TYPE "RfqStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'CLOSED');

-- CreateTable
CREATE TABLE "RFQ" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "quantityEstimateValue" DECIMAL(10,2),
    "quantityEstimateUnit" TEXT,
    "message" TEXT,
    "status" "RfqStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RFQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RfqProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RfqProducts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "RFQ_status_idx" ON "RFQ"("status");

-- CreateIndex
CREATE INDEX "RFQ_createdAt_idx" ON "RFQ"("createdAt");

-- CreateIndex
CREATE INDEX "_RfqProducts_B_index" ON "_RfqProducts"("B");

-- AddForeignKey
ALTER TABLE "_RfqProducts" ADD CONSTRAINT "_RfqProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RfqProducts" ADD CONSTRAINT "_RfqProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "RFQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;
