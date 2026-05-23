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

    // Properties section
    ourProjects: "Our Projects",
    propertiesTitle: "Premium Properties Curated for You",
    propertiesSubtitle:
      "Discover thoughtfully designed homes & commercial spaces across Dhaka's most desirable locations.",
    all: "All",
    beds: "Beds",
    viewDetails: "View Details",

    // About
    aboutTag: "About Us",
    aboutTitle: "Crafting Landmarks Since 2008",
    aboutP1:
      "Starline Builders Ltd. is one of Bangladesh's most trusted real estate developers, delivering premium residential and commercial projects with uncompromising quality and timely handover.",
    aboutP2:
      "With over 50+ completed projects and 200+ satisfied families, we continue to redefine modern urban living through architecture, innovation and trust.",
    yearsExp: "Years of Excellence",
    projectsDone: "Projects Completed",
    happyFamilies: "Happy Families",
    sqftBuilt: "Sqft Delivered",
    learnMore: "Learn More",

    // Why Choose Us
    whyTag: "Why Choose Us",
    whyTitle: "The Starline Advantage",
    whySubtitle: "Built on trust. Backed by quality. Driven by innovation.",
    why1Title: "Premium Quality",
    why1Desc: "World-class materials & finishes in every project we build.",
    why2Title: "On-Time Handover",
    why2Desc: "We honor our commitments — every project delivered on schedule.",
    why3Title: "REHAB Member",
    why3Desc: "Registered & certified developer with full legal compliance.",
    why4Title: "Prime Locations",
    why4Desc: "Strategic addresses in Dhaka's most sought-after neighborhoods.",
    why5Title: "Smart Investment",
    why5Desc: "Properties that appreciate — your future, secured.",
    why6Title: "24/7 Support",
    why6Desc: "Dedicated after-sales care for all our valued homeowners.",

    // Contact
    contactTag: "Get In Touch",
    contactTitle: "Let's Build Your Dream Together",
    contactSubtitle: "Have a question or want to schedule a site visit? We'd love to hear from you.",
    contactName: "Your Name",
    contactEmail: "Email Address",
    contactPhone: "Phone Number",
    contactMessage: "Your Message",
    contactSend: "Send Message",
    contactAddress: "Head Office",
    contactAddressVal: "House #42, Road #11, Banani, Dhaka-1213",
    contactCall: "Call Us",
    contactEmailUs: "Email Us",
    contactSent: "Message sent successfully!",
    contactOfficeHours: "Office Hours",
    contactOfficeHoursVal: "Sat – Thu: 10:00 AM – 6:00 PM",
    contactLocation: "Live Location",
    contactInterestedIn: "Interested Property",
    contactSelectProperty: "Select a property",
    propertyGeneral: "General Inquiry",

    // Footer
    footerTagline:
      "Bangladesh's premier luxury real estate developer — building tomorrow's landmarks today.",
    quickLinks: "Quick Links",
    services: "Services",
    followUs: "Follow Us",
    newsletter: "Newsletter",
    newsletterDesc: "Subscribe for project launches & exclusive offers.",
    subscribe: "Subscribe",
    yourEmail: "Your email",
    rights: "All rights reserved.",
    designedBy: "Designed with care.",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
    sitemap: "Sitemap",
    careers: "Careers",
    footerOfficeHours: "Sat – Thu: 10:00 AM – 6:00 PM",

    // Profile page
    profileTag: "Company Profile",
    profileTitle: "Inside Starline Builders Ltd.",
    profileSubtitle:
      "A glimpse into our journey, leadership, people, milestones and legal credentials.",
    historyTitle: "Our Story",
    historyP1:
      "Founded in 2008, Starline Builders Ltd. began with a single vision — to redefine premium living in Dhaka through honest craftsmanship, transparent dealings and timely handovers.",
    historyP2:
      "From a small studio of 5 engineers, we have grown into a 200+ member team delivering 50+ landmark projects across Bangladesh's most prestigious neighborhoods.",
    historyP3:
      "Today, Starline is synonymous with trust — chosen by 200+ families and recognized by the industry for setting new benchmarks in design, safety and after-sales service.",
    milestonesTitle: "Key Milestones",
    boardTitle: "Board of Directors",
    boardSubtitle: "Visionaries who steer our journey.",
    chairman: "Chairman",
    managingDirector: "Managing Director",
    director: "Director",
    executiveDirector: "Executive Director",
    employeesTitle: "Our People",
    employeesSubtitle: "The dedicated team behind every Starline project.",
    engineering: "Engineering",
    architecture: "Architecture",
    sales: "Sales & Marketing",
    finance: "Finance",
    construction: "Construction",
    customerCare: "Customer Care",
    employeesCount: "Team Members",
    departmentsCount: "Departments",
    newsTitle: "Updates & Latest News",
    newsSubtitle: "Stay informed with the latest from Starline.",
    readMore: "Read More",
    credentialsTitle: "Certifications & Legal Credentials",
    credentialsSubtitle: "Fully licensed, registered and compliant.",
    rehabMember: "REHAB Member",
    rehabMemberDesc: "Registered member of Real Estate & Housing Association of Bangladesh.",
    tradeLicense: "Trade License",
    tradeLicenseNo: "License No: TRAD/DSCC/000123/2008",
    tinCertificate: "TIN Certificate",
    tinNo: "TIN: 123456789012",
    binCertificate: "BIN / VAT Registration",
    binNo: "BIN: 000123456-0202",
    incorporationCert: "Certificate of Incorporation",
    incorporationNo: "RJSC Reg: C-72345/2008",
    isoCertified: "ISO 9001:2015",
    isoCertifiedDesc: "Certified Quality Management System.",
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

    ourProjects: "আমাদের প্রজেক্ট",
    propertiesTitle: "আপনার জন্য নির্বাচিত প্রিমিয়াম প্রপার্টি",
    propertiesSubtitle:
      "ঢাকার সবচেয়ে আকর্ষণীয় এলাকায় সুপরিকল্পিত আবাসিক ও বাণিজ্যিক স্থান আবিষ্কার করুন।",
    all: "সব",
    beds: "বেড",
    viewDetails: "বিস্তারিত দেখুন",

    aboutTag: "আমাদের সম্পর্কে",
    aboutTitle: "২০০৮ সাল থেকে ল্যান্ডমার্ক তৈরি করছি",
    aboutP1:
      "স্টারলাইন বিল্ডার্স লিঃ বাংলাদেশের অন্যতম বিশ্বস্ত রিয়েল এস্টেট ডেভেলপার, আপোসহীন মান ও সময়মত হস্তান্তরের সাথে প্রিমিয়াম আবাসিক ও বাণিজ্যিক প্রজেক্ট সরবরাহ করছে।",
    aboutP2:
      "৫০+ সম্পন্ন প্রকল্প এবং ২০০+ সন্তুষ্ট পরিবারের সাথে, আমরা স্থাপত্য, উদ্ভাবন ও বিশ্বাসের মাধ্যমে আধুনিক নগর জীবনকে নতুনভাবে সংজ্ঞায়িত করছি।",
    yearsExp: "বছরের অভিজ্ঞতা",
    projectsDone: "সম্পন্ন প্রকল্প",
    happyFamilies: "সুখী পরিবার",
    sqftBuilt: "বর্গফুট নির্মিত",
    learnMore: "আরও জানুন",

    whyTag: "কেন আমাদের বেছে নিবেন",
    whyTitle: "স্টারলাইন এর সুবিধা",
    whySubtitle: "বিশ্বাসে গড়া। মানে সমর্থিত। উদ্ভাবনে চালিত।",
    why1Title: "প্রিমিয়াম মান",
    why1Desc: "প্রতিটি প্রকল্পে বিশ্বমানের উপাদান ও ফিনিশিং।",
    why2Title: "সময়মত হস্তান্তর",
    why2Desc: "আমরা প্রতিশ্রুতি রক্ষা করি — প্রতিটি প্রকল্প সময়মত সরবরাহ।",
    why3Title: "রিহ্যাব সদস্য",
    why3Desc: "নিবন্ধিত ও সার্টিফায়েড ডেভেলপার, সম্পূর্ণ আইনি নিয়ম মেনে।",
    why4Title: "প্রাইম লোকেশন",
    why4Desc: "ঢাকার সবচেয়ে কাঙ্ক্ষিত এলাকায় কৌশলগত ঠিকানা।",
    why5Title: "স্মার্ট বিনিয়োগ",
    why5Desc: "মূল্যবান হয়ে ওঠা প্রপার্টি — আপনার ভবিষ্যৎ নিরাপদ।",
    why6Title: "২৪/৭ সাপোর্ট",
    why6Desc: "সকল গৃহকর্তার জন্য নিবেদিত আফটার-সেলস সেবা।",

    contactTag: "যোগাযোগ করুন",
    contactTitle: "চলুন একসাথে আপনার স্বপ্ন গড়ি",
    contactSubtitle: "কোনো প্রশ্ন আছে বা সাইট ভিজিট চান? আমরা আপনার কথা শুনতে চাই।",
    contactName: "আপনার নাম",
    contactEmail: "ইমেইল ঠিকানা",
    contactPhone: "ফোন নম্বর",
    contactMessage: "আপনার বার্তা",
    contactSend: "বার্তা পাঠান",
    contactAddress: "প্রধান কার্যালয়",
    contactAddressVal: "বাড়ি #৪২, রোড #১১, বনানী, ঢাকা-১২১৩",
    contactCall: "কল করুন",
    contactEmailUs: "ইমেইল করুন",
    contactSent: "বার্তা সফলভাবে পাঠানো হয়েছে!",
    contactOfficeHours: "অফিস সময়",
    contactOfficeHoursVal: "শনি – বৃহঃ: সকাল ১০টা – সন্ধ্যা ৬টা",
    contactLocation: "লাইভ লোকেশন",
    contactInterestedIn: "আগ্রহী প্রপার্টি",
    contactSelectProperty: "প্রপার্টি নির্বাচন করুন",
    propertyGeneral: "সাধারণ জিজ্ঞাসা",

    footerTagline:
      "বাংলাদেশের প্রিমিয়ার লাক্সারি রিয়েল এস্টেট ডেভেলপার — আজই আগামীর ল্যান্ডমার্ক তৈরি করছি।",
    quickLinks: "দ্রুত লিংক",
    services: "সেবাসমূহ",
    followUs: "আমাদের ফলো করুন",
    newsletter: "নিউজলেটার",
    newsletterDesc: "নতুন প্রকল্প ও বিশেষ অফারের জন্য সাবস্ক্রাইব করুন।",
    subscribe: "সাবস্ক্রাইব",
    yourEmail: "আপনার ইমেইল",
    rights: "সর্বস্বত্ব সংরক্ষিত।",
    designedBy: "যত্ন সহকারে ডিজাইন করা।",
    privacyPolicy: "প্রাইভেসি পলিসি",
    termsConditions: "শর্তাবলী",
    sitemap: "সাইটম্যাপ",
    careers: "ক্যারিয়ার",
    footerOfficeHours: "শনি – বৃহঃ: সকাল ১০টা – সন্ধ্যা ৬টা",
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
