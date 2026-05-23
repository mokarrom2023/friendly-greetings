import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeName = "navy" | "emerald" | "charcoal" | "logo";

export const THEMES: { id: ThemeName; label: string; labelBn: string; swatch: string }[] = [
  { id: "navy", label: "Royal Navy + Gold", labelBn: "রয়্যাল নেভি + গোল্ড", swatch: "#c9a84c" },
  { id: "emerald", label: "Emerald + Cream", labelBn: "এমেরাল্ড + ক্রিম", swatch: "#0d7a5f" },
  { id: "charcoal", label: "Charcoal + Orange", labelBn: "চারকোল + অরেঞ্জ", swatch: "#e85d3a" },
  { id: "logo", label: "Logo Colors", labelBn: "লোগো কালার", swatch: "#1e40af" },
];

type ThemeCtx = { theme: ThemeName; setTheme: (t: ThemeName) => void };
const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("navy");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("sl_theme")) as ThemeName | null;
    if (saved && THEMES.some((t) => t.id === saved)) setThemeState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    if (typeof window !== "undefined") localStorage.setItem("sl_theme", t);
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
