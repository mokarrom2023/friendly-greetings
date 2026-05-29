import { Facebook, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useSocialLinks } from "@/lib/social-links";
import logo from "@/assets/logo.png";

// X (Twitter) icon — lucide doesn't ship a current X glyph, inline SVG
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2H21l-6.52 7.45L22 22h-6.79l-4.74-6.21L4.8 22H2l7-8L1.6 2h6.95l4.28 5.69L18.244 2Zm-1.19 18h1.55L7.04 4H5.4l11.654 16Z" />
    </svg>
  );
}

// TikTok icon — inline SVG (not shipped in lucide)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.83a8.16 8.16 0 0 0 4.77 1.52V6.9a4.85 4.85 0 0 1-1.84-.21Z" />
    </svg>
  );
}

export function Footer() {
  const { t } = useLanguage();
  const { data: links } = useSocialLinks();
  const year = new Date().getFullYear();

  const socials = [
    { Icon: Facebook, href: links?.facebook, label: "Facebook" },
    { Icon: Instagram, href: links?.instagram, label: "Instagram" },
    { Icon: Youtube, href: links?.youtube, label: "YouTube" },
    { Icon: Linkedin, href: links?.linkedin, label: "LinkedIn" },
    { Icon: XIcon, href: links?.twitter, label: "X" },
    { Icon: TikTokIcon, href: links?.tiktok, label: "TikTok" },
  ];



  return (
    <footer
      className="text-white"
      style={{
        background:
          "linear-gradient(180deg, var(--primary) 0%, color-mix(in oklab, var(--primary) 80%, black) 100%)",
      }}
    >
      <div className="container mx-auto max-w-7xl px-4 py-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Starline Builders" className="h-12 w-12 object-contain" />
              <div>
                <div
                  className="text-base font-bold tracking-wide"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t("company")}
                </div>
                <div
                  className="text-[10px] uppercase tracking-[2px]"
                  style={{ color: "#f4cf5b" }}
                >
                  {t("tagline")}
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/75">{t("footerTagline")}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {socials.map(({ Icon, href, label }) => {
                const hasLink = !!(href && href.trim().length > 0);
                const base = "flex h-9 w-9 items-center justify-center rounded-full border transition-all";
                return hasLink ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className={`${base} border-white/20 hover:border-white hover:bg-white/10`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ) : (
                  <span
                    key={label}
                    aria-label={`${label} (no link configured)`}
                    title={`${label} — add a link in the admin dashboard`}
                    className={`${base} cursor-not-allowed border-white/10 text-white/40`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                );
              })}
            </div>
          </div>


          {/* Quick links */}
          <div>
            <h4
              className="mb-5 text-sm font-bold uppercase tracking-[2px]"
              style={{ color: "#f4cf5b" }}
            >
              {t("quickLinks")}
            </h4>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li><a href="/#home" className="hover:text-white">{t("home")}</a></li>
              <li><a href="/#about" className="hover:text-white">{t("about")}</a></li>
              <li><a href="/#properties" className="hover:text-white">{t("property")}</a></li>
              <li><a href="/#properties" className="hover:text-white">{t("location")}</a></li>
              <li><a href="/#properties" className="hover:text-white">{t("size")}</a></li>
              <li><a href="/#contact" className="hover:text-white">{t("contact")}</a></li>
              <li><a href="/gallery" className="hover:text-white">{t("gallery")}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="mb-5 text-sm font-bold uppercase tracking-[2px]"
              style={{ color: "#f4cf5b" }}
            >
              {t("legal")}
            </h4>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li><a href="#" className="hover:text-white">{t("careers")}</a></li>
              <li><a href="#" className="hover:text-white">{t("privacyPolicy")}</a></li>
              <li><a href="#" className="hover:text-white">{t("termsConditions")}</a></li>
              <li><a href="#" className="hover:text-white">{t("sitemap")}</a></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4
              className="mb-5 text-sm font-bold uppercase tracking-[2px]"
              style={{ color: "#f4cf5b" }}
            >
              {t("contact")}
            </h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#f4cf5b" }} />
                <span>{t("contactAddressVal")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0" style={{ color: "#f4cf5b" }} />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0" style={{ color: "#f4cf5b" }} />
                <span>info@starlinebuilders.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#f4cf5b" }} />
                <span>{t("footerOfficeHours")}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4
              className="mb-5 text-sm font-bold uppercase tracking-[2px]"
              style={{ color: "#f4cf5b" }}
            >
              {t("newsletter")}
            </h4>
            <p className="mb-4 text-sm text-white/75">{t("newsletterDesc")}</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-2"
            >
              <input
                type="email"
                placeholder={t("yourEmail")}
                className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/50 outline-none focus:border-amber-300"
              />
              <button
                type="submit"
                className="w-full rounded-md px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary transition-all hover:scale-[1.02]"
                style={{ background: "#f4cf5b" }}
              >
                {t("subscribe")}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-xs text-white/60 sm:flex-row">
          <span>© {year} {t("company")} {t("rights")}</span>
          <span>{t("designedBy")}</span>
        </div>
      </div>
    </footer>
  );
}
