import { useState } from "react";
import { Plus, Minus, MessageCircle, Phone, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language";

export function Faq() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);

  const items = [
    { q: t("faqQ1"), a: t("faqA1") },
    { q: t("faqQ2"), a: t("faqA2") },
    { q: t("faqQ3"), a: t("faqA3") },
    { q: t("faqQ4"), a: t("faqA4") },
    { q: t("faqQ5"), a: t("faqA5") },
    { q: t("faqQ6"), a: t("faqA6") },
  ];

  return (
    <section id="faq" className="bg-secondary/40 py-14 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-8" style={{ background: "var(--brand)" }} />
            <span
              className="text-xs font-bold uppercase tracking-[3px]"
              style={{ color: "var(--brand)" }}
            >
              {t("faqTag")}
            </span>
          </div>
          <h2
            className="mt-4 text-4xl font-bold sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("faqTitle1")}{" "}
            <span style={{ color: "var(--brand)" }}>{t("faqTitleAccent")}</span>
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Accordion */}
          <div className="space-y-3">
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-border bg-card transition-all"
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span
                      className="text-base font-bold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {it.q}
                    </span>
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border"
                      style={{
                        background: isOpen ? "var(--brand)" : "transparent",
                        color: isOpen ? "#fff" : "currentColor",
                      }}
                    >
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {it.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Side card */}
          <aside
            className="h-fit rounded-2xl p-7 text-white shadow-xl"
            style={{ background: "var(--primary)" }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ background: "var(--brand)" }}
            >
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h3
              className="mt-6 text-2xl font-bold leading-snug"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("faqSideTitle")}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/75">{t("faqSideDesc")}</p>

            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.03]"
              style={{ background: "var(--brand)" }}
            >
              {t("faqContactBtn")} <ArrowRight className="h-4 w-4" />
            </a>

            <div className="my-6 h-px bg-white/15" />

            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ background: "rgba(255,255,255,0.08)", color: "var(--brand)" }}
              >
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <div
                  className="text-[10px] font-bold uppercase tracking-[2px]"
                  style={{ color: "var(--brand)" }}
                >
                  {t("faq247")}
                </div>
                <div className="text-sm font-bold">{t("faqPhone")}</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
