import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, LogOut, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  claimAdminIfFirst,
  checkIsAdmin,
  saveTeamMember,
  deleteTeamMember,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — STARLINE BUILDERS LTD." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Dept = { id: string; name: string; slug: string };
type Member = {
  id: string;
  department_id: string;
  name: string;
  title: string;
  image_url: string | null;
  sort_order: number;
};

function AdminPage() {
  const [session, setSession] = useState<null | { userId: string; email: string }>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(
        s?.user ? { userId: s.user.id, email: s.user.email ?? "" } : null,
      );
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(
        data.session?.user
          ? { userId: data.session.user.id, email: data.session.user.email ?? "" }
          : null,
      );
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  return session ? <Dashboard email={session.email} /> : <AuthForm />;
}

function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-lg">
        <h1
          className="text-center text-2xl font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Admin {mode === "login" ? "Login" : "Sign Up"}
        </h1>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          First user to sign up becomes admin automatically.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          {err && <p className="text-xs text-destructive">{err}</p>}
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "login" ? "Login" : "Create account"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 w-full text-xs text-muted-foreground hover:text-brand"
        >
          {mode === "login"
            ? "Need an account? Sign up"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}

function Dashboard({ email }: { email: string }) {
  const claim = useServerFn(claimAdminIfFirst);
  const check = useServerFn(checkIsAdmin);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await claim();
      } catch {
        /* ignore */
      }
      try {
        const r = await check();
        setIsAdmin(r.isAdmin);
      } catch {
        setIsAdmin(false);
      }
    })();
  }, [claim, check]);

  if (isAdmin === null)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  if (!isAdmin)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <p className="text-center text-sm text-muted-foreground">
          You are signed in as <b>{email}</b> but do not have admin access.
        </p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="rounded-md border border-border px-4 py-2 text-sm"
        >
          Sign out
        </button>
      </div>
    );

  return <AdminConsole email={email} />;
}

function AdminConsole({ email }: { email: string }) {
  const qc = useQueryClient();
  const save = useServerFn(saveTeamMember);
  const remove = useServerFn(deleteTeamMember);

  const { data: depts } = useQuery({
    queryKey: ["admin-depts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("id,name,slug")
        .order("sort_order");
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
        .eq("department_id", activeDept)
        .order("sort_order");
      if (error) throw error;
      return data as Member[];
    },
    enabled: !!activeDept,
  });

  const [editing, setEditing] = useState<Member | null>(null);
  const [showForm, setShowForm] = useState(false);

  function openNew() {
    if (!activeDept) return;
    setEditing({
      id: "",
      department_id: activeDept,
      name: "",
      title: "",
      image_url: null,
      sort_order: 0,
    });
    setShowForm(true);
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
        name: m.name,
        title: m.title,
        image_url: m.image_url,
        sort_order: m.sort_order,
      },
    });
    setShowForm(false);
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-members", activeDept] });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Admin Console
            </h1>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap gap-2">
          {depts?.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDept(d.id)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                activeDept === d.id
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border hover:bg-accent"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Team members</h2>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add member
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members?.length === 0 && (
            <p className="text-sm text-muted-foreground">No members yet.</p>
          )}
          {members?.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              {m.image_url ? (
                <img
                  src={m.image_url}
                  alt={m.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-sm font-bold">
                  {m.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-semibold">{m.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {m.title}
                </div>
              </div>
              <button
                onClick={() => {
                  setEditing(m);
                  setShowForm(true);
                }}
                className="rounded-md p-1.5 hover:bg-accent"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(m.id)}
                className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </main>

      {showForm && editing && (
        <MemberFormModal
          member={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function MemberFormModal({
  member,
  onClose,
  onSave,
}: {
  member: Member;
  onClose: () => void;
  onSave: (m: Member) => Promise<void>;
}) {
  const [m, setM] = useState<Member>(member);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setErr(null);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${m.department_id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("team-images")
        .upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from("team-images").getPublicUrl(path);
      setM((p) => ({ ...p, image_url: data.publicUrl }));
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await onSave(m);
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <h3 className="text-lg font-bold">
          {m.id ? "Edit member" : "New member"}
        </h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            {m.image_url ? (
              <img
                src={m.image_url}
                alt=""
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                No image
              </div>
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent">
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              {uploading ? "Uploading…" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </label>
          </div>
          <input
            required
            placeholder="Full name"
            value={m.name}
            onChange={(e) => setM({ ...m, name: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Title / Position"
            value={m.title}
            onChange={(e) => setM({ ...m, title: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={0}
            placeholder="Sort order"
            value={m.sort_order}
            onChange={(e) =>
              setM({ ...m, sort_order: parseInt(e.target.value) || 0 })
            }
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          {err && <p className="text-xs text-destructive">{err}</p>}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
