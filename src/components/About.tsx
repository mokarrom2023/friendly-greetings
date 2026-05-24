import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language";

export function About() {
  const { t } = useLanguage();

  const stats = [
    { value: "17+", label: t("yearsExp") },
    { value: "50+", label: t("projectsDone") },
    { value: "200+", label: t("happyFamilies") },
    { value: "2M+", label: t("sqftBuilt") },
  ];

  return (
    <section id="about" className="bg-secondary/40 py-14 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80"
              alt="About Starline Builders"
              className="rounded-2xl shadow-xl"
              loading="lazy"
            />
            <div
              className="absolute -bottom-6 -right-6 hidden rounded-2xl p-6 text-center text-white shadow-2xl sm:block"
              style={{ background: "var(--primary)" }}
            >
              <div className="text-4xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                17+
              </div>
              <div className="text-[10px] uppercase tracking-[2px] opacity-90">
                {t("yearsExp")}
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[4px] text-brand">
              {t("aboutTag")}
            </span>
            <h2
              className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("aboutTitle")}
            </h2>
            <p className="mt-5 leading-relaxed text-foreground/80">{t("aboutP1")}</p>
            <p className="mt-4 leading-relaxed text-foreground/80">{t("aboutP2")}</p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-card p-4 text-center"
                >
                  <div
                    className="text-2xl font-bold text-brand"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {s.value}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-wider shadow-md transition-all hover:scale-[1.02]"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {t("learnMore")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
