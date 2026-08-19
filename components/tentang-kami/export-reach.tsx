import { CompanyProfile } from "@/lib/content/company-profile";

type ExportReachProps = {
  countries: CompanyProfile["exportCountries"];
};

export function ExportReach({ countries }: ExportReachProps) {
  return (
    <section className="bg-ivory py-space-12 md:py-space-16 px-space-4 md:px-space-6 border-t border-border-hairline">
      <div className="max-w-7xl mx-auto">
        <div className="mb-space-8 text-center md:text-left max-w-2xl">
          <h2 className="font-display font-medium text-display-lg text-navy-deep leading-tight">
            Jangkauan Ekspor
          </h2>
          <p className="font-body text-body-md text-slate mt-space-2">
            Produk karet alam kami telah dipercaya oleh berbagai produsen ban dan industri manufaktur di berbagai negara.
          </p>
        </div>

        <div className="flex flex-wrap gap-space-2 md:gap-space-3">
          {countries.map((country, idx) => (
            <div
              key={idx}
              className="px-space-3 md:px-space-4 py-space-1 md:py-space-2 rounded-radius-sm border border-slate/30 text-body-sm md:text-body-md font-body text-navy-deep bg-white shadow-sm"
            >
              {country}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
