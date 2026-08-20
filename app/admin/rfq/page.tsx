import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RfqTable } from "./rfq-table";

export default async function AdminRfqPage() {
  const session = await auth();
  if (!session?.user) {
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
    <div className="p-space-6 md:p-space-10 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-4 border-b border-slate/20 pb-space-4 mb-space-6">
        <div>
          <h1 className="font-display font-medium text-display-lg text-navy-deep">
            Manajemen RFQ
          </h1>
          <p className="font-body text-body-sm text-slate mt-space-1">
            Kelola permintaan penawaran harga dari calon pembeli.
          </p>
        </div>
      </div>

      <RfqTable rfqs={rfqs} />
    </div>
  );
}
