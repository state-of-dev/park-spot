// User & Profile Types
export type UserRole = 'driver' | 'host' | 'admin'

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  paypal_merchant_id: string | null
  paypal_payer_id: string | null
  paypal_onboarding_complete: boolean
  email_notifications: boolean
  sms_notifications: boolean
  whatsapp_notifications: boolean
  created_at: string
  updated_at: string
}

// Subscription Types
export type SubscriptionPlan = 'starter' | 'pro' | 'business'
export type SubscriptionStatus = 'trialing' | 'active' | 'cancelled' | 'past_due' | 'expired'

export interface Subscription {
  id: string
  host_id: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  max_slots: number | null
  max_addresses: number | null
  paypal_subscription_id: string | null
  paypal_plan_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

// Address Types
export interface Address {
  id: string
  host_id: string
  name: string
  address_exact: string
  lat_exact: number
  lng_exact: number
  lat_approx: number
  lng_approx: number
  zone_description: string
  venue_nearby: string
  access_instructions: string
  contact_phone: string
  entry_code: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Spot Types
export interface Spot {
  id: string
  address_id: string
  name: string
  description: string
  price_per_hour: number
  features: string[]
  photos: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

// Booking Types
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

export interface Booking {
  id: string
  spot_id: string
  driver_id: string
  host_id: string
  booking_code: string
  start_datetime: string
  end_datetime: string
  duration_hours: number
  price_base_cents: number
  price_fee_cents: number
  price_total_cents: number
  status: BookingStatus
  check_in_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  refund_amount_cents: number | null
  policy_snapshot: Record<string, any>
  spot_snapshot: Record<string, any>
  created_at: string
  updated_at: string
}

// Payment Types
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Payment {
  id: string
  booking_id: string
  paypal_order_id: string | null
  paypal_capture_id: string | null
  paypal_refund_id: string | null
  amount_cents: number
  platform_fee_cents: number
  host_amount_cents: number
  refund_cents: number
  status: PaymentStatus
  paypal_response: Record<string, any> | null
  created_at: string
  updated_at: string
}

// Notification Types
export type NotificationChannel = 'email' | 'sms' | 'whatsapp'
export type NotificationType =
  | 'booking_confirmed'
  | 'booking_reminder'
  | 'booking_cancelled'
  | 'host_new_booking'
  | 'payment_received'
  | 'subscription_active'

export interface NotificationLog {
  id: string
  user_id: string | null
  channel: NotificationChannel
  type: NotificationType
  recipient: string
  content: string | null
  provider: string
  provider_id: string | null
  status: string
  error: string | null
  created_at: string
}

// Venue Types
export interface Venue {
  id: string
  name: string
  capacity: number
  lat: number
  lng: number
}

// Slot Types
export interface TimeSlot {
  date: string
  time: string
  duration: number
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
