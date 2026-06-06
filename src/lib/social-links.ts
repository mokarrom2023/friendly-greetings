import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SocialLinks = {
  whatsapp?: string;
  messenger?: string;
  telegram?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  
};

export const SOCIAL_DEFAULTS: SocialLinks = {
  whatsapp: "https://wa.me/8801334563765",
  messenger: "https://m.me/starlinebuilders",
  telegram: "https://t.me/starlinebuilders",
  facebook: "",
  instagram: "",
  linkedin: "",
  twitter: "",
  youtube: "",
  tiktok: "",
};

export function useSocialLinks() {
  return useQuery({
    queryKey: ["social-links"],
    queryFn: async (): Promise<SocialLinks> => {
      const { data } = await supabase
        .from("site_sections")
        .select("extra")
        .eq("section_key", "social_links")
        .maybeSingle();
      return { ...SOCIAL_DEFAULTS, ...((data?.extra ?? {}) as SocialLinks) };
    },
    staleTime: 60_000,
  });
}
