export default function StyleGuidePage() {
  const colors = [
    {
      name: "navy-deep",
      hex: "#0B1E3A",
      bgClass: "bg-navy-deep",
      textClass: "text-ivory",
      usage: "Primary dark background (hero, footer)",
    },
    {
      name: "navy-base",
      hex: "#16294D",
      bgClass: "bg-navy-base",
      textClass: "text-ivory",
      usage: "Secondary dark surface",
    },
    {
      name: "red-signal",
      hex: "#D81F3C",
      bgClass: "bg-red-signal",
      textClass: "text-ivory",
      usage: "Primary accent — CTAs, highlights, active states",
    },
    {
      name: "ivory",
      hex: "#F6F3EC",
      bgClass: "bg-ivory",
      textClass: "text-navy-deep",
      borderClass: "border border-slate",
      usage: "Primary light background (NOT pure white)",
    },
    {
      name: "slate",
      hex: "#5B6472",
      bgClass: "bg-slate",
      textClass: "text-ivory",
      usage: "Secondary/muted text",
    },
    {
      name: "gold-hairline",
      hex: "#C9A15A",
      bgClass: "bg-gold-hairline",
      textClass: "text-navy-deep",
      usage: "Sparse premium accent — thin dividers, certification icons",
    },
  ];

  const typeScale = [
    {
      token: "display-xl",
      size: "44px / 1.15",
      fontClass: "font-display font-medium text-display-xl text-navy-deep",
      description: "Hero headlines (Fraunces 500)",
      sample: "Industrial Rubber Export Solutions",
    },
    {
      token: "display-lg",
      size: "32px / 1.2",
      fontClass: "font-display font-medium text-display-lg text-navy-deep",
      description: "Section headlines (Fraunces 500)",
      sample: "Global Manufacturing Standards",
    },
    {
      token: "display-md",
      size: "26px / 1.25",
      fontClass: "font-display font-medium text-display-md text-navy-deep",
      description: "Card/subsection headlines (Fraunces 500)",
      sample: "Technical Compound Specifications",
    },
    {
      token: "body-lg",
      size: "18px / 1.6",
      fontClass: "font-body text-body-lg text-navy-deep",
      description: "Lead paragraphs (Inter 400/500)",
      sample:
        "Duta Mita Luhur delivers premium-grade rubber polymers engineered for demanding international industrial applications.",
    },
    {
      token: "body-md",
      size: "16px / 1.6",
      fontClass: "font-body text-body-md text-navy-deep",
      description: "Default body text (Inter 400)",
      sample:
        "Our supply chain maintains rigorous batch testing and certifications meeting ASTM and ISO specifications for vulcanized materials.",
    },
    {
      token: "body-sm",
      size: "14px / 1.5",
      fontClass: "font-body text-body-sm text-slate",
      description: "Secondary captions / compact UI (Inter 400)",
      sample: "Minimum order quantity: 20 Metric Tons. Standard lead time: 14 business days.",
    },
    {
      token: "caption",
      size: "12px / 1.4",
      fontClass: "font-mono text-caption text-slate uppercase tracking-wider",
      description: "Eyebrows, labels, mono data (JetBrains Mono 400/500)",
      sample: "BATCH NO: DML-2026-X88 // HS CODE: 4001.22.00",
    },
  ];

  const spacingScale = [
    { token: "space-1", px: "8px", widthClass: "w-space-1" },
    { token: "space-2", px: "16px", widthClass: "w-space-2" },
    { token: "space-3", px: "24px", widthClass: "w-space-3" },
    { token: "space-4", px: "32px", widthClass: "w-space-4" },
    { token: "space-6", px: "48px", widthClass: "w-space-6" },
    { token: "space-8", px: "64px", widthClass: "w-space-8" },
    { token: "space-12", px: "96px", widthClass: "w-space-12" },
  ];

  return (
    <main className="min-h-screen bg-ivory text-navy-deep p-space-4 md:p-space-8 font-body">
      <div className="max-w-5xl mx-auto space-y-space-8">
        {/* Header */}
        <header className="border-b border-gold-hairline pb-space-4">
          <p className="font-mono text-caption text-slate uppercase tracking-wider">
            Internal Brand Kit // PBI-02
          </p>
          <h1 className="font-display font-medium text-display-xl text-navy-deep mt-space-1">
            Design System &amp; Style Guide
          </h1>
          <p className="font-body text-body-md text-slate mt-space-1">
            DUTA MITA LUHUR — Visual tokens, typography scale, spacing units, and component foundations.
          </p>
        </header>

        {/* 1. Color Palette */}
        <section className="space-y-space-4">
          <div>
            <h2 className="font-display font-medium text-display-lg text-navy-deep">
              1. Color Palette
            </h2>
            <p className="font-body text-body-sm text-slate mt-space-1">
              Exact brand colors configured in globals.css and tailwind.config.ts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-3">
            {colors.map((color) => (
              <div
                key={color.name}
                className={`p-space-3 rounded-radius-md ${color.bgClass} ${color.textClass} ${
                  color.borderClass ?? ""
                } shadow-card flex flex-col justify-between min-h-[140px]`}
              >
                <div>
                  <span className="font-mono font-medium text-caption block">
                    {color.name}
                  </span>
                  <span className="font-mono text-caption opacity-90 block">
                    {color.hex}
                  </span>
                </div>
                <p className="font-body text-body-sm mt-space-2 opacity-95">
                  {color.usage}
                </p>
              </div>
            ))}
          </div>

          {/* Semantic Aliases */}
          <div className="bg-navy-base text-ivory p-space-4 rounded-radius-md">
            <h3 className="font-display font-medium text-display-md text-ivory mb-space-2">
              Semantic Color Aliases
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-2 font-mono text-caption">
              <div className="p-space-2 bg-ivory text-navy-deep rounded-radius-sm">
                --color-bg-primary → ivory
              </div>
              <div className="p-space-2 bg-navy-deep text-ivory rounded-radius-sm">
                --color-bg-inverse → navy-deep
              </div>
              <div className="p-space-2 bg-ivory text-navy-deep rounded-radius-sm">
                --color-text-primary → navy-deep
              </div>
              <div className="p-space-2 bg-navy-deep text-ivory rounded-radius-sm">
                --color-text-inverse → ivory
              </div>
              <div className="p-space-2 bg-navy-deep text-slate rounded-radius-sm">
                --color-text-muted → slate
              </div>
              <div className="p-space-2 bg-red-signal text-ivory rounded-radius-sm">
                --color-accent → red-signal
              </div>
            </div>
          </div>
        </section>

        {/* 2. Typography */}
        <section className="space-y-space-4">
          <div>
            <h2 className="font-display font-medium text-display-lg text-navy-deep">
              2. Typography
            </h2>
            <p className="font-body text-body-sm text-slate mt-space-1">
              Google Fonts loaded via next/font/google: Fraunces (Display), Inter (Body), JetBrains Mono (Utility).
            </p>
          </div>

          <div className="space-y-space-4 divide-y divide-slate/20">
            {typeScale.map((item) => (
              <div key={item.token} className="pt-space-3 first:pt-0">
                <div className="flex flex-wrap items-center justify-between gap-space-2 mb-space-1">
                  <div className="flex items-center gap-space-2">
                    <span className="font-mono font-medium text-caption bg-navy-deep text-ivory px-space-1 py-0.5 rounded-radius-sm">
                      {item.token}
                    </span>
                    <span className="font-mono text-caption text-slate">
                      {item.size}
                    </span>
                  </div>
                  <span className="font-body text-body-sm text-slate">
                    {item.description}
                  </span>
                </div>
                <div className={item.fontClass}>{item.sample}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Spacing Scale */}
        <section className="space-y-space-4">
          <div>
            <h2 className="font-display font-medium text-display-lg text-navy-deep">
              3. Spacing Scale
            </h2>
            <p className="font-body text-body-sm text-slate mt-space-1">
              8px-based spacing scale using named space-* tokens.
            </p>
          </div>

          <div className="space-y-space-2">
            {spacingScale.map((step) => (
              <div
                key={step.token}
                className="flex items-center gap-space-3 font-mono text-caption"
              >
                <span className="w-24 text-slate">
                  {step.token} ({step.px})
                </span>
                <div className="flex-1 bg-slate/10 p-0.5 rounded-radius-sm">
                  <div
                    className={`${step.widthClass} h-6 bg-navy-base rounded-radius-sm`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Border Radius & Shadows (Component Examples) */}
        <section className="space-y-space-4">
          <div>
            <h2 className="font-display font-medium text-display-lg text-navy-deep">
              4. Radius &amp; Shadow Foundations
            </h2>
            <p className="font-body text-body-sm text-slate mt-space-1">
              Restrained radii (2px, 6px, 12px) and cool-toned navy shadows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-4">
            {/* Button Examples */}
            <div className="bg-ivory border border-slate/30 p-space-4 rounded-radius-md shadow-card space-y-space-3">
              <h3 className="font-display font-medium text-display-md text-navy-deep">
                Button Elements (radius-sm: 2px)
              </h3>
              <p className="font-body text-body-sm text-slate">
                Buttons, badges, and input fields use 2px corner radius.
              </p>
              <div className="flex flex-wrap gap-space-2 pt-space-2">
                <button
                  type="button"
                  className="bg-red-signal hover:bg-red-signal/90 text-ivory px-space-3 py-space-1 rounded-radius-sm font-body font-medium text-body-sm transition-colors"
                >
                  Request Quote
                </button>
                <button
                  type="button"
                  className="bg-navy-base hover:bg-navy-deep text-ivory px-space-3 py-space-1 rounded-radius-sm font-body font-medium text-body-sm transition-colors"
                >
                  Explore Catalog
                </button>
                <button
                  type="button"
                  className="border border-navy-deep text-navy-deep hover:bg-navy-deep hover:text-ivory px-space-3 py-space-1 rounded-radius-sm font-body font-medium text-body-sm transition-colors"
                >
                  Download Specs
                </button>
              </div>
            </div>

            {/* Card Example */}
            <div className="bg-ivory border border-slate/30 p-space-4 rounded-radius-md shadow-card hover:shadow-card-hover transition-shadow space-y-space-2">
              <div className="flex justify-between items-start">
                <span className="font-mono text-caption text-gold-hairline font-medium uppercase">
                  Product Grade // SIR-20
                </span>
                <span className="bg-navy-base text-ivory font-mono text-caption px-space-1 rounded-radius-sm">
                  ISO 9001
                </span>
              </div>
              <h3 className="font-display font-medium text-display-md text-navy-deep">
                Standard Indonesian Rubber
              </h3>
              <p className="font-body text-body-sm text-slate">
                Card component utilizing radius-md (6px) with shadow-card and shadow-card-hover elevation.
              </p>
              <div className="pt-space-2 border-t border-slate/20 flex justify-between items-center">
                <span className="font-mono text-caption text-slate">
                  Dirt Content: ≤ 0.20%
                </span>
                <span className="text-red-signal font-body font-medium text-body-sm">
                  View Compound →
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
