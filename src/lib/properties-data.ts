export type Status = "ongoing" | "handover" | "upcoming" | "featured";

export type Facility = { label: string; icon: string };

export type BookingDetails = {
  apartmentImage: string;
  perSft: string;
  totalSize: string;
  totalPrice: string;
  advance: string;
  paymentDeadline: string;
  schedule: { milestone: string; due: string; amount: string }[];
};

export type PropertyNews = {
  id: number;
  title: string;
  date: string;
  tag: string;
  image: string;
  excerpt: string;
  content: string;
  booking?: BookingDetails;
};

export type Property = {
  id: number;
  title: string;
  location: string;
  size: string;
  beds: number;
  parking: string;
  price: string;
  status: Status;
  image: string;
  gallery: string[];
  description: string;
  facilities: Facility[];
  videoUrl: string;
  news: PropertyNews[];
};

const defaultExcerpt =
  "Latest update from our project team — read the full story for details, timeline and what comes next.";
const defaultContent =
  "Our team has shared this update as part of our commitment to keep buyers and well-wishers informed at every step of the project.\n\nThe project continues to progress on schedule with strict quality controls, on-site supervision and regular third-party inspections. We are working closely with our architects, engineers and contractors to ensure each milestone is delivered with the craftsmanship that Starline Builders is known for.\n\nFor any questions, site visit requests or booking enquiries, please reach out to our sales team. We will be happy to walk you through the project, share progress photos, and discuss available units and payment plans.";

