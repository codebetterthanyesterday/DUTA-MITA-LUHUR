import Link from "next/link";

type FinalCtaProps = {
  eyebrow: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
};

export function FinalCta({
  eyebrow,
  title,
  description,
  buttonText,
  buttonHref,
}: FinalCtaProps) {
  return (
    <section className="bg-navy-deep text-ivory py-space-12 px-space-4 md:px-space-6 text-center border-t border-slate/20">
      <div className="max-w-3xl mx-auto space-y-space-4">
        <span className="font-mono text-caption text-gold-hairline uppercase tracking-wider block">
          {eyebrow}
        </span>

        <h2 className="font-display font-medium text-display-lg text-ivory leading-tight">
          {title}
        </h2>

        <p className="font-body text-body-md text-ivory/75 max-w-xl mx-auto">
          {description}
        </p>

        <div className="pt-space-2">
          <Link
            href={buttonHref}
            className="inline-block bg-red-signal hover:bg-red-signal/90 text-ivory px-space-6 py-space-2 rounded-radius-sm font-body font-medium text-body-md transition-colors"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
