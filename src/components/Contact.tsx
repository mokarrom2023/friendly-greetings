import { useState, type FormEvent } from "react";
import { MapPin, Phone, Mail, Send, Check, Clock, Navigation, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";

const PROPERTY_OPTIONS = [
  "Starline Heights – Gulshan",
  "Starline Crown – Banani",
  "Starline Residency – Bashundhara",
  "Starline Palace – Dhanmondi",
  "Starline Skyline – Uttara",
  "Starline Galaxy – Mirpur",
  "Starline Lake View – Purbachal",
  "Duplex / Penthouse",
  "Commercial Space",
  "Studio Apartment",
];

export function Contact() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? "") || null,
        property: String(fd.get("property") ?? "") || null,
        message: String(fd.get("message") ?? ""),
      });
      if (error) throw error;
      setSent(true);
      form.reset();
      setTimeout(() => setSent(false), 3500);
    } catch (e: unknown) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };


  const cards = [
    { icon: MapPin, title: t("contactAddress"), value: t("contactAddressVal") },
    { icon: Phone, title: t("contactCall"), value: "+880 1700-000000" },
    { icon: Mail, title: t("contactEmailUs"), value: "info@starlinebuilders.com" },
    { icon: Clock, title: t("contactOfficeHours"), value: t("contactOfficeHoursVal") },
  ];

  const mapsUrl =
    "https://www.google.com/maps?q=Banani,+Dhaka-1213,+Bangladesh&output=embed";
  const directionsUrl =
    "https://www.google.com/maps/dir/?api=1&destination=Banani,+Dhaka-1213,+Bangladesh";

  return (
    <section id="contact" className="bg-secondary/40 py-14 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[4px] text-brand">
            {t("contactTag")}
          </span>
          <h2
            className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("contactTitle")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("contactSubtitle")}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Info cards + map */}
          <div className="space-y-4 lg:col-span-2">
            {cards.map((c) => (
              <div
                key={c.title}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-brand"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background: "color-mix(in oklab, var(--brand) 15%, transparent)",
                    color: "var(--brand)",
                  }}
                >
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {c.title}
                  </div>
                  <div className="mt-1 text-sm font-medium text-foreground">{c.value}</div>
                </div>
              </div>
            ))}

            {/* Live location map */}
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <Navigation className="h-4 w-4" style={{ color: "var(--brand)" }} />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {t("contactLocation")}
                  </span>
                </div>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold uppercase tracking-wider text-brand hover:underline"
                >
                  {t("viewDetails")}
                </a>
              </div>
              <iframe
                title="Starline Builders location"
                src={mapsUrl}
                className="h-56 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-3"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                name="name"
                type="text"
                placeholder={t("contactName")}
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <input
                required
                name="email"
                type="email"
                placeholder={t("contactEmail")}
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <input
              name="phone"
              type="tel"
              placeholder={t("contactPhone")}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("contactInterestedIn")}
              </label>
              <select
                required
                name="property"
                defaultValue=""
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
              >
                <option value="" disabled>
                  {t("contactSelectProperty")}
                </option>
                <option value="general">{t("propertyGeneral")}</option>
                {PROPERTY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              required
              name="message"
              rows={5}
              placeholder={t("contactMessage")}
              className="w-full resize-none rounded-md border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            {err && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</p>
            )}
            <button
              type="submit"
              disabled={busy || sent}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm font-semibold uppercase tracking-wider shadow-md transition-all hover:scale-[1.01] disabled:opacity-70 sm:w-auto"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("contactSend")}
                </>
              ) : sent ? (
                <>
                  <Check className="h-4 w-4" />
                  {t("contactSent")}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t("contactSend")}
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}
