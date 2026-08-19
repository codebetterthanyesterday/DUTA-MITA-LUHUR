import { CompanyProfile } from "@/lib/content/company-profile";

type HistoryProps = {
  history: CompanyProfile["history"];
};

export function History({ history }: HistoryProps) {
  return (
    <section className="bg-ivory py-space-12 md:py-space-16 px-space-4 md:px-space-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-space-6 md:gap-space-10 items-start">
        {/* Left Column: Prose */}
        <div className="prose prose-slate prose-lg max-w-none font-body text-navy-deep">
          <p className="text-body-lg font-medium leading-relaxed text-navy-deep">
            {history.intro}
          </p>
          {history.body.split("\n\n").map((paragraph, idx) => (
            <p key={idx} className="text-body-md leading-relaxed text-slate mt-space-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Right Column: Large Placeholder Image */}
        <div className="w-full aspect-[4/3] rounded-radius-md bg-navy-base/5 border border-border-hairline flex flex-col items-center justify-center p-space-4 text-center">
          <span className="font-mono text-caption text-slate/60 uppercase">
            Fasilitas Pengolahan
          </span>
          <span className="font-mono text-caption text-slate/40 mt-1">
            PT Duta Mitra Luhur
          </span>
        </div>
      </div>
    </section>
  );
}