export const PROPERTIES: Property[] = [
  {
    id: 1,
    title: "Starline Heights",
    location: "Gulshan-2, Dhaka",
    size: "1,285 sqft",
    beds: 3,
    parking: "1 Car",
    price: "৳ 1.85 Cr",
    status: "ongoing",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
    ],
    description:
      "A premium residential tower in the heart of Gulshan-2 with thoughtfully designed 3-bedroom apartments, modern interiors, and skyline views.",
    facilities: [
      { label: "24/7 Electricity", icon: "Zap" },
      { label: "High-speed Lift", icon: "ArrowUpDown" },
      { label: "Generator Backup", icon: "BatteryCharging" },
      { label: "Rooftop Garden", icon: "TreePine" },
      { label: "Gymnasium", icon: "Dumbbell" },
      { label: "CCTV Security", icon: "ShieldCheck" },
      { label: "Community Hall", icon: "Users" },
      { label: "Kids Play Area", icon: "Baby" },
      { label: "Visitor Parking", icon: "Car" },
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    news: [
      {
        id: 1,
        title: "Booking now open for limited apartments",
        date: "Apr 12, 2026",
        tag: "Booking",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80",
        excerpt:
          "Only a handful of premium units remain at Starline Heights — early-bird pricing and flexible payment plans available now.",
        content:
          "We are pleased to announce that booking is officially open for the remaining apartments at Starline Heights, Gulshan-2.\n\nThis phase includes a limited number of corner units with extended balconies and unobstructed skyline views. Early-bird customers will enjoy preferred floor selection, complimentary interior consultation, and a flexible 24-month payment plan.\n\nOur sales team is conducting site visits daily between 10:00 AM and 6:00 PM. Please contact us to schedule a private tour of the show apartment and discuss financing options with our partner banks.",
      },
      {
        id: 2,
        title: "Construction reached 8th floor slab",
        date: "Mar 03, 2026",
        tag: "Progress",
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80",
        excerpt:
          "Structural work is progressing on schedule — 8th floor slab successfully cast this week.",
        content:
          "Construction at Starline Heights has reached a significant milestone with the successful casting of the 8th floor slab this week, keeping the project firmly on its delivery schedule.\n\nAll structural work has been independently verified by our consulting engineers, with concrete strength tests exceeding the required specifications. MEP rough-in is already underway on the completed floors below.\n\nWith the current pace, we anticipate completing the structural framework by Q3 2026, followed by finishing works and handover as per the buyer agreement.",
      },
    ],
  },
  {
    id: 2,
    title: "Royal Skyline Residence",
    location: "Banani, Dhaka",
    size: "1,800 sqft",
    beds: 4,
    parking: "2 Cars",
    price: "৳ 2.60 Cr",
    status: "featured",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    ],
    description:
      "Signature luxury residence in Banani offering panoramic city views, expansive layouts and a curated suite of premium amenities.",
    facilities: [
      { label: "24/7 Electricity", icon: "Zap" },
      { label: "Two Lifts", icon: "ArrowUpDown" },
      { label: "Swimming Pool", icon: "Waves" },
      { label: "Sky Lounge", icon: "Sofa" },
      { label: "Gymnasium", icon: "Dumbbell" },
      { label: "CCTV Security", icon: "ShieldCheck" },
      { label: "Concierge", icon: "Bell" },
      { label: "EV Charging", icon: "Plug" },
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    news: [
      {
        id: 1,
        title: "Featured in Bangladesh Property Expo 2026",
        date: "Feb 18, 2026",
        tag: "Event",
        image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=900&q=80",
        excerpt:
          "Royal Skyline Residence was showcased at the Bangladesh Property Expo 2026 with overwhelming visitor response.",
        content:
          "Royal Skyline Residence was proudly featured at the Bangladesh Property Expo 2026 held at ICCB, Dhaka. Our pavilion welcomed thousands of visitors over the three-day event.\n\nVisitors experienced a full-scale 3D walkthrough of the residence, explored the curated amenities, and consulted directly with our architects and sales advisors. Several units were booked on-site with the special expo offer.\n\nWe thank everyone who visited our pavilion and look forward to welcoming you to the project site for a more detailed tour.",
      },
    ],
  },
  {
    id: 3,
    title: "Bashundhara Bliss",
    location: "Bashundhara R/A",
    size: "1,300 sqft",
    beds: 3,
    parking: "1 Car",
    price: "৳ 1.55 Cr",
    status: "ongoing",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    ],
    description:
      "Modern family apartments in Bashundhara R/A with smart layouts, quality finishes and excellent connectivity.",
    facilities: [
      { label: "24/7 Electricity", icon: "Zap" },
      { label: "Lift", icon: "ArrowUpDown" },
      { label: "Generator Backup", icon: "BatteryCharging" },
      { label: "CCTV Security", icon: "ShieldCheck" },
      { label: "Kids Play Area", icon: "Baby" },
      { label: "Car Parking", icon: "Car" },
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    news: [],
  },
  {
    id: 4,
    title: "Dhanmondi Pearl",
    location: "Dhanmondi, Dhaka",
    size: "1,000 sqft",
    beds: 2,
    parking: "1 Car",
    price: "৳ 1.10 Cr",
    status: "handover",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    ],
    description:
      "Ready-to-move-in 2-bedroom apartments in the cultural heart of Dhanmondi, blending comfort with urban convenience.",
    facilities: [
      { label: "24/7 Electricity", icon: "Zap" },
      { label: "Lift", icon: "ArrowUpDown" },
      { label: "CCTV Security", icon: "ShieldCheck" },
      { label: "Car Parking", icon: "Car" },
      { label: "Rooftop", icon: "TreePine" },
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    news: [
      {
        id: 1,
        title: "Handover ceremony scheduled for May 2026",
        date: "Apr 02, 2026",
        tag: "Handover",
        image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=900&q=80",
        excerpt:
          "The official handover ceremony for Dhanmondi Pearl is scheduled — owners will receive keys and documents on the day.",
        content:
          "We are delighted to confirm that the official handover ceremony for Dhanmondi Pearl is scheduled for May 2026. All registered owners have been notified individually with the venue and time.\n\nOn the day of handover, owners will receive their apartment keys, full set of original documents, warranty packages, and a complimentary welcome kit. Our facility management team will also be present to walk new residents through building services and emergency contacts.\n\nWe look forward to celebrating this milestone with all our valued homeowners.",
      },
    ],
  },
  {
    id: 5,
    title: "Purbachal Crown",
    location: "Purbachal New Town",
    size: "2,200 sqft",
    beds: 4,
    parking: "2 Cars",
    price: "৳ 3.20 Cr",
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    ],
    description:
      "An upcoming flagship project in Purbachal New Town offering duplex-style luxury living with grand open spaces.",
    facilities: [
      { label: "24/7 Electricity", icon: "Zap" },
      { label: "Two Lifts", icon: "ArrowUpDown" },
      { label: "Swimming Pool", icon: "Waves" },
      { label: "Sky Garden", icon: "TreePine" },
      { label: "Gymnasium", icon: "Dumbbell" },
      { label: "CCTV Security", icon: "ShieldCheck" },
      { label: "EV Charging", icon: "Plug" },
      { label: "Community Hall", icon: "Users" },
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    news: [
      {
        id: 1,
        title: "Pre-launch registration opens June 2026",
        date: "Apr 20, 2026",
        tag: "Pre-launch",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80",
        excerpt:
          "Pre-launch registration for Purbachal Crown opens soon — register interest for priority allocation and launch-day pricing.",
        content:
          "Pre-launch registration for our flagship Purbachal Crown project opens in June 2026. Registered customers will be invited to the exclusive launch event and offered priority unit allocation along with launch-day pricing.\n\nThe project features duplex-style residences with private gardens, double-height living rooms and a curated set of resort-style amenities including a swimming pool, sky garden and EV charging stations.\n\nTo register your interest, please contact our sales team or fill out the enquiry form on our website. A dedicated relationship manager will reach out to walk you through the master plan and unit options.",
      },
    ],
  },
  {
    id: 6,
    title: "Uttara Vista",
    location: "Uttara Sector 4",
    size: "1,450 sqft",
    beds: 3,
    parking: "1 Car",
    price: "৳ 1.70 Cr",
    status: "featured",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
    ],
    description:
      "Contemporary apartments in Uttara Sector 4 with a focus on natural light, ventilation and family-friendly amenities.",
    facilities: [
      { label: "24/7 Electricity", icon: "Zap" },
      { label: "Lift", icon: "ArrowUpDown" },
      { label: "Generator Backup", icon: "BatteryCharging" },
      { label: "Rooftop Garden", icon: "TreePine" },
      { label: "CCTV Security", icon: "ShieldCheck" },
      { label: "Kids Play Area", icon: "Baby" },
      { label: "Car Parking", icon: "Car" },
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    news: [],
  },
];

// Ensure every news item has excerpt + content (fallback to defaults)
for (const p of PROPERTIES) {
  for (const n of p.news) {
    if (!n.excerpt) n.excerpt = defaultExcerpt;
    if (!n.content) n.content = defaultContent;
  }
}

export function getPropertyById(id: number): Property | undefined {
  return PROPERTIES.find((p) => p.id === id);
}

export function getNewsItem(propertyId: number, newsId: number) {
  const property = getPropertyById(propertyId);
  if (!property) return undefined;
  const item = property.news.find((n) => n.id === newsId);
  if (!item) return undefined;
  return { property, item };
}

export type AggregatedNews = PropertyNews & {
  propertyId: number;
  propertyTitle: string;
};

export function getAllNews(): AggregatedNews[] {
  const all: AggregatedNews[] = [];
  for (const p of PROPERTIES) {
    for (const n of p.news) {
      all.push({ ...n, propertyId: p.id, propertyTitle: p.title });
    }
  }
  return all;
}
