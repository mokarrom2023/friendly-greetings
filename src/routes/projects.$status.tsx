import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { ArrowLeft, MapPin, Search, Home, Tag, X } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/Properties";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import { PROPERTIES, type Status } from "@/lib/properties-data";

const STATUS_VALUES = ["all", "ongoing", "handover", "upcoming", "featured"] as const;

const LOCATIONS = Array.from(new Set(PROPERTIES.map((p) => p.location))).sort();
const TYPES = ["Apartment", "Duplex", "Commercial", "Plot", "Penthouse"];

const STATUS_BANNERS: Record<(typeof STATUS_VALUES)[number], string> = {
  all: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80",
  ongoing: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1800&q=80",
  handover: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1800&q=80",
  upcoming: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1800&q=80",
  featured: "https://images.unsplash.com/photo-1600573472556-e636c2acda88?w=1800&q=80",
};

const STATUS_LABEL: Record<(typeof STATUS_VALUES)[number], string> = {
  all: "All Projects",
  ongoing: "Ongoing",
  handover: "Ready / Handover",
  upcoming: "Upcoming",
  featured: "Featured",
};

const searchSchema = z.object({
  q: fallback(z.string().optional(), undefined),
  type: fallback(z.string().optional(), undefined),
  location: fallback(z.string().optional(), undefined),
});

export const Route = createFileRoute("/projects/$status")({
  validateSearch: zodValidator(searchSchema),
  head: ({ params }) => ({
    meta: [
      {
        title: `${STATUS_LABEL[params.status as (typeof STATUS_VALUES)[number]] ?? "Projects"} — Starline Builders Ltd.`,
      },
      {
        name: "description",
        content: `Browse ${STATUS_LABEL[params.status as (typeof STATUS_VALUES)[number]] ?? ""} projects from Starline Builders Ltd.`,
      },
    ],
  }),
  component: ProjectsStatusRoute,
});

function ProjectsStatusRoute() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground">
          <TopBar />
          <Navbar />
          <main>
            <ProjectsStatusPage />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

function ProjectsStatusPage() {
  const params = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();

  const statusParam = (STATUS_VALUES as readonly string[]).includes(params.status)
    ? (params.status as (typeof STATUS_VALUES)[number])
    : "all";

  const [query, setQuery] = useState(search.q ?? "");
  const [type, setType] = useState(search.type ?? "");
  const [location, setLocation] = useState(search.location ?? "");
  const [status, setStatus] = useState<"all" | Status>(statusParam);

  const filtered = PROPERTIES.filter((p) => {
    if (status !== "all" && p.status !== status) return false;
    if (query && !`${p.title} ${p.location}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (location && p.location !== location) return false;
    return true;
  });

  function applySearch(e: FormEvent) {
    e.preventDefault();
    navigate({
      to: "/projects/$status",
      params: { status },
      search: {
        q: query || undefined,
        type: type || undefined,
        location: location || undefined,
      },
    });
  }

  function clearStatus() {
    setStatus("all");
    navigate({
      to: "/projects/$status",
      params: { status: "all" },
      search: { q: query || undefined, type: type || undefined, location: location || undefined },
    });
  }

  const label = STATUS_LABEL[statusParam];
  const banner = STATUS_BANNERS[statusParam];

  return (
    <>
      {/* Hero banner */}
      <section className="relative isolate overflow-hidden pt-20">
        <div className="relative h-[340px] w-full sm:h-[420px]">
          <img src={banner} alt={label} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="container relative mx-auto flex h-full max-w-7xl items-end px-4 pb-10">
            <div>
              <Link
                to="/"
                className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur hover:bg-white/20"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to home
              </Link>
              <h1
                className="text-5xl font-bold text-white drop-shadow-lg sm:text-6xl md:text-7xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {label}
              </h1>
              <p className="mt-3 max-w-xl text-sm text-white/85 sm:text-base">
                Browse our {label.toLowerCase()} developments — search, filter and find the perfect home.
              </p>
            </div>
          </div>
        </div>

        {/* Sticky filter bar overlapping the hero, matching reference */}
        <div className="container mx-auto -mt-10 max-w-7xl px-4">
          <form
            onSubmit={applySearch}
            className="rounded-2xl p-5 shadow-xl ring-1 ring-white/10"
            style={{ background: "#0f1c3a" }}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FieldDark label={label} active>
                <div className="flex items-center justify-between border-b border-white/20 pb-2 text-white">
                  <span className="text-sm font-semibold">{label}</span>
                  {statusParam !== "all" && (
                    <button
                      type="button"
                      onClick={clearStatus}
                      className="text-white/70 hover:text-white"
                      aria-label="Clear status"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </FieldDark>
              <FieldDark label="Property Type">
                <DarkSelect
                  icon={<Home className="h-4 w-4" />}
                  value={type}
                  onChange={setType}
                  placeholder="All Types"
                  options={TYPES.map((v) => ({ value: v, label: v }))}
                />
              </FieldDark>
              <FieldDark label="Location">
                <DarkSelect
                  icon={<MapPin className="h-4 w-4" />}
                  value={location}
                  onChange={setLocation}
                  placeholder="Any Location"
                  options={LOCATIONS.map((v) => ({ value: v, label: v }))}
                />
              </FieldDark>
              <FieldDark label="Status">
                <DarkSelect
                  icon={<Tag className="h-4 w-4" />}
                  value={status}
                  onChange={(v) => setStatus(v as "all" | Status)}
                  placeholder="Any Status"
                  options={STATUS_VALUES.filter((s) => s !== "all").map((s) => ({
                    value: s,
                    label: STATUS_LABEL[s],
                  }))}
                />
              </FieldDark>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02]"
                style={{ background: "var(--brand)" }}
              >
                <Search className="h-4 w-4" /> Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <h2
              className="text-2xl font-bold sm:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {filtered.length} {filtered.length === 1 ? "project" : "projects"} found
            </h2>
            <div className="flex flex-wrap gap-2">
              {STATUS_VALUES.map((s) => (
                <Link
                  key={s}
                  to="/projects/$status"
                  params={{ status: s }}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all ${
                    statusParam === s
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground/70 hover:border-brand hover:text-brand"
                  }`}
                >
                  {STATUS_LABEL[s]}
                </Link>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
              No projects match your filters. Try clearing some options.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <PropertyCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function FieldDark({
  label,
  children,
  active,
}: {
  label: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div>
      <span
        className={`mb-1.5 block text-[10px] font-bold uppercase tracking-[2px] ${
          active ? "text-white" : "text-white/60"
        }`}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function DarkSelect({
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
      <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-white/60">
        {icon}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none border-b border-white/20 bg-transparent pb-2 pl-6 pr-6 text-sm text-white outline-none focus:border-brand"
      >
        <option value="" className="text-black">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-black">
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-white/60">
        ▾
      </span>
    </div>
  );
}
