import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/language";

const SLIDES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1920&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80",
  "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1920&q=80",
];

export function Hero() {
  const { t } = useLanguage();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100vh] items-center justify-center overflow-hidden pt-24"
    >
      {/* Background slideshow */}
      <div className="absolute inset-0 -z-20">
        {SLIDES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Luxury building"
            loading={i === 0 ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out"
            style={{ opacity: i === idx ? 1 : 0 }}
          />
        ))}
      </div>
      {/* Overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--primary) 92%, transparent) 0%, color-mix(in oklab, var(--primary) 70%, transparent) 50%, color-mix(in oklab, var(--background) 30%, transparent) 100%)",
        }}
      />


      <div className="container mx-auto max-w-5xl px-4 text-center text-white">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[3px] backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--brand)" }} />
          {t("heroTag")}
        </div>

        <h1
          className="mb-6 text-4xl font-bold leading-[1.05] sm:text-5xl md:text-7xl lg:text-[5.5rem]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {t("heroTitle1")}{" "}
          <span className="brand-gradient italic">{t("heroTitleAccent")}</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
          {t("heroSubtitle")}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#properties"
            className="group inline-flex items-center gap-2 rounded-md px-7 py-3.5 text-sm font-semibold uppercase tracking-wider shadow-lg transition-all hover:scale-[1.02]"
            style={{
              background: "var(--brand)",
              color: "var(--brand-foreground)",
            }}
          >
            {t("heroCta1")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-md border-2 border-white/60 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10"
          >
            {t("heroCta2")}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white/70">
        <ChevronDown className="mx-auto h-5 w-5 animate-bounce" />
        <small className="text-[10px] uppercase tracking-[3px]">{t("scrollDown")}</small>
      </div>
    </section>
  );
}
