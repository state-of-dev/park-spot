-- Enable Realtime for bookings table
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- Enable Realtime for spots table (for availability updates)
ALTER PUBLICATION supabase_realtime ADD TABLE spots;
