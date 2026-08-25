import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { getAdminSlug } from "@/lib/admin-routes";
import {
  getActionItems,
  getCatalogHealth,
  getContentCompleteness,
  getKpis,
  getRecentActivity,
  getRfqPipeline,
  getRfqTrend,
  getTopCountries,
  getTopProducts,
} from "@/lib/admin/dashboard-data";
import { ColumnChart, PipelineBar, RankedBars } from "@/components/admin/dashboard/charts";
import {
  ActionQueue,
  ActivityFeed,
  ContentCompleteness,
  HealthList,
  Panel,
  PanelSkeleton,
  StatTile,
} from "@/components/admin/dashboard/panels";

/**
 * Admin dashboard.
 *
 * Composed action-first: the queue of things needing a human decision comes
 * before any analytics, because at this site's volume that is the part with
 * real signal. Each section streams under its own <Suspense> so a slow
 * aggregate never delays the queue.
 */

function formatHours(hours: number | null): string {
  if (hours === null) return "—";
  if (hours < 1) return `${Math.round(hours * 60)} mnt`;
  if (hours < 48) return `${hours.toFixed(1)} jam`;
  return `${(hours / 24).toFixed(1)} hari`;
}

async function ActionSection({ adminSlug }: { adminSlug: string }) {
  const items = await getActionItems(adminSlug);
  return <ActionQueue items={items} />;
}

async function KpiSection() {
  const kpis = await getKpis();
  const delta = kpis.rfqThisMonth - kpis.rfqLastMonth;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-3">
      <StatTile
        label="RFQ bulan ini"
        value={String(kpis.rfqThisMonth)}
        delta={delta}
        deltaLabel="dibanding bulan lalu"
        hint={`Bulan lalu: ${kpis.rfqLastMonth}`}
        sparkline={kpis.sparkline}
      />
      <StatTile
        label="Median waktu respons"
        value={formatHours(kpis.medianResponseHours)}
        hint={
          kpis.medianResponseHours === null
            ? "Belum ada RFQ yang diproses"
            : "Dari masuk hingga status berubah"
        }
      />
      <StatTile
        label="Produk aktif"
        value={String(kpis.activeProducts)}
        hint={`Dari total ${kpis.totalProducts} produk`}
      />
      <StatTile
        label="Negara terjangkau"
        value={String(kpis.countriesReached)}
        hint="Berdasarkan asal RFQ yang masuk"
      />
    </div>
  );
}

async function TrendSection() {
  const trend = await getRfqTrend(12);
  return (
    <ColumnChart
      data={trend.map((point) => ({ label: point.label, count: point.count }))}
      ariaLabel="Jumlah RFQ per minggu selama 12 minggu terakhir"
      valueSuffix="RFQ"
    />
  );
}

async function PipelineSection() {
  const stages = await getRfqPipeline();
  return <PipelineBar stages={stages.map((s) => ({ label: s.label, count: s.count }))} />;
}

async function TopProductsSection() {
  const products = await getTopProducts();
  return (
    <RankedBars
      items={products}
      ariaLabel="Produk yang paling sering diminta dalam RFQ"
      emptyMessage="Belum ada RFQ yang menyebutkan produk tertentu."
    />
  );
}

async function TopCountriesSection() {
  const countries = await getTopCountries();
  return (
    <RankedBars
      items={countries}
      ariaLabel="Negara asal RFQ terbanyak"
      emptyMessage="Belum ada RFQ yang masuk."
    />
  );
}

async function HealthSection() {
  const issues = await getCatalogHealth();
  return <HealthList issues={issues} />;
}

async function ContentSection() {
  const blocks = await getContentCompleteness();
  return <ContentCompleteness blocks={blocks} />;
}

async function ActivitySection({ adminSlug }: { adminSlug: string }) {
  const entries = await getRecentActivity(adminSlug);
  return <ActivityFeed entries={entries} />;
}

export default async function AdminDashboardPage() {
  const session = await auth();
  const adminSlug = getAdminSlug();

  if (!session?.user) {
    redirect(`/${adminSlug}/login`);
  }

  return (
    <div className="p-space-4 md:p-space-8 max-w-7xl mx-auto">
      <header className="border-b border-border-hairline pb-space-4 mb-space-6">
        <h1 className="font-display font-medium text-display-lg text-navy-deep">
          Ringkasan
        </h1>
        <p className="font-body text-body-sm text-slate mt-1">
          Selamat datang, {session.user.email}
        </p>
      </header>

      <div className="space-y-space-6">
        {/* 1. Action queue — the reason to open this page. */}
        <Panel
          title="Perlu tindakan"
          description="Hal yang menunggu keputusan Anda, diurutkan dari yang paling mendesak."
        >
          <Suspense fallback={<PanelSkeleton lines={3} />}>
            <ActionSection adminSlug={adminSlug} />
          </Suspense>
        </Panel>

        {/* 2. Headline numbers. */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-radius-md shadow-card border border-border-hairline p-space-4"
                >
                  <PanelSkeleton lines={2} />
                </div>
              ))}
            </div>
          }
        >
          <KpiSection />
        </Suspense>

        {/* 3. RFQ analytics. */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-4">
          <Panel
            title="Tren RFQ"
            description="Jumlah permintaan per minggu, 12 minggu terakhir."
            className="lg:col-span-2"
          >
            <Suspense fallback={<PanelSkeleton lines={5} />}>
              <TrendSection />
            </Suspense>
          </Panel>

          <Panel title="Alur RFQ" description="Sebaran status permintaan saat ini.">
            <Suspense fallback={<PanelSkeleton lines={3} />}>
              <PipelineSection />
            </Suspense>
          </Panel>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-4">
          <Panel
            title="Produk paling diminati"
            description="Berdasarkan jumlah RFQ yang menyebutkan produk."
            action={
              <Link
                href={`/${adminSlug}/products`}
                className="inline-flex items-center gap-1 text-body-sm text-slate hover:text-red-signal transition-colors shrink-0"
              >
                Katalog <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            }
          >
            <Suspense fallback={<PanelSkeleton lines={4} />}>
              <TopProductsSection />
            </Suspense>
          </Panel>

          <Panel title="Negara tujuan teratas" description="Asal permintaan penawaran.">
            <Suspense fallback={<PanelSkeleton lines={4} />}>
              <TopCountriesSection />
            </Suspense>
          </Panel>
        </div>

        {/* 4. Health & content completeness. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-4">
          <Panel
            title="Kesehatan katalog"
            description="Kelengkapan data produk, kategori, dan sertifikasi."
          >
            <Suspense fallback={<PanelSkeleton lines={5} />}>
              <HealthSection />
            </Suspense>
          </Panel>

          <Panel
            title="Kelengkapan konten"
            description="Bagian halaman publik yang sudah disesuaikan dari teks bawaan."
          >
            <Suspense fallback={<PanelSkeleton lines={4} />}>
              <ContentSection />
            </Suspense>
          </Panel>
        </div>

        {/* 5. Activity. */}
        <Panel title="Aktivitas terbaru" description="RFQ dan pesan kontak yang baru masuk.">
          <Suspense fallback={<PanelSkeleton lines={5} />}>
            <ActivitySection adminSlug={adminSlug} />
          </Suspense>
        </Panel>
      </div>
    </div>
  );
}
