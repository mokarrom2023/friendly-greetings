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
  "Holidays",
  "Inbox",
  "Header",
  "Properties",
  "Main Sections",
  "Extra Sections",
  "List Content",
  "Footer",
  "Settings",
] as const;


export const SECTIONS: SectionConfig[] = [
  // Holidays (top section) — controls TopBar holiday banner
  { key: "holidays", label: "🎉 Holidays / Office Closures", type: "custom", group: "Holidays", hint: "Add government holidays (Eid, etc). Top bar will auto-show the holiday and reopen date. Office auto-reopens with normal hours after the end date." },

  // Inbox group
  { key: "messages", label: "📨 Contact Messages", type: "custom", group: "Inbox", hint: "Messages submitted via the website contact form. Reply via WhatsApp / Call / Email." },
  { key: "subscribers", label: "📬 Newsletter Subscribers", type: "custom", group: "Inbox", hint: "Everyone who subscribed via the footer newsletter form." },
  { key: "auth_users", label: "👥 Registered Users", type: "custom", group: "Inbox", hint: "Everyone who signed up / logged in to the website (email, phone, last login)." },


  // Header group
  { key: "topbar", label: "Top Bar", type: "single", group: "Header", fields: ["title", "subtitle", "description"], hint: "Company name, office hours, contact info shown above the navbar." },
  { key: "navbar", label: "Navbar / Logo", type: "single", group: "Header", fields: ["title", "subtitle", "image"], hint: "Logo image, company name, tagline." },
  { key: "hero_slides", label: "🖼️ Hero Slideshow Images", type: "list", group: "Header", hint: "Big homepage background slideshow. Add, replace or delete slide images here." },

  // Properties group
  { key: "properties", label: "🏢 Manage Properties", type: "custom", group: "Properties", hint: "Add, edit or delete property listings shown on the website. Upload cover image + gallery, set price, location, beds, size and status." },


  // Main sections
  { key: "hero", label: "Hero Banner", type: "single", group: "Main Sections", fields: ["title", "subtitle", "description", "image", "video"], hint: "Big homepage banner with title and CTAs." },
  { key: "about", label: "About Us", type: "single", group: "Main Sections", fields: ["title", "subtitle", "description", "image"] },
  { key: "why_choose", label: "Why Choose Us (header)", type: "single", group: "Main Sections", fields: ["title", "subtitle", "description"] },
  { key: "contact", label: "Contact (Heading)", type: "single", group: "Main Sections", fields: ["title", "subtitle", "description"], hint: "Heading + subtitle shown above the Get In Touch section." },
  { key: "contact_info", label: "📍 Contact Cards (Address / Phone / Email …)", type: "list", group: "Main Sections", hint: "Each item is one card. Title = Label (e.g. 'Our Address'). Subtitle = Icon name (MapPin, Phone, Mail, Clock, Globe, MessageCircle, Navigation, Building, Send). Description = Value (e.g. the address or phone number). Link URL (optional) = tel:..., mailto:..., or a Google Maps link to make the card clickable." },
  { key: "contact_map", label: "🗺️ Office Map Location", type: "single", group: "Main Sections", fields: ["title", "description"], hint: "Title = label shown above the map. Description = address used by Google Maps (e.g. 'Banani, Dhaka-1213, Bangladesh'). Leave empty to hide the map." },
  { key: "project_locations", label: "📍 Project Locations (Find Our Projects map)", type: "list", group: "Main Sections", hint: "Each item = one location chip next to the big map in 'Find Our Projects'. Title = location name (e.g. 'Gulshan-2'). Description = full address used by Google Maps (e.g. 'Gulshan-2, Dhaka, Bangladesh'). Link URL (optional) = custom Google Maps link; leave empty to auto-build from the address." },

  // Extra sections (13) — each also supports multiple images/videos via the Media gallery panel rendered below the editor.
  { key: "extra_stats", label: "1. Stats / Numbers", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"], hint: "Multiple images/videos can be uploaded from your device below." },
  { key: "extra_services", label: "2. Services", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"], hint: "Multiple images/videos can be uploaded from your device below." },
  { key: "extra_process", label: "3. Process Timeline", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"], hint: "Multiple images/videos can be uploaded from your device below." },
  { key: "extra_testimonials", label: "4. Testimonials", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"], hint: "Multiple images/videos can be uploaded from your device below." },
  { key: "extra_team", label: "5. Team Preview", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"], hint: "Multiple images/videos can be uploaded from your device below." },
  { key: "extra_awards", label: "6. Awards", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"], hint: "Multiple images/videos can be uploaded from your device below." },
  { key: "extra_partners", label: "7. Partners / Clients", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"], hint: "Multiple images/videos can be uploaded from your device below." },
  { key: "extra_blog", label: "8. Blog Preview", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"], hint: "Multiple images/videos can be uploaded from your device below." },
  { key: "extra_amenities", label: "9. Amenities", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"], hint: "Multiple images/videos can be uploaded from your device below." },
  { key: "extra_emi", label: "10. EMI Calculator", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"], hint: "Multiple images/videos can be uploaded from your device below." },
  { key: "extra_gallery_preview", label: "11. Gallery Preview", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"], hint: "Multiple images/videos can be uploaded from your device below." },
  { key: "extra_newsletter", label: "12. Newsletter CTA", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"], hint: "Multiple images/videos can be uploaded from your device below." },
  { key: "extra_faq", label: "13. FAQ (header)", type: "single", group: "Extra Sections", fields: ["title", "subtitle", "description"], hint: "Multiple images/videos can be uploaded from your device below." },


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

  // Settings
  { key: "account_settings", label: "⚙️ Account & Theme", type: "custom", group: "Settings", hint: "Change admin email, password and dashboard theme." },
];

