import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { MapPin, Bed, Maximize2, ArrowRight, Search, Home, Tag } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";
import { PROPERTIES, type Status } from "@/lib/properties-data";

const LOCATIONS = Array.from(new Set(PROPERTIES.map((p) => p.location))).sort();
const TYPES = ["Apartment", "Duplex", "Commercial", "Plot", "Penthouse"];
const STATUSES: { value: "all" | Status; label: string }[] = [
  { value: "all", label: "Any Status" },
  { value: "ongoing", label: "Ongoing" },
  { value: "handover", label: "Ready / Handover" },
  { value: "upcoming", label: "Upcoming" },
  { value: "featured", label: "Featured" },
];

type Tab = "all" | "buy" | "rent";

export function Properties() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<"all" | Status>("all");

  const filtered = PROPERTIES.filter((p) => {
    if (query && !`${p.title} ${p.location}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (location && p.location !== location) return false;
    if (status !== "all" && p.status !== status) return false;
    return true;
  });

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    navigate({
      to: "/projects/$status",
      params: { status: status },
      search: { q: query || undefined, type: type || undefined, location: location || undefined },
    });
  }

  return (
    <section id="properties" className="py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center">
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

        {/* Tabs */}
        <div className="mb-5 flex justify-center">
          <div className="inline-flex rounded-full bg-card p-1 shadow-sm ring-1 ring-border">
            {(["all", "buy", "rent"] as Tab[]).map((t2) => (
              <button
                key={t2}
                type="button"
                onClick={() => setTab(t2)}
                className={cn(
                  "rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all",
                  tab === t2
                    ? "text-white shadow"
                    : "text-foreground/60 hover:text-foreground",
                )}
                style={tab === t2 ? { background: "#0f1c3a" } : undefined}
              >
                {t2 === "all" ? "All Projects" : t2 === "buy" ? "Buy" : "Rent"}
              </button>
            ))}
          </div>
        </div>

        {/* Filter form */}
        <form
          onSubmit={handleSearch}
          className="mx-auto mb-12 grid max-w-6xl gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end"
        >
          <Field label="Search">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Title, location, category..."
                className="w-full rounded-md border border-border bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:border-brand"
              />
            </div>
          </Field>
          <Field label="Property Type">
            <SelectWithIcon
              icon={<Home className="h-4 w-4" />}
              value={type}
              onChange={setType}
              placeholder="All Types"
              options={TYPES.map((v) => ({ value: v, label: v }))}
            />
          </Field>
          <Field label="Location">
            <SelectWithIcon
              icon={<MapPin className="h-4 w-4" />}
              value={location}
              onChange={setLocation}
              placeholder="Any Location"
              options={LOCATIONS.map((v) => ({ value: v, label: v }))}
            />
          </Field>
          <Field label="Status">
            <SelectWithIcon
              icon={<Tag className="h-4 w-4" />}
              value={status}
              onChange={(v) => setStatus(v as "all" | Status)}
              placeholder="Any Status"
              options={STATUSES.filter((s) => s.value !== "all").map((s) => ({
                value: s.value,
                label: s.label,
              }))}
            />
          </Field>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02]"
            style={{ background: "var(--brand)" }}
          >
            <Search className="h-4 w-4" /> Search
          </button>
        </form>

        {/* Quick status chips */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {STATUSES.map((s) => (
            <Link
              key={s.value}
              to="/projects/$status"
              params={{ status: s.value }}
              className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground/70 transition-all hover:border-brand hover:text-brand"
            >
              {s.label}
            </Link>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PropertyCard key={p.id} p={p} t={t} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
              No matching projects.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export function PropertyCard({
  p,
  t,
}: {
  p: (typeof PROPERTIES)[number];
  t: (key: string) => string;
}) {
  return (
    <Link
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
          style={{ background: "var(--brand)" }}
        >
          {t(p.status)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="mb-1 text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
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
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[2px] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function SelectWithIcon({
  icon,
  value,
  onChange,
  placeholder,
  options,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {icon}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-md border border-border bg-background py-2.5 pl-9 pr-8 text-sm outline-none focus:border-brand"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        ▾
      </span>
    </div>
  );
}
