import { useState, type FormEvent } from "react";
import { MapPin, Phone, Mail, Send, Check } from "lucide-react";
import { useLanguage } from "@/lib/language";

export function Contact() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3500);
    (e.currentTarget as HTMLFormElement).reset();
  };

  const cards = [
    {
      icon: MapPin,
      title: t("contactAddress"),
      value: t("contactAddressVal"),
    },
    { icon: Phone, title: t("contactCall"), value: "+880 1700-000000" },
    { icon: Mail, title: t("contactEmailUs"), value: "info@starlinebuilders.com" },
  ];

  return (
    <section id="contact" className="bg-secondary/40 py-24">
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
          {/* Info cards */}
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
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-3"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                type="text"
                placeholder={t("contactName")}
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <input
                required
                type="email"
                placeholder={t("contactEmail")}
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <input
              type="tel"
              placeholder={t("contactPhone")}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <textarea
              required
              rows={5}
              placeholder={t("contactMessage")}
              className="w-full resize-none rounded-md border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="submit"
              disabled={sent}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm font-semibold uppercase tracking-wider shadow-md transition-all hover:scale-[1.01] disabled:opacity-70 sm:w-auto"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {sent ? (
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
