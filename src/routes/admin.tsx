import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  Loader2, Plus, Pencil, Trash2, LogOut, Upload, Save, CheckCircle2,
  ArrowLeft, LayoutDashboard, Image as ImageIcon, Video, Shield, Eye, EyeOff,
  Mail, MailOpen, Users, Inbox, Link as LinkIcon, Phone, MessageCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  claimAdminIfFirst, checkIsAdmin,
  saveTeamMember, deleteTeamMember,
  saveSiteSection, saveSectionItem, deleteSectionItem,
  listContactMessages, markMessageRead, deleteContactMessage,
  getAdminStats, saveSocialLinks,
  listNewsletterSubscribers, deleteNewsletterSubscriber, listAuthUsers,
} from "@/lib/admin.functions";
import { SECTIONS, SECTION_GROUPS, type SectionConfig } from "@/lib/admin-sections";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Starline Builders Ltd." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

export type AdminThemeId = "gold" | "light" | "gray" | "ocean" | "midnight";
export const ADMIN_THEMES: { id: AdminThemeId; label: string; swatch: string; bg: string }[] = [
  { id: "gold", label: "Black + Gold (default)", swatch: "#c9a84c", bg: "#0d0d0d" },
  { id: "light", label: "Clean Light", swatch: "#4f46e5", bg: "#ffffff" },
  { id: "gray", label: "Soft Gray", swatch: "#475569", bg: "#f1f5f9" },
  { id: "ocean", label: "Ocean Blue", swatch: "#2563eb", bg: "#eff6ff" },
  { id: "midnight", label: "Midnight Cyan", swatch: "#22d3ee", bg: "#1e1b4b" },
];

function getInitialAdminTheme(): AdminThemeId {
  if (typeof window === "undefined") return "gold";
  const v = localStorage.getItem("admin_theme") as AdminThemeId | null;
  return v && ADMIN_THEMES.some((t) => t.id === v) ? v : "gold";
}

function AdminPage() {
  const [session, setSession] = useState<null | { userId: string; email: string }>(null);
  const [loading, setLoading] = useState(true);
  const [adminTheme, setAdminThemeState] = useState<AdminThemeId>("gold");

  useEffect(() => { setAdminThemeState(getInitialAdminTheme()); }, []);

  const setAdminTheme = (t: AdminThemeId) => {
    setAdminThemeState(t);
    try { localStorage.setItem("admin_theme", t); } catch { /* ignore */ }
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s?.user ? { userId: s.user.id, email: s.user.email ?? "" } : null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session?.user
        ? { userId: data.session.user.id, email: data.session.user.email ?? "" }
        : null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Default attribute is "gold" (which equals the base .admin-theme palette).
  const themeAttr = adminTheme === "gold" ? undefined : adminTheme;

  if (loading)
    return (
      <div className="admin-theme flex min-h-screen items-center justify-center bg-background" data-admin-theme={themeAttr}>
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="admin-theme min-h-screen bg-background text-foreground" data-admin-theme={themeAttr}>
      {session
        ? <Dashboard email={session.email} adminTheme={adminTheme} setAdminTheme={setAdminTheme} />
        : <AdminAuthForm />}
    </div>
  );
}

/* ---------------- Admin Auth ---------------- */
function AdminAuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-black/40 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h1 className="mt-3 text-xl font-bold text-primary" style={{ fontFamily: "var(--font-heading)" }}>
              Admin {mode === "login" ? "Login" : "Sign Up"}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              First user to sign up becomes admin automatically.
            </p>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-3">
            <input
              type="email" required placeholder="Admin email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
            <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 transition focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30">
              <input
                type={show ? "text" : "password"} required minLength={6} placeholder="Password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground outline-none"
              />
              <button type="button" onClick={() => setShow((v) => !v)} className="text-muted-foreground hover:text-primary">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {err && <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</p>}
            <button
              type="submit" disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Login as Admin" : "Create Admin Account"}
            </button>
          </form>
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-4 w-full text-xs text-muted-foreground hover:text-brand"
          >
            {mode === "login" ? "Need an admin account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Admin Check Wrapper ---------------- */
function Dashboard({ email, adminTheme, setAdminTheme }: { email: string; adminTheme: AdminThemeId; setAdminTheme: (t: AdminThemeId) => void }) {
  const claim = useServerFn(claimAdminIfFirst);
  const check = useServerFn(checkIsAdmin);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try { await claim(); } catch { /* ignore */ }
      try { const r = await check(); setIsAdmin(r.isAdmin); }
      catch { setIsAdmin(false); }
    })();
  }, [claim, check]);

  if (isAdmin === null)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );

  if (!isAdmin)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4">
        <Shield className="h-12 w-12 text-muted-foreground" />
        <p className="text-center text-sm text-muted-foreground">
          You are signed in as <b className="text-foreground">{email}</b> but do not have admin access.
        </p>
        <button onClick={() => supabase.auth.signOut()} className="rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground hover:bg-accent">
          Sign out
        </button>
      </div>
    );

  return <AdminConsole email={email} adminTheme={adminTheme} setAdminTheme={setAdminTheme} />;
}

