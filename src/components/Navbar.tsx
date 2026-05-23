import { useState } from "react";
import { ChevronDown, Menu, X, User } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

type NavItem =
  | { key: string; label: string; href: string }
  | { key: string; label: string; dropdown: { label: string; href: string }[] };

export function Navbar() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const items: NavItem[] = [
    { key: "home", label: t("home"), href: "#home" },
    { key: "about", label: t("about"), href: "#about" },
    { key: "contact", label: t("contact"), href: "#contact" },
    {
      key: "property",
      label: t("property"),
      dropdown: [
        { label: t("ongoing"), href: "#properties" },
        { label: t("handover"), href: "#properties" },
        { label: t("processing"), href: "#properties" },
        { label: t("upcoming"), href: "#properties" },
        { label: t("featured"), href: "#properties" },
      ],
    },
    {
      key: "location",
      label: t("location"),
      dropdown: [
        { label: "Gulshan", href: "#properties" },
        { label: "Banani", href: "#properties" },
        { label: "Bashundhara", href: "#properties" },
        { label: "Dhanmondi", href: "#properties" },
        { label: "Uttara", href: "#properties" },
        { label: "Mirpur", href: "#properties" },
        { label: "Purbachal", href: "#properties" },
      ],
    },
    {
      key: "profile",
      label: t("profile"),
      dropdown: [
        { label: t("boardOfDirectors"), href: "#profile" },
        { label: t("ourEmployees"), href: "#profile" },
        { label: t("latestNews"), href: "#profile" },
        { label: t("rehabMembership"), href: "#profile" },
        { label: t("companyHistory"), href: "#about" },
      ],
    },
  ];

  return (
    <nav className="fixed left-0 right-0 top-9 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 lg:px-8">
        <a href="#home" className="flex items-center gap-3">
          <img src={logo} alt="Starline Builders" className="h-11 w-11 object-contain" />
          <div className="hidden flex-col leading-tight sm:flex">
            <span
              className="text-base font-bold tracking-wide text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("company")}
            </span>
            <span
              className="text-[10px] font-semibold uppercase tracking-[2px]"
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
          <button
            type="button"
            className="hidden items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 sm:flex"
          >
            <User className="h-4 w-4" />
            {t("login")}
          </button>
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
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                <User className="h-4 w-4" />
                {t("login")}
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
