"use client";

import React, { useState, useMemo, useTransition, useOptimistic } from "react";
import { RfqStatus } from "@prisma/client";
import { StatusBadge } from "@/components/admin/status-badge";
import { RfqDetailDrawer, DrawerRfq } from "@/components/admin/rfq-detail-drawer";
import { updateRfqStatus } from "./actions";
import { exportRfqsToCsv, RfqExportRow } from "@/lib/csv-export";

interface RfqTableProps {
  rfqs: DrawerRfq[];
}

export function RfqTable({ rfqs: initialRfqs }: RfqTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RfqStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null);

  // Optimistic UI for Status
  const [optimisticRfqs, addOptimisticAction] = useOptimistic(
    initialRfqs,
    (state, action: { id: string; status: RfqStatus }) => {
      return state.map((r) =>
        r.id === action.id ? { ...r, status: action.status } : r
      );
    }
  );

  const [isPending, startTransition] = useTransition();

  // Filter
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

  // Counts for tabs
  const counts = useMemo(() => {
    let all = optimisticRfqs.length;
    let newCount = 0;
    let inProgressCount = 0;
    let closedCount = 0;

    optimisticRfqs.forEach((r) => {
      if (r.status === "NEW") newCount++;
      if (r.status === "IN_PROGRESS") inProgressCount++;
      if (r.status === "CLOSED") closedCount++;
    });

    return { ALL: all, NEW: newCount, IN_PROGRESS: inProgressCount, CLOSED: closedCount };
  }, [optimisticRfqs]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRfqs.length / itemsPerPage));
  const paginatedRfqs = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredRfqs.slice(start, start + itemsPerPage);
  }, [filteredRfqs, page]);

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const handleStatusChange = (id: string, newStatus: RfqStatus) => {
    startTransition(async () => {
      addOptimisticAction({ id, status: newStatus });
      const res = await updateRfqStatus(id, newStatus);
      if (!res.success) {
        // Since useOptimistic rolls back automatically on error (if parent re-renders/throws),
        // we can just alert or log here. Real-world we'd use a toast.
        console.error("Failed to update status:", res.error);
        alert(`Gagal memperbarui status: ${res.error}`);
      }
    });
  };

  const handleExport = () => {
    const exportData: RfqExportRow[] = filteredRfqs.map(r => ({
      createdAt: r.createdAt,
      name: r.name,
      company: r.company,
      country: r.country,
      email: r.email,
      phone: r.phone,
      products: r.products.length > 0 ? r.products.map(p => p.name).join(", ") : "Pertanyaan Umum",
      quantity: r.quantityEstimateValue !== null ? `${r.quantityEstimateValue} ${r.quantityEstimateUnit}` : "",
      status: r.status === "NEW" ? "Baru" : r.status === "IN_PROGRESS" ? "Diproses" : "Selesai",
      message: r.message
    }));
    exportRfqsToCsv(exportData);
  };

  const selectedRfq = useMemo(
    () => optimisticRfqs.find((r) => r.id === selectedRfqId) || null,
    [optimisticRfqs, selectedRfqId]
  );

  return (
    <div className="space-y-space-4">
      {/* Search and Export */}
      <div className="flex flex-col sm:flex-row gap-space-4 justify-between items-start sm:items-center">
        <input
          type="text"
          placeholder="Cari nama, perusahaan, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs bg-white border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body text-body-md transition-colors outline-none"
        />
        <button
          onClick={handleExport}
          className="shrink-0 px-space-4 py-2 rounded-radius-sm border border-slate/30 text-body-sm font-medium hover:bg-slate/5 transition-colors flex items-center gap-2 text-navy-deep bg-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Ekspor CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-space-4">
        {(["ALL", "NEW", "IN_PROGRESS", "CLOSED"] as const).map((tab) => {
          const isActive = statusFilter === tab;
          const label = tab === "ALL" ? "Semua" : tab === "NEW" ? "Baru" : tab === "IN_PROGRESS" ? "Diproses" : "Selesai";
          const count = counts[tab];
          return (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-space-3 py-1.5 rounded-full text-body-sm font-medium transition-colors flex items-center gap-2 border ${
                isActive
                  ? "bg-navy-deep text-ivory border-navy-deep"
                  : "bg-white text-slate border-slate/20 hover:border-slate/40 hover:bg-slate/5"
              }`}
            >
              {label}
              <span className={`text-[11px] px-1.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-slate/10'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-radius-md shadow-card border border-slate/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-navy-base text-ivory text-body-sm font-medium">
              <tr>
                <th className="px-space-4 py-space-3">Tanggal</th>
                <th className="px-space-4 py-space-3">Klien</th>
                <th className="px-space-4 py-space-3 hidden md:table-cell">Produk</th>
                <th className="px-space-4 py-space-3 text-center w-36">Status</th>
                <th className="px-space-4 py-space-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10 text-body-md text-navy-deep">
              {paginatedRfqs.length > 0 ? (
                paginatedRfqs.map((rfq) => (
                  <tr 
                    key={rfq.id} 
                    className="hover:bg-slate/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedRfqId(rfq.id)}
                  >
                    <td className="px-space-4 py-space-3 whitespace-nowrap text-slate">
                      {rfq.createdAt.toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-space-4 py-space-3 font-medium">
                      {rfq.name}
                      <div className="text-body-sm text-slate font-normal">{rfq.company} • {rfq.country}</div>
                    </td>
                    <td className="px-space-4 py-space-3 hidden md:table-cell max-w-[200px] truncate">
                      {rfq.products.length > 0 ? (
                        rfq.products.map(p => p.name).join(", ")
                      ) : (
                        <span className="text-slate italic">Pertanyaan Umum</span>
                      )}
                    </td>
                    <td className="px-space-4 py-space-3 text-center" onClick={e => e.stopPropagation()}>
                      <div className="relative">
                        <select
                          value={rfq.status}
                          onChange={(e) => handleStatusChange(rfq.id, e.target.value as RfqStatus)}
                          disabled={isPending}
                          className="w-full appearance-none bg-transparent absolute inset-0 text-transparent cursor-pointer z-10"
                        >
                          <option value="NEW">Baru</option>
                          <option value="IN_PROGRESS">Diproses</option>
                          <option value="CLOSED">Selesai</option>
                        </select>
                        <div className="pointer-events-none relative z-0 flex justify-center">
                          <StatusBadge status={rfq.status} />
                        </div>
                      </div>
                    </td>
                    <td className="px-space-4 py-space-3 text-right">
                      <button
                        className="text-body-sm font-medium text-navy-deep hover:text-red-signal transition-colors inline-flex items-center gap-1"
                      >
                        Lihat Detail
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-space-4 py-space-8 text-center text-slate">
                    {optimisticRfqs.length === 0 
                      ? "Belum ada RFQ yang masuk."
                      : "Tidak ada RFQ yang cocok dengan pencarian dan filter Anda."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-space-4 py-space-3 border-t border-slate/10 bg-ivory/30 flex items-center justify-between">
            <span className="text-body-sm text-slate">
              Menampilkan {Math.min((page - 1) * itemsPerPage + 1, filteredRfqs.length)} - {Math.min(page * itemsPerPage, filteredRfqs.length)} dari {filteredRfqs.length}
            </span>
            <div className="flex items-center gap-space-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-radius-sm border border-slate/20 text-body-sm font-medium hover:bg-slate/5 disabled:opacity-50 transition-colors"
              >
                Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-radius-sm border border-slate/20 text-body-sm font-medium hover:bg-slate/5 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

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
