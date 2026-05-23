import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  MapPin,
  Maximize2,
  Bed,
  Car,
  Tag,
  Zap,
  ArrowUpDown,
  BatteryCharging,
  TreePine,
  Dumbbell,
  ShieldCheck,
  Users,
  Baby,
  Waves,
  Sofa,
  Bell,
  Plug,
  PlayCircle,
  Calendar,
  Phone,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import { getPropertyById, type Property } from "@/lib/properties-data";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  ArrowUpDown,
  BatteryCharging,
  TreePine,
  Dumbbell,
  ShieldCheck,
  Users,
  Baby,
  Car,
  Waves,
  Sofa,
  Bell,
  Plug,
};

export const Route = createFileRoute("/properties/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Property #${params.id} — STARLINE BUILDERS LTD.` },
      {
        name: "description",
        content: "Premium property details, facilities, gallery and booking news.",
      },
    ],
  }),
  loader: ({ params }) => {
    const property = getPropertyById(Number(params.id));
    if (!property) throw notFound();
    return { property };
  },
  component: PropertyDetailPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <p>Property not found</p>
    </div>
  ),
});

function PropertyDetailPage() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground">
          <TopBar />
          <Navbar />
          <main className="pt-24">
            <Content />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

function Content() {
  const { property: p } = Route.useLoaderData() as { property: Property };
  const allImages = [p.image, ...p.gallery];
  const [active, setActive] = useState(0);

  return (
    <>
      {/* Header / breadcrumb */}
      <section className="border-b border-border bg-muted/30 py-6">
        <div className="container mx-auto max-w-7xl px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" /> Back to projects
          </Link>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border">
                <img
                  src={allImages[active]}
                  alt={p.title}
                  className="h-full w-full object-cover"
                />
                <span
                  className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow"
                  style={{ background: "var(--brand)" }}
                >
                  {p.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
              {allImages.slice(0, 3).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all ${
                    active === i ? "border-brand" : "border-border hover:border-brand/50"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Title + key info cards */}
      <section className="pb-10">
        <div className="container mx-auto max-w-7xl px-4">
          <h1
            className="text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {p.title}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-brand" />
            {p.location}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard icon={<Tag className="h-5 w-5" />} label="Price" value={p.price} />
            <InfoCard
              icon={<Maximize2 className="h-5 w-5" />}
              label="Size"
              value={p.size}
            />
            <InfoCard
              icon={<Bed className="h-5 w-5" />}
              label="Bedrooms"
              value={`${p.beds} Beds`}
            />
            <InfoCard
              icon={<Car className="h-5 w-5" />}
              label="Parking"
              value={p.parking}
            />
          </div>

          <p className="mt-8 max-w-3xl text-base leading-relaxed text-foreground/80">
            {p.description}
          </p>
        </div>
      </section>

      {/* Facilities */}
      <section className="border-t border-border bg-muted/30 py-14">
        <div className="container mx-auto max-w-7xl px-4">
          <span className="text-xs font-semibold uppercase tracking-[4px] text-brand">
            Amenities
          </span>
          <h2
            className="mt-2 text-3xl font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Facilities & Features
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {p.facilities.map((f) => {
              const Icon = ICONS[f.icon] ?? ShieldCheck;
              return (
                <div
                  key={f.label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-brand"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium">{f.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="py-14">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-brand" />
            <span className="text-xs font-semibold uppercase tracking-[4px] text-brand">
              Project Video
            </span>
          </div>
          <h2
            className="mt-2 text-3xl font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Take a Virtual Tour
          </h2>
          <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-border bg-black">
            <iframe
              src={p.videoUrl}
              title={`${p.title} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      </section>

      {/* News / Booking updates */}
      <section className="border-t border-border bg-muted/30 py-14">
        <div className="container mx-auto max-w-7xl px-4">
          <span className="text-xs font-semibold uppercase tracking-[4px] text-brand">
            Updates
          </span>
          <h2
            className="mt-2 text-3xl font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            News, Booking & Progress
          </h2>

          {p.news.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              No news yet for this project. Stay tuned!
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {p.news.map((n) => (
                <Link
                  key={n.id}
                  to="/properties/$id/news/$newsId"
                  params={{ id: String(p.id), newsId: String(n.id) }}
                  className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-brand hover:shadow-lg"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={n.image}
                      alt={n.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand">
                      {n.tag}
                    </span>
                    <h3
                      className="mt-3 text-lg font-bold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {n.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {n.excerpt}
                    </p>
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {n.date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-8 sm:flex-row">
            <div>
              <h3
                className="text-xl font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Interested in {p.title}?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Talk to our sales team for booking and site visit.
              </p>
            </div>
            <Link
              to="/"
              hash="contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              <Phone className="h-4 w-4" />
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-brand">
      <div className="flex items-center gap-2 text-brand">{icon}</div>
      <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        className="mt-1 text-lg font-bold"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {value}
      </div>
    </div>
  );
}
