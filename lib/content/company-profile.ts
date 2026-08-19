export type CompanyProfile = {
  history: {
    intro: string;
    body: string;
  };
  vision: string;
  mission: string[];
  facilityStats: { label: string; value: string }[];
  facilityImages: { altText: string }[];
  exportCountries: string[];
};

export const companyProfile: CompanyProfile = {
  // TODO: replace this entire file's export with a database-backed fetch once PBI-17
  // (admin-managed dynamic content) is implemented. Keep the CompanyProfile type stable
  // so the page component doesn't need to change, only this file's implementation.
  history: {
    intro: "Berdiri sejak awal tahun 2000-an, PT Duta Mitra Luhur telah mengukuhkan posisinya sebagai salah satu pemain utama dalam industri pengolahan dan ekspor karet alam di Indonesia.",
    body: "Berawal dari fasilitas pengolahan skala menengah, kami terus berinovasi dan meningkatkan kapasitas produksi untuk memenuhi permintaan pasar global yang terus berkembang. Melalui dedikasi terhadap kualitas dan kepatuhan terhadap standar internasional, kami memproduksi berbagai grade karet alam unggulan, termasuk Ribbed Smoked Sheet (RSS), Crumb Rubber (Standard Indonesian Rubber / SIR), dan Centrifuged Latex.\n\nKomitmen kami tidak hanya berfokus pada kualitas produk akhir, tetapi juga pada keberlanjutan rantai pasok. Kami menjalin kemitraan erat dengan petani karet lokal, memastikan pasokan bahan baku yang konsisten sekaligus mendukung kesejahteraan komunitas petani. Dengan fasilitas produksi modern dan tim quality control yang berpengalaman, setiap pengiriman dari PT Duta Mitra Luhur dijamin memenuhi spesifikasi ketat yang disyaratkan oleh industri manufaktur dan otomotif dunia.",
  },
  vision: "Menjadi produsen dan eksportir karet alam terdepan yang diakui secara global karena kualitas, keandalan, dan komitmen terhadap keberlanjutan.",
  mission: [
    "Memproduksi karet alam bermutu tinggi (SIR, RSS, Latex) yang memenuhi standar industri internasional.",
    "Membangun hubungan jangka panjang yang saling menguntungkan dengan mitra bisnis dan pelanggan di seluruh dunia.",
    "Menerapkan praktik produksi yang ramah lingkungan dan mendukung kesejahteraan petani lokal.",
    "Terus berinovasi dalam proses pengolahan untuk meningkatkan efisiensi dan konsistensi produk.",
  ],
  facilityStats: [
    { value: "150+", label: "Ton produksi / bulan" },
    { value: "12", label: "Negara tujuan ekspor" },
    { value: "ISO 9001", label: "Sertifikasi kualitas" },
    { value: "15+", label: "Tahun pengalaman" },
  ],
  facilityImages: [
    { altText: "Area Penerimaan Bahan Baku Karet (Bokar)" },
    { altText: "Fasilitas Pengolahan Crumb Rubber (SIR)" },
    { altText: "Mesin Sentrifugasi Latex" },
    { altText: "Ruang Pengasapan Ribbed Smoked Sheet (RSS)" },
    { altText: "Laboratorium Quality Control (QC)" },
    { altText: "Gudang Penyimpanan dan Persiapan Ekspor" },
  ],
  exportCountries: [
    "Amerika Serikat",
    "Jepang",
    "Jerman",
    "Korea Selatan",
    "Tiongkok",
    "India",
    "Brasil",
    "Prancis",
    "Turki",
    "Italia",
  ],
};
