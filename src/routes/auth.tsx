import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock, User, ArrowLeft, CheckCircle2, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login / Register — Starline Builders Ltd." },
      { name: "description", content: "Customer login and registration for Starline Builders Ltd." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "register" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        {/* Back to home */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
          {/* Logo */}
          <div className="flex flex-col items-center text-center">
            <img src={logo} alt="Starline Builders" className="h-14 w-14 object-contain" />
            <h1
              className="mt-3 text-xl font-bold tracking-wide text-primary sm:text-2xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              STARLINE BUILDERS LTD.
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-[2px] text-muted-foreground">
              Invest Smart. Live Better.
            </p>
          </div>

          {/* Tabs (login / register) — hidden in forgot mode */}
          {mode !== "forgot" && (
            <div className="mt-6 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
              <button
                onClick={() => setMode("login")}
                className={`rounded-md py-2 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("register")}
                className={`rounded-md py-2 text-sm font-semibold transition ${
                  mode === "register"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Register
              </button>
            </div>
          )}

          <div className="mt-6">
            {mode === "login" && <LoginForm onForgot={() => setMode("forgot")} />}
            {mode === "register" && <RegisterForm onDone={() => setMode("login")} />}
            {mode === "forgot" && <ForgotForm onBack={() => setMode("login")} />}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Admin?{" "}
          <Link to="/admin" className="font-semibold text-brand hover:underline">
            Admin Login
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ---------------- LOGIN ---------------- */
function LoginForm({ onForgot }: { onForgot: () => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/" });
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-lg font-bold">Welcome Back</h2>
      <p className="-mt-2 text-xs text-muted-foreground">Login to your customer account</p>

      <Field icon={<Mail className="h-4 w-4" />}>
        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </Field>

      <Field icon={<Lock className="h-4 w-4" />}>
        <input
          type={show ? "text" : "password"}
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
        <button type="button" onClick={() => setShow((v) => !v)} className="text-muted-foreground">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </Field>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onForgot}
          className="text-xs font-semibold text-brand hover:underline"
        >
          Forgot password?
        </button>
      </div>

      {err && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Login
      </button>
    </form>
  );
}

/* ---------------- REGISTER ---------------- */
function RegisterForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (password !== confirm) {
      setErr("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: name },
        },
      });
      if (error) throw error;
      setSuccess(true);
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle2 className="h-9 w-9 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-lg font-bold text-green-700 dark:text-green-400">
          Registration Successful!
        </h2>
        <p className="text-sm text-muted-foreground">
          We've sent a verification link to <b className="text-foreground">{email}</b>. Please check
          your inbox and verify your email to activate your account.
        </p>
        <button
          onClick={onDone}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-lg font-bold">Create Account</h2>
      <p className="-mt-2 text-xs text-muted-foreground">Register as a new customer</p>

      <Field icon={<User className="h-4 w-4" />}>
        <input
          required
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </Field>

      <Field icon={<Mail className="h-4 w-4" />}>
        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </Field>

      <Field icon={<Lock className="h-4 w-4" />}>
        <input
          type={show ? "text" : "password"}
          required
          minLength={6}
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
        <button type="button" onClick={() => setShow((v) => !v)} className="text-muted-foreground">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </Field>

      <Field icon={<Lock className="h-4 w-4" />}>
        <input
          type={show ? "text" : "password"}
          required
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </Field>

      {err && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Create Account
      </button>
    </form>
  );
}

/* ---------------- FORGOT ---------------- */
function ForgotForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <Mail className="h-9 w-9 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-lg font-bold">Check Your Email</h2>
        <p className="text-sm text-muted-foreground">
          We sent a password reset link to <b className="text-foreground">{email}</b>. Click the
          link in the email to reset your password.
        </p>
        <button
          onClick={onBack}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="-mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-brand"
      >
        <ArrowLeft className="h-3 w-3" /> Back to login
      </button>
      <h2 className="text-lg font-bold">Forgot Password?</h2>
      <p className="-mt-2 text-xs text-muted-foreground">
        Enter your registered email and we'll send you a reset link.
      </p>

      <Field icon={<Mail className="h-4 w-4" />}>
        <input
          type="email"
          required
          placeholder="Registered email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </Field>

      {err && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Send Reset Link
      </button>
    </form>
  );
}

/* ---------------- shared field ---------------- */
function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </div>
  );
}
