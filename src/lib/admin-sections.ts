// Configuration of all editable sections in the admin dashboard.
// Each item maps to a section_key in the site_sections / section_items tables.

export type SectionType = "single" | "list" | "custom";

export interface SectionConfig {
  key: string;
  label: string;
  type: SectionType;
  group: string;
  hint?: string;
  fields?: Array<"title" | "subtitle" | "description" | "image" | "video">;
}

export const SECTION_GROUPS = [
  "Inbox",
  "Header",
  "Properties",
  "Main Sections",
  "Extra Sections",
  "List Content",
  "Footer",
] as const;


export const SECTIONS: SectionConfig[] = [
  // Inbox group
  { key: "messages", label: "📨 Contact Messages", type: "custom", group: "Inbox", hint: "Messages submitted via the website contact form." },


  // Header group
  { key: "topbar", label: "Top Bar", type: "single", group: "Header", fields: ["title", "subtitle", "description"], hint: "Company name, office hours, contact info shown above the navbar." },
  { key: "navbar", label: "Navbar / Logo", type: "single", group: "Header", fields: ["title", "subtitle", "image"], hint: "Logo image, company name, tagline." },
  { key: "hero_slides", label: "🖼️ Hero Slideshow Images", type: "list", group: "Header", hint: "Big homepage background slideshow. Add, replace or delete slide images here." },


  // Main sections
  { key: "hero", label: "Hero Banner", type: "single", group: "Main Sections", fields: ["title", "subtitle", "description", "image", "video"], hint: "Big homepage banner with title and CTAs." },
  { key: "about", label: "About Us", type: "single", group: "Main Sections", fields: ["title", "subtitle", "description", "image"] },
  { key: "why_choose", label: "Why Choose Us (header)", type: "single", group: "Main Sections", fields: ["title", "subtitle", "description"] },
  { key: "contact", label: "Contact Info", type: "single", group: "Main Sections", fields: ["title", "subtitle", "description"], hint: "Address, phone, email shown in Contact section." },

  // Extra sections (13)
  { key: "extra_stats", label: "1. Stats / Numbers", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"] },
  { key: "extra_services", label: "2. Services", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"] },
  { key: "extra_process", label: "3. Process Timeline", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"] },
  { key: "extra_testimonials", label: "4. Testimonials", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"] },
  { key: "extra_team", label: "5. Team Preview", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"] },
  { key: "extra_awards", label: "6. Awards", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"] },
  { key: "extra_partners", label: "7. Partners / Clients", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"] },
  { key: "extra_blog", label: "8. Blog Preview", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"] },
  { key: "extra_amenities", label: "9. Amenities", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"] },
  { key: "extra_emi", label: "10. EMI Calculator", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"] },
  { key: "extra_gallery_preview", label: "11. Gallery Preview", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"] },
  { key: "extra_newsletter", label: "12. Newsletter CTA", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"] },
  { key: "extra_faq", label: "13. FAQ (header)", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"] },

  // List content
  { key: "team_members", label: "Team Members (advanced)", type: "custom", group: "List Content", hint: "Manage employees grouped by department." },
  { key: "news", label: "News Articles", type: "list", group: "List Content", hint: "Each item: title, summary, image, link." },
  { key: "gallery", label: "Gallery Items", type: "list", group: "List Content", hint: "Each item: title, image." },
  { key: "faq_items", label: "FAQ Items", type: "list", group: "List Content", hint: "Each item: question (title), answer (description)." },
  { key: "testimonials_list", label: "Testimonials List", type: "list", group: "List Content", hint: "Each item: client name (title), role (subtitle), quote (description), photo." },
  { key: "services_list", label: "Services List", type: "list", group: "List Content" },
  { key: "amenities_list", label: "Amenities List", type: "list", group: "List Content" },
  { key: "awards_list", label: "Awards List", type: "list", group: "List Content" },
  { key: "partners_list", label: "Partners List", type: "list", group: "List Content" },
  { key: "blog_list", label: "Blog Posts", type: "list", group: "List Content" },

  // Footer
  { key: "footer", label: "Footer", type: "single", group: "Footer", fields: ["title", "subtitle", "description"], hint: "Footer text, copyright." },
  { key: "social_links", label: "🔗 Social Links", type: "custom", group: "Footer", hint: "WhatsApp, Messenger, Telegram (floating icons) + Facebook/Instagram/etc (footer icons)." },
];

