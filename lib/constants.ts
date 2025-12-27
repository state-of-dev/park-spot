// Business Constants
export const PLATFORM_FEE_PERCENT = Number(process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENT) || 5
export const MIN_PRICE_PER_HOUR = Number(process.env.NEXT_PUBLIC_MIN_PRICE_PER_HOUR) || 400
export const MAX_PRICE_PER_HOUR = Number(process.env.NEXT_PUBLIC_MAX_PRICE_PER_HOUR) || 900
export const CANCEL_REFUND_PERCENT = Number(process.env.NEXT_PUBLIC_CANCEL_REFUND_PERCENT) || 40
export const CANCEL_WINDOW_HOURS = Number(process.env.NEXT_PUBLIC_CANCEL_WINDOW_HOURS) || 1
export const NOSHOW_GRACE_MINUTES = Number(process.env.NEXT_PUBLIC_NOSHOW_GRACE_MINUTES) || 30

// Venues
export const VENUES = [
  { id: 'foro-sol', name: 'Foro Sol', capacity: 65000, lat: 19.4090, lng: -99.0902 },
  { id: 'estadio-azteca', name: 'Estadio Azteca', capacity: 87000, lat: 19.3030, lng: -99.1506 },
  { id: 'arena-cdmx', name: 'Arena CDMX', capacity: 22000, lat: 19.4897, lng: -99.1389 },
  { id: 'palacio-deportes', name: 'Palacio de los Deportes', capacity: 22000, lat: 19.4086, lng: -99.1125 },
  { id: 'auditorio-nacional', name: 'Auditorio Nacional', capacity: 10000, lat: 19.4256, lng: -99.1919 },
  { id: 'autodromo', name: 'Autódromo Hermanos Rodríguez', capacity: 140000, lat: 19.4039, lng: -99.0911 },
  { id: 'estadio-olimpico', name: 'Estadio Olímpico UNAM', capacity: 72000, lat: 19.3324, lng: -99.1926 },
  { id: 'metropolitan', name: 'Teatro Metropolitan', capacity: 3000, lat: 19.4361, lng: -99.1522 },
] as const

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  STARTER: {
    id: 'starter',
    name: 'Starter',
    price: 699,
    features: {
      maxSlots: 1,
      maxAddresses: 1,
      analytics: false,
      priority: false,
      reports: false,
    },
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 1199,
    features: {
      maxSlots: null, // unlimited
      maxAddresses: 1,
      analytics: true,
      priority: true,
      reports: false,
    },
  },
  BUSINESS: {
    id: 'business',
    name: 'Business',
    price: 2299,
    features: {
      maxSlots: null, // unlimited
      maxAddresses: null, // unlimited
      analytics: true,
      priority: true,
      reports: true,
    },
  },
} as const

// Spot Features
export const SPOT_FEATURES = [
  'Techado',
  'Vigilancia 24/7',
  'Cámaras de seguridad',
  'Iluminado',
  'Portón eléctrico',
  'Cabe SUV',
  'Cabe camioneta',
  'Acceso pavimentado',
  'Cerca del venue',
] as const

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
} as const

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const

// User Roles
export const USER_ROLES = {
  DRIVER: 'driver',
  HOST: 'host',
  ADMIN: 'admin',
} as const
