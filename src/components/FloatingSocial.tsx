import { MessageCircle } from "lucide-react";
import { useSocialLinks } from "@/lib/social-links";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path d="M19.11 17.21c-.27-.14-1.62-.8-1.87-.89-.25-.09-.43-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.36-1.62-1.52-1.89-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.47l-.53-.01c-.18 0-.48.07-.73.34s-.96.94-.96 2.29.99 2.65 1.13 2.83c.14.18 1.95 2.97 4.72 4.17.66.28 1.18.45 1.58.58.66.21 1.27.18 1.74.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.11-.25-.18-.52-.32zM16.02 5.33c-5.89 0-10.67 4.78-10.67 10.67 0 1.88.49 3.72 1.43 5.34L5.33 26.67l5.51-1.44a10.6 10.6 0 0 0 5.18 1.32h.01c5.89 0 10.67-4.78 10.67-10.67s-4.78-10.55-10.68-10.55z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.24 3.64 11.95c-.88-.25-.89-.86.2-1.3L19.42 4.6c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.4 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}

export function FloatingSocial() {
  const { data: links } = useSocialLinks();

  const items = [
    { name: "WhatsApp", href: links?.whatsapp, bg: "#25D366", Icon: WhatsAppIcon },
    {
      name: "Messenger",
      href: links?.messenger,
      bg: "linear-gradient(135deg,#0078FF 0%,#A033FF 50%,#FF0066 100%)",
      Icon: MessageCircle,
    },
    { name: "Telegram", href: links?.telegram, bg: "#229ED9", Icon: TelegramIcon },
  ].filter((i) => i.href && i.href.trim().length > 0);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-3 z-[90] flex flex-col gap-2 sm:right-4 sm:gap-2.5">
      {items.map(({ name, href, bg, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          className="group relative flex h-9 w-9 items-center justify-center rounded-full text-white shadow-[0_6px_18px_rgba(0,0,0,0.25)] ring-2 ring-white/70 transition-all hover:scale-110 hover:shadow-[0_10px_24px_rgba(0,0,0,0.35)] sm:h-10 sm:w-10"
          style={{ background: bg }}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </a>
      ))}
    </div>
  );
}
