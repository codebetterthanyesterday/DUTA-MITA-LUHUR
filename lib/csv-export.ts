export type RfqExportRow = {
  createdAt: Date;
  name: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  products: string; // comma-joined or "Pertanyaan Umum"
  quantity: string; // formatted "{value} {unit}" or empty
  status: string; // "Baru", "Diproses", "Selesai"
  message: string | null;
};

function escapeCsv(value: string | null | undefined): string {
  if (value == null) return '""';
  // If value contains double quotes, commas, or newlines, wrap in double quotes
  // and double up any internal double quotes.
  const stringValue = String(value);
  if (
    stringValue.includes('"') ||
    stringValue.includes(',') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return `"${stringValue}"`;
}

export function exportRfqsToCsv(rfqs: RfqExportRow[]): void {
  const headers = [
    "Tanggal",
    "Nama",
    "Perusahaan",
    "Negara",
    "Email",
    "Telepon",
    "Produk",
    "Kuantitas",
    "Status",
    "Pesan"
  ];

  const rows = rfqs.map((rfq) => {
    return [
      escapeCsv(rfq.createdAt.toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })),
      escapeCsv(rfq.name),
      escapeCsv(rfq.company),
      escapeCsv(rfq.country),
      escapeCsv(rfq.email),
      escapeCsv(rfq.phone),
      escapeCsv(rfq.products),
      escapeCsv(rfq.quantity),
      escapeCsv(rfq.status),
      escapeCsv(rfq.message || "Tidak ada pesan tambahan")
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  
  // Create Blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", url);
  link.setAttribute("download", `rfq-export-${dateStr}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
