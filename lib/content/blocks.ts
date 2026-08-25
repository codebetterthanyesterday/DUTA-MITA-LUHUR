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
      eyebrow: "RUBBER EXPORT — TRUSTED INDUSTRIAL PARTNER",
      title: "Indonesian Natural Rubber Engineered for Global Industry",
      description:
        "PT Duta Mitra Luhur memproduksi dan mengekspor polimer karet alam berstandar internasional dengan jaminan konsistensi mutu teknis dan ketepatan logistik global.",
      ctas: [
        { label: "Lihat Katalog Produk", href: "/katalog" },
        { label: "Ajukan Penawaran", href: "/kontak" },
      ],
      routeLabels: ["Origin: Indonesia", "Hub: Port of Tanjung Perak", "Global Destinations"],
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
        { value: "150+", label: "Ton produksi / bulan" },
        { value: "12", label: "Negara tujuan ekspor" },
        { value: "ISO 9001", label: "Sertifikasi kualitas" },
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
          { kind: "text", name: "label", label: "Keterangan", placeholder: "Ton produksi / bulan" },
        ],
      },
    ],
    revalidate: HOME,
  }),

  "home.whyUs": defineBlock({
    title: "Edit Keunggulan Kompetitif",
    schema: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      items: z
        .array(z.object({ title: z.string().min(1), description: z.string().min(1) }))
        .min(1)
        .max(3),
    }),
    defaults: {
      eyebrow: "Keunggulan Kompetitif",
      title: "Mengapa Memilih Duta Mitra Luhur",
      items: [
        {
          title: "Kapasitas Pasokan Terukur",
          description:
            "Fasilitas pemrosesan terintegrasi menjamin kontinuitas volume pasokan polimer karet untuk kontrak jangka panjang pabrikan internasional.",
        },
        {
          title: "Kepatuhan Spesifikasi Teknis",
          description:
            "Pengujian parameter berkala memastikan kesesuaian ketat terhadap standar mutu ASTM D2000, ISO 9001, dan Standar Indonesian Rubber (SIR).",
        },
        {
          title: "Manajemen Logistik Ekspor",
          description:
            "Pengalaman menyeluruh dalam penerbitan Certificate of Analysis, kepatuhan kepabeanan, serta pengiriman kontainer tepat waktu ke seluruh dunia.",
        },
      ],
    },
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "text", name: "title", label: "Judul Bagian" },
      {
        kind: "repeater",
        name: "items",
        label: "Poin Keunggulan",
        itemLabel: "Keunggulan",
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
    title: "Edit Bagian Produk Unggulan",
    schema: z.object({
      eyebrow: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
      linkText: z.string().min(1),
      limit: z.coerce.number().int().min(1).max(12),
    }),
    defaults: {
      eyebrow: "Katalog Ekspor",
      title: "Produk Unggulan",
      description:
        "Spesifikasi polimer karet alam dan olahan siap ekspor dengan parameter kualitas terverifikasi.",
      linkText: "Lihat Semua Produk →",
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
    title: "Edit Ajakan Akhir (Beranda)",
    schema: ctaSchema,
    defaults: {
      eyebrow: "MULAI KEMITRAAN EKSPOR",
      title: "Siap Memenuhi Kebutuhan Pasokan Karet Industri Anda",
      description:
        "Hubungi tim perdagangan internasional kami untuk konsultasi spesifikasi teknis, alokasi kuota pengiriman, dan penawaran harga kompetitif FOB/CIF.",
      buttonText: "Ajukan Penawaran Sekarang",
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
      eyebrow: "SERTIFIKASI & LEGALITAS",
      title: "Standar Kualitas Internasional yang Terverifikasi",
      subtitle:
        "Komitmen tak kenal kompromi pada kualitas, terbukti melalui pengakuan dan sertifikasi resmi.",
    },
    fields: pageHeaderFields,
    revalidate: [{ path: "/sertifikasi" }],
  }),

  "sertifikasi.intro": defineBlock({
    title: "Edit Paragraf Pengantar",
    schema: z.object({ body: z.string().min(1) }),
    defaults: {
      body: "Kepatuhan terhadap standar internasional adalah landasan operasional kami. Kami memahami bahwa kepastian hukum, konsistensi kualitas (ISO), dan kepatuhan lingkungan (REACH) bukan sekadar dokumen—melainkan fondasi kepercayaan bagi rantai pasok industri manufaktur global Anda.",
    },
    fields: [{ kind: "textarea", name: "body", label: "Paragraf Pengantar", rows: 5 }],
    revalidate: [{ path: "/sertifikasi" }],
  }),

  "sertifikasi.disclaimer": defineBlock({
    title: "Edit Catatan Legal",
    schema: z.object({ body: z.string().min(1) }),
    defaults: {
      body: "*Dokumen sertifikasi lengkap tersedia berdasarkan permintaan selama proses inquiry. Sertifikasi yang ditampilkan di atas tunduk pada pembaruan berkala oleh badan penerbit terkait.",
    },
    fields: [{ kind: "textarea", name: "body", label: "Catatan Legal", rows: 3 }],
    revalidate: [{ path: "/sertifikasi" }],
  }),

  "sertifikasi.finalCta": defineBlock({
    title: "Edit Ajakan Akhir (Sertifikasi)",
    schema: ctaSchema,
    defaults: {
      eyebrow: "DOKUMENTASI KEPATUHAN",
      title: "Butuh Bukti Legalitas Spesifik untuk Persyaratan Impor Anda?",
      description:
        "Tim kepatuhan ekspor kami siap membantu menyediakan sertifikat origin (SKA), dokumen phytosanitary, atau hasil lab independen (COA) untuk kelancaran clearance kargo Anda.",
      buttonText: "Minta Dokumen Kepatuhan",
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
        "Eksplorasi jajaran produk karet alam unggulan kami. Dari Ribbed Smoked Sheet premium hingga Crumb Rubber berstandar internasional, kami memastikan parameter teknis yang ketat untuk setiap kebutuhan industri Anda.",
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
      eyebrow: "AJUKAN PENAWARAN",
      title: "Request for Quote (RFQ)",
      subtitle:
        "Dapatkan penawaran harga terbaik dan informasi ketersediaan stok untuk kebutuhan industri Anda.",
    },
    fields: pageHeaderFields,
    revalidate: [{ path: "/rfq" }],
  }),

  // ----------------------------------------------------------------- Kontak
  "kontak.header": defineBlock({
    title: "Edit Header Kontak",
    schema: pageHeaderSchema,
    defaults: {
      eyebrow: "HUBUNGI KAMI",
      title: "Mari Jalin Kerja Sama Jangka Panjang",
      subtitle:
        "Tim kami siap membantu menjawab pertanyaan Anda terkait operasional, kemitraan, dan layanan kami.",
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
        "Produsen dan eksportir produk karet alam dan olahan industri berkualitas tinggi dari Indonesia untuk pasar manufaktur global.",
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
        "Halo, saya ingin bertanya tentang produk karet Duta Mitra Luhur.",
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
      description: "Kepatuhan standar mutu internasional untuk pasar ekspor.",
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
      title: "DUTA Mitra LUHUR — Produsen & Eksportir Karet Alam Industri Indonesia",
      description:
        "PT Duta Mitra Luhur memproduksi dan mengekspor polimer karet alam berstandar internasional (SIR 20, SIR 10, RSS, Centrifuged Latex) untuk industri manufaktur global.",
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
        "Profil perusahaan, sejarah, kapasitas produksi, dan jangkauan ekspor PT Duta Mitra Luhur sebagai produsen karet alam terkemuka di Indonesia.",
    },
    fields: seoFields,
    revalidate: [{ path: "/tentang-kami" }],
  }),

  "seo.katalog": defineBlock({
    title: "Edit SEO — Katalog",
    schema: seoSchema,
    defaults: {
      title: "Katalog Produk | Duta Mitra Luhur",
      description:
        "Eksplorasi spesifikasi polimer karet alam dan olahan siap ekspor dengan parameter kualitas terverifikasi dari PT Duta Mitra Luhur.",
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
        "Kredensial sertifikasi dan legalitas PT Duta Mitra Luhur untuk menjamin kualitas karet alam ekspor sesuai standar internasional.",
    },
    fields: seoFields,
    revalidate: [{ path: "/sertifikasi" }],
  }),

  "seo.rfq": defineBlock({
    title: "Edit SEO — RFQ",
    schema: seoSchema,
    defaults: {
      title: "Ajukan Penawaran (RFQ) — PT Duta Mitra Luhur",
      description:
        "Formulir pengajuan Request for Quote (RFQ) untuk produk karet alam (RSS, SIR, Latex) dari PT Duta Mitra Luhur.",
    },
    fields: seoFields,
    revalidate: [{ path: "/rfq" }],
  }),

  "seo.kontak": defineBlock({
    title: "Edit SEO — Kontak",
    schema: seoSchema,
    defaults: {
      title: "Hubungi Kami — PT Duta Mita Luhur",
      description:
        "Hubungi PT Duta Mita Luhur untuk pertanyaan umum, informasi perusahaan, atau bantuan terkait ekspor karet alam. Kantor pusat kami berlokasi di Surabaya, Indonesia.",
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
