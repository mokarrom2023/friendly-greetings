import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Star, Play, Calculator, MapPin, Award, HardHat, BookOpen,
  Handshake, FileCheck, LayoutGrid, MessageCircle, Briefcase, TrendingUp,
  Quote, ChevronRight, Phone
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/language";

const SectionHeader = ({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) => (
  <div className="mx-auto mb-8 md:mb-12 max-w-2xl text-center">
    <span className="text-xs font-semibold uppercase tracking-[4px] text-brand">{tag}</span>
    <h2 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
      {title}
    </h2>
    {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
  </div>
);

/* 1. Testimonials */
export function Testimonials() {
  const { t } = useLanguage();
  const defaults = [
    { name: "Rahim Ahmed", role: "Homeowner, Gulshan", rating: 5, text: "Starline delivered exactly what they promised. Quality construction, on-time handover, and excellent after-sales service.", img: "https://i.pravatar.cc/100?img=12" },
    { name: "Fatema Begum", role: "Investor, Banani", rating: 5, text: "Best investment decision. My property value has appreciated significantly within just 2 years.", img: "https://i.pravatar.cc/100?img=45" },
    { name: "Karim Hossain", role: "CEO, TechBD", rating: 5, text: "Their commercial space in Bashundhara transformed our business. Premium location, premium build.", img: "https://i.pravatar.cc/100?img=33" },
  ];

  const { data: dbReviews } = useQuery({
    queryKey: ["testimonials-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("section_items")
        .select("title,subtitle,description,image_url")
        .eq("section_key", "testimonials_list")
        .order("sort_order");
      return (data ?? []).map((r) => ({
        name: r.title || "Anonymous",
        role: r.subtitle || "",
        rating: 5,
        text: r.description || "",
        img: r.image_url || "https://i.pravatar.cc/100?img=1",
      }));
    },
  });

  const reviews = dbReviews && dbReviews.length > 0 ? dbReviews : defaults;
  return (
    <section className="py-14 md:py-24 bg-card/30">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag={t("testimonialsTag")} title={t("testimonialsTitle")} subtitle={t("testimonialsSubtitle")} />
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.name} className="rounded-xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-lg">
              <Quote className="h-8 w-8 text-brand/30" />
              <p className="my-4 text-sm leading-relaxed text-foreground/80">"{r.text}"</p>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-brand text-brand" />)}
              </div>
              <div className="flex items-center gap-3">
                <img src={r.img} alt={r.name} className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* 2. Video / Virtual Tour */
export function VideoTour() {
  const { t } = useLanguage();
  const videos = [
    { t: t("videoAerial"), img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800" },
    { t: t("videoApartment"), img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800" },
    { t: t("video360"), img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800" },
  ];
  return (
    <section className="py-14 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag={t("virtualTourTag")} title={t("virtualTourTitle")} subtitle={t("virtualTourSubtitle")} />
        <div className="grid gap-6 md:grid-cols-3">
          {videos.map((v) => (
            <div key={v.t} className="group relative aspect-video overflow-hidden rounded-xl">
              <img src={v.img} alt={v.t} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <button className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-black transition-transform group-hover:scale-110">
                  <Play className="h-7 w-7 fill-current ml-1" />
                </span>
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-white font-semibold">{v.t}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 3. Payment Calculator */
export function EmiCalculator() {
  const { t } = useLanguage();
  const [price, setPrice] = useState(1500000);
  const [downPct, setDownPct] = useState(20);
  const [months, setMonths] = useState(36);

  const ORANGE = "#ea580c";
  const NAVY = "#0f1b3d";

  const safePrice = Math.max(0, Number(price) || 0);
  const downAmt = Math.round((safePrice * downPct) / 100);
  const remaining = Math.max(0, safePrice - downAmt);
  const baseEmi = months > 0 ? Math.floor(remaining / months) : 0;
  const lastEmi = months > 0 ? remaining - baseEmi * (months - 1) : 0;
  const fmt = (v: number) => v.toLocaleString();

  return (
    <section className="py-14 md:py-24 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-6 lg:grid-cols-2 rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-sm">
          {/* LEFT: Inputs */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[3px]" style={{ color: ORANGE }}>
              <Calculator className="h-4 w-4" />
              {t("emiPaymentCalc")}
            </div>
            <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">
              {t("emiHeadline")}
            </h3>

            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("emiApartmentPrice")}
              </label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-base font-medium text-foreground focus:outline-none focus:ring-2"
                style={{ ['--tw-ring-color' as never]: ORANGE }}
              />
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>{t("emiDownPayment")}</span>
                <span className="text-foreground">{downPct}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={40}
                step={1}
                value={downPct}
                onChange={(e) => setDownPct(Number(e.target.value))}
                className="mt-2 w-full"
                style={{ accentColor: ORANGE }}
              />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>20%</span><span>25%</span><span>30%</span><span>35%</span><span>40%</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>{t("emiTenure")}</span>
                <span className="text-foreground">{months} {t("emiMonths")}</span>
              </div>
              <input
                type="range"
                min={24}
                max={72}
                step={1}
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="mt-2 w-full"
                style={{ accentColor: ORANGE }}
              />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>24m</span><span>36m</span><span>48m</span><span>60m</span><span>72m</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Summary */}
          <div className="flex flex-col">
            <div className="text-xs font-semibold uppercase tracking-[3px] text-muted-foreground">
              {t("emiEstimatedPlan")}
            </div>

            <div className="mt-4 divide-y divide-border">
              <Row label={t("emiPriceRow")} value={`৳${fmt(safePrice)}`} />
              <Row label={`${t("emiDownPaymentRow")} (${downPct}%)`} value={`৳${fmt(downAmt)}`} />
              <Row label={t("emiRemaining")} value={`৳${fmt(remaining)}`} />
              <Row label={t("emiTenure")} value={`${months} ${t("emiMonths")}`} />
            </div>

            <div className="mt-4 rounded-xl p-5 text-white" style={{ background: NAVY }}>
              <div className="text-[11px] font-semibold uppercase tracking-[3px]" style={{ color: ORANGE }}>
                {t("emiMonthly")}
              </div>
              <div className="mt-1 text-4xl font-bold">৳{fmt(baseEmi)}</div>
              <div className="mt-2 text-xs text-white/70">
                {t("emiRemainingNote")} ৳{fmt(remaining)} ÷ {months} {t("emiMonths")} · {downPct}% {t("emiPaidUpfront")}
              </div>
            </div>

            {lastEmi !== baseEmi && months > 0 && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
                ※ {t("emiLastNote")} <strong>৳{fmt(lastEmi)}</strong> {t("emiLastNoteEnd")}
              </div>
            )}

            <a
              href="#contact"
              className="mt-3 inline-flex items-center justify-center rounded-lg px-6 py-3 text-white font-semibold transition hover:opacity-90"
              style={{ background: ORANGE }}
            >
              {t("emiBookConsult")}
            </a>

            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              {t("emiDisclaimer")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

/* 4. Project Location Map */
export function LocationMap() {
  const { t } = useLanguage();
  const defaults = [
    { id: "d1", title: "Gulshan-2", description: "Gulshan-2, Dhaka, Bangladesh", link_url: null as string | null },
    { id: "d2", title: "Banani DOHS", description: "Banani DOHS, Dhaka, Bangladesh", link_url: null },
    { id: "d3", title: "Bashundhara R/A", description: "Bashundhara R/A, Dhaka, Bangladesh", link_url: null },
    { id: "d4", title: "Dhanmondi-27", description: "Dhanmondi 27, Dhaka, Bangladesh", link_url: null },
    { id: "d5", title: "Uttara Sector-7", description: "Uttara Sector 7, Dhaka, Bangladesh", link_url: null },
    { id: "d6", title: "Purbachal", description: "Purbachal, Dhaka, Bangladesh", link_url: null },
  ];

  const { data: dbLocs } = useQuery({
    queryKey: ["project-locations"],
    queryFn: async () => {
      const { data } = await supabase
        .from("section_items")
        .select("id,title,description,link_url,sort_order")
        .eq("section_key", "project_locations")
        .order("sort_order");
      return data ?? [];
    },
  });

  const locs = dbLocs && dbLocs.length > 0
    ? dbLocs.map((d) => ({
        id: d.id,
        title: d.title || "Location",
        description: d.description || d.title || "",
        link_url: d.link_url,
      }))
    : defaults;

  const [activeId, setActiveId] = useState<string>(locs[0]?.id ?? "");
  const active = locs.find((l) => l.id === activeId) ?? locs[0];
  const query = active?.description || active?.title || "Dhaka";
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  return (
    <section className="py-14 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag={t("locationsTag")} title={t("findProjects")} subtitle={t("findProjectsSub")} />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-border h-[420px]">
            <iframe
              key={mapSrc}
              title="Project Locations"
              src={mapSrc}
              width="100%" height="100%" loading="lazy" style={{ border: 0 }} />
          </div>
          <div className="space-y-3">
            {locs.map((loc) => {
              const isActive = loc.id === active?.id;
              const href =
                loc.link_url && loc.link_url.trim().length > 0
                  ? loc.link_url
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.description || loc.title)}`;
              return (
                <div
                  key={loc.id}
                  onClick={() => setActiveId(loc.id)}
                  className={`flex items-center gap-3 rounded-lg border bg-card p-4 transition cursor-pointer ${
                    isActive ? "border-brand ring-1 ring-brand/30" : "border-border hover:border-brand"
                  }`}
                >
                  <MapPin className={`h-5 w-5 ${isActive ? "text-brand" : "text-brand/70"}`} />
                  <span className="font-medium text-sm">{loc.title}</span>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-brand"
                    aria-label={`Open ${loc.title} in Google Maps`}
                    title="Open in Google Maps"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 5. Awards & Certifications */
export function Awards() {
  const { t } = useLanguage();
  const awards = [
    { t: t("rehabMember"), d: t("awardRehabSince"), icon: Award },
    { t: t("isoCertified"), d: t("awardIsoQuality"), icon: FileCheck },
    { t: t("awardBestDev"), d: t("awardBestDevSub"), icon: Star },
    { t: t("awardGreen"), d: t("awardGreenSub"), icon: Award },
  ];
  return (
    <section className="py-14 md:py-24 bg-card/30">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag={t("recognitionTag")} title={t("awardsCertTitle")} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {awards.map((a) => (
            <div key={a.t} className="text-center rounded-xl border border-border bg-card p-7 hover:border-brand transition">
              <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "color-mix(in oklab, var(--brand) 15%, transparent)", color: "var(--brand)" }}>
                <a.icon className="h-7 w-7" />
              </div>
              <h3 className="font-bold mb-1">{a.t}</h3>
              <p className="text-xs text-muted-foreground">{a.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 6. Construction Progress */
export function Progress() {
  const { t } = useLanguage();
  const items = [
    { t: "Starline Heights", p: 75, img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600" },
    { t: "Starline Residence", p: 40, img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600" },
    { t: "Starline Tower", p: 90, img: "https://images.unsplash.com/photo-1590725140246-20acdee442be?w=600" },
  ];
  return (
    <section className="py-14 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag={t("liveUpdatesTag")} title={t("constructionProgress")} subtitle={t("constructionSub")} />
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((i) => (
            <div key={i.t} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative aspect-video">
                <img src={i.img} alt={i.t} className="h-full w-full object-cover" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur px-3 py-1 text-xs text-white">
                  <HardHat className="h-3 w-3" /> {t("liveLabel")}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold">{i.t}</h3>
                  <span className="text-sm font-semibold text-brand">{i.p}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand to-yellow-400" style={{ width: `${i.p}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 7. Blog */
export function Blog() {
  const { t } = useLanguage();
  const posts = [
    { t: t("blogPost1"), c: t("blogPost1Cat"), img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600" },
    { t: t("blogPost2"), c: t("blogPost2Cat"), img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600" },
    { t: t("blogPost3"), c: t("blogPost3Cat"), img: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600" },
  ];
  return (
    <section className="py-14 md:py-24 bg-card/30">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag={t("blogTag")} title={t("blogTitle")} subtitle={t("blogSubtitle")} />
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <article key={p.t} className="group overflow-hidden rounded-xl border border-border bg-card hover:-translate-y-1 transition-all">
              <div className="aspect-video overflow-hidden">
                <img src={p.img} alt={p.t} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand">{p.c}</span>
                <h3 className="mt-2 font-bold leading-snug group-hover:text-brand transition">{p.t}</h3>
                <div className="mt-3 flex items-center text-sm text-muted-foreground gap-1">
                  {t("readMore")} <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 8. Partners */
export function Partners() {
  const { t } = useLanguage();
  const partners = ["DBBL", "BRAC Bank", "City Bank", "IDLC", "EBL", "HSBC", "Standard Chartered", "Prime Bank"];
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag={t("partnersTag")} title={t("partnersTitle")} subtitle={t("partnersSubtitle")} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {partners.map((p) => (
            <div key={p} className="flex items-center justify-center h-20 rounded-lg border border-border bg-card hover:border-brand transition">
              <div className="flex items-center gap-2">
                <Handshake className="h-5 w-5 text-brand" />
                <span className="font-bold text-sm">{p}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 9. Legal / NOC */
export function LegalDocs() {
  const { t } = useLanguage();
  const docs = [
    { t: t("docRajuk"), d: t("docRajukSub") },
    { t: t("docNoc"), d: t("docNocSub") },
    { t: t("docLandMut"), d: t("docLandMutSub") },
    { t: t("docFire"), d: t("docFireSub") },
  ];
  return (
    <section className="py-14 md:py-24 bg-card/30">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag={t("transparencyTag")} title={t("legalTitle")} subtitle={t("legalSubtitle")} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {docs.map((d) => (
            <div key={d.t} className="rounded-xl border border-border bg-card p-6 hover:border-brand transition">
              <FileCheck className="h-8 w-8 text-brand mb-3" />
              <h3 className="font-bold mb-1">{d.t}</h3>
              <p className="text-xs text-muted-foreground">{d.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 10. Floor Plan Viewer */
export function FloorPlan() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const plans = [
    { t: t("plan1"), img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900" },
    { t: t("plan2"), img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900" },
    { t: t("plan3"), img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900" },
  ];
  return (
    <section className="py-14 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag={t("floorPlansTag")} title={t("floorPlansTitle")} subtitle={t("floorPlansSub")} />
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex flex-wrap gap-2 p-4 border-b border-border">
            {plans.map((p, i) => (
              <button key={p.t} onClick={() => setActive(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${active === i ? "bg-brand text-black" : "bg-background hover:bg-accent/30"}`}>
                <LayoutGrid className="inline h-4 w-4 mr-1.5" />{p.t}
              </button>
            ))}
          </div>
          <div className="aspect-[16/9] bg-background">
            <img src={plans[active].img} alt={plans[active].t} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* 11. Live Chat / WhatsApp */
export function LiveChat() {
  const { t } = useLanguage();
  return (
    <section className="py-14 md:py-24 bg-card/30">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-brand/15 to-brand/5 p-10 text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-brand mb-4" />
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)" }}>{t("chatTitle")}</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{t("chatSubtitle")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://wa.me/8801700000000" className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-white font-semibold hover:opacity-90">
              <MessageCircle className="h-5 w-5" /> {t("chatWhatsapp")}
            </a>
            <a href="tel:+8801700000000" className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-black font-semibold hover:opacity-90">
              <Phone className="h-5 w-5" /> {t("chatCallNow")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 12. Careers */
export function Careers() {
  const { t } = useLanguage();
  const jobs = [
    { t: t("jobCivil"), l: t("jobLocDhakaHQ"), type: t("jobFullTime") },
    { t: t("jobSales"), l: t("jobLocGulshan"), type: t("jobFullTime") },
    { t: t("jobMkt"), l: t("jobLocDhaka"), type: t("jobFullTime") },
  ];
  return (
    <section className="py-14 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag={t("careersTag")} title={t("joinTeam")} subtitle={t("joinTeamSub")} />
        <div className="grid gap-4 md:grid-cols-3">
          {jobs.map((j) => (
            <div key={j.t} className="rounded-xl border border-border bg-card p-6 hover:border-brand transition">
              <Briefcase className="h-7 w-7 text-brand mb-3" />
              <h3 className="font-bold">{j.t}</h3>
              <div className="mt-2 text-sm text-muted-foreground">{j.l} • {j.type}</div>
              <button className="mt-4 text-sm font-semibold text-brand hover:underline inline-flex items-center gap-1">
                {t("applyNow")} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="#" className="text-sm font-semibold text-brand hover:underline">{t("viewAllOpenings")}</a>
        </div>
      </div>
    </section>
  );
}

/* 13. ROI Calculator */
export function RoiCalculator() {
  const { t } = useLanguage();
  const [invest, setInvest] = useState(5000000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(12);
  const future = Math.round(invest * Math.pow(1 + rate / 100, years));
  const profit = future - invest;
  return (
    <section className="py-14 md:py-24 bg-card/30">
      <div className="container mx-auto max-w-6xl px-4">
        <SectionHeader tag={t("investmentTag")} title={t("roiTitle")} subtitle={t("roiSub")} />
        <div className="grid gap-8 lg:grid-cols-2 rounded-2xl border border-border bg-card p-5 sm:p-8">
          <div className="space-y-6">
            {[
              { label: t("roiInvestAmt"), val: invest, set: setInvest, min: 500000, max: 100000000, step: 100000 },
              { label: t("roiHolding"), val: years, set: setYears, min: 1, max: 20, step: 1 },
              { label: t("roiAppreciation"), val: rate, set: setRate, min: 5, max: 25, step: 0.5 },
            ].map((f) => (
              <div key={f.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{f.label}</span>
                  <span className="font-semibold text-brand">{f.val.toLocaleString()}</span>
                </div>
                <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
                  onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-brand" />
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 p-6 sm:p-8 text-center">
            <TrendingUp className="mx-auto h-10 w-10 text-brand mb-3" />
            <div className="text-sm text-muted-foreground">{t("roiFutureValue")}</div>
            <div className="text-4xl font-bold text-brand my-2">৳ {future.toLocaleString()}</div>
            <div className="mt-2 text-sm text-green-500 font-semibold">+ ৳ {profit.toLocaleString()} {t("roiProfit")}</div>
            <div className="mt-6 text-xs text-muted-foreground">{t("roiDisclaimer")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ExtraSections() {
  return (
    <>
      <Testimonials />
      <VideoTour />
      <EmiCalculator />
      <LocationMap />
      <Awards />
      <Progress />
      <Blog />
      <Partners />
      <LegalDocs />
      <FloorPlan />
      <LiveChat />
      <Careers />
      <RoiCalculator />
    </>
  );
}
