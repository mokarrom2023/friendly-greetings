import { useState } from "react";
import {
  Star, Play, Calculator, MapPin, Award, HardHat, BookOpen,
  Handshake, FileCheck, LayoutGrid, MessageCircle, Briefcase, TrendingUp,
  Quote, ChevronRight, Phone
} from "lucide-react";

const SectionHeader = ({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) => (
  <div className="mx-auto mb-12 max-w-2xl text-center">
    <span className="text-xs font-semibold uppercase tracking-[4px] text-brand">{tag}</span>
    <h2 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
      {title}
    </h2>
    {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
  </div>
);

/* 1. Testimonials */
export function Testimonials() {
  const reviews = [
    { name: "Rahim Ahmed", role: "Homeowner, Gulshan", rating: 5, text: "Starline delivered exactly what they promised. Quality construction, on-time handover, and excellent after-sales service.", img: "https://i.pravatar.cc/100?img=12" },
    { name: "Fatema Begum", role: "Investor, Banani", rating: 5, text: "Best investment decision. My property value has appreciated significantly within just 2 years.", img: "https://i.pravatar.cc/100?img=45" },
    { name: "Karim Hossain", role: "CEO, TechBD", rating: 5, text: "Their commercial space in Bashundhara transformed our business. Premium location, premium build.", img: "https://i.pravatar.cc/100?img=33" },
  ];
  return (
    <section className="py-24 bg-card/30">
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
    <section className="py-24">
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

/* 3. EMI Calculator */
export function EmiCalculator() {
  const [price, setPrice] = useState(5000000);
  const [down, setDown] = useState(1000000);
  const [months, setMonths] = useState(180);
  const [rate, setRate] = useState(9);
  const principal = Math.max(0, price - down);
  const r = rate / 12 / 100;
  const n = months;
  const emi =
    principal > 0 && r > 0
      ? Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
      : principal > 0
      ? Math.round(principal / n)
      : 0;
  const total = emi * n;
  const interest = total - principal;

  const GREEN = "#16a34a";
  const fields = [
    { label: "Property Price (৳)", val: price, set: setPrice, min: 100000, max: 50000000, step: 10000, fmt: (v: number) => v.toLocaleString() },
    { label: "Down Payment (৳)", val: down, set: setDown, min: 0, max: price, step: 50000, fmt: (v: number) => v.toLocaleString() },
    { label: "Loan Tenure (Months)", val: months, set: setMonths, min: 6, max: 360, step: 1, fmt: (v: number) => `${v} mo` },
    { label: "Interest Rate (%)", val: rate, set: setRate, min: 0.5, max: 18, step: 0.5, fmt: (v: number) => `${v}%` },
  ];

  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto max-w-6xl px-4">
        <SectionHeader tag="EMI Calculator" title="Plan Your Investment" subtitle="Calculate your monthly installment instantly" />
        <div
          className="grid gap-8 lg:grid-cols-2 rounded-2xl border bg-card p-8"
          style={{ borderColor: `${GREEN}33` }}
        >
          <div className="space-y-6">
            {fields.map((f) => (
              <div key={f.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{f.label}</span>
                  <span className="font-semibold" style={{ color: GREEN }}>{f.fmt(f.val)}</span>
                </div>
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={f.val}
                  onChange={(e) => f.set(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: GREEN }}
                />
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>{f.fmt(f.min)}</span>
                  <span>{f.fmt(f.max)}</span>
                </div>
              </div>
            ))}
          </div>
          <div
            className="flex flex-col justify-center rounded-xl p-8 text-center"
            style={{ background: `linear-gradient(135deg, ${GREEN}22, ${GREEN}08)` }}
          >
            <Calculator className="mx-auto h-10 w-10 mb-3" style={{ color: GREEN }} />
            <div className="text-sm text-muted-foreground">Monthly EMI</div>
            <div className="text-4xl font-bold my-2" style={{ color: GREEN }}>
              ৳ {emi.toLocaleString()}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-background/50 p-3">
                <div className="text-muted-foreground text-xs">Principal</div>
                <div className="font-semibold">৳ {principal.toLocaleString()}</div>
              </div>
              <div className="rounded-lg bg-background/50 p-3">
                <div className="text-muted-foreground text-xs">Total Interest</div>
                <div className="font-semibold">৳ {interest.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 4. Project Location Map */
export function LocationMap() {
  return (
    <section className="py-24">
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
    <section className="py-24 bg-card/30">
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
    <section className="py-24">
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
    <section className="py-24 bg-card/30">
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
    <section className="py-20">
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
    <section className="py-24 bg-card/30">
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
    <section className="py-24">
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
    <section className="py-24 bg-card/30">
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
    <section className="py-24">
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
    <section className="py-24 bg-card/30">
      <div className="container mx-auto max-w-6xl px-4">
        <SectionHeader tag="Investment" title="ROI Calculator" subtitle="Estimate your return on commercial property investment" />
        <div className="grid gap-8 lg:grid-cols-2 rounded-2xl border border-border bg-card p-8">
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
          <div className="flex flex-col justify-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 p-8 text-center">
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
