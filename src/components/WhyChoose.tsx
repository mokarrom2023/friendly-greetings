import { Award, Clock, ShieldCheck, MapPin, TrendingUp, Headphones } from "lucide-react";
import { useLanguage } from "@/lib/language";

export function WhyChoose() {
  const { t } = useLanguage();

  const items = [
    { icon: Award, titleKey: "why1Title", descKey: "why1Desc" },
    { icon: Clock, titleKey: "why2Title", descKey: "why2Desc" },
    { icon: ShieldCheck, titleKey: "why3Title", descKey: "why3Desc" },
    { icon: MapPin, titleKey: "why4Title", descKey: "why4Desc" },
    { icon: TrendingUp, titleKey: "why5Title", descKey: "why5Desc" },
    { icon: Headphones, titleKey: "why6Title", descKey: "why6Desc" },
  ] as const;

  return (
    <section className="py-14 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[4px] text-brand">
            {t("whyTag")}
          </span>
          <h2
            className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("whyTitle")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("whySubtitle")}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, titleKey, descKey }) => (
            <div
              key={titleKey}
              className="group rounded-xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-brand hover:shadow-lg"
            >
              <div
                className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                style={{
                  background: "color-mix(in oklab, var(--brand) 15%, transparent)",
                  color: "var(--brand)",
                }}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3
                className="mb-2 text-lg font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t(titleKey)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{t(descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
