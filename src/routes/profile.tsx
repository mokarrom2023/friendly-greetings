import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Building2,
  Award,
  Users,
  Newspaper,
  ShieldCheck,
  FileText,
  Hash,
  BadgeCheck,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { getAllNews } from "@/lib/properties-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Company Profile — STARLINE BUILDERS LTD." },
      {
        name: "description",
        content:
          "Company profile of Starline Builders Ltd. — history, board of directors, employees, latest news, REHAB membership and legal credentials (TIN, BIN, Trade License).",
      },
      { property: "og:title", content: "Company Profile — Starline Builders Ltd." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700;800&family=Hind+Siliguri:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground">
          <TopBar />
          <Navbar />
          <main className="pt-24">
            <ProfileHero />
            <CompanyHistory />
            <BoardOfDirectors />
            <Employees />
            <LatestNews />
            <Credentials />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

/* ----- helpers ----- */
function useHashScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.location.hash.replace("#", "");
    if (id) {
      const el = document.getElementById(id);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  }, []);
}

function ProfileHero() {
  const { t } = useLanguage();
  useHashScroll();
  return (
    <section
      className="relative overflow-hidden border-b border-border py-20"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklab, var(--primary) 95%, black) 0%, var(--primary) 100%)",
      }}
    >
      <div className="container mx-auto max-w-5xl px-4 text-center text-white">
        <span
          className="text-xs font-semibold uppercase tracking-[4px]"
          style={{ color: "#f4cf5b" }}
        >
          {t("profileTag")}
        </span>
        <h1
          className="mt-3 text-4xl font-bold sm:text-5xl md:text-6xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {t("profileTitle")}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm text-white/80 sm:text-base">
          {t("profileSubtitle")}
        </p>
      </div>
    </section>
  );
}

