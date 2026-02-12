// User & Profile Types
export type UserRole = 'driver' | 'host'

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  phone: string | null
  avatar_url: string | null

  // Driver specific
  vehicle_size: string | null
  license_plate: string | null

  // Host specific
  paypal_merchant_id: string | null
  paypal_onboarding_complete: boolean
  rfc: string | null
  billing_email: string | null

  // Preferences
  email_notifications: boolean
  sms_notifications: boolean

  created_at: string
  updated_at: string
}

// Subscription Types
export type SubscriptionPlan = 'starter' | 'pro' | 'business'
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired'

export interface Subscription {
  id: string
  host_id: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  paypal_subscription_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

// Spot Types
export interface AvailabilitySchedule {
  type: 'weekly' | 'custom'
  // For weekly: { monday: { start: "09:00", end: "18:00" }, ... }
  // For custom: array of specific dates
  schedule: Record<string, any>
}

export interface Spot {
  id: string
  host_id: string
  title: string
  description: string
  address_exact: string
  lat_exact: number
  lng_exact: number
  lat_fuzzy: number
  lng_fuzzy: number
  price_per_hour: number // in cents
  photos: string[]
  tags: string[]
  availability_schedule: AvailabilitySchedule
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SpotWithHost extends Spot {
  host: Profile
}

// Booking Types
export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'reschedule_pending'
  | 'reschedule_rejected'

export interface Booking {
  id: string
  booking_code: string
  spot_id: string
  driver_id: string
  host_id: string
  start_time: string
  end_time: string
  duration_hours: number
  price_base_cents: number
  platform_fee_cents: number
  total_cents: number
  status: BookingStatus
  reschedule_count: number
  proposed_start_time: string | null
  proposed_end_time: string | null
  reschedule_reason: string | null
  spot_snapshot: Partial<Spot>
  created_at: string
  updated_at: string
}

export interface BookingWithRelations extends Booking {
  spot: Spot
  driver: Profile
  host: Profile
}

// Payment Types
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Payment {
  id: string
  booking_id: string
  paypal_order_id: string | null
  paypal_capture_id: string | null
  amount_cents: number
  status: PaymentStatus
  created_at: string
  updated_at: string
}

// Form Types
export interface SignupFormData {
  email: string
  password: string
  role: UserRole
  full_name: string
  phone: string
  // Driver specific
  vehicle_size?: string
  license_plate?: string
  // Host specific
  rfc?: string
  billing_email?: string
}

export interface SpotFormData {
  title: string
  description: string
  address_exact: string
  lat_exact: number
  lng_exact: number
  price_per_hour: number
  photos: File[]
  tags: string[]
  availability_schedule: AvailabilitySchedule
}

export interface BookingFormData {
  spot_id: string
  start_time: string
  duration_hours: number
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
