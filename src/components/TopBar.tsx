import { useEffect, useState } from "react";
import { Calendar, Clock, Languages } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useTheme, THEMES, type ThemeName } from "@/lib/theme";
import { cn } from "@/lib/utils";

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function getOfficeStatus(d: Date): { open: boolean; text: string } {
  const day = d.getDay(); // 0 = Sun ... 5 = Fri
  if (day === 5) return { open: false, text: "Friday Office Closed" };
  const h = d.getHours();
  if (h >= 10 && h < 18) return { open: true, text: "Office Open · 10:00 AM – 6:00 PM" };
  return { open: false, text: "Office Open Next Day 10 AM" };
}

export function TopBar() {
  const { lang, toggle, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const now = useNow();

  const dateLocale = lang === "bn" ? "bn-BD" : "en-US";
  const dateStr = now
    ? now.toLocaleDateString(dateLocale, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";
  const timeStr = now
    ? now.toLocaleTimeString(dateLocale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "";

  const status = now ? getOfficeStatus(now) : { open: false, text: "" };
  const open = status.open;

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
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-amber-300">★</span>
          <span
            className="hidden font-semibold uppercase tracking-[2px] sm:inline"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("company")}
          </span>
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-3 md:flex">
          <div className="flex items-center gap-1.5 text-white/85">
            <Calendar className="h-3 w-3 text-amber-300" />
            <span suppressHydrationWarning>{dateStr || "\u00A0"}</span>
          </div>
          <div className="h-3 w-px bg-white/20" />
          <div className="flex items-center gap-1.5 text-white/85">
            <Clock className="h-3 w-3 text-amber-300" />
            <span className="tabular-nums" suppressHydrationWarning>
              {timeStr || "\u00A0"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 lg:flex">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                open ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-red-400",
              )}
            />
            <span className="font-medium text-white/90" suppressHydrationWarning>
              {now ? status.text : "\u00A0"}
            </span>
          </div>
          <div className="hidden h-3 w-px bg-white/20 lg:block" />

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

          {/* Theme picker — direct click swatches */}
          <div
            className="flex items-center gap-1.5 rounded border border-white/20 bg-white/5 px-2 py-1"
            title={t("themeTitle")}
          >
            {THEMES.map((th) => {
              const active = theme === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setTheme(th.id as ThemeName)}
                  title={lang === "bn" ? th.labelBn : th.label}
                  aria-label={th.label}
                  className={cn(
                    "h-3 w-3 rounded-full ring-1 ring-white/40 transition-all hover:scale-125",
                    active && "ring-2 ring-white scale-125 shadow-[0_0_6px_rgba(255,255,255,0.6)]",
                  )}
                  style={{ background: th.swatch }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
