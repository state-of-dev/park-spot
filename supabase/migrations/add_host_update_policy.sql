-- Add policy for hosts to update bookings
CREATE POLICY "Hosts can update bookings for their spots"
  ON bookings FOR UPDATE
  USING (auth.uid() = host_id);
