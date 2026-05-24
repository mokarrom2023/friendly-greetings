import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Tag,
  MapPin,
  Phone,
  Maximize2,
  Wallet,
  CalendarClock,
  CheckCircle2,
  Banknote,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import { getNewsItem } from "@/lib/properties-data";

export const Route = createFileRoute("/properties/$id/news/$newsId")({
  head: ({ params }) => ({
    meta: [
      { title: `News #${params.newsId} — STARLINE BUILDERS LTD.` },
      { name: "description", content: "Project news, booking and progress updates." },
    ],
  }),
  loader: ({ params }) => {
    const data = getNewsItem(Number(params.id), Number(params.newsId));
    if (!data) throw notFound();
    return data;
  },
  component: NewsDetailPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <p>News item not found</p>
    </div>
  ),
});

function NewsDetailPage() {
  const { property, item } = Route.useLoaderData();
  const isBooking = !!item.booking;

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground">
          <TopBar />
          <Navbar />
          <main className="pt-24">
            <section className="border-b border-border bg-muted/30 py-6">
              <div className="container mx-auto max-w-5xl px-4">
                <Link
                  to="/properties/$id"
                  params={{ id: String(property.id) }}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to {property.title}
                </Link>
              </div>
            </section>

            {isBooking ? (
              <BookingLayout property={property} item={item} />
            ) : (
              <NewspaperLayout property={property} item={item} />
            )}
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

/* ---------------- Newspaper-style layout for normal news ---------------- */
function NewspaperLayout({ property, item }: any) {
  return (
    <article className="bg-[#fbfaf5] py-14 text-neutral-900 dark:bg-neutral-100">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Masthead */}
        <header className="border-y-4 border-double border-neutral-900 py-4 text-center">
          <div className="text-[10px] font-bold uppercase tracking-[6px] text-neutral-600">
            The Starline Times
          </div>
          <div
            className="mt-1 text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            STARLINE BUILDERS LTD.
          </div>
          <div className="mt-1 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[3px] text-neutral-500">
            <span>{item.date}</span>
            <span>•</span>
            <span>Vol. XVII</span>
            <span>•</span>
            <span>Dhaka Edition</span>
          </div>
        </header>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[3px]">
          <span className="rounded-sm bg-neutral-900 px-2 py-1 text-white">{item.tag}</span>
          <span className="text-neutral-600">
            {property.title} — {property.location}
          </span>
        </div>

        <h1
          className="mt-3 text-3xl font-black leading-[1.05] text-neutral-900 sm:text-5xl"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {item.title}
        </h1>

        <p
          className="mt-3 text-base italic text-neutral-700 sm:text-lg"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {item.excerpt}
        </p>

        <div className="my-7 border-y border-neutral-300 py-1 text-[10px] uppercase tracking-[3px] text-neutral-500">
          By Starline Newsroom · Staff Correspondent
        </div>

        <figure className="my-6">
          <img
            src={item.image}
            alt={item.title}
            className="w-full grayscale"
            style={{ filter: "grayscale(0.4) contrast(1.05)" }}
          />
          <figcaption className="mt-2 text-center text-xs italic text-neutral-500">
            {item.title} — file photo
          </figcaption>
        </figure>

        <div
          className="prose prose-neutral max-w-none columns-1 gap-8 text-neutral-800 sm:columns-2 [&>p:first-child::first-letter]:float-left [&>p:first-child::first-letter]:mr-2 [&>p:first-child::first-letter]:text-6xl [&>p:first-child::first-letter]:font-black [&>p:first-child::first-letter]:leading-none"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {item.content.split("\n\n").map((para: string, i: number) => (
            <p
              key={i}
              className="mb-4 break-inside-avoid text-[15px] leading-relaxed first-line:uppercase first-line:tracking-wider"
            >
              {para}
            </p>
          ))}
        </div>

        <footer className="mt-10 border-t-4 border-double border-neutral-900 pt-4 text-center text-[10px] uppercase tracking-[3px] text-neutral-500">
          © Starline Builders Ltd. · Printed in Dhaka
        </footer>
      </div>
    </article>
  );
}

/* ---------------- Booking detail layout ---------------- */
function BookingLayout({ property, item }: any) {
  const b = item.booking!;
  return (
    <article className="py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 font-bold uppercase tracking-wider text-brand">
            <Tag className="h-3 w-3" />
            {item.tag}
          </span>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {item.date}
          </span>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {property.title} — {property.location}
          </span>
        </div>

        <h1
          className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {item.title}
        </h1>
        <p className="mt-3 max-w-3xl text-base text-muted-foreground">{item.excerpt}</p>

        {/* Apartment image */}
        <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
          <img
            src={b.apartmentImage}
            alt={`${property.title} apartment`}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Price summary cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Banknote, label: "Per Sqft Price", value: b.perSft },
            { icon: Maximize2, label: "Apartment Size", value: b.totalSize },
            { icon: Wallet, label: "Total Price", value: b.totalPrice },
            { icon: CalendarClock, label: "Booking / Advance", value: b.advance },
          ].map((c) => (
            <div key={c.label} className="rounded-2xl border border-border bg-card p-5">
              <div
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: "color-mix(in oklab, var(--brand) 15%, transparent)",
                  color: "var(--brand)",
                }}
              >
                <c.icon className="h-5 w-5" />
              </div>
              <div className="mt-3 text-[10px] font-semibold uppercase tracking-[2px] text-muted-foreground">
                {c.label}
              </div>
              <div
                className="mt-1 text-lg font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {c.value}
              </div>
            </div>
          ))}
        </div>

        {/* Deadline strip */}
        <div
          className="mt-6 flex items-start gap-3 rounded-2xl border p-5"
          style={{
            background: "color-mix(in oklab, var(--brand) 8%, transparent)",
            borderColor: "color-mix(in oklab, var(--brand) 25%, transparent)",
          }}
        >
          <CalendarClock className="mt-0.5 h-5 w-5 text-brand" />
          <div>
            <div
              className="text-sm font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Payment Deadline
            </div>
            <div className="text-sm text-muted-foreground">{b.paymentDeadline}</div>
          </div>
        </div>

        {/* Payment schedule table */}
        <h2
          className="mt-12 text-2xl font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Payment Schedule
        </h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Milestone</th>
                <th className="px-5 py-3">Due</th>
                <th className="px-5 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {b.schedule.map((row: any, i: number) => (
                <tr
                  key={i}
                  className="border-t border-border bg-card hover:bg-muted/30"
                >
                  <td className="px-5 py-3 font-semibold">
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand" />
                      {row.milestone}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{row.due}</td>
                  <td className="px-5 py-3 text-right font-bold text-brand">
                    {row.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Full description */}
        <div className="prose prose-lg mt-10 max-w-none text-foreground/85">
          {item.content.split("\n\n").map((para: string, i: number) => (
            <p key={i} className="mb-5 text-base leading-relaxed sm:text-lg">
              {para}
            </p>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-8 sm:flex-row">
          <div>
            <h3
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ready to book your unit at {property.title}?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Speak with our sales team for floor selection and bank financing.
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
    </article>
  );
}
