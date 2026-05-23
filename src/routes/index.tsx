import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Properties } from "@/components/Properties";
import { About } from "@/components/About";
import { WhyChoose } from "@/components/WhyChoose";
import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "STARLINE BUILDERS LTD. — Invest Smart. Live Better." },
      {
        name: "description",
        content:
          "Bangladesh's premier luxury real estate developer. Premium residential & commercial properties in Dhaka — Gulshan, Banani, Bashundhara, Dhanmondi & more.",
      },
      { property: "og:title", content: "STARLINE BUILDERS LTD." },
      {
        property: "og:description",
        content: "Premium real estate developer — Invest Smart. Live Better.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&family=Hind+Siliguri:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground">
          <TopBar />
          <Navbar />
          <main>
            <Hero />
            <Properties />
            <About />
            <WhyChoose />
            <Contact />
            <Faq />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
