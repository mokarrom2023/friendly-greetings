import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Tag, MapPin, Phone } from "lucide-react";
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

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground">
          <TopBar />
          <Navbar />
          <main className="pt-24">
            <section className="border-b border-border bg-muted/30 py-6">
              <div className="container mx-auto max-w-4xl px-4">
                <Link
                  to="/properties/$id"
                  params={{ id: String(property.id) }}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to {property.title}
                </Link>
              </div>
            </section>

            <article className="py-12">
              <div className="container mx-auto max-w-4xl px-4">
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

                <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="prose prose-lg mt-10 max-w-none text-foreground/85">
                  {item.content.split("\n\n").map((para, i) => (
                    <p key={i} className="mb-5 text-base leading-relaxed sm:text-lg">
                      {para}
                    </p>
                  ))}
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-8 sm:flex-row">
                  <div>
                    <h3
                      className="text-xl font-bold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Interested in {property.title}?
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
            </article>
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
