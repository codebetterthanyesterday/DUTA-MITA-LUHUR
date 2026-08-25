import { z } from "zod";

/**
 * Registry of every inline-editable content block on the public site.
 *
 * Each block is one row in the `ContentBlock` table (`key` -> `data` JSON). The
 * Zod schema here is the single source of truth for that JSON's shape, and the
 * `fields` list drives the generic admin form in components/admin/block-form.tsx.
 * Adding a new editable section therefore means adding one entry below — no
 * migration and no bespoke modal component.
 *
 * `defaults` must always mirror the copy that is currently live, so a page
 * renders identically before an admin has ever saved the block.
 */

// --- Form field descriptors -------------------------------------------------

type LeafFieldBase = {
  name: string;
  label: string;
  placeholder?: string;
  help?: string;
  /** Textarea height; ignored for single-line text fields. */
  rows?: number;
};

/**
 * Fields allowed inside a repeater row (no nesting beyond one level).
 *
 * Spelled as a union of single-literal `kind`s rather than one member with
 * `kind: "text" | "textarea"`, so that TypeScript can narrow `Field` away from
 * a leaf once both leaf kinds have been handled.
 */
export type LeafField =
  | (LeafFieldBase & { kind: "text" })
  | (LeafFieldBase & { kind: "textarea" });

export type Field =
  | LeafField
  | {
      kind: "list";
      name: string;
      label: string;
      placeholder?: string;
      addLabel?: string;
      help?: string;
    }
  | {
      kind: "repeater";
      name: string;
      label: string;
      itemLabel: string;
      fields: LeafField[];
      min?: number;
      max?: number;
      help?: string;
    };

export type RevalidateTarget = { path: string; type?: "page" | "layout" };

type BlockDefinition<S extends z.ZodTypeAny> = {
  /** Modal heading shown to the admin. */
  title: string;
  schema: S;
  defaults: z.infer<S>;
  fields: Field[];
  revalidate: RevalidateTarget[];
};

function defineBlock<S extends z.ZodTypeAny>(def: BlockDefinition<S>) {
  return def;
}

// --- Reusable shapes --------------------------------------------------------

const pageHeaderSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
});

const pageHeaderFields: Field[] = [
  { kind: "text", name: "eyebrow", label: "Eyebrow (teks kecil di atas judul)" },
  { kind: "text", name: "title", label: "Judul Utama" },
  { kind: "textarea", name: "subtitle", label: "Subjudul", rows: 3 },
];

const ctaSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  buttonText: z.string().min(1),
  buttonHref: z.string().min(1),
});

const ctaFields: Field[] = [
  { kind: "text", name: "eyebrow", label: "Eyebrow" },
  { kind: "text", name: "title", label: "Judul" },
  { kind: "textarea", name: "description", label: "Deskripsi", rows: 3 },
  { kind: "text", name: "buttonText", label: "Teks Tombol" },
  {
    kind: "text",
    name: "buttonHref",
    label: "Tujuan Tombol",
    placeholder: "/kontak",
    help: "Gunakan path internal seperti /kontak atau /katalog.",
  },
];

const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const seoFields: Field[] = [
  {
    kind: "text",
    name: "title",
    label: "Judul Halaman (title tag)",
    help: "Tampil di tab browser dan hasil pencarian Google. Idealnya di bawah 60 karakter.",
  },
  {
    kind: "textarea",
    name: "description",
    label: "Deskripsi Meta",
    rows: 3,
    help: "Ringkasan di hasil pencarian Google. Idealnya 120–160 karakter.",
  },
];

const HOME: RevalidateTarget[] = [{ path: "/" }];

// --- Block registry ---------------------------------------------------------

