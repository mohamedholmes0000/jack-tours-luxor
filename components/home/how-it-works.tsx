import { Headphones, MessageSquareText, Route, SlidersHorizontal, type LucideIcon } from "lucide-react";

const steps: Array<{
  description: string;
  icon: LucideIcon;
  title: string;
}> = [
  {
    description: "Tell us your dates, interests, pace, and group size.",
    icon: MessageSquareText,
    title: "Share your plans",
  },
  {
    description: "We prepare a private route tailored to your preferences.",
    icon: Route,
    title: "Receive your itinerary",
  },
  {
    description: "Review the plan with us and adjust each part together.",
    icon: SlidersHorizontal,
    title: "Refine the details",
  },
  {
    description: "Enjoy your journey with trusted local coordination.",
    icon: Headphones,
    title: "Travel with support",
  },
];

export function HowItWorks() {
  return (
    <section className="order-6 bg-[var(--color-ivory)] py-10 text-[var(--color-navy)] sm:py-12 lg:py-14">
      <div className="container-premium">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 border-b border-[rgb(6_17_31_/_14%)] pb-6 md:grid-cols-[0.75fr_1.25fr] md:items-end md:gap-12">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-dark)]">
                From idea to arrival
              </p>
              <h2 className="mt-3 font-serif text-[clamp(2rem,3.4vw,3rem)] font-semibold leading-[1.03]">
                How It Works
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--color-navy)]/64 sm:text-base">
              A clear, personal planning process shaped around your pace and priorities.
            </p>
          </div>

          <ol className="grid grid-cols-1 border-b border-[rgb(6_17_31_/_14%)] min-[430px]:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <li
                  key={step.title}
                  className="relative border-t border-[rgb(6_17_31_/_12%)] px-1 py-5 min-[430px]:px-5 min-[430px]:odd:pl-0 min-[430px]:even:border-l lg:border-t-0 lg:border-l lg:px-6 lg:py-6 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-serif text-[1.7rem] leading-none text-[var(--color-gold-dark)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon aria-hidden="true" className="size-5 text-[var(--color-navy)]/52" strokeWidth={1.45} />
                  </div>
                  <h3 className="mt-5 font-serif text-xl font-semibold leading-[1.15] text-[var(--color-navy)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[17rem] text-sm leading-6 text-[var(--color-navy)]/62">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}