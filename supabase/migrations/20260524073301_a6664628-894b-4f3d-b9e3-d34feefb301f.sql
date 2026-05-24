
-- 1. site_sections: one row per editable section
CREATE TABLE public.site_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  title text,
  subtitle text,
  description text,
  image_url text,
  video_url text,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_sections public read"
ON public.site_sections FOR SELECT
USING (true);

CREATE POLICY "admins manage site_sections"
ON public.site_sections FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. section_items: list-style items belonging to a section
CREATE TABLE public.section_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL,
  title text,
  subtitle text,
  description text,
  image_url text,
  link_url text,
  sort_order int NOT NULL DEFAULT 0,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX section_items_section_key_idx ON public.section_items(section_key, sort_order);

ALTER TABLE public.section_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "section_items public read"
ON public.section_items FOR SELECT
USING (true);

CREATE POLICY "admins manage section_items"
ON public.section_items FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. updated_at trigger function (reuse)
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_site_sections_updated
BEFORE UPDATE ON public.site_sections
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TRIGGER trg_section_items_updated
BEFORE UPDATE ON public.section_items
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 4. Storage bucket for admin media uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-media', 'site-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read all files in site-media
CREATE POLICY "site-media public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-media');

-- Admins can upload
CREATE POLICY "site-media admin insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));

-- Admins can update
CREATE POLICY "site-media admin update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete
CREATE POLICY "site-media admin delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));
