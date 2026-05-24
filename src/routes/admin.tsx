import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  Loader2, Plus, Pencil, Trash2, LogOut, Upload, Save, CheckCircle2,
  ArrowLeft, LayoutDashboard, Image as ImageIcon, Video, Shield, Eye, EyeOff,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  claimAdminIfFirst, checkIsAdmin,
  saveTeamMember, deleteTeamMember,
  saveSiteSection, saveSectionItem, deleteSectionItem,
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

function AdminPage() {
  const [session, setSession] = useState<null | { userId: string; email: string }>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return (
      <div className="admin-theme flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="admin-theme min-h-screen bg-background text-foreground">
      {session ? <Dashboard email={session.email} /> : <AdminAuthForm />}
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
function Dashboard({ email }: { email: string }) {
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

  return <AdminConsole email={email} />;
}

/* ---------------- Admin Console with Sidebar ---------------- */
function AdminConsole({ email }: { email: string }) {
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
        <aside className={`${mobileNavOpen ? "block" : "hidden"} fixed inset-x-0 top-[57px] z-20 max-h-[calc(100vh-57px)] overflow-y-auto border-b border-border/60 bg-card lg:sticky lg:top-[57px] lg:block lg:max-h-[calc(100vh-57px)] lg:w-64 lg:flex-shrink-0 lg:border-b-1 lg:border-r lg:border-border/60`}>
          <nav className="p-3 text-sm">
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
          {activeSection?.type === "single" && <SingleSectionEditor section={activeSection} />}
          {activeSection?.type === "list" && <ListSectionEditor section={activeSection} />}
          {activeSection?.key === "team_members" && <TeamMembersPanel />}
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
        Manage every section of your website from one place. Pick a section on the left or below to edit.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SECTION_GROUPS.map((g) => (
          <div key={g} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g}</p>
            <p className="mt-2 text-3xl font-bold">{totals[g] ?? 0}</p>
            <p className="text-xs text-muted-foreground">editable sections</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {SECTIONS.filter((s) => s.group === g).slice(0, 5).map((s) => (
                <button key={s.key} onClick={() => onSelect(s.key)} className="rounded-full border border-border px-2 py-0.5 text-[11px] hover:border-brand hover:text-brand">
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

      <div className="mt-5 space-y-2">
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        {items?.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No items yet. Click <b>Add Item</b> to create the first one.
          </p>
        )}
        {items?.map((it) => (
          <div key={it.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
            {it.image_url ? (
              <img src={it.image_url} alt="" className="h-14 w-14 rounded-md object-cover" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                <ImageIcon className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{it.title || "(untitled)"}</div>
              {it.subtitle && <div className="truncate text-xs text-muted-foreground">{it.subtitle}</div>}
            </div>
            <button onClick={() => setEditing(it)} className="rounded-md p-1.5 hover:bg-accent">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={() => handleDelete(it.id)} className="rounded-md p-1.5 text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
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
