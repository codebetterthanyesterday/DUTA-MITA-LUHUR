"use client";

import React, { useState, useMemo, useTransition, useOptimistic } from "react";
import { RfqStatus } from "@prisma/client";
import { Download, ChevronRight, Inbox, ChevronDown } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { RfqDetailDrawer, DrawerRfq } from "@/components/admin/rfq-detail-drawer";
import { SearchInput, FilterPills } from "@/components/admin/ui/toolbar";
import { Pagination } from "@/components/admin/ui/pagination";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { updateRfqStatus } from "./actions";
import { exportRfqsToCsv, RfqExportRow } from "@/lib/csv-export";

interface RfqTableProps {
  rfqs: DrawerRfq[];
}

const STATUS_LABEL: Record<RfqStatus, string> = {
  NEW: "Baru",
  IN_PROGRESS: "Diproses",
  CLOSED: "Selesai",
};

function StatusSelect({
  status,
  onChange,
  disabled,
  className = "",
}: {
  status: RfqStatus;
  onChange: (status: RfqStatus) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative inline-flex ${className}`}>
      <select
        value={status}
        onChange={(e) => onChange(e.target.value as RfqStatus)}
        disabled={disabled}
        aria-label="Ubah status RFQ"
        className="appearance-none bg-transparent absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
      >
        {(Object.keys(STATUS_LABEL) as RfqStatus[]).map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      <div className="pointer-events-none relative z-0 flex items-center gap-1">
        <StatusBadge status={status} />
        <ChevronDown className="w-3 h-3 text-slate/50" aria-hidden="true" />
      </div>
    </div>
  );
}

export function RfqTable({ rfqs: initialRfqs }: RfqTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RfqStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null);

  const [optimisticRfqs, addOptimisticAction] = useOptimistic(
    initialRfqs,
    (state, action: { id: string; status: RfqStatus }) =>
      state.map((r) => (r.id === action.id ? { ...r, status: action.status } : r))
  );

  const [isPending, startTransition] = useTransition();

  const filteredRfqs = useMemo(() => {
    return optimisticRfqs.filter((r) => {
      const s = search.toLowerCase();
      const matchSearch =
        r.name.toLowerCase().includes(s) ||
        r.company.toLowerCase().includes(s) ||
        r.email.toLowerCase().includes(s);
      const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [optimisticRfqs, search, statusFilter]);

  const counts = useMemo(() => {
    const c = { ALL: optimisticRfqs.length, NEW: 0, IN_PROGRESS: 0, CLOSED: 0 };
    optimisticRfqs.forEach((r) => {
      c[r.status]++;
    });
    return c;
  }, [optimisticRfqs]);

  const totalPages = Math.max(1, Math.ceil(filteredRfqs.length / itemsPerPage));
  const paginatedRfqs = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredRfqs.slice(start, start + itemsPerPage);
  }, [filteredRfqs, page]);

  React.useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const handleStatusChange = (id: string, newStatus: RfqStatus) => {
    startTransition(async () => {
      addOptimisticAction({ id, status: newStatus });
      const res = await updateRfqStatus(id, newStatus);
      if (!res.success) {
        console.error("Failed to update status:", res.error);
        alert(`Gagal memperbarui status: ${res.error}`);
      }
    });
  };

  const handleExport = () => {
    const exportData: RfqExportRow[] = filteredRfqs.map((r) => ({
      createdAt: r.createdAt,
      name: r.name,
      company: r.company,
      country: r.country,
      email: r.email,
      phone: r.phone,
      products: r.products.length > 0 ? r.products.map((p) => p.name).join(", ") : "Pertanyaan Umum",
      quantity: r.quantityEstimateValue !== null ? `${r.quantityEstimateValue} ${r.quantityEstimateUnit}` : "",
      status: STATUS_LABEL[r.status],
      message: r.message,
    }));
    exportRfqsToCsv(exportData);
  };

  const selectedRfq = useMemo(
    () => optimisticRfqs.find((r) => r.id === selectedRfqId) || null,
    [optimisticRfqs, selectedRfqId]
  );

  const hasFilters = search !== "" || statusFilter !== "ALL";

  return (
    <div className="space-y-space-4">
      {/* Search and export */}
      <div className="flex flex-col sm:flex-row gap-space-3 justify-between sm:items-center">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari nama, perusahaan, email..."
          className="w-full sm:max-w-xs"
        />
        <button
          onClick={handleExport}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-space-4 py-2.5 min-h-[44px] rounded-radius-md border border-border-hairline text-body-sm font-medium hover:bg-navy-deep/5 transition-colors text-navy-deep bg-white active:scale-[0.98] duration-150"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Ekspor CSV
        </button>
      </div>

      {/* Status tabs */}
      <FilterPills
        options={[
          { value: "ALL" as const, label: "Semua", count: counts.ALL },
          { value: "NEW" as const, label: "Baru", count: counts.NEW },
          { value: "IN_PROGRESS" as const, label: "Diproses", count: counts.IN_PROGRESS },
          { value: "CLOSED" as const, label: "Selesai", count: counts.CLOSED },
        ]}
        value={statusFilter}
        onChange={setStatusFilter}
      />

      {paginatedRfqs.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={optimisticRfqs.length === 0 ? "Belum ada RFQ" : "Tidak ada RFQ yang cocok"}
          description={
            optimisticRfqs.length === 0
              ? "Permintaan penawaran dari halaman publik akan muncul di sini."
              : "Coba ubah kata kunci pencarian atau filter status."
          }
        />
      ) : (
        <>
          {/* Table (md and up) */}
          <div className="hidden md:block bg-white rounded-radius-md shadow-card border border-border-hairline overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body">
                <thead className="bg-navy-deep text-ivory text-body-sm font-medium">
                  <tr>
                    <th className="px-space-4 py-space-3">Tanggal</th>
                    <th className="px-space-4 py-space-3">Klien</th>
                    <th className="px-space-4 py-space-3 hidden lg:table-cell">Produk</th>
                    <th className="px-space-4 py-space-3 text-center w-40">Status</th>
                    <th className="px-space-4 py-space-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-hairline text-body-md text-navy-deep">
                  {paginatedRfqs.map((rfq) => (
                    <tr
                      key={rfq.id}
                      className="hover:bg-ivory/60 transition-colors cursor-pointer group"
                      onClick={() => setSelectedRfqId(rfq.id)}
                    >
                      <td className="px-space-4 py-space-3 whitespace-nowrap text-slate">
                        {rfq.createdAt.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-space-4 py-space-3 font-medium">
                        {rfq.name}
                        <div className="text-body-sm text-slate font-normal">
                          {rfq.company} · {rfq.country}
                        </div>
                      </td>
                      <td className="px-space-4 py-space-3 hidden lg:table-cell max-w-[220px] truncate text-slate">
                        {rfq.products.length > 0 ? (
                          rfq.products.map((p) => p.name).join(", ")
                        ) : (
                          <span className="italic">Pertanyaan Umum</span>
                        )}
                      </td>
                      <td className="px-space-4 py-space-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <StatusSelect
                          status={rfq.status}
                          onChange={(status) => handleStatusChange(rfq.id, status)}
                          disabled={isPending}
                          className="justify-center"
                        />
                      </td>
                      <td className="px-space-4 py-space-3 text-right">
                        <span className="inline-flex items-center gap-1 text-body-sm font-medium text-slate group-hover:text-red-signal transition-colors">
                          Lihat
                          <ChevronRight className="w-4 h-4" aria-hidden="true" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card list (below md) */}
          <div className="md:hidden space-y-space-3">
            {paginatedRfqs.map((rfq) => (
              <div
                key={rfq.id}
                className="bg-white rounded-radius-md shadow-card border border-border-hairline p-space-4 space-y-space-3 cursor-pointer active:scale-[0.99] transition-transform"
                onClick={() => setSelectedRfqId(rfq.id)}
              >
                <div className="flex justify-between items-start gap-space-2">
                  <div className="min-w-0">
                    <h3 className="font-medium text-navy-deep truncate">{rfq.name}</h3>
                    <div className="text-body-sm text-slate truncate">
                      {rfq.company} · {rfq.country}
                    </div>
                  </div>
                  <div className="text-caption text-slate shrink-0 pt-1">
                    {rfq.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-space-2 pt-space-2 border-t border-border-hairline">
                  <span className="text-body-sm text-slate truncate max-w-[55%]">
                    {rfq.products.length > 0 ? (
                      rfq.products.map((p) => p.name).join(", ")
                    ) : (
                      <span className="italic">Pertanyaan Umum</span>
                    )}
                  </span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <StatusSelect
                      status={rfq.status}
                      onChange={(status) => handleStatusChange(rfq.id, status)}
                      disabled={isPending}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={filteredRfqs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
          />
        </>
      )}

      <RfqDetailDrawer
        isOpen={selectedRfqId !== null}
        onClose={() => setSelectedRfqId(null)}
        rfq={selectedRfq}
        onStatusChange={handleStatusChange}
        isPending={isPending}
      />
    </div>
  );
}
