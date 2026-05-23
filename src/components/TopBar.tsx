import { useEffect, useState, useRef } from "react";
import { Calendar, Clock, Languages, Palette, Check } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useTheme, THEMES, type ThemeName } from "@/lib/theme";
import { cn } from "@/lib/utils";

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function isOfficeOpen(d: Date) {
  const day = d.getDay(); // 0=Sun ... 6=Sat
  // Sat–Thu open (closed Friday = 5)
  if (day === 5) return false;
  const h = d.getHours();
  return h >= 10 && h < 18;
}

export function TopBar() {
  const { lang, toggle, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const now = useNow();
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const dateLocale = lang === "bn" ? "bn-BD" : "en-US";
  const dateStr = now.toLocaleDateString(dateLocale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString(dateLocale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const open = isOfficeOpen(now);

  return (
    <div
      className="fixed left-0 right-0 top-0 z-[100] h-9 text-[11px] shadow-md"
      style={{
        background:
          "linear-gradient(90deg, oklch(0.28 0.07 152) 0%, oklch(0.34 0.09 152) 40%, oklch(0.32 0.08 148) 70%, oklch(0.26 0.06 152) 100%)",
        color: "oklch(0.98 0 0)",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-3 px-4">
        {/* LEFT — Company name */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-amber-300">★</span>
          <span
            className="hidden font-semibold uppercase tracking-[2px] sm:inline"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("company")}
          </span>
        </div>

        {/* CENTER — Date + time */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-3 md:flex">
          <div className="flex items-center gap-1.5 text-white/85">
            <Calendar className="h-3 w-3 text-amber-300" />
            <span>{dateStr}</span>
          </div>
          <div className="h-3 w-px bg-white/20" />
          <div className="flex items-center gap-1.5 text-white/85">
            <Clock className="h-3 w-3 text-amber-300" />
            <span className="tabular-nums">{timeStr}</span>
          </div>
        </div>

        {/* RIGHT — Office, Language, Theme picker */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 lg:flex">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                open ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-red-400",
              )}
            />
            <span className="text-white/85">{open ? t("officeOpen") : t("officeClosed")}</span>
          </div>
          <div className="hidden h-3 w-px bg-white/20 lg:block" />

          {/* Language toggle EN / বাং */}
          <button
            type="button"
            onClick={toggle}
            title={t("langTitle")}
            className="flex items-center gap-1 rounded border border-amber-300/40 bg-amber-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200 transition-all hover:bg-amber-300/20"
          >
            <Languages className="h-3 w-3" />
            <span className={lang === "en" ? "text-amber-200" : "text-white/50"}>EN</span>
            <span className="text-white/30">|</span>
            <span
              className={lang === "bn" ? "text-amber-200" : "text-white/50"}
              style={{ fontFamily: "system-ui" }}
            >
              বাং
            </span>
          </button>

          <div className="h-3 w-px bg-white/20" />

          {/* Theme picker */}
          <div className="relative" ref={pickerRef}>
            <button
              type="button"
              onClick={() => setPickerOpen((v) => !v)}
              title={t("themeTitle")}
              className="flex items-center gap-1 rounded border border-white/20 bg-white/5 px-2 py-0.5 text-white/90 transition-all hover:bg-white/15"
            >
              <Palette className="h-3 w-3" />
              <span className="flex items-center gap-1">
                {THEMES.map((th) => (
                  <span
                    key={th.id}
                    className={cn(
                      "h-2.5 w-2.5 rounded-full ring-1 ring-white/40 transition-all",
                      theme === th.id && "ring-2 ring-white scale-110",
                    )}
                    style={{ background: th.swatch }}
                  />
                ))}
              </span>
            </button>

            {pickerOpen && (
              <div
                className="absolute right-0 top-[calc(100%+6px)] w-56 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl"
                role="menu"
              >
                <div className="border-b border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("themeTitle")}
                </div>
                {THEMES.map((th) => {
                  const active = theme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => {
                        setTheme(th.id as ThemeName);
                        setPickerOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-accent/40",
                        active && "bg-accent/30",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="h-3.5 w-3.5 rounded-full ring-2 ring-offset-1 ring-offset-popover"
                          style={{ background: th.swatch, boxShadow: `0 0 0 1px ${th.swatch}` }}
                        />
                        <span>{lang === "bn" ? th.labelBn : th.label}</span>
                      </span>
                      {active && <Check className="h-3.5 w-3.5 text-brand" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
