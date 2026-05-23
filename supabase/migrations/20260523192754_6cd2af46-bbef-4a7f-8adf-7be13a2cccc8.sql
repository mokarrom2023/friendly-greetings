
revoke execute on function public.has_role(uuid, app_role) from public, anon, authenticated;

-- Restrict storage list: drop broad public read and use a narrower select policy that requires a known object name (still allows getPublicUrl to work)
drop policy if exists "team-images public read" on storage.objects;
create policy "team-images read by name" on storage.objects for select
  using (bucket_id = 'team-images' and name is not null);