export const BLOCKS = {
  // ---------------------------------------------------------------- Beranda
  "home.hero": defineBlock({
    title: "Edit Hero Beranda",
    schema: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
      ctas: z
        .array(z.object({ label: z.string().min(1), href: z.string().min(1) }))
        .min(1)
        .max(2),
      routeLabels: z.array(z.string().min(1)).max(3),
    }),
    defaults: {
      eyebrow: "Karet alam dari Indonesia",
      title: "Karet alam Indonesia, siap masuk lini produksi Anda",
      description:
        "Kami mengolah dan mengekspor karet alam dari Surabaya. Mutunya konsisten di tiap batch, dokumen ekspornya lengkap, dan kontainer berangkat sesuai jadwal.",
      ctas: [
        { label: "Lihat Katalog", href: "/katalog" },
        { label: "Minta Penawaran", href: "/kontak" },
      ],
      routeLabels: ["Asal: Indonesia", "Pelabuhan: Tanjung Perak", "Tujuan: 12 negara"],
    },
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "textarea", name: "title", label: "Judul Utama (H1)", rows: 2 },
      { kind: "textarea", name: "description", label: "Deskripsi", rows: 3 },
      {
        kind: "repeater",
        name: "ctas",
        label: "Tombol Aksi",
        itemLabel: "Tombol",
        min: 1,
        max: 2,
        fields: [
          { kind: "text", name: "label", label: "Teks Tombol" },
          { kind: "text", name: "href", label: "Tujuan", placeholder: "/katalog" },
        ],
      },
      {
        kind: "list",
        name: "routeLabels",
        label: "Label Jalur Ekspor (grafik kanan)",
        addLabel: "+ Tambah Label",
        help: "Maksimal 3 label.",
      },
    ],
    revalidate: HOME,
  }),

  "home.trustStats": defineBlock({
    title: "Edit Statistik Beranda",
    schema: z.object({
      stats: z
        .array(z.object({ value: z.string().min(1), label: z.string().min(1) }))
        .min(1)
        .max(6),
    }),
    defaults: {
      stats: [
        { value: "150+", label: "Ton karet per bulan" },
        { value: "12", label: "Negara tujuan ekspor" },
        { value: "ISO 9001", label: "Standar mutu" },
        { value: "15+", label: "Tahun pengalaman" },
      ],
    },
    fields: [
      {
        kind: "repeater",
        name: "stats",
        label: "Statistik",
        itemLabel: "Statistik",
        min: 1,
        max: 6,
        fields: [
          { kind: "text", name: "value", label: "Angka", placeholder: "150+" },
          { kind: "text", name: "label", label: "Keterangan", placeholder: "Ton karet per bulan" },
        ],
      },
    ],
    revalidate: HOME,
  }),

  "home.whyUs": defineBlock({
    title: "Edit Bagian Kenapa Kami",
    schema: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      items: z
        .array(z.object({ title: z.string().min(1), description: z.string().min(1) }))
        .min(1)
        .max(3),
    }),
    defaults: {
      eyebrow: "Kenapa kami",
      title: "Yang bisa Anda andalkan dari kami",
      items: [
        {
          title: "Pasokan yang tidak putus",
          description:
            "Fasilitas kami mengolah dari bahan baku sampai pengemasan dalam satu alur, jadi volume untuk kontrak tahunan bisa kami penuhi tanpa jeda.",
        },
        {
          title: "Spesifikasi yang bisa dicek",
          description:
            "Setiap batch kami uji sebelum dikirim dan hasilnya kami lampirkan. Standar yang kami pakai: ASTM D2000, ISO 9001, dan Standard Indonesian Rubber (SIR).",
        },
        {
          title: "Urusan ekspor kami yang tangani",
          description:
            "Certificate of Analysis, dokumen kepabeanan, sampai jadwal kontainer kami siapkan sendiri. Anda tinggal menunggu barang sampai.",
        },
      ],
    },
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "text", name: "title", label: "Judul Bagian" },
      {
        kind: "repeater",
        name: "items",
        label: "Poin Alasan",
        itemLabel: "Alasan",
        min: 1,
        max: 3,
        help: "Ikon setiap poin mengikuti urutan dan tidak dapat diubah di sini.",
        fields: [
          { kind: "text", name: "title", label: "Judul" },
          { kind: "textarea", name: "description", label: "Deskripsi", rows: 3 },
        ],
      },
    ],
    revalidate: HOME,
  }),

  "home.featuredProducts": defineBlock({
    title: "Edit Bagian Produk Pilihan",
    schema: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
      linkText: z.string().min(1),
      limit: z.coerce.number().int().min(1).max(12),
    }),
    defaults: {
      eyebrow: "Katalog",
      title: "Produk yang paling sering dipesan",
      description:
        "Beberapa grade yang paling banyak diminta pembeli. Spesifikasi lengkapnya ada di halaman masing-masing produk.",
      linkText: "Lihat semua produk →",
      limit: 6,
    },
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "text", name: "title", label: "Judul Bagian" },
      { kind: "textarea", name: "description", label: "Deskripsi", rows: 2 },
      { kind: "text", name: "linkText", label: "Teks Tautan Bawah" },
      {
        kind: "text",
        name: "limit",
        label: "Jumlah Produk Ditampilkan",
        placeholder: "6",
        help: "Antara 1 dan 12. Produk dipilih otomatis dari katalog aktif.",
      },
    ],
    revalidate: HOME,
  }),

  "home.finalCta": defineBlock({
    title: "Edit Ajakan Penutup (Beranda)",
    schema: ctaSchema,
    defaults: {
      eyebrow: "Mulai kerja sama",
      title: "Ada kebutuhan karet yang mau dibicarakan?",
      description:
        "Sebutkan grade, volume, dan tujuan pengirimannya. Kami balas dengan spesifikasi, ketersediaan stok, dan harga FOB atau CIF.",
      buttonText: "Minta Penawaran",
      buttonHref: "/kontak",
    },
    fields: ctaFields,
    revalidate: HOME,
  }),

  // ------------------------------------------------------------ Sertifikasi
  "sertifikasi.header": defineBlock({
    title: "Edit Header Sertifikasi",
    schema: pageHeaderSchema,
    defaults: {
      eyebrow: "Sertifikasi & legalitas",
      title: "Sertifikat dan izin yang kami pegang",
      subtitle:
        "Semua dokumen di bawah ini masih aktif, dan salinannya bisa kami kirimkan kalau Anda butuh.",
    },
    fields: pageHeaderFields,
    revalidate: [{ path: "/sertifikasi" }],
  }),

  "sertifikasi.intro": defineBlock({
    title: "Edit Paragraf Pengantar",
    schema: z.object({ body: z.string().min(1) }),
    defaults: {
      body: "Buat pembeli di luar negeri, sertifikat bukan sekadar formalitas. Tanpa dokumen yang benar, barang bisa tertahan di pelabuhan dan jadwal produksi Anda ikut mundur. Karena itu kami menjaga legalitas usaha, sertifikasi mutu ISO, dan kepatuhan REACH tetap aktif dan siap diperiksa kapan saja.",
    },
    fields: [{ kind: "textarea", name: "body", label: "Paragraf Pengantar", rows: 5 }],
    revalidate: [{ path: "/sertifikasi" }],
  }),

  "sertifikasi.disclaimer": defineBlock({
    title: "Edit Catatan Legal",
    schema: z.object({ body: z.string().min(1) }),
    defaults: {
      body: "*Salinan lengkap tiap sertifikat bisa diminta saat proses penawaran berjalan. Masa berlaku sertifikat di atas diperbarui berkala oleh lembaga yang menerbitkannya.",
    },
    fields: [{ kind: "textarea", name: "body", label: "Catatan Legal", rows: 3 }],
    revalidate: [{ path: "/sertifikasi" }],
  }),

  "sertifikasi.finalCta": defineBlock({
    title: "Edit Ajakan Penutup (Sertifikasi)",
    schema: ctaSchema,
    defaults: {
      eyebrow: "Dokumen ekspor",
      title: "Butuh dokumen tertentu untuk bea cukai di negara Anda?",
      description:
        "Sebutkan saja dokumen yang diminta, misalnya Surat Keterangan Asal (SKA), phytosanitary, atau hasil uji lab independen. Kami siapkan sebelum kargo berangkat.",
      buttonText: "Tanya Soal Dokumen",
      buttonHref: "/kontak",
    },
    fields: ctaFields,
    revalidate: [{ path: "/sertifikasi" }],
  }),

  // ---------------------------------------------------------------- Katalog
  "katalog.header": defineBlock({
    title: "Edit Header Katalog",
    schema: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    }),
    defaults: {
      title: "Katalog Produk",
      description:
        "Semua grade yang kami produksi, dari Ribbed Smoked Sheet sampai Crumb Rubber. Klik salah satu untuk melihat spesifikasi teknis lengkapnya.",
    },
    fields: [
      { kind: "text", name: "title", label: "Judul Halaman" },
      { kind: "textarea", name: "description", label: "Deskripsi", rows: 4 },
    ],
    revalidate: [{ path: "/katalog" }],
  }),

  // -------------------------------------------------------------------- RFQ
  "rfq.header": defineBlock({
    title: "Edit Header RFQ",
    schema: pageHeaderSchema,
    defaults: {
      eyebrow: "Minta penawaran",
      title: "Minta Penawaran Harga",
      subtitle:
        "Isi formulir di bawah ini dengan grade dan volume yang Anda butuhkan. Kami balas dengan harga, ketersediaan stok, dan perkiraan waktu kirim.",
    },
    fields: pageHeaderFields,
    revalidate: [{ path: "/rfq" }],
  }),

  // ----------------------------------------------------------------- Kontak
  "kontak.header": defineBlock({
    title: "Edit Header Kontak",
    schema: pageHeaderSchema,
    defaults: {
      eyebrow: "Hubungi kami",
      title: "Ada yang mau ditanyakan?",
      subtitle:
        "Soal produk, kerja sama, atau hal lain, silakan kirim pesan lewat formulir atau hubungi kami langsung.",
    },
    fields: pageHeaderFields,
    revalidate: [{ path: "/kontak" }],
  }),

  // ------------------------------------------------ Informasi global (situs)
  "site.contact": defineBlock({
    title: "Edit Informasi Kontak Perusahaan",
    schema: z.object({
      companyName: z.string().min(1),
      tagline: z.string().min(1),
      addressLabel: z.string().min(1),
      addressLines: z.array(z.string().min(1)).min(1),
      addressShort: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(1),
      phoneHref: z.string().min(1),
      whatsappNumber: z
        .string()
        .regex(/^\d{8,15}$/, "Nomor WhatsApp harus berupa angka saja, diawali kode negara (contoh: 6281234567890)."),
      whatsappMessage: z.string().min(1),
      businessHoursLabel: z.string().min(1),
      businessHours: z.string().min(1),
      mapQuery: z.string().min(1),
      linkedinUrl: z.string().min(1),
      instagramUrl: z.string().min(1),
    }),
    defaults: {
      companyName: "Duta Mitra Luhur",
      tagline:
        "Mengolah dan mengekspor karet alam dari Surabaya untuk pabrik-pabrik di berbagai negara.",
      addressLabel: "Kantor Pusat",
      addressLines: [
        "Kawasan Industri Estate Raya Kav. 45",
        "Surabaya, Jawa Timur 60293",
        "Indonesia",
      ],
      addressShort: "Kawasan Industri Estate, Surabaya, Jawa Timur, Indonesia",
      email: "info@dutamitraluhur.com",
      phone: "+62 (31) 555-0199",
      phoneHref: "tel:+62315550199",
      whatsappNumber: "6281234567890",
      whatsappMessage:
        "Halo, saya mau tanya soal produk karet Duta Mitra Luhur.",
      businessHoursLabel: "Jam Operasional",
      businessHours: "Senin – Jumat, 08.00 – 17.00 WIB",
      mapQuery: "Kawasan Industri Surabaya Rungkut",
      linkedinUrl: "#",
      instagramUrl: "#",
    },
    fields: [
      { kind: "text", name: "companyName", label: "Nama Perusahaan" },
      { kind: "textarea", name: "tagline", label: "Deskripsi Singkat (footer)", rows: 3 },
      { kind: "text", name: "addressLabel", label: "Label Alamat", placeholder: "Kantor Pusat" },
      {
        kind: "list",
        name: "addressLines",
        label: "Alamat Lengkap (per baris)",
        addLabel: "+ Tambah Baris",
        help: "Tampil di halaman Kontak, satu baris per entri.",
      },
      {
        kind: "text",
        name: "addressShort",
        label: "Alamat Singkat (footer)",
        help: "Versi satu baris untuk footer.",
      },
      { kind: "text", name: "email", label: "Email" },
      { kind: "text", name: "phone", label: "Telepon (tampilan)", placeholder: "+62 (31) 555-0199" },
      {
        kind: "text",
        name: "phoneHref",
        label: "Telepon (tautan)",
        placeholder: "tel:+62315550199",
      },
      {
        kind: "text",
        name: "whatsappNumber",
        label: "Nomor WhatsApp",
        placeholder: "6281234567890",
        help: "Angka saja dengan kode negara, tanpa + atau spasi. Dipakai footer, halaman Kontak, dan tombol mengambang.",
      },
      {
        kind: "textarea",
        name: "whatsappMessage",
        label: "Pesan Awal WhatsApp",
        rows: 2,
        help: "Terisi otomatis saat pengunjung membuka chat.",
      },
      { kind: "text", name: "businessHoursLabel", label: "Label Jam Operasional" },
      {
        kind: "text",
        name: "businessHours",
        label: "Jam Operasional",
        placeholder: "Senin – Jumat, 08.00 – 17.00 WIB",
      },
      {
        kind: "text",
        name: "mapQuery",
        label: "Lokasi Peta",
        placeholder: "Kawasan Industri Surabaya Rungkut",
        help: "Alamat atau koordinat yang dicari di Google Maps pada halaman Kontak.",
      },
      { kind: "text", name: "linkedinUrl", label: "URL LinkedIn", placeholder: "#" },
      { kind: "text", name: "instagramUrl", label: "URL Instagram", placeholder: "#" },
    ],
    // Contact details render inside the shared public layout (footer + floating
    // button), so every page under it must be revalidated.
    revalidate: [{ path: "/", type: "layout" }],
  }),

  "site.footerCredentials": defineBlock({
    title: "Edit Sertifikasi & Standar (Footer)",
    schema: z.object({
      heading: z.string().min(1),
      description: z.string().min(1),
      badges: z.array(z.string().min(1)).max(8),
    }),
    defaults: {
      heading: "Sertifikasi & Standar",
      description: "Standar mutu yang kami ikuti untuk pasar ekspor.",
      badges: ["ISO 9001:2015", "SNI Standard", "ASTM D2000", "SIR 20"],
    },
    fields: [
      { kind: "text", name: "heading", label: "Judul Kolom" },
      { kind: "textarea", name: "description", label: "Deskripsi", rows: 2 },
      {
        kind: "list",
        name: "badges",
        label: "Badge Standar",
        addLabel: "+ Tambah Badge",
        help: "Maksimal 8 badge.",
      },
    ],
    revalidate: [{ path: "/", type: "layout" }],
  }),

  // -------------------------------------------------------------------- SEO
  "seo.home": defineBlock({
    title: "Edit SEO — Beranda",
    schema: seoSchema,
    defaults: {
      title: "PT Duta Mitra Luhur — Produsen & Eksportir Karet Alam Indonesia",
      description:
        "PT Duta Mitra Luhur mengolah dan mengekspor karet alam Indonesia (SIR 20, SIR 10, RSS, dan lateks pekat) untuk pabrik manufaktur di berbagai negara.",
    },
    fields: seoFields,
    revalidate: HOME,
  }),

  "seo.tentang-kami": defineBlock({
    title: "Edit SEO — Tentang Kami",
    schema: seoSchema,
    defaults: {
      title: "Tentang Kami — PT Duta Mitra Luhur",
      description:
        "Profil, sejarah, kapasitas produksi, dan negara tujuan ekspor PT Duta Mitra Luhur, produsen karet alam asal Surabaya.",
    },
    fields: seoFields,
    revalidate: [{ path: "/tentang-kami" }],
  }),

  "seo.katalog": defineBlock({
    title: "Edit SEO — Katalog",
    schema: seoSchema,
    defaults: {
      title: "Katalog Produk — PT Duta Mitra Luhur",
      description:
        "Daftar grade karet alam siap ekspor dari PT Duta Mitra Luhur, lengkap dengan spesifikasi teknis tiap produk.",
    },
    fields: seoFields,
    revalidate: [{ path: "/katalog" }],
  }),

  "seo.sertifikasi": defineBlock({
    title: "Edit SEO — Sertifikasi",
    schema: seoSchema,
    defaults: {
      title: "Sertifikasi & Legalitas — PT Duta Mitra Luhur",
      description:
        "Sertifikat mutu dan dokumen legalitas yang dipegang PT Duta Mitra Luhur untuk kebutuhan ekspor karet alam.",
    },
    fields: seoFields,
    revalidate: [{ path: "/sertifikasi" }],
  }),

  "seo.rfq": defineBlock({
    title: "Edit SEO — RFQ",
    schema: seoSchema,
    defaults: {
      title: "Minta Penawaran Harga (RFQ) — PT Duta Mitra Luhur",
      description:
        "Formulir permintaan penawaran untuk karet alam RSS, SIR, dan lateks pekat dari PT Duta Mitra Luhur.",
    },
    fields: seoFields,
    revalidate: [{ path: "/rfq" }],
  }),

  "seo.kontak": defineBlock({
    title: "Edit SEO — Kontak",
    schema: seoSchema,
    defaults: {
      title: "Hubungi Kami — PT Duta Mitra Luhur",
      description:
        "Alamat, telepon, dan email PT Duta Mitra Luhur di Surabaya. Hubungi kami untuk pertanyaan produk, informasi perusahaan, atau kerja sama ekspor.",
    },
    fields: seoFields,
    revalidate: [{ path: "/kontak" }],
  }),
} as const;

export type BlockKey = keyof typeof BLOCKS;

export type BlockData<K extends BlockKey> = z.infer<(typeof BLOCKS)[K]["schema"]>;

export function isBlockKey(key: string): key is BlockKey {
  return Object.prototype.hasOwnProperty.call(BLOCKS, key);
}

/**
 * Serialisable subset of a block definition, safe to hand to a Client
 * Component (a Zod schema is not serialisable, so it stays on the server).
 */
export type BlockFormSpec = {
  key: BlockKey;
  title: string;
  fields: Field[];
};

export function getBlockFormSpec<K extends BlockKey>(key: K): BlockFormSpec {
  return { key, title: BLOCKS[key].title, fields: BLOCKS[key].fields as Field[] };
}
