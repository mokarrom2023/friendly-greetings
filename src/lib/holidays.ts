import { supabase } from "@/integrations/supabase/client";

export type Holiday = {
  id: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  label_en: string;
  label_bn: string;
};

type RawItem = {
  id: string;
  title: string | null;
  subtitle: string | null;
  extra: Record<string, unknown> | null;
};

export async function fetchHolidays(): Promise<Holiday[]> {
  const { data, error } = await supabase
    .from("section_items")
    .select("id, title, subtitle, extra")
    .eq("section_key", "holidays")
    .order("sort_order");
  if (error) return [];
  return (data as RawItem[]).map((r) => ({
    id: r.id,
    label_en: r.title ?? "Holiday",
    label_bn: r.subtitle ?? r.title ?? "ছুটি",
    start_date: String(r.extra?.start_date ?? ""),
    end_date: String(r.extra?.end_date ?? ""),
  })).filter((h) => h.start_date && h.end_date);
}

// Local YYYY-MM-DD for `d`
function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function findActiveHoliday(holidays: Holiday[], now: Date): Holiday | null {
  const today = ymd(now);
  return holidays.find((h) => today >= h.start_date && today <= h.end_date) ?? null;
}

// Returns the next day after `endDate` (YYYY-MM-DD) as a Date.
export function reopenDate(endDate: string): Date {
  const [y, m, d] = endDate.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + 1);
  return dt;
}
