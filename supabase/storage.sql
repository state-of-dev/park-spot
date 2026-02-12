-- ============================================
-- SUPABASE STORAGE CONFIGURATION
-- ============================================

-- Create bucket for spot photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('spot-photos', 'spot-photos', true);

-- Storage policies for spot-photos bucket

-- Allow authenticated hosts to upload photos
CREATE POLICY "Authenticated hosts can upload spot photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'spot-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated hosts to update their own photos
CREATE POLICY "Hosts can update own spot photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'spot-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated hosts to delete their own photos
CREATE POLICY "Hosts can delete own spot photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'spot-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow everyone to view photos (bucket is public)
CREATE POLICY "Anyone can view spot photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'spot-photos');
