import { StatsBand } from "@/components/shared/stats-band";

export function TrustStats() {
  // TODO: confirm exact production and export numbers with client
  const stats = [
    { value: "150+", label: "Ton produksi / bulan" },
    { value: "12", label: "Negara tujuan ekspor" },
    { value: "ISO 9001", label: "Sertifikasi kualitas" },
    { value: "15+", label: "Tahun pengalaman" },
  ];

  return <StatsBand stats={stats} />;
}