/* ----- 1. Company History ----- */
function CompanyHistory() {
  const { t } = useLanguage();
  const milestones = [
    { year: "2008", text: t("historyP1") },
    { year: "2014", text: "Delivered first 10 projects across Banani & Gulshan." },
    { year: "2018", text: "Crossed 25 completed projects and 100+ happy families." },
    { year: "2022", text: "Awarded REHAB Excellence in Quality Construction." },
    { year: "2026", text: "50+ landmark projects delivered, 200+ team members strong." },
  ];

  return (
    <section id="history" className="border-b border-border py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <SectionHeader icon={Building2} tag="01" title={t("historyTitle")} />

        <div className="mx-auto mt-10 grid max-w-4xl gap-5 text-base leading-relaxed text-muted-foreground">
          <p>{t("historyP1")}</p>
          <p>{t("historyP2")}</p>
          <p>{t("historyP3")}</p>
        </div>

        <h3
          className="mt-14 text-center text-2xl font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {t("milestonesTitle")}
        </h3>

        <ol className="relative mx-auto mt-8 max-w-3xl border-l-2 border-brand/30 pl-6">
          {milestones.map((m) => (
            <li key={m.year} className="relative mb-8 last:mb-0">
              <span
                className="absolute -left-[34px] flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: "var(--brand)" }}
              >
                ★
              </span>
              <div className="text-sm font-semibold text-brand">{m.year}</div>
              <p className="mt-1 text-sm text-foreground/85">{m.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ----- 2. Board of Directors ----- */
function BoardOfDirectors() {
  const { t } = useLanguage();
  const board = [
    { name: "Md. Rafiqul Islam", role: t("chairman"), initials: "RI" },
    { name: "Eng. Tanvir Ahmed", role: t("managingDirector"), initials: "TA" },
    { name: "Mr. Shahed Khan", role: t("director"), initials: "SK" },
    { name: "Ms. Farzana Rahman", role: t("director"), initials: "FR" },
  ];

  return (
    <section id="board" className="bg-secondary/40 border-b border-border py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <SectionHeader icon={Award} tag="02" title={t("boardTitle")} sub={t("boardSubtitle")} />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {board.map((p) => (
            <div
              key={p.name}
              className="group rounded-2xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:border-brand hover:shadow-lg"
            >
              <div
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, var(--primary), var(--brand))",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {p.initials}
              </div>
              <div
                className="mt-5 text-lg font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {p.name}
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand">
                {p.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----- 3. Employees ----- */
function Employees() {
  const { t } = useLanguage();
  const departments = [
    { slug: "engineering", label: t("engineering"), count: 48 },
    { slug: "architecture", label: t("architecture"), count: 22 },
    { slug: "construction", label: t("construction"), count: 86 },
    { slug: "sales", label: t("sales"), count: 24 },
    { slug: "finance", label: t("finance"), count: 12 },
    { slug: "customer-care", label: t("customerCare"), count: 18 },
  ];

  const stats = [
    { value: "210+", label: t("employeesCount") },
    { value: "6", label: t("departmentsCount") },
    { value: "17+", label: t("yearsExp") },
  ];

  return (
    <section id="employees" className="border-b border-border py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <SectionHeader
          icon={Users}
          tag="03"
          title={t("employeesTitle")}
          sub={t("employeesSubtitle")}
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-card p-6 text-center"
            >
              <div
                className="text-3xl font-bold text-brand sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {s.value}
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <Link
              key={d.slug}
              to="/departments/$slug"
              params={{ slug: d.slug }}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
            >
              <div className="text-sm font-semibold">{d.label}</div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-brand" />
                <span className="text-lg font-bold text-brand">{d.count}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----- 4. Latest News ----- */
function LatestNews() {
  const { t } = useLanguage();

  const staticNews = [
    {
      tag: "Project Launch",
      date: "May 18, 2026",
      title: "Starline Lake View – Purbachal handover ceremony",
      excerpt:
        "Our flagship Purbachal project welcomed 42 families this week with an elegant handover event.",
      to: null as null | { propertyId: number; newsId: number },
    },
    {
      tag: "Award",
      date: "April 02, 2026",
      title: "REHAB Excellence Award 2026 — Quality Construction",
      excerpt:
        "Starline Builders has been recognized once again for outstanding construction quality.",
      to: null,
    },
  ];

  const propertyNews = getAllNews().map((n) => ({
    tag: n.tag,
    date: n.date,
    title: `${n.propertyTitle} — ${n.title}`,
    excerpt: n.excerpt,
    to: { propertyId: n.propertyId, newsId: n.id },
  }));

  const news = [...staticNews, ...propertyNews];

  return (
    <section id="news" className="bg-secondary/40 border-b border-border py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <SectionHeader
          icon={Newspaper}
          tag="04"
          title={t("newsTitle")}
          sub={t("newsSubtitle")}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {news.map((n) => {
            const card = (
              <>
                <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider">
                  <span
                    className="rounded-full px-2.5 py-1"
                    style={{
                      background: "color-mix(in oklab, var(--brand) 15%, transparent)",
                      color: "var(--brand)",
                    }}
                  >
                    {n.tag}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {n.date}
                  </span>
                </div>
                <h3
                  className="mt-4 text-lg font-bold leading-snug"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {n.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{n.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand transition-all group-hover:gap-2.5">
                  {t("readMore")} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </>
            );

            const cls =
              "group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-brand hover:shadow-lg";

            return n.to ? (
              <Link
                key={n.title}
                to="/properties/$id/news/$newsId"
                params={{
                  id: String(n.to.propertyId),
                  newsId: String(n.to.newsId),
                }}
                className={cls}
              >
                {card}
              </Link>
            ) : (
              <article key={n.title} className={cls}>
                {card}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ----- 5. Credentials ----- */
function Credentials() {
  const { t } = useLanguage();
  const items = [
    { icon: ShieldCheck, title: t("rehabMember"), value: t("rehabMemberDesc") },
    { icon: FileText, title: t("tradeLicense"), value: t("tradeLicenseNo") },
    { icon: Hash, title: t("tinCertificate"), value: t("tinNo") },
    { icon: Hash, title: t("binCertificate"), value: t("binNo") },
    { icon: BadgeCheck, title: t("incorporationCert"), value: t("incorporationNo") },
    { icon: Award, title: t("isoCertified"), value: t("isoCertifiedDesc") },
  ];

  return (
    <section id="rehab" className="py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <SectionHeader
          icon={ShieldCheck}
          tag="05"
          title={t("credentialsTitle")}
          sub={t("credentialsSubtitle")}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <div
              key={c.title}
              className="flex gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-brand hover:shadow-md"
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "color-mix(in oklab, var(--brand) 15%, transparent)",
                  color: "var(--brand)",
                }}
              >
                <c.icon className="h-6 w-6" />
              </div>
              <div>
                <div
                  className="text-sm font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {c.title}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{c.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----- shared header ----- */
function SectionHeader({
  icon: Icon,
  tag,
  title,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-border bg-card px-4 py-1.5">
        <Icon className="h-3.5 w-3.5 text-brand" />
        <span className="text-[10px] font-semibold uppercase tracking-[3px] text-muted-foreground">
          Section {tag}
        </span>
      </div>
      <h2
        className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h2>
      {sub && <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}
