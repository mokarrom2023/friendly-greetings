import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Allow the FIRST authenticated user to claim admin role (bootstrap).
// Once an admin exists, this becomes a no-op for other users.
export const claimAdminIfFirst = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (countErr) throw new Error(countErr.message);

    if ((count ?? 0) === 0) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      if (error) throw new Error(error.message);
      return { granted: true };
    }
    return { granted: false };
  });

export const checkIsAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { isAdmin: !!data };
  });

const memberSchema = z.object({
  id: z.string().uuid().optional(),
  department_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  title: z.string().min(1).max(200),
  image_url: z.string().url().nullable().optional(),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

export const saveTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => memberSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden: admin only");

    if (data.id) {
      const { error } = await supabaseAdmin
        .from("team_members")
        .update({
          department_id: data.department_id,
          name: data.name,
          title: data.title,
          image_url: data.image_url ?? null,
          sort_order: data.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: row, error } = await supabaseAdmin
      .from("team_members")
      .insert({
        department_id: data.department_id,
        name: data.name,
        title: data.title,
        image_url: data.image_url ?? null,
        sort_order: data.sort_order,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden: admin only");

    const { error } = await supabaseAdmin
      .from("team_members")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- Generic site_sections + section_items CRUD ---------- */

async function assertAdmin(userId: string) {
  const { data: roleRow } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!roleRow) throw new Error("Forbidden: admin only");
}

const sectionSchema = z.object({
  section_key: z.string().min(1).max(100),
  title: z.string().max(500).nullable().optional(),
  subtitle: z.string().max(500).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  image_url: z.string().url().max(2000).nullable().optional(),
  video_url: z.string().url().max(2000).nullable().optional(),
  extra: z.record(z.string(), z.unknown()).optional(),
});

export const saveSiteSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => sectionSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("site_sections")
      .upsert(
        {
          section_key: data.section_key,
          title: data.title ?? null,
          subtitle: data.subtitle ?? null,
          description: data.description ?? null,
          image_url: data.image_url ?? null,
          video_url: data.video_url ?? null,
          extra: data.extra ?? {},
        },
        { onConflict: "section_key" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const itemSchema = z.object({
  id: z.string().uuid().optional(),
  section_key: z.string().min(1).max(100),
  title: z.string().max(500).nullable().optional(),
  subtitle: z.string().max(500).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  image_url: z.string().url().max(2000).nullable().optional(),
  link_url: z.string().url().max(2000).nullable().optional(),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

export const saveSectionItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => itemSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const payload = {
      section_key: data.section_key,
      title: data.title ?? null,
      subtitle: data.subtitle ?? null,
      description: data.description ?? null,
      image_url: data.image_url ?? null,
      link_url: data.link_url ?? null,
      sort_order: data.sort_order,
    };
    if (data.id) {
      const { error } = await supabaseAdmin
        .from("section_items")
        .update(payload)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: row, error } = await supabaseAdmin
      .from("section_items")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteSectionItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("section_items")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
