export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Katalog Produk", href: "/katalog" },
  { label: "Sertifikasi", href: "/sertifikasi" },
  { label: "Kontak", href: "/kontak" },
];
