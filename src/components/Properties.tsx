import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Bed, Maximize2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";
import { PROPERTIES, type Status } from "@/lib/properties-data";

const FILTERS: { key: "all" | Status; labelKey: "all" | Status }[] = [
  { key: "all", labelKey: "all" },
  { key: "ongoing", labelKey: "ongoing" },
  { key: "handover", labelKey: "handover" },
  { key: "upcoming", labelKey: "upcoming" },
  { key: "featured", labelKey: "featured" },
];

export function Properties() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<"all" | Status>("all");

  const list = filter === "all" ? PROPERTIES : PROPERTIES.filter((p) => p.status === filter);

  return (
    <section id="properties" className="py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[4px] text-brand">
            {t("ourProjects")}
          </span>
          <h2
            className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("propertiesTitle")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("propertiesSubtitle")}</p>
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all",
                filter === f.key
                  ? "border-transparent bg-primary text-primary-foreground shadow-md"
                  : "border-border bg-background text-foreground/70 hover:border-brand hover:text-brand",
              )}
            >
              {t(f.labelKey)}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <Link
              key={p.id}
              to="/properties/$id"
              params={{ id: String(p.id) }}
              className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span
                  className="absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow"
                  style={{ background: "var(--brand)", color: "var(--brand-foreground)" }}
                >
                  {t(p.status)}
                </span>
              </div>
              <div className="p-5">
                <h3
                  className="mb-1 text-lg font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {p.title}
                </h3>
                <p className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {p.location}
                </p>
                <div className="mb-4 flex items-center justify-between border-y border-border py-3 text-xs text-foreground/70">
                  <span className="flex items-center gap-1.5">
                    <Maximize2 className="h-3.5 w-3.5 text-brand" />
                    {p.size}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bed className="h-3.5 w-3.5 text-brand" />
                    {p.beds} {t("beds")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-brand">{p.price}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary group-hover:gap-2 transition-all">
                    {t("viewDetails")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
