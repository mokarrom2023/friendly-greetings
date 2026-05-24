import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, User, LogOut } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

type NavItem =
  | { key: string; label: string; href: string }
  | { key: string; label: string; dropdown: { label: string; href: string }[] };

export function Navbar() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setUserEmail(s?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
  }

  const items: NavItem[] = [
    { key: "home", label: t("home"), href: "/#home" },
    { key: "about", label: t("about"), href: "/#about" },
    { key: "contact", label: t("contact"), href: "/#contact" },
    {
      key: "property",
      label: t("property"),
      dropdown: [
        { label: t("ongoing"), href: "/projects/ongoing" },
        { label: t("handover"), href: "/projects/handover" },
        { label: t("processing"), href: "/projects/ongoing" },
        { label: t("upcoming"), href: "/projects/upcoming" },
        { label: t("featured"), href: "/projects/featured" },
      ],
    },
    {
      key: "location",
      label: t("location"),
      dropdown: [
        { label: "Gulshan", href: "/#properties" },
        { label: "Banani", href: "/#properties" },
        { label: "Bashundhara", href: "/#properties" },
        { label: "Dhanmondi", href: "/#properties" },
        { label: "Uttara", href: "/#properties" },
        { label: "Mirpur", href: "/#properties" },
        { label: "Purbachal", href: "/#properties" },
      ],
    },
    {
      key: "size",
      label: t("size"),
      dropdown: [
        { label: "1285 sqft", href: "/#properties" },
        { label: "1300 sqft", href: "/#properties" },
        { label: "1000 sqft", href: "/#properties" },
        { label: "900 sqft", href: "/#properties" },
        { label: t("duplex"), href: "/#properties" },
        { label: t("commercial"), href: "/#properties" },
        { label: t("studioApartment"), href: "/#properties" },
      ],
    },
    {
      key: "profile",
      label: t("profile"),
      dropdown: [
        { label: t("companyHistory"), href: "/profile#history" },
        { label: t("boardOfDirectors"), href: "/profile#board" },
        { label: t("ourEmployees"), href: "/profile#employees" },
        { label: t("gallery"), href: "/gallery" },
        { label: t("latestNews"), href: "/profile#news" },
        { label: t("rehabMembership"), href: "/profile#rehab" },
      ],
    },
  ];

  return (
    <nav className="fixed left-0 right-0 top-9 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 lg:px-8">
        <a href="/#home" className="flex items-center gap-2 sm:gap-3 -ml-1 sm:ml-0">
          <img
            src={logo}
            alt="Starline Builders"
            className="h-12 w-12 shrink-0 object-contain sm:h-16 sm:w-16"
          />
          <div className="flex min-w-0 flex-col leading-tight">
            <span
              className="truncate text-[13px] font-bold tracking-wide text-primary sm:text-base sm:whitespace-nowrap"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("company")}
            </span>
            <span
              className="truncate text-[8px] font-semibold uppercase tracking-[1.5px] leading-tight sm:text-[10px] sm:tracking-[2px] sm:whitespace-nowrap"
              style={{
                background: "linear-gradient(90deg, #d4a017, #f4cf5b, #b8860b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("tagline")}
            </span>
          </div>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {items.map((item) =>
            "dropdown" in item ? (
              <li
                key={item.key}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.key)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-brand"
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <div
                  className={cn(
                    "absolute left-0 top-full min-w-[180px] origin-top rounded-lg border border-border bg-popover py-1.5 text-popover-foreground shadow-lg transition-all",
                    openDropdown === item.key
                      ? "visible opacity-100 translate-y-0"
                      : "invisible opacity-0 -translate-y-1",
                  )}
                >
                  {item.dropdown.map((d) => (
                    <a
                      key={d.label}
                      href={d.href}
                      className="block px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent/30 hover:text-brand"
                    >
                      {d.label}
                    </a>
                  ))}
                </div>
              </li>
            ) : (
              <li key={item.key}>
                <a
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-brand"
                >
                  {item.label}
                </a>
              </li>
            ),
          )}
        </ul>

        <div className="flex items-center gap-2">
          {userEmail ? (
            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <button
                type="button"
                className="flex max-w-[180px] items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition hover:border-brand"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {userEmail.charAt(0).toUpperCase()}
                </span>
                <span className="truncate">{userEmail.split("@")[0]}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <div
                className={cn(
                  "absolute right-0 top-full min-w-[200px] rounded-lg border border-border bg-popover py-1.5 shadow-lg transition-all",
                  userMenuOpen
                    ? "visible opacity-100 translate-y-0"
                    : "invisible opacity-0 -translate-y-1",
                )}
              >
                <div className="border-b border-border px-3 py-2">
                  <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent/30"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/auth"
              className="hidden items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 sm:flex"
            >
              <User className="h-4 w-4" />
              {t("login")}
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-foreground hover:bg-accent/30 lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 lg:hidden">
          <ul className="mx-auto max-w-[1400px] px-4 py-2">
            {items.map((item) => (
              <li key={item.key} className="border-b border-border/50 last:border-0">
                {"dropdown" in item ? (
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between px-2 py-3 text-sm font-medium">
                      {item.label}
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="pb-2 pl-4">
                      {item.dropdown.map((d) => (
                        <a
                          key={d.label}
                          href={d.href}
                          onClick={() => setOpen(false)}
                          className="block py-1.5 text-sm text-foreground/70 hover:text-brand"
                        >
                          {d.label}
                        </a>
                      ))}
                    </div>
                  </details>
                ) : (
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-2 py-3 text-sm font-medium"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
            <li className="pt-3">
              {userEmail ? (
                <div className="space-y-2">
                  <p className="px-2 text-xs text-muted-foreground">
                    Signed in as <b className="text-foreground">{userEmail}</b>
                  </p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-destructive/40 px-4 py-2 text-sm font-semibold text-destructive"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  <User className="h-4 w-4" />
                  {t("login")}
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
