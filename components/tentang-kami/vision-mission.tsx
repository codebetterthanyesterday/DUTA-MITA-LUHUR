import { CompanyProfile } from "@/lib/content/company-profile";

type VisionMissionProps = {
  vision: CompanyProfile["vision"];
  mission: CompanyProfile["mission"];
};

export function VisionMission({ vision, mission }: VisionMissionProps) {
  return (
    <section className="bg-ivory py-space-12 md:py-space-16 px-space-4 md:px-space-6 border-t border-border-hairline">
      <div className="max-w-4xl mx-auto text-center">
        {/* Vision Statement */}
        <div className="mb-space-12">
          <div className="w-12 h-px bg-gold-hairline mx-auto mb-space-6" />
          <h2 className="font-display font-medium text-display-md text-navy-deep leading-snug">
            "{vision}"
          </h2>
          <div className="w-12 h-px bg-gold-hairline mx-auto mt-space-6" />
        </div>

        {/* Mission List */}
        <div className="text-left max-w-3xl mx-auto">
          <h3 className="font-mono text-caption text-gold-hairline uppercase tracking-wider mb-space-4 text-center">
            MISI KAMI
          </h3>
          <ul className="space-y-space-3">
            {mission.map((item, idx) => (
              <li key={idx} className="flex items-start gap-space-3 group">
                <span className="font-mono text-caption text-navy-deep/40 mt-1 group-hover:text-gold-hairline transition-colors">
                  {(idx + 1).toString().padStart(2, "0")}
                </span>
                <span className="font-body text-body-md text-slate leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
