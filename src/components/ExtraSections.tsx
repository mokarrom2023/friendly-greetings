import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Star, Play, Calculator, MapPin, Award, HardHat, BookOpen,
  Handshake, FileCheck, LayoutGrid, MessageCircle, Briefcase, TrendingUp,
  Quote, ChevronRight, Phone
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
        <SectionHeader tag="Testimonials" title="What Our Clients Say" subtitle="Trusted by 5000+ happy families across Bangladesh" />
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
  return (
    <section className="py-14 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag="Virtual Tour" title="Experience Our Projects in 360°" subtitle="Drone footage, walkthroughs, and immersive virtual tours" />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { t: "Aerial Drone Tour", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800" },
            { t: "Apartment Walkthrough", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800" },
            { t: "360° Virtual Reality", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800" },
          ].map((v) => (
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
              Payment Calculator
            </div>
            <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">
              See your monthly payment instantly
            </h3>

            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Apartment Price (BDT)
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
                <span>Down Payment</span>
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
                <span>Tenure</span>
                <span className="text-foreground">{months} months</span>
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
              Your Estimated Plan
            </div>

            <div className="mt-4 divide-y divide-border">
              <Row label="Apartment Price" value={`৳${fmt(safePrice)}`} />
              <Row label={`Down Payment (${downPct}%)`} value={`৳${fmt(downAmt)}`} />
              <Row label="Remaining Balance" value={`৳${fmt(remaining)}`} />
              <Row label="Tenure" value={`${months} months`} />
            </div>

            <div className="mt-4 rounded-xl p-5 text-white" style={{ background: NAVY }}>
              <div className="text-[11px] font-semibold uppercase tracking-[3px]" style={{ color: ORANGE }}>
                Monthly Installment
              </div>
              <div className="mt-1 text-4xl font-bold">৳{fmt(baseEmi)}</div>
              <div className="mt-2 text-xs text-white/70">
                Remaining ৳{fmt(remaining)} ÷ {months} months · {downPct}% down paid upfront
              </div>
            </div>

            {lastEmi !== baseEmi && months > 0 && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
                ※ Last installment will be <strong>৳{fmt(lastEmi)}</strong> to settle the balance exactly.
              </div>
            )}

            <a
              href="#contact"
              className="mt-3 inline-flex items-center justify-center rounded-lg px-6 py-3 text-white font-semibold transition hover:opacity-90"
              style={{ background: ORANGE }}
            >
              Book a Free Consultation
            </a>

            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              * Indicative figures only. Final plan and tenure depend on the selected project.
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
  return (
    <section className="py-14 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag="Locations" title="Find Our Projects" subtitle="Strategic locations across Dhaka's most prestigious neighborhoods" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-border h-[420px]">
            <iframe
              title="Project Locations"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d29215.158!2d90.4125!3d23.7937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1700000000000"
              width="100%" height="100%" loading="lazy" style={{ border: 0 }} />
          </div>
          <div className="space-y-3">
            {["Gulshan-2", "Banani DOHS", "Bashundhara R/A", "Dhanmondi-27", "Uttara Sector-7", "Purbachal"].map((loc) => (
              <div key={loc} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 hover:border-brand transition">
                <MapPin className="h-5 w-5 text-brand" />
                <span className="font-medium text-sm">{loc}</span>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 5. Awards & Certifications */
export function Awards() {
  const awards = [
    { t: "REHAB Member", d: "Since 2010", icon: Award },
    { t: "ISO 9001:2015", d: "Quality Certified", icon: FileCheck },
    { t: "Best Developer 2023", d: "Bangladesh Property Awards", icon: Star },
    { t: "Green Building Award", d: "Sustainable Design", icon: Award },
  ];
  return (
    <section className="py-14 md:py-24 bg-card/30">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag="Recognition" title="Awards & Certifications" />
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
  const items = [
    { t: "Starline Heights", p: 75, img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600" },
    { t: "Starline Residence", p: 40, img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600" },
    { t: "Starline Tower", p: 90, img: "https://images.unsplash.com/photo-1590725140246-20acdee442be?w=600" },
  ];
  return (
    <section className="py-14 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag="Live Updates" title="Construction Progress" subtitle="Real-time updates from our ongoing project sites" />
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((i) => (
            <div key={i.t} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative aspect-video">
                <img src={i.img} alt={i.t} className="h-full w-full object-cover" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur px-3 py-1 text-xs text-white">
                  <HardHat className="h-3 w-3" /> Live
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
  const posts = [
    { t: "Top 5 Investment Areas in Dhaka 2026", c: "Investment Guide", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600" },
    { t: "How to Choose Your Dream Apartment", c: "Buyer Tips", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600" },
    { t: "Bangladesh Real Estate Market Trends", c: "Market Report", img: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600" },
  ];
  return (
    <section className="py-14 md:py-24 bg-card/30">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag="Blog" title="Real Estate Insights" subtitle="Expert advice, market trends, and buying guides" />
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
                  Read More <ChevronRight className="h-4 w-4" />
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
  const partners = ["DBBL", "BRAC Bank", "City Bank", "IDLC", "EBL", "HSBC", "Standard Chartered", "Prime Bank"];
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag="Partners" title="Our Trusted Partners" subtitle="Leading banks, architects & contractors who work with us" />
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
  const docs = [
    { t: "RAJUK Approval", d: "All projects approved" },
    { t: "NOC Certificate", d: "Environmental clearance" },
    { t: "Land Mutation", d: "Verified title deed" },
    { t: "Fire Safety Cert.", d: "Bangladesh Fire Service" },
  ];
  return (
    <section className="py-14 md:py-24 bg-card/30">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag="Transparency" title="Legal & Compliance" subtitle="Full transparency — all our documents are publicly verifiable" />
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
  const [active, setActive] = useState(0);
  const plans = [
    { t: "1285 sqft - 3 Bed", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900" },
    { t: "1500 sqft - 4 Bed", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900" },
    { t: "2200 sqft - Duplex", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900" },
  ];
  return (
    <section className="py-14 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag="Floor Plans" title="Interactive Floor Plans" subtitle="Explore detailed 2D & 3D layouts of our apartments" />
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
  return (
    <section className="py-14 md:py-24 bg-card/30">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-brand/15 to-brand/5 p-10 text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-brand mb-4" />
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)" }}>Talk to Us Instantly</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Our property experts are available 24/7 on WhatsApp, Messenger & Telegram. Get instant answers to all your queries.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://wa.me/8801700000000" className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-white font-semibold hover:opacity-90">
              <MessageCircle className="h-5 w-5" /> WhatsApp
            </a>
            <a href="tel:+8801700000000" className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-black font-semibold hover:opacity-90">
              <Phone className="h-5 w-5" /> Call Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 12. Careers */
export function Careers() {
  const jobs = [
    { t: "Senior Civil Engineer", l: "Dhaka HQ", type: "Full-time" },
    { t: "Sales Manager", l: "Gulshan Office", type: "Full-time" },
    { t: "Marketing Executive", l: "Dhaka", type: "Full-time" },
  ];
  return (
    <section className="py-14 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeader tag="Careers" title="Join Our Team" subtitle="Build your career with Bangladesh's leading real estate developer" />
        <div className="grid gap-4 md:grid-cols-3">
          {jobs.map((j) => (
            <div key={j.t} className="rounded-xl border border-border bg-card p-6 hover:border-brand transition">
              <Briefcase className="h-7 w-7 text-brand mb-3" />
              <h3 className="font-bold">{j.t}</h3>
              <div className="mt-2 text-sm text-muted-foreground">{j.l} • {j.type}</div>
              <button className="mt-4 text-sm font-semibold text-brand hover:underline inline-flex items-center gap-1">
                Apply Now <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="#" className="text-sm font-semibold text-brand hover:underline">View All Openings →</a>
        </div>
      </div>
    </section>
  );
}

/* 13. ROI Calculator */
export function RoiCalculator() {
  const [invest, setInvest] = useState(5000000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(12);
  const future = Math.round(invest * Math.pow(1 + rate / 100, years));
  const profit = future - invest;
  return (
    <section className="py-14 md:py-24 bg-card/30">
      <div className="container mx-auto max-w-6xl px-4">
        <SectionHeader tag="Investment" title="ROI Calculator" subtitle="Estimate your return on commercial property investment" />
        <div className="grid gap-8 lg:grid-cols-2 rounded-2xl border border-border bg-card p-5 sm:p-8">
          <div className="space-y-6">
            {[
              { label: "Investment Amount (৳)", val: invest, set: setInvest, min: 500000, max: 100000000, step: 100000 },
              { label: "Holding Period (Years)", val: years, set: setYears, min: 1, max: 20, step: 1 },
              { label: "Expected Annual Appreciation (%)", val: rate, set: setRate, min: 5, max: 25, step: 0.5 },
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
            <div className="text-sm text-muted-foreground">Estimated Future Value</div>
            <div className="text-4xl font-bold text-brand my-2">৳ {future.toLocaleString()}</div>
            <div className="mt-2 text-sm text-green-500 font-semibold">+ ৳ {profit.toLocaleString()} profit</div>
            <div className="mt-6 text-xs text-muted-foreground">*Indicative figures based on historical Dhaka market trends</div>
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
