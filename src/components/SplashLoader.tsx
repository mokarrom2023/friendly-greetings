import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

export function SplashLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1800);
    const hideTimer = setTimeout(() => setVisible(false), 2400);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-5 px-6">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="Starline Builders"
            className="h-12 w-12 rounded-md object-contain"
          />
          <h1
            className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-[0.2em]"
            style={{ color: "#d4b35a", fontFamily: "'Cormorant Garamond', serif" }}
          >
            STARLINE BUILDERS LTD.
          </h1>
        </div>

        <div className="relative h-[2px] w-64 overflow-hidden bg-[#d4b35a]/20">
          <div className="splash-bar absolute inset-y-0 left-0 w-1/3 bg-[#d4b35a]" />
        </div>

        <p
          className="text-xs tracking-[0.4em] text-sky-400/80"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          LOADING EXCELLENCE...
        </p>
      </div>

      <style>{`
        @keyframes splashSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .splash-bar {
          animation: splashSlide 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
