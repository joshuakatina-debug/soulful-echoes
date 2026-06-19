-- Lock down the private 'soul-sounds' storage bucket to service-role only.
-- The bucket is only ever read/written by edge functions using the service
-- role key (which bypasses RLS); the browser receives short-lived signed
-- URLs minted server-side. Deny all anon/authenticated direct access.

CREATE POLICY "soul_sounds_no_anon_select"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id <> 'soul-sounds');

CREATE POLICY "soul_sounds_no_anon_insert"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id <> 'soul-sounds');

CREATE POLICY "soul_sounds_no_anon_update"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id <> 'soul-sounds')
  WITH CHECK (bucket_id <> 'soul-sounds');

CREATE POLICY "soul_sounds_no_anon_delete"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id <> 'soul-sounds');