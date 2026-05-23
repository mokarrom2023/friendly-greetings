import { Facebook, Instagram, Linkedin, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/lib/language";
import logo from "@/assets/logo.png";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer
      className="text-white"
      style={{
        background:
          "linear-gradient(180deg, var(--primary) 0%, color-mix(in oklab, var(--primary) 80%, black) 100%)",
      }}
    >
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
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
            <div className="mt-5 flex gap-2">
              {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-all hover:border-white hover:bg-white/10"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
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
              <li><a href="#home" className="hover:text-white">{t("home")}</a></li>
              <li><a href="#about" className="hover:text-white">{t("about")}</a></li>
              <li><a href="#properties" className="hover:text-white">{t("property")}</a></li>
              <li><a href="#contact" className="hover:text-white">{t("contact")}</a></li>
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
              className="flex flex-col gap-2 sm:flex-row"
            >
              <input
                type="email"
                placeholder={t("yourEmail")}
                className="flex-1 rounded-md border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/50 outline-none focus:border-amber-300"
              />
              <button
                type="submit"
                className="rounded-md px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary transition-all hover:scale-[1.02]"
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
