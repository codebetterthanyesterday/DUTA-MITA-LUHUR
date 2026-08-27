import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RfqTable } from "./rfq-table";
import { PageHeader } from "@/components/admin/ui/page-header";

export default async function AdminRfqPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin");
  }

  const rfqsData = await prisma.rFQ.findMany({
    include: {
      products: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const rfqs = rfqsData.map(rfq => ({
    ...rfq,
    quantityEstimateValue: rfq.quantityEstimateValue ? Number(rfq.quantityEstimateValue) : null
  }));

  return (
    <div className="p-space-4 md:p-space-8 max-w-6xl mx-auto">
      <PageHeader
        title="RFQ"
        description="Kelola permintaan penawaran harga dari calon pembeli."
      />

      <RfqTable rfqs={rfqs} />
    </div>
  );
}
