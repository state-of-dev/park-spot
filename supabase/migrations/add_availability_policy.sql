-- Allow anyone to view bookings for checking availability
-- This is needed so drivers can see which time slots are already booked
CREATE POLICY "Anyone can view bookings for availability"
  ON bookings FOR SELECT
  USING (true);
