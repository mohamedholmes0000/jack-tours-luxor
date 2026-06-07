type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[var(--color-navy)] md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-8 text-[var(--color-gray-600)] md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
