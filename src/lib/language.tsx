import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "bn";

// All site copy lives here. Add new keys as we build more sections.
export const translations = {
  en: {
    // Top bar
    company: "STARLINE BUILDERS LTD.",
    officeOpen: "Office Open",
    officeClosed: "Office Closed",
    officeHours: "Office: 10:00 AM – 6:00 PM",
    themeTitle: "Change theme",
    langTitle: "Toggle language",

    // Nav
    home: "Home",
    about: "About",
    contact: "Contact",
    property: "Property",
    location: "Location",
    size: "Size",
    duplex: "Duplex",
    commercial: "Commercial",
    studioApartment: "Studio Apartment",
    profile: "Profile",
    login: "Login",
    ongoing: "Ongoing",
    handover: "Handover",
    processing: "Processing",
    upcoming: "Upcoming",
    featured: "Featured",
    boardOfDirectors: "Board of Directors",
    ourEmployees: "Our Employees",
    latestNews: "Latest News",
    rehabMembership: "REHAB Membership",
    companyHistory: "Company History",

    // Hero
    heroTag: "Premium Real Estate",
    heroTitle1: "Building Future",
    heroTitleAccent: "Luxury",
    heroSubtitle:
      "Experience unmatched living with Starline Builders Ltd. — where architecture meets aspiration.",
    heroCta1: "Explore Properties",
    heroCta2: "Book Consultation",
    scrollDown: "Scroll Down",

    // Brand tagline
    tagline: "Invest Smart. Live Better.",
  },
  bn: {
    company: "স্টারলাইন বিল্ডার্স লিঃ",
    officeOpen: "অফিস খোলা",
    officeClosed: "অফিস বন্ধ",
    officeHours: "অফিস: সকাল ১০টা – সন্ধ্যা ৬টা",
    themeTitle: "থিম পরিবর্তন করুন",
    langTitle: "ভাষা পরিবর্তন",

    home: "হোম",
    about: "আমাদের সম্পর্কে",
    contact: "যোগাযোগ",
    property: "প্রপার্টি",
    location: "লোকেশন",
    size: "সাইজ",
    duplex: "ডুপ্লেক্স",
    commercial: "কমার্শিয়াল",
    studioApartment: "স্টুডিও অ্যাপার্টমেন্ট",
    profile: "প্রোফাইল",
    login: "লগইন",
    ongoing: "চলমান",
    handover: "হস্তান্তর",
    processing: "প্রসেসিং",
    upcoming: "আসন্ন",
    featured: "ফিচার্ড",
    boardOfDirectors: "পরিচালনা পর্ষদ",
    ourEmployees: "আমাদের কর্মীবৃন্দ",
    latestNews: "সাম্প্রতিক সংবাদ",
    rehabMembership: "রিহ্যাব সদস্যপদ",
    companyHistory: "কোম্পানির ইতিহাস",

    heroTag: "প্রিমিয়াম রিয়েল এস্টেট",
    heroTitle1: "ভবিষ্যৎ গড়ছি",
    heroTitleAccent: "বিলাসিতায়",
    heroSubtitle:
      "স্টারলাইন বিল্ডার্স লিঃ-এর সাথে অতুলনীয় জীবনযাত্রার অভিজ্ঞতা — যেখানে স্থাপত্য মিলিত হয় স্বপ্নের সাথে।",
    heroCta1: "প্রপার্টি দেখুন",
    heroCta2: "কনসাল্টেশন বুক করুন",
    scrollDown: "নিচে স্ক্রল করুন",

    tagline: "স্মার্ট বিনিয়োগ। উন্নত জীবন।",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("sl_lang")) as Lang | null;
    if (saved === "en" || saved === "bn") setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("sl_lang", l);
  };

  const toggle = () => setLang(lang === "en" ? "bn" : "en");

  const t = (key: TranslationKey) => translations[lang][key] ?? translations.en[key];

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
