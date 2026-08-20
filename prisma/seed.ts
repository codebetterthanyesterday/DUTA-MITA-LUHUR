import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("🌱 Starting database seed for PT Duta Mitra Luhur...");

  // Clean existing catalog data in safe order
  await prisma.productImage.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 1. Seed 3 Categories
  const categoriesData = [
    {
      name: "Ribbed Smoked Sheet (RSS)",
      slug: slugify("Ribbed Smoked Sheet RSS"),
      description:
        "Lembaran karet alam yang dikeringkan melalui proses pengasapan terkontrol, diklasifikasikan berdasarkan kemurnian visual dan elastisitas.",
      sortOrder: 1,
    },
    {
      name: "Latex",
      slug: slugify("Latex"),
      description:
        "Lateks cair alami konsentrat hasil sentrifugasi dengan kandungan DRC 60% untuk industri sarung tangan medis, benang karet, dan busa.",
      sortOrder: 2,
    },
    {
      name: "Crumb Rubber (SIR)",
      slug: slugify("Crumb Rubber SIR"),
      description:
        "Standard Indonesian Rubber berbentuk blok teknis dengan kontrol ketat terhadap kadar kotoran, abu, dan ketahanan plastisitas.",
      sortOrder: 3,
    },
  ];

  const categories = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: cat,
    });
    categories.set(cat.name, created.id);
    console.log(`✓ Created Category: ${cat.name} (${created.id})`);
  }

  // 2. Seed 6 Products (2 per Category) with Specifications and Images
  const productsData = [
    // --- Category: Ribbed Smoked Sheet (RSS) ---
    {
      categoryName: "Ribbed Smoked Sheet (RSS)",
      name: "RSS 1",
      slug: slugify("RSS 1"),
      shortDescription:
        "Lembaran karet asap mutu tertinggi bebas gelembung udara, karat, dan jamur untuk manufaktur ban premium dan produk teknis khusus.",
      description:
        "Ribbed Smoked Sheet Grade 1 (RSS 1) adalah standar mutu tertinggi untuk lembaran karet alam yang diasap. Diproses dari lateks segar pilihan dengan pengasapan higienis tanpa cacat visual, noda, atau jamur. Ideal untuk komponen presisi tinggi industri otomotif dan kedirgantaraan.",
      moqValue: 19.2,
      moqUnit: "ton",
      packaging: "Bal 111.11 kg dibungkus kain goni / Palet kayu",
      specifications: [
        { label: "Kadar Kotoran (Dirt Content)", value: "≤ 0.05%", sortOrder: 1 },
        { label: "Kadar Abu (Ash Content)", value: "≤ 0.50%", sortOrder: 2 },
        { label: "Zat Menguap (Volatile Matter)", value: "≤ 0.80%", sortOrder: 3 },
        { label: "Kadar Nitrogen", value: "≤ 0.60%", sortOrder: 4 },
      ],
      image: {
        url: "/images/products/placeholder.jpg",
        altText: "Ribbed Smoked Sheet RSS 1 bal ekspor PT Duta Mitra Luhur",
        isPrimary: true,
        sortOrder: 1,
      },
    },
    {
      categoryName: "Ribbed Smoked Sheet (RSS)",
      name: "RSS 3",
      slug: slugify("RSS 3"),
      shortDescription:
        "Lembaran karet asap standar industri yang banyak digunakan pada manufaktur tapak ban, konveyor, dan alas kaki.",
      description:
        "Ribbed Smoked Sheet Grade 3 (RSS 3) merupakan grade terpopuler untuk industri manufaktur ban komersial dan vulkanisir. Memiliki elastisitas tinggi dan daya rekat polimer superior dengan toleransi visual partikel asap minor sesuai standar Green Book.",
      moqValue: 19.2,
      moqUnit: "ton",
      packaging: "Bal 111.11 kg / Palet kayu shrink-wrapped",
      specifications: [
        { label: "Kadar Kotoran (Dirt Content)", value: "≤ 0.15%", sortOrder: 1 },
        { label: "Kadar Abu (Ash Content)", value: "≤ 0.75%", sortOrder: 2 },
        { label: "Zat Menguap (Volatile Matter)", value: "≤ 0.80%", sortOrder: 3 },
        { label: "Kadar Nitrogen", value: "≤ 0.60%", sortOrder: 4 },
      ],
      image: {
        url: "/images/products/placeholder.jpg",
        altText: "Ribbed Smoked Sheet RSS 3 kemasan ekspor internasional",
        isPrimary: true,
        sortOrder: 1,
      },
    },

    // --- Category: Latex ---
    {
      categoryName: "Latex",
      name: "High Ammonia Latex 60% DRC",
      slug: slugify("High Ammonia Latex 60 DRC"),
      shortDescription:
        "Lateks cair pekat sentrifugasi dengan pengawet amonia tinggi untuk stabilitas mekanis optimal pada dipping process.",
      description:
        "High Ammonia (HA) Centrifuged Natural Rubber Latex memiliki kandungan Dry Rubber Content (DRC) minimum 60%. Diawetkan dengan amonia murni untuk menjaga stabilitas koloid jangka panjang selama pengiriman lintas benua. Sangat cocok untuk produksi sarung tangan bedah, kondom, dan kateter.",
      moqValue: 16.0,
      moqUnit: "ton",
      packaging: "Flexibag 20-24 MT / Drum baja 205 kg / IBC Tote 1000 L",
      specifications: [
        { label: "Dry Rubber Content (DRC)", value: "≥ 60.00%", sortOrder: 1 },
        { label: "Total Solids Content (TSC)", value: "≥ 61.50%", sortOrder: 2 },
        { label: "Kadar Amonia (Alkalinity)", value: "≥ 0.60%", sortOrder: 3 },
        { label: "Volatile Fatty Acid (VFA)", value: "≤ 0.05", sortOrder: 4 },
      ],
      image: {
        url: "/images/products/placeholder.jpg",
        altText: "High Ammonia Latex 60 DRC dalam kemasan drum dan flexibag",
        isPrimary: true,
        sortOrder: 1,
      },
    },
    {
      categoryName: "Latex",
      name: "Low Ammonia Latex (LATZ)",
      slug: slugify("Low Ammonia Latex LATZ"),
      shortDescription:
        "Lateks cair sentrifugasi rendah amonia dengan sistem pengawet sekunder TMTD/ZnO ramah lingkungan.",
      description:
        "Low Ammonia Latex (LATZ) dirancang untuk lini produksi yang membutuhkan emisi uap amonia rendah di area pabrik. Menggunakan kombinasi seng oksida dan TMTD untuk menjaga kestabilan tanpa menurunkan laju vulkanisasi atau kualitas elastis produk jadi.",
      moqValue: 16.0,
      moqUnit: "ton",
      packaging: "Flexibag 20-24 MT / Drum baja 205 kg",
      specifications: [
        { label: "Dry Rubber Content (DRC)", value: "≥ 60.00%", sortOrder: 1 },
        { label: "Total Solids Content (TSC)", value: "≥ 61.50%", sortOrder: 2 },
        { label: "Kadar Amonia (Alkalinity)", value: "≤ 0.29%", sortOrder: 3 },
        { label: "KOH Number", value: "≤ 0.85", sortOrder: 4 },
      ],
      image: {
        url: "/images/products/placeholder.jpg",
        altText: "Low Ammonia Latex LATZ konsentrat ekspor",
        isPrimary: true,
        sortOrder: 1,
      },
    },

    // --- Category: Crumb Rubber (SIR) ---
    {
      categoryName: "Crumb Rubber (SIR)",
      name: "SIR 20",
      slug: slugify("SIR 20"),
      shortDescription:
        "Karet blok teknis Standard Indonesian Rubber grade 20 paling populer untuk manufaktur ban dan barang teknik karet.",
      description:
        "SIR 20 (Standard Indonesian Rubber 20) adalah polimer karet bongkah yang diproses secara mekanis dengan spesifikasi terukur ketat. Menawarkan kekuatan tarik dan elastisitas tinggi dengan proses mixing yang efisien untuk produsen ban radial dunia.",
      moqValue: 20.16,
      moqUnit: "ton",
      packaging: "Bongkah 35 kg / Palet kayu shrink-wrapped 1.26 MT",
      specifications: [
        { label: "Kadar Kotoran (Dirt Content)", value: "≤ 0.20%", sortOrder: 1 },
        { label: "Kadar Abu (Ash Content)", value: "≤ 1.00%", sortOrder: 2 },
        { label: "Zat Menguap (Volatile Matter)", value: "≤ 0.80%", sortOrder: 3 },
        { label: "Plasticity Retention Index (PRI)", value: "≥ 40", sortOrder: 4 },
      ],
      image: {
        url: "/images/products/placeholder.jpg",
        altText: "Standard Indonesian Rubber SIR 20 bal ekspor",
        isPrimary: true,
        sortOrder: 1,
      },
    },
    {
      categoryName: "Crumb Rubber (SIR)",
      name: "SIR 10",
      slug: slugify("SIR 10"),
      shortDescription:
        "Karet remah teknis kadar kotoran rendah untuk aplikasi industri yang menuntut ketahanan dinamik dan keausan superior.",
      description:
        "SIR 10 (Standard Indonesian Rubber 10) memiliki batas kadar kotoran maksimum hanya 0.10% dengan Plasticity Retention Index (PRI) minimal 50. Ideal untuk produk karet rekayasa tinggi seperti engine mounting, selang hidrolik bertekanan, dan tapak ban performa tinggi.",
      moqValue: 20.16,
      moqUnit: "ton",
      packaging: "Bongkah 35 kg / Palet kayu shrink-wrapped 1.26 MT",
      specifications: [
        { label: "Kadar Kotoran (Dirt Content)", value: "≤ 0.10%", sortOrder: 1 },
        { label: "Kadar Abu (Ash Content)", value: "≤ 0.75%", sortOrder: 2 },
        { label: "Zat Menguap (Volatile Matter)", value: "≤ 0.80%", sortOrder: 3 },
        { label: "Plasticity Retention Index (PRI)", value: "≥ 50", sortOrder: 4 },
      ],
      image: {
        url: "/images/products/placeholder.jpg",
        altText: "Standard Indonesian Rubber SIR 10 low dirt grade pallet",
        isPrimary: true,
        sortOrder: 1,
      },
    },
  ];

  for (const prod of productsData) {
    const categoryId = categories.get(prod.categoryName);
    if (!categoryId) {
      throw new Error(`Category not found: ${prod.categoryName}`);
    }

    const createdProduct = await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        shortDescription: prod.shortDescription,
        description: prod.description,
        moqValue: prod.moqValue,
        moqUnit: prod.moqUnit,
        packaging: prod.packaging,
        categoryId: categoryId,
        specifications: {
          create: prod.specifications,
        },
        images: {
          create: [prod.image],
        },
      },
    });

    console.log(
      `✓ Created Product: ${createdProduct.name} [${prod.categoryName}] (${createdProduct.id})`
    );
  }

  // 3. Seed 3 Certifications
  const certificationsData = [
    {
      name: "ISO 9001:2015",
      issuingBody: "Bureau Veritas",
      description: "Sertifikasi Sistem Manajemen Mutu yang menjamin konsistensi kualitas produk, proses pengolahan yang terdokumentasi, dan fokus pada kepuasan pelanggan sesuai standar internasional.",
      logoUrl: null, // TODO: update logoUrl/certificateUrl once file upload is implemented in a later PBI
      certificateUrl: null, // TODO: update logoUrl/certificateUrl once file upload is implemented in a later PBI
      validUntil: null,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "SNI (Standar Nasional Indonesia)",
      issuingBody: "Badan Standardisasi Nasional (BSN)",
      description: "Sertifikasi kelayakan teknis yang diwajibkan untuk menjamin kualitas material karet alam yang diekspor dari Indonesia, memenuhi parameter ketat industri manufaktur lokal maupun global.",
      logoUrl: null, // TODO: update logoUrl/certificateUrl once file upload is implemented in a later PBI
      certificateUrl: null, // TODO: update logoUrl/certificateUrl once file upload is implemented in a later PBI
      validUntil: null,
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "REACH Compliance",
      issuingBody: "ECHA (European Chemicals Agency)",
      description: "Kepatuhan terhadap regulasi Uni Eropa yang memastikan produk karet alam kami diproses dan diekspor tanpa menggunakan bahan kimia berbahaya yang memengaruhi kesehatan manusia dan lingkungan.",
      logoUrl: null, // TODO: update logoUrl/certificateUrl once file upload is implemented in a later PBI
      certificateUrl: null, // TODO: update logoUrl/certificateUrl once file upload is implemented in a later PBI
      validUntil: null,
      isActive: true,
      sortOrder: 3,
    }
  ];

  for (const cert of certificationsData) {
    const existing = await prisma.certification.findFirst({
      where: { name: cert.name },
    });
    
    if (existing) {
      await prisma.certification.update({
        where: { id: existing.id },
        data: cert,
      });
      console.log(`✓ Updated Certification: ${cert.name}`);
    } else {
      await prisma.certification.create({
        data: cert,
      });
      console.log(`✓ Created Certification: ${cert.name}`);
    }
  }

  // 4. Seed Admin User (Conditionally)
  const adminEmail = process.env.ADMIN_SEED_EMAIL;
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;

  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        passwordHash,
      },
      create: {
        email: adminEmail,
        name: "Administrator",
        passwordHash,
      },
    });
    console.log(`✓ Upserted Admin User: ${adminEmail}`);
  } else {
    console.warn("⚠️  Skipped Admin seeding: ADMIN_SEED_EMAIL or ADMIN_SEED_PASSWORD not set.");
  }

  // 5. Seed RFQ Entries
  const allProducts = await prisma.product.findMany();
  const rss1 = allProducts.find(p => p.slug === "rss-1");
  const rss3 = allProducts.find(p => p.slug === "rss-3");
  const latexHA = allProducts.find(p => p.slug === "high-ammonia-latex-60-drc");
  const sir20 = allProducts.find(p => p.slug === "sir-20");

  const rfqsData = [
    {
      name: "Hans Weber",
      company: "Weber Reifen GmbH",
      country: "Germany",
      email: "hans.weber@weber-reifen.de",
      phone: "+49 89 12345678",
      quantityEstimateValue: 100,
      quantityEstimateUnit: "ton",
      message: "We are looking to source high quality RSS 1 for our premium tire manufacturing line. Please provide pricing and shipping details to Hamburg port.",
      status: "NEW" as const,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      products: { connect: rss1 ? [{ id: rss1.id }] : [] }
    },
    {
      name: "Rajesh Kumar",
      company: "Kumar Rubber Industries",
      country: "India",
      email: "purchasing@kumar-rubber.in",
      phone: "+91 98765 43210",
      quantityEstimateValue: 50,
      quantityEstimateUnit: "ton",
      message: "Interested in regular monthly shipments of SIR 20. Could you please send us the latest COA and pricing CIF Mumbai?",
      status: "IN_PROGRESS" as const,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      products: { connect: (rss3 && sir20) ? [{ id: rss3.id }, { id: sir20.id }] : [] }
    },
    {
      name: "Lee Min-ho",
      company: "Seoul Medical Supplies Corp",
      country: "South Korea",
      email: "lee.minho@seoulmed.kr",
      phone: "+82 2 123 4567",
      quantityEstimateValue: 2,
      quantityEstimateUnit: "container",
      message: "Requesting quotation for High Ammonia Latex 60% DRC for surgical glove production. We need to verify stability and VFA parameters.",
      status: "CLOSED" as const,
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      products: { connect: latexHA ? [{ id: latexHA.id }] : [] }
    },
    {
      name: "Elena Rossi",
      company: "Rossi Componenti",
      country: "Italy",
      email: "elena@rossicomponenti.it",
      phone: "+39 02 1234567",
      quantityEstimateValue: null,
      quantityEstimateUnit: null,
      message: "We are exploring new suppliers for industrial rubber components. Can you provide a general product catalog and your minimum order quantities for European shipments?",
      status: "NEW" as const,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      products: { connect: [] }
    },
    {
      name: "John Smith",
      company: "Global Polymers Ltd",
      country: "United Kingdom",
      email: "jsmith@globalpolymers.co.uk",
      phone: "+44 20 7123 4567",
      quantityEstimateValue: 200,
      quantityEstimateUnit: "MT",
      message: "Looking for long term supply contract for SIR 20. Need to know your monthly production capacity and if you hold ISO certifications.",
      status: "IN_PROGRESS" as const,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      products: { connect: sir20 ? [{ id: sir20.id }] : [] }
    }
  ];

  await prisma.rFQ.deleteMany(); // clean before seeding

  for (const rfq of rfqsData) {
    await prisma.rFQ.create({
      data: rfq,
    });
  }
  console.log(`✓ Seeded 5 RFQ entries`);

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