/* ---------------- Admin Console with Sidebar ---------------- */
function AdminConsole({ email, adminTheme, setAdminTheme }: { email: string; adminTheme: AdminThemeId; setAdminTheme: (t: AdminThemeId) => void }) {
  const [activeKey, setActiveKey] = useState<string>("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeSection = useMemo(
    () => SECTIONS.find((s) => s.key === activeKey),
    [activeKey],
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-card/80 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="rounded-md p-2 text-foreground hover:bg-accent/60 lg:hidden"
              aria-label="Menu"
            >
              <LayoutDashboard className="h-5 w-5" />
            </button>
            <img src={logo} alt="" className="h-9 w-9" />
            <div>
              <h1 className="text-base font-bold leading-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Admin Dashboard
              </h1>
              <p className="text-[11px] text-muted-foreground">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:bg-accent/60 hover:text-primary sm:inline-flex">
              View Site
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:bg-accent/60 hover:text-primary"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${mobileNavOpen ? "block" : "hidden"} fixed inset-x-0 top-[57px] z-20 h-[calc(100vh-57px)] overflow-y-auto border-b border-border/60 bg-card lg:sticky lg:top-[57px] lg:block lg:w-64 lg:flex-shrink-0 lg:self-start lg:border-b-0 lg:border-r lg:border-border/60`}>
          <nav className="min-h-full p-3 text-sm">
            <SidebarItem
              active={activeKey === "dashboard"}
              onClick={() => { setActiveKey("dashboard"); setMobileNavOpen(false); }}
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </SidebarItem>

            {SECTION_GROUPS.map((group) => (
              <div key={group} className="mt-4">
                <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-primary/80">
                  {group}
                </p>
                {SECTIONS.filter((s) => s.group === group).map((s) => (
                  <SidebarItem
                    key={s.key}
                    active={activeKey === s.key}
                    onClick={() => { setActiveKey(s.key); setMobileNavOpen(false); }}
                  >
                    {s.label}
                  </SidebarItem>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="min-h-[calc(100vh-57px)] flex-1 bg-background p-4 sm:p-6 lg:p-8">
          {activeKey === "dashboard" && <DashboardHome onSelect={setActiveKey} />}
          {activeSection?.key === "holidays" && <HolidaysPanel />}
          {activeSection?.key === "messages" && <MessagesPanel />}
          {activeSection?.key === "social_links" && <SocialLinksPanel />}
          {activeSection?.key === "team_members" && <TeamMembersPanel />}
          {activeSection?.key === "properties" && <PropertiesPanel />}
          {activeSection?.key === "account_settings" && (
            <AccountThemePanel email={email} adminTheme={adminTheme} setAdminTheme={setAdminTheme} />
          )}
          {activeSection?.type === "single" && (
            <>
              <SingleSectionEditor section={activeSection} />
              {activeSection.group === "Extra Sections" && (
                <div className="mx-auto mt-8 max-w-3xl">
                  <MediaGalleryPanel sectionKey={`${activeSection.key}_media`} title="Media (images & videos)" />
                </div>
              )}
            </>
          )}
          {activeSection?.type === "list" && <ListSectionEditor section={activeSection} />}
        </main>

      </div>
    </div>
  );
}

function SidebarItem({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition ${
        active ? "bg-primary/15 font-semibold text-primary ring-1 ring-primary/20" : "text-foreground/80 hover:bg-accent/60 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function DashboardHome({ onSelect }: { onSelect: (k: string) => void }) {
  const statsFn = useServerFn(getAdminStats);
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => statsFn(),
    refetchInterval: 30_000,
  });

  const totals = SECTIONS.reduce(
    (acc, s) => {
      acc[s.group] = (acc[s.group] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="mx-auto max-w-5xl">
      <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Welcome, Admin 👋</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage every section of your website from one place.
      </p>

      {/* Live stats */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <button
          onClick={() => onSelect("messages")}
          className="group relative overflow-hidden rounded-xl border border-primary/40 bg-card p-5 text-left transition hover:border-primary"
        >
          <div className="flex items-center justify-between">
            <Inbox className="h-5 w-5 text-primary" />
            {(stats?.unreadMessages ?? 0) > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                {stats!.unreadMessages} NEW
              </span>
            )}
          </div>
          <p className="mt-3 text-3xl font-bold text-primary">{stats?.totalMessages ?? "—"}</p>
          <p className="text-xs text-muted-foreground">Contact messages</p>
        </button>

        <div className="rounded-xl border border-border bg-card p-5">
          <Users className="h-5 w-5 text-primary" />
          <p className="mt-3 text-3xl font-bold text-primary">{stats?.totalUsers ?? "—"}</p>
          <p className="text-xs text-muted-foreground">Registered users</p>
        </div>

        <button
          onClick={() => onSelect("social_links")}
          className="rounded-xl border border-border bg-card p-5 text-left transition hover:border-primary"
        >
          <LinkIcon className="h-5 w-5 text-primary" />
          <p className="mt-3 text-3xl font-bold text-primary">8</p>
          <p className="text-xs text-muted-foreground">Social link slots</p>
        </button>
      </div>

      {/* Section overview */}
      <h3 className="mt-8 text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>Editable sections</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SECTION_GROUPS.map((g) => (
          <div key={g} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g}</p>
            <p className="mt-2 text-3xl font-bold">{totals[g] ?? 0}</p>
            <p className="text-xs text-muted-foreground">editable sections</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {SECTIONS.filter((s) => s.group === g).slice(0, 5).map((s) => (
                <button key={s.key} onClick={() => onSelect(s.key)} className="rounded-full border border-border px-2 py-0.5 text-[11px] hover:border-primary hover:text-primary">
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Messages Panel ---------------- */
type ContactMsg = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  property: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

function MessagesPanel() {
  const qc = useQueryClient();
  const listFn = useServerFn(listContactMessages);
  const markFn = useServerFn(markMessageRead);
  const delFn = useServerFn(deleteContactMessage);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: () => listFn() as Promise<ContactMsg[]>,
  });

  const messages = (data ?? []).filter((m) => filter === "all" || !m.is_read);

  async function toggleRead(m: ContactMsg) {
    await markFn({ data: { id: m.id, is_read: !m.is_read } });
    qc.invalidateQueries({ queryKey: ["contact-messages"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    await delFn({ data: { id } });
    qc.invalidateQueries({ queryKey: ["contact-messages"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Contact Messages</h2>
          <p className="mt-1 text-xs text-muted-foreground">Messages from the website contact form.</p>
        </div>
        <div className="flex gap-1 rounded-md border border-border p-1 text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`rounded px-3 py-1 ${filter === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >All</button>
          <button
            onClick={() => setFilter("unread")}
            className={`rounded px-3 py-1 ${filter === "unread" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >Unread</button>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        {!isLoading && messages.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No messages yet.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-xl border bg-card p-4 transition ${m.is_read ? "border-border" : "border-primary/50 shadow-md shadow-primary/10"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{m.name}</span>
                  {!m.is_read && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase text-primary-foreground">New</span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <a href={`mailto:${m.email}`} className="hover:text-primary">✉ {m.email}</a>
                  {m.phone && <a href={`tel:${m.phone}`} className="hover:text-primary">☎ {m.phone}</a>}
                  {m.property && <span>🏠 {m.property}</span>}
                  <span>{new Date(m.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => toggleRead(m)}
                  title={m.is_read ? "Mark unread" : "Mark read"}
                  className="rounded-md p-1.5 text-foreground hover:bg-accent"
                >
                  {m.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap rounded-md bg-background/60 p-3 text-sm leading-relaxed text-foreground/90">
              {m.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Social Links Panel ---------------- */
const SOCIAL_FIELDS: Array<{ key: keyof SocialForm; label: string; placeholder: string }> = [
  { key: "whatsapp", label: "WhatsApp (floating icon)", placeholder: "https://wa.me/8801XXXXXXXXX" },
  { key: "messenger", label: "Messenger (floating icon)", placeholder: "https://m.me/yourpage" },
  { key: "telegram", label: "Telegram (floating icon)", placeholder: "https://t.me/yourchannel" },
  { key: "facebook", label: "Facebook (footer)", placeholder: "https://facebook.com/yourpage" },
  { key: "instagram", label: "Instagram (footer)", placeholder: "https://instagram.com/yourpage" },
  { key: "linkedin", label: "LinkedIn (footer)", placeholder: "https://linkedin.com/company/..." },
  { key: "twitter", label: "X / Twitter (footer)", placeholder: "https://x.com/yourpage" },
  { key: "youtube", label: "YouTube (footer)", placeholder: "https://youtube.com/@yourchannel" },
  { key: "tiktok", label: "TikTok (footer)", placeholder: "https://www.tiktok.com/@yourhandle" },
];

type SocialForm = {
  whatsapp: string; messenger: string; telegram: string;
  facebook: string; instagram: string; linkedin: string; twitter: string; youtube: string; tiktok: string;
};

function SocialLinksPanel() {
  const qc = useQueryClient();
  const saveFn = useServerFn(saveSocialLinks);

  const { data, isLoading } = useQuery({
    queryKey: ["social-links-admin"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_sections")
        .select("extra")
        .eq("section_key", "social_links")
        .maybeSingle();
      return (data?.extra ?? {}) as Partial<SocialForm>;
    },
  });

  const [form, setForm] = useState<SocialForm>({
    whatsapp: "", messenger: "", telegram: "",
    facebook: "", instagram: "", linkedin: "", twitter: "", youtube: "", tiktok: "",
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (data) setForm((f) => ({ ...f, ...data }));
  }, [data]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null); setSaved(false);
    try {
      await saveFn({ data: form });
      setSaved(true);
      qc.invalidateQueries({ queryKey: ["social-links"] });
      qc.invalidateQueries({ queryKey: ["social-links-admin"] });
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  }

  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin" />;

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Social Links</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        WhatsApp / Messenger / Telegram show as floating icons on the website.
        Facebook / Instagram / LinkedIn / X / YouTube show in the footer. Leave empty to hide.
      </p>

      <form onSubmit={handleSave} className="mt-6 space-y-3 rounded-xl border border-border bg-card p-5 sm:p-6">
        {SOCIAL_FIELDS.map((f) => (
          <Field key={f.key} label={f.label}>
            <input
              type="url"
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </Field>
        ))}

        {err && <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</p>}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit" disabled={busy}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Links
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-500">
              <CheckCircle2 className="h-4 w-4" /> Saved!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}


/* ---------------- Single Section Editor ---------------- */
function SingleSectionEditor({ section }: { section: SectionConfig }) {
  const qc = useQueryClient();
  const save = useServerFn(saveSiteSection);

  const { data, isLoading } = useQuery({
    queryKey: ["site-section", section.key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_sections")
        .select("*")
        .eq("section_key", section.key)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState({
    title: "", subtitle: "", description: "", image_url: "", video_url: "",
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setForm({
      title: data?.title ?? "",
      subtitle: data?.subtitle ?? "",
      description: data?.description ?? "",
      image_url: data?.image_url ?? "",
      video_url: data?.video_url ?? "",
    });
  }, [data, section.key]);

  const fields = section.fields ?? ["title", "subtitle", "description", "image"];

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null); setSaved(false);
    try {
      await save({
        data: {
          section_key: section.key,
          title: form.title || null,
          subtitle: form.subtitle || null,
          description: form.description || null,
          image_url: form.image_url || null,
          video_url: form.video_url || null,
        },
      });
      setSaved(true);
      qc.invalidateQueries({ queryKey: ["site-section", section.key] });
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  }

  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin" />;

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{section.label}</h2>
      {section.hint && <p className="mt-1 text-xs text-muted-foreground">{section.hint}</p>}

      <form onSubmit={handleSave} className="mt-6 space-y-4 rounded-xl border border-border bg-card p-5 sm:p-6">
        {fields.includes("title") && (
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Section title"
            />
          </Field>
        )}
        {fields.includes("subtitle") && (
          <Field label="Subtitle">
            <input
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Short tagline"
            />
          </Field>
        )}
        {fields.includes("description") && (
          <Field label="Description">
            <textarea
              value={form.description} rows={5}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Longer description text"
            />
          </Field>
        )}
        {fields.includes("image") && (
          <Field label="Image">
            <MediaUpload
              value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
              folder={section.key}
              accept="image/*"
              icon={<ImageIcon className="h-4 w-4" />}
            />
          </Field>
        )}
        {fields.includes("video") && (
          <Field label="Video (URL or upload)">
            <MediaUpload
              value={form.video_url}
              onChange={(url) => setForm({ ...form, video_url: url })}
              folder={section.key}
              accept="video/*"
              icon={<Video className="h-4 w-4" />}
            />
          </Field>
        )}

        {err && <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit" disabled={busy}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
              <CheckCircle2 className="h-4 w-4" /> Saved!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

/* ---------------- List Section Editor ---------------- */
type ListItem = {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  sort_order: number;
};

function ListSectionEditor({ section }: { section: SectionConfig }) {
  const qc = useQueryClient();
  const save = useServerFn(saveSectionItem);
  const remove = useServerFn(deleteSectionItem);

  const { data: items, isLoading } = useQuery({
    queryKey: ["section-items", section.key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("section_items")
        .select("*")
        .eq("section_key", section.key)
        .order("sort_order");
      if (error) throw error;
      return data as ListItem[];
    },
  });

  const [editing, setEditing] = useState<ListItem | null>(null);

  function openNew() {
    setEditing({
      id: "", section_key: section.key,
      title: "", subtitle: "", description: "",
      image_url: null, link_url: null, sort_order: (items?.length ?? 0),
    });
  }

  async function handleSave(it: ListItem) {
    await save({
      data: {
        id: it.id || undefined,
        section_key: section.key,
        title: it.title || null,
        subtitle: it.subtitle || null,
        description: it.description || null,
        image_url: it.image_url || null,
        link_url: it.link_url || null,
        sort_order: it.sort_order,
      },
    });
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["section-items", section.key] });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    await remove({ data: { id } });
    qc.invalidateQueries({ queryKey: ["section-items", section.key] });
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{section.label}</h2>
          {section.hint && <p className="mt-1 text-xs text-muted-foreground">{section.hint}</p>}
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
        {isLoading && <div className="p-6"><Loader2 className="h-5 w-5 animate-spin" /></div>}
        {items?.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">
            No items yet. Click <b>Add Item</b> to create the first one.
          </p>
        )}
        {(items?.length ?? 0) > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-[11px] uppercase tracking-wider text-primary">
                  <th className="px-3 py-3 text-left">Image</th>
                  <th className="px-3 py-3 text-left">Title</th>
                  <th className="px-3 py-3 text-left">Subtitle</th>
                  <th className="px-3 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((it) => (
                  <tr key={it.id} className="border-b border-border/60 last:border-0 hover:bg-accent/30">
                    <td className="px-3 py-3">
                      <RowImageCell
                        src={it.image_url}
                        folder={section.key}
                        onReplaced={async (url) => {
                          await save({ data: { id: it.id, section_key: section.key, title: it.title, subtitle: it.subtitle, description: it.description, image_url: url, link_url: it.link_url, sort_order: it.sort_order } });
                          qc.invalidateQueries({ queryKey: ["section-items", section.key] });
                          qc.invalidateQueries({ queryKey: ["hero-slides"] });
                        }}
                      />
                    </td>
                    <td className="px-3 py-3 font-semibold text-foreground">{it.title || "(untitled)"}</td>
                    <td className="px-3 py-3 text-muted-foreground">{it.subtitle || "—"}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setEditing(it)} className="inline-flex items-center gap-1 rounded-md border border-primary/40 px-2 py-1 text-xs text-primary hover:bg-primary/10">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button onClick={() => handleDelete(it.id)} className="rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>


      {editing && (
        <ItemModal item={editing} onClose={() => setEditing(null)} onSave={handleSave} folder={section.key} />
      )}
    </div>
  );
}

function ItemModal({
  item, onClose, onSave, folder,
}: {
  item: ListItem;
  onClose: () => void;
  onSave: (it: ListItem) => Promise<void>;
  folder: string;
}) {
  const [it, setIt] = useState<ListItem>(item);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try { await onSave(it); }
    catch (e: unknown) { setErr((e as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <form onSubmit={submit} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <h3 className="text-lg font-bold">{it.id ? "Edit item" : "New item"}</h3>
        <div className="mt-4 space-y-3">
          <Field label="Title">
            <input value={it.title ?? ""} onChange={(e) => setIt({ ...it, title: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="Title" />
          </Field>
          <Field label="Subtitle">
            <input value={it.subtitle ?? ""} onChange={(e) => setIt({ ...it, subtitle: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="Subtitle" />
          </Field>
          <Field label="Description">
            <textarea value={it.description ?? ""} rows={4} onChange={(e) => setIt({ ...it, description: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="Description" />
          </Field>
          <Field label="Image">
            <MediaUpload value={it.image_url ?? ""} onChange={(u) => setIt({ ...it, image_url: u || null })} folder={folder} accept="image/*" icon={<ImageIcon className="h-4 w-4" />} />
          </Field>
          <Field label="Link URL (optional)">
            <input value={it.link_url ?? ""} onChange={(e) => setIt({ ...it, link_url: e.target.value || null })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="https://..." />
          </Field>
          <Field label="Sort order">
            <input type="number" min={0} value={it.sort_order} onChange={(e) => setIt({ ...it, sort_order: parseInt(e.target.value) || 0 })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </Field>
          {err && <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</p>}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
          <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- Media Upload ---------------- */
function MediaUpload({
  value, onChange, folder, accept, icon,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  accept: string;
  icon: React.ReactNode;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true); setErr(null);
    try {
      const ext = file.name.split(".").pop() || "bin";
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("site-media").upload(path, file, {
        upsert: false, contentType: file.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("site-media").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally { setUploading(false); }
  }

  const isVideo = accept.includes("video");

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {value ? (
          isVideo ? (
            <video src={value} className="h-20 w-32 rounded-md bg-muted object-cover" muted />
          ) : (
            <img src={value} alt="" className="h-20 w-20 rounded-md object-cover" />
          )
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted text-muted-foreground">
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent">
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {uploading ? "Uploading…" : `Upload ${isVideo ? "video" : "image"}`}
            <input type="file" accept={accept} className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </label>
          {value && (
            <button type="button" onClick={() => onChange("")} className="text-xs text-destructive hover:underline">
              Remove
            </button>
          )}
        </div>
      </div>
      <input
        type="url" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste URL"
        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs"
      />
      {err && <p className="text-xs text-destructive">{err}</p>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

/* ---------------- Team Members Panel (existing) ---------------- */
type Dept = { id: string; name: string; slug: string };
type Member = {
  id: string; department_id: string; name: string; title: string;
  image_url: string | null; sort_order: number;
};

function TeamMembersPanel() {
  const qc = useQueryClient();
  const save = useServerFn(saveTeamMember);
  const remove = useServerFn(deleteTeamMember);

  const { data: depts } = useQuery({
    queryKey: ["admin-depts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("departments").select("id,name,slug").order("sort_order");
      if (error) throw error;
      return data as Dept[];
    },
  });
  const [activeDept, setActiveDept] = useState<string | null>(null);

  useEffect(() => {
    if (depts && depts.length && !activeDept) setActiveDept(depts[0].id);
  }, [depts, activeDept]);

  const { data: members } = useQuery({
    queryKey: ["admin-members", activeDept],
    queryFn: async () => {
      if (!activeDept) return [];
      const { data, error } = await supabase
        .from("team_members")
        .select("id,department_id,name,title,image_url,sort_order")
        .eq("department_id", activeDept).order("sort_order");
      if (error) throw error;
      return data as Member[];
    },
    enabled: !!activeDept,
  });

  const [editing, setEditing] = useState<Member | null>(null);

  function openNew() {
    if (!activeDept) return;
    setEditing({ id: "", department_id: activeDept, name: "", title: "", image_url: null, sort_order: 0 });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this member?")) return;
    await remove({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-members", activeDept] });
  }

  async function handleSave(m: Member) {
    await save({
      data: {
        id: m.id || undefined,
        department_id: m.department_id,
        name: m.name, title: m.title,
        image_url: m.image_url, sort_order: m.sort_order,
      },
    });
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-members", activeDept] });
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Team Members</h2>
      <p className="mt-1 text-xs text-muted-foreground">Manage employees grouped by department.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {depts?.map((d) => (
          <button key={d.id} onClick={() => setActiveDept(d.id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              activeDept === d.id ? "border-brand bg-brand/10 text-brand" : "border-border hover:bg-accent"
            }`}>
            {d.name}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h3 className="text-base font-semibold">Members</h3>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> Add member
        </button>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members?.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
            No members yet.
          </p>
        )}
        {members?.map((m) => (
          <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
            {m.image_url ? (
              <img src={m.image_url} alt={m.name} className="h-14 w-14 rounded-full object-cover" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-sm font-bold">
                {m.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{m.name}</div>
              <div className="truncate text-xs text-muted-foreground">{m.title}</div>
            </div>
            <button onClick={() => setEditing(m)} className="rounded-md p-1.5 hover:bg-accent">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={() => handleDelete(m.id)} className="rounded-md p-1.5 text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <MemberModal member={editing} onClose={() => setEditing(null)} onSave={handleSave} />
      )}
    </div>
  );
}

function MemberModal({ member, onClose, onSave }: { member: Member; onClose: () => void; onSave: (m: Member) => Promise<void> }) {
  const [m, setM] = useState<Member>(member);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setBusy(true);
    try { await onSave(m); }
    catch (e: unknown) { setErr((e as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <h3 className="text-lg font-bold">{m.id ? "Edit member" : "New member"}</h3>
        <div className="mt-4 space-y-3">
          <Field label="Photo">
            <MediaUpload value={m.image_url ?? ""} onChange={(u) => setM({ ...m, image_url: u || null })} folder={`team/${m.department_id}`} accept="image/*" icon={<ImageIcon className="h-4 w-4" />} />
          </Field>
          <Field label="Full name">
            <input required value={m.name} onChange={(e) => setM({ ...m, name: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </Field>
          <Field label="Title / Position">
            <input required value={m.title} onChange={(e) => setM({ ...m, title: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </Field>
          <Field label="Sort order">
            <input type="number" min={0} value={m.sort_order} onChange={(e) => setM({ ...m, sort_order: parseInt(e.target.value) || 0 })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </Field>
          {err && <p className="text-xs text-destructive">{err}</p>}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
          <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- Row Image Cell (thumbnail + inline replace) ---------------- */
function RowImageCell({
  src, folder, onReplaced, isVideo = false,
}: {
  src: string | null;
  folder: string;
  onReplaced: (url: string) => void | Promise<void>;
  isVideo?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  async function handleFile(file: File) {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "bin";
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("site-media").upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from("site-media").getPublicUrl(path);
      await onReplaced(data.publicUrl);
    } catch (e) {
      alert((e as Error).message);
    } finally { setBusy(false); }
  }
  return (
    <div className="group relative h-12 w-12 overflow-hidden rounded-md border border-border bg-muted">
      {src ? (
        isVideo ? <video src={src} className="h-full w-full object-cover" muted />
                : <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <ImageIcon className="h-4 w-4" />
        </div>
      )}
      <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100" title="Replace image">
        {busy ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Upload className="h-4 w-4 text-white" />}
        <input
          type="file" accept={isVideo ? "video/*" : "image/*"} className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
        />
      </label>
    </div>
  );
}

/* ---------------- Properties Panel (custom structured list) ---------------- */
type PropertyRow = {
  id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  extra: Record<string, string | number> | null;
};

const PROPERTY_STATUSES = ["ongoing", "handover", "upcoming", "featured"] as const;

function PropertiesPanel() {
  const qc = useQueryClient();
  const save = useServerFn(saveSectionItem);
  const remove = useServerFn(deleteSectionItem);

  const { data: items, isLoading } = useQuery({
    queryKey: ["properties-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("section_items")
        .select("*")
        .eq("section_key", "properties")
        .order("sort_order");
      if (error) throw error;
      return data as PropertyRow[];
    },
  });

  const [editing, setEditing] = useState<PropertyRow | null>(null);

  function openNew() {
    setEditing({
      id: "", title: "", subtitle: "", description: "", image_url: null,
      sort_order: items?.length ?? 0,
      extra: { price: "", size: "", beds: 0, parking: "", status: "ongoing", location: "" },
    });
  }

  async function handleSave(it: PropertyRow) {
    await save({
      data: {
        id: it.id || undefined,
        section_key: "properties",
        title: it.title || null,
        subtitle: it.subtitle || null,
        description: it.description || null,
        image_url: it.image_url || null,
        link_url: null,
        sort_order: it.sort_order,
        extra: it.extra ?? {},
      },
    });
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["properties-admin"] });
    qc.invalidateQueries({ queryKey: ["properties-db"] });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this property?")) return;
    await remove({ data: { id } });
    qc.invalidateQueries({ queryKey: ["properties-admin"] });
    qc.invalidateQueries({ queryKey: ["properties-db"] });
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Manage Properties</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Add a property from your device — name, location, price, beds, size, status & cover image.
            When you add even one property here, the website will show YOUR properties instead of the default demo set.
          </p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> Add Property
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
        {isLoading && <div className="p-6"><Loader2 className="h-5 w-5 animate-spin" /></div>}
        {!isLoading && (items?.length ?? 0) === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">
            No properties yet. Click <b>Add Property</b> to create the first one.
          </p>
        )}
        {!isLoading && (items?.length ?? 0) > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-[11px] uppercase tracking-wider text-primary">
                  <th className="px-3 py-3 text-left">Image</th>
                  <th className="px-3 py-3 text-left">Name</th>
                  <th className="px-3 py-3 text-left">Location</th>
                  <th className="px-3 py-3 text-left">Status</th>
                  <th className="px-3 py-3 text-left">Size</th>
                  <th className="px-3 py-3 text-left">Price</th>
                  <th className="px-3 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((p) => {
                  const ex = (p.extra ?? {}) as Record<string, string | number>;
                  return (
                    <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-accent/30">
                      <td className="px-3 py-3">
                        <RowImageCell
                          src={p.image_url}
                          folder="properties"
                          onReplaced={async (url) => {
                            await save({ data: { id: p.id, section_key: "properties", title: p.title, subtitle: p.subtitle, description: p.description, image_url: url, link_url: null, sort_order: p.sort_order, extra: p.extra ?? {} } });
                            qc.invalidateQueries({ queryKey: ["properties-admin"] });
                            qc.invalidateQueries({ queryKey: ["properties-db"] });
                          }}
                        />
                      </td>
                      <td className="px-3 py-3 font-semibold text-foreground">{p.title || "(untitled)"}</td>
                      <td className="px-3 py-3 text-muted-foreground">{p.subtitle || ex.location || "—"}</td>
                      <td className="px-3 py-3 text-muted-foreground">{ex.status || "—"}</td>
                      <td className="px-3 py-3 text-muted-foreground">{ex.size || "—"}</td>
                      <td className="px-3 py-3 text-primary">{ex.price || "—"}</td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setEditing(p)} className="inline-flex items-center gap-1 rounded-md border border-primary/40 px-2 py-1 text-xs text-primary hover:bg-primary/10">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>


      {editing && <PropertyModal item={editing} onClose={() => setEditing(null)} onSave={handleSave} />}
    </div>
  );
}

function PropertyModal({
  item, onClose, onSave,
}: {
  item: PropertyRow;
  onClose: () => void;
  onSave: (p: PropertyRow) => Promise<void>;
}) {
  const [p, setP] = useState<PropertyRow>(item);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const ex = (p.extra ?? {}) as Record<string, string | number>;
  function setEx(key: string, val: string | number) {
    setP({ ...p, extra: { ...(p.extra ?? {}), [key]: val } });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try { await onSave(p); }
    catch (e: unknown) { setErr((e as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <form onSubmit={submit} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <h3 className="text-lg font-bold">{p.id ? "Edit property" : "New property"}</h3>
        <div className="mt-4 space-y-3">
          <Field label="Cover Image (upload from device)">
            <MediaUpload value={p.image_url ?? ""} onChange={(u) => setP({ ...p, image_url: u || null })} folder="properties" accept="image/*" icon={<ImageIcon className="h-4 w-4" />} />
          </Field>
          <Field label="Property Name">
            <input required value={p.title ?? ""} onChange={(e) => setP({ ...p, title: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="e.g. Starline Heights" />
          </Field>
          <Field label="Location">
            <input value={p.subtitle ?? ""} onChange={(e) => setP({ ...p, subtitle: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="e.g. Gulshan-2, Dhaka" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price">
              <input value={String(ex.price ?? "")} onChange={(e) => setEx("price", e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="৳ 1.85 Cr" />
            </Field>
            <Field label="Status">
              <select value={String(ex.status ?? "ongoing")} onChange={(e) => setEx("status", e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                {PROPERTY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Size">
              <input value={String(ex.size ?? "")} onChange={(e) => setEx("size", e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="1,285 sqft" />
            </Field>
            <Field label="Beds">
              <input type="number" min={0} value={Number(ex.beds ?? 0)} onChange={(e) => setEx("beds", parseInt(e.target.value) || 0)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            </Field>
            <Field label="Parking">
              <input value={String(ex.parking ?? "")} onChange={(e) => setEx("parking", e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="1 Car" />
            </Field>
            <Field label="Sort order">
              <input type="number" min={0} value={p.sort_order} onChange={(e) => setP({ ...p, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            </Field>
          </div>
          <Field label="Description / Details">
            <textarea rows={4} value={p.description ?? ""} onChange={(e) => setP({ ...p, description: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="Full property details, amenities, location highlights..." />
          </Field>
          {err && <p className="text-xs text-destructive">{err}</p>}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
          <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- Media Gallery Panel (multi image/video per extra section) ---------------- */
function MediaGalleryPanel({ sectionKey, title }: { sectionKey: string; title: string }) {
  const qc = useQueryClient();
  const save = useServerFn(saveSectionItem);
  const remove = useServerFn(deleteSectionItem);

  const { data: items, isLoading } = useQuery({
    queryKey: ["media-gallery", sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("section_items")
        .select("id,image_url,link_url,title,sort_order,extra")
        .eq("section_key", sectionKey)
        .order("sort_order");
      if (error) throw error;
      return data as Array<{ id: string; image_url: string | null; link_url: string | null; title: string | null; sort_order: number; extra: Record<string, unknown> | null }>;
    },
  });

  async function handleUpload(file: File) {
    const ext = file.name.split(".").pop() || "bin";
    const path = `${sectionKey}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("site-media").upload(path, file, { upsert: false, contentType: file.type });
    if (upErr) { alert(upErr.message); return; }
    const { data: pub } = supabase.storage.from("site-media").getPublicUrl(path);
    const isVideo = file.type.startsWith("video/");
    await save({
      data: {
        section_key: sectionKey,
        title: file.name,
        subtitle: null,
        description: null,
        image_url: isVideo ? null : pub.publicUrl,
        link_url: isVideo ? pub.publicUrl : null,
        sort_order: items?.length ?? 0,
        extra: { kind: isVideo ? "video" : "image" },
      },
    });
    qc.invalidateQueries({ queryKey: ["media-gallery", sectionKey] });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this media?")) return;
    await remove({ data: { id } });
    qc.invalidateQueries({ queryKey: ["media-gallery", sectionKey] });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold">{title}</h3>
          <p className="text-[11px] text-muted-foreground">Upload multiple images or videos from your device.</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">
          <Upload className="h-3.5 w-3.5" /> Upload
          <input
            type="file" accept="image/*,video/*" multiple className="hidden"
            onChange={async (e) => {
              const files = Array.from(e.target.files ?? []);
              for (const f of files) await handleUpload(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-border">
        {isLoading && <div className="p-4"><Loader2 className="h-4 w-4 animate-spin" /></div>}
        {!isLoading && (items?.length ?? 0) === 0 && (
          <p className="p-4 text-center text-xs text-muted-foreground">No media yet.</p>
        )}
        {(items?.length ?? 0) > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-[11px] uppercase tracking-wider text-primary">
                  <th className="px-3 py-2 text-left">Preview</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((it) => {
                  const isVideo = (it.extra as { kind?: string })?.kind === "video";
                  const src = isVideo ? it.link_url : it.image_url;
                  return (
                    <tr key={it.id} className="border-b border-border/60 last:border-0 hover:bg-accent/30">
                      <td className="px-3 py-2">
                        <RowImageCell
                          src={src}
                          folder={sectionKey}
                          isVideo={isVideo}
                          onReplaced={async (url) => {
                            await save({ data: { id: it.id, section_key: sectionKey, title: it.title, image_url: isVideo ? null : url, link_url: isVideo ? url : null, sort_order: it.sort_order, extra: (it.extra ?? { kind: isVideo ? "video" : "image" }) as Record<string, unknown> } });
                            qc.invalidateQueries({ queryKey: ["media-gallery", sectionKey] });
                          }}
                        />
                      </td>
                      <td className="px-3 py-2 text-foreground truncate max-w-[260px]">{it.title || "(untitled)"}</td>
                      <td className="px-3 py-2 text-muted-foreground">{isVideo ? "Video" : "Image"}</td>
                      <td className="px-3 py-2">
                        <button onClick={() => handleDelete(it.id)} className="rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

/* ---------------- Account & Theme Panel ---------------- */
function AccountThemePanel({
  email,
  adminTheme,
  setAdminTheme,
}: {
  email: string;
  adminTheme: AdminThemeId;
  setAdminTheme: (t: AdminThemeId) => void;
}) {
  const [newEmail, setNewEmail] = useState(email);
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwBusy, setPwBusy] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function changeEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailMsg(null);
    if (!newEmail || newEmail === email) {
      setEmailMsg({ ok: false, text: "Please enter a new email address." });
      return;
    }
    setEmailBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      setEmailMsg({
        ok: true,
        text: "Confirmation link sent to the new email. Click it to complete the change.",
      });
    } catch (err) {
      setEmailMsg({ ok: false, text: (err as Error).message });
    } finally {
      setEmailBusy(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (newPw.length < 6) {
      setPwMsg({ ok: false, text: "Password must be at least 6 characters." });
      return;
    }
    if (newPw !== confirmPw) {
      setPwMsg({ ok: false, text: "Passwords do not match." });
      return;
    }
    setPwBusy(true);
    try {
      // Re-authenticate to confirm current password
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password: currentPw,
      });
      if (signInErr) throw new Error("Current password is incorrect.");

      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) throw error;
      setPwMsg({ ok: true, text: "Password updated successfully." });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (err) {
      setPwMsg({ ok: false, text: (err as Error).message });
    } finally {
      setPwBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          Account & Theme
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your admin email, password and dashboard appearance.
        </p>
      </div>

      {/* Theme picker */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold text-foreground">Dashboard Theme</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          This only changes the admin dashboard. The public website is not affected.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ADMIN_THEMES.map((t) => {
            const active = adminTheme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setAdminTheme(t.id)}
                className={`group relative flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                  active
                    ? "border-primary ring-2 ring-primary/40"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div
                  className="h-10 w-10 flex-shrink-0 rounded-lg border border-border"
                  style={{ background: `linear-gradient(135deg, ${t.bg} 50%, ${t.swatch} 50%)` }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{t.label}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{t.id}</p>
                </div>
                {active && <CheckCircle2 className="h-5 w-5 text-primary" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Change email */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold text-foreground">Change Email</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Current: <span className="text-foreground">{email}</span>
        </p>
        <form onSubmit={changeEmail} className="mt-4 space-y-3">
          <input
            type="email"
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="new@email.com"
            className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
          {emailMsg && (
            <p className={`text-xs ${emailMsg.ok ? "text-primary" : "text-destructive"}`}>
              {emailMsg.text}
            </p>
          )}
          <button
            type="submit"
            disabled={emailBusy}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {emailBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Update email
          </button>
        </form>
      </section>

      {/* Change password */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold text-foreground">Change Password</h3>
        <form onSubmit={changePassword} className="mt-4 space-y-3">
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30">
            <input
              type={showPw ? "text" : "password"}
              required
              placeholder="Current password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none"
            />
            <button type="button" onClick={() => setShowPw((v) => !v)} className="text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <input
            type={showPw ? "text" : "password"}
            required
            minLength={6}
            placeholder="New password (min 6 characters)"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
          <input
            type={showPw ? "text" : "password"}
            required
            minLength={6}
            placeholder="Confirm new password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
          {pwMsg && (
            <p className={`text-xs ${pwMsg.ok ? "text-primary" : "text-destructive"}`}>
              {pwMsg.text}
            </p>
          )}
          <button
            type="submit"
            disabled={pwBusy}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {pwBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Update password
          </button>
        </form>
      </section>
    </div>
  );
}

/* ---------------- Holidays Panel ---------------- */
type HolidayRow = {
  id: string;
  title: string | null;
  subtitle: string | null;
  sort_order: number;
  extra: { start_date?: string; end_date?: string } | null;
};

function HolidaysPanel() {
  const qc = useQueryClient();
  const save = useServerFn(saveSectionItem);
  const remove = useServerFn(deleteSectionItem);

  const { data: items, isLoading } = useQuery({
    queryKey: ["section-items", "holidays"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("section_items")
        .select("id, title, subtitle, sort_order, extra")
        .eq("section_key", "holidays")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as HolidayRow[];
    },
  });

  const empty = { id: "", title: "", subtitle: "", start_date: "", end_date: "" };
  const [editing, setEditing] = useState<typeof empty | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function openNew() { setEditing({ ...empty }); }
  function openEdit(r: HolidayRow) {
    setEditing({
      id: r.id,
      title: r.title ?? "",
      subtitle: r.subtitle ?? "",
      start_date: r.extra?.start_date ?? "",
      end_date: r.extra?.end_date ?? "",
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setErr(null);
    if (!editing.title.trim()) { setErr("Holiday name required"); return; }
    if (!editing.start_date || !editing.end_date) { setErr("Start and end date required"); return; }
    if (editing.end_date < editing.start_date) { setErr("End date must be after start date"); return; }
    setBusy(true);
    try {
      await save({
        data: {
          id: editing.id || undefined,
          section_key: "holidays",
          title: editing.title.trim(),
          subtitle: editing.subtitle.trim() || editing.title.trim(),
          sort_order: 0,
          extra: { start_date: editing.start_date, end_date: editing.end_date },
        },
      });
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["section-items", "holidays"] });
      qc.invalidateQueries({ queryKey: ["holidays"] });
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this holiday?")) return;
    await remove({ data: { id } });
    qc.invalidateQueries({ queryKey: ["section-items", "holidays"] });
    qc.invalidateQueries({ queryKey: ["holidays"] });
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            🎉 Holidays / Office Closures
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Add government holidays. The top bar will automatically show the holiday name and reopen date during the closure. Office returns to normal hours automatically when it ends.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add Holiday
        </button>
      </div>

      <div className="mt-5 space-y-2">
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        {!isLoading && (items?.length ?? 0) === 0 && (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No holidays yet. Click <b>Add Holiday</b> to create one.
          </p>
        )}
        {items?.map((it) => {
          const start = it.extra?.start_date ?? "";
          const end = it.extra?.end_date ?? "";
          const active = start && end && today >= start && today <= end;
          const past = end && today > end;
          return (
            <div key={it.id} className={`flex items-center gap-3 rounded-xl border bg-card p-3 ${active ? "border-primary shadow-md shadow-primary/10" : past ? "border-border opacity-60" : "border-border"}`}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{it.title || "(untitled)"}</span>
                  {active && <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase text-primary-foreground">Active</span>}
                  {past && !active && <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold uppercase text-muted-foreground">Past</span>}
                </div>
                <div className="text-xs text-muted-foreground">
                  {start} → {end}
                  {it.subtitle && it.subtitle !== it.title && <span className="ml-2">· {it.subtitle}</span>}
                </div>
              </div>
              <button onClick={() => openEdit(it)} className="rounded-md p-1.5 hover:bg-accent">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(it.id)} className="rounded-md p-1.5 text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setEditing(null)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSave}
            className="w-full max-w-md space-y-3 rounded-2xl border border-border bg-card p-5"
          >
            <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              {editing.id ? "Edit Holiday" : "New Holiday"}
            </h3>
            <Field label="Holiday name (English)">
              <input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="Eid Holiday"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Holiday name (Bangla)">
              <input
                value={editing.subtitle}
                onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
                placeholder="ঈদের ছুটি"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start date">
                <input
                  type="date"
                  value={editing.start_date}
                  onChange={(e) => setEditing({ ...editing, start_date: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </Field>
              <Field label="End date (last closed day)">
                <input
                  type="date"
                  value={editing.end_date}
                  onChange={(e) => setEditing({ ...editing, end_date: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </Field>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Example: 25 May → 31 May = office closed 25–31 May, reopens 1 June at 10 AM.
            </p>
            {err && <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-md border border-border px-3 py-2 text-sm">
                Cancel
              </button>
              <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}


