-- ============================================
-- PARKSPOT DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('driver', 'host')),
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,

  -- Driver specific fields
  vehicle_size TEXT,
  license_plate TEXT,

  -- Host specific fields
  paypal_merchant_id TEXT,
  paypal_onboarding_complete BOOLEAN DEFAULT FALSE,
  rfc TEXT,
  billing_email TEXT,

  -- Preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- SUBSCRIPTIONS TABLE (for hosts)
-- ============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('starter', 'pro', 'business')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  paypal_subscription_id TEXT UNIQUE,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(host_id)
);

-- RLS Policies for subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Hosts can view their own subscription
CREATE POLICY "Hosts can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = host_id);

-- ============================================
-- SPOTS TABLE
-- ============================================
CREATE TABLE spots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  address_exact TEXT NOT NULL,
  lat_exact DECIMAL(10, 8) NOT NULL,
  lng_exact DECIMAL(11, 8) NOT NULL,
  lat_fuzzy DECIMAL(10, 8) NOT NULL,
  lng_fuzzy DECIMAL(11, 8) NOT NULL,
  price_per_hour INTEGER NOT NULL CHECK (price_per_hour >= 40000 AND price_per_hour <= 90000),
  photos TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  availability_schedule JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for spots
CREATE INDEX idx_spots_host_id ON spots(host_id);
CREATE INDEX idx_spots_is_active ON spots(is_active);
CREATE INDEX idx_spots_lat_lng ON spots(lat_fuzzy, lng_fuzzy);

-- RLS Policies for spots
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;

-- Everyone can view active spots (with fuzzy location)
CREATE POLICY "Anyone can view active spots"
  ON spots FOR SELECT
  USING (is_active = TRUE);

-- Hosts can view their own spots (including inactive)
CREATE POLICY "Hosts can view own spots"
  ON spots FOR SELECT
  USING (auth.uid() = host_id);

-- Hosts can insert their own spots
CREATE POLICY "Hosts can insert own spots"
  ON spots FOR INSERT
  WITH CHECK (auth.uid() = host_id);

-- Hosts can update their own spots
CREATE POLICY "Hosts can update own spots"
  ON spots FOR UPDATE
  USING (auth.uid() = host_id);

-- Hosts can delete their own spots
CREATE POLICY "Hosts can delete own spots"
  ON spots FOR DELETE
  USING (auth.uid() = host_id);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_code TEXT UNIQUE NOT NULL,
  spot_id UUID NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_hours INTEGER NOT NULL CHECK (duration_hours >= 1 AND duration_hours <= 8),

  price_base_cents INTEGER NOT NULL,
  platform_fee_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,

  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show', 'reschedule_pending', 'reschedule_rejected')),

  -- Reagendamiento
  reschedule_count INTEGER DEFAULT 0 CHECK (reschedule_count <= 1),
  proposed_start_time TIMESTAMPTZ,
  proposed_end_time TIMESTAMPTZ,
  reschedule_reason TEXT,

  -- Snapshot of spot data at time of booking
  spot_snapshot JSONB NOT NULL DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for bookings
CREATE INDEX idx_bookings_spot_id ON bookings(spot_id);
CREATE INDEX idx_bookings_driver_id ON bookings(driver_id);
CREATE INDEX idx_bookings_host_id ON bookings(host_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);

-- RLS Policies for bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drivers can view their own bookings
CREATE POLICY "Drivers can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = driver_id);

-- Hosts can view bookings for their spots
CREATE POLICY "Hosts can view bookings for their spots"
  ON bookings FOR SELECT
  USING (auth.uid() = host_id);

-- Drivers can create bookings
CREATE POLICY "Drivers can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = driver_id);

-- Drivers can update their own bookings (for cancellation)
CREATE POLICY "Drivers can update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = driver_id);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  paypal_order_id TEXT UNIQUE,
  paypal_capture_id TEXT,
  amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for payments
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_paypal_order_id ON payments(paypal_order_id);

-- RLS Policies for payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can view payments for their own bookings
CREATE POLICY "Users can view payments for their bookings"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = payments.booking_id
      AND (bookings.driver_id = auth.uid() OR bookings.host_id = auth.uid())
    )
  );

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spots_updated_at BEFORE UPDATE ON spots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate booking code
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate booking_code
CREATE OR REPLACE FUNCTION set_booking_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_code IS NULL OR NEW.booking_code = '' THEN
    NEW.booking_code := generate_booking_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_bookings_code BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_booking_code();
