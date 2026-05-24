import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/TopBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";


export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Starline Builders Ltd." },
      {
        name: "description",
        content:
          "Photo gallery of Starline Builders projects, events and behind-the-scenes moments.",
      },
      { property: "og:title", content: "Gallery — Starline Builders Ltd." },
      {
        property: "og:description",
        content:
          "Photo gallery of Starline Builders projects, events and behind-the-scenes moments.",
      },
    ],
  }),
  component: GalleryRoute,
});

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
  "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1200&q=80",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200&q=80",
  "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
  "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&q=80",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
  "https://images.unsplash.com/photo-1448630360428-65456885c650?w=1200&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80",
];

function GalleryRoute() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <GalleryPage />
      </LanguageProvider>
    </ThemeProvider>
  );
}

function GalleryPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto max-w-7xl px-4">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <div className="mb-10 text-center">
            <span
              className="text-xs font-semibold uppercase tracking-[3px]"
              style={{ color: "var(--brand)" }}
            >
              {t("galleryTag")}
            </span>
            <h1
              className="mt-2 text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("galleryTitle")}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
              {t("gallerySubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {PLACEHOLDER_IMAGES.map((src, i) => (
              <figure
                key={i}
                className="group relative aspect-square overflow-hidden rounded-xl bg-muted shadow-sm ring-1 ring-border transition-all hover:shadow-lg"
              >
                <img
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </figure>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-xs text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
            <span>
              Admin image upload coming soon — you'll be able to manage these
              photos from the dashboard.
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
