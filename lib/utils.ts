import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format price in MXN
export function formatPrice(cents: number): string {
  const amount = cents / 100
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
  }).format(amount)
}

// Format date
export function formatDate(date: Date | string, formatStr: string = 'PPP'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, formatStr, { locale: es })
}

// Calculate platform fee
export function calculatePlatformFee(basePrice: number, feePercent: number = 5): number {
  return Math.round((basePrice * feePercent) / 100)
}

// Calculate total with fee
export function calculateTotal(basePrice: number, feePercent: number = 5): number {
  return basePrice + calculatePlatformFee(basePrice, feePercent)
}

// Calculate refund amount
export function calculateRefund(amount: number, refundPercent: number): number {
  return Math.round((amount * refundPercent) / 100)
}

// Validate price range
export function isValidPrice(price: number, min: number = 400, max: number = 900): boolean {
  return price >= min && price <= max
}

// Generate random booking code
export function generateBookingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Get time slots for a date
export function getTimeSlots(startHour: number = 0, endHour: number = 24): string[] {
  const slots: string[] = []
  for (let hour = startHour; hour < endHour; hour++) {
    const formattedHour = hour.toString().padStart(2, '0')
    slots.push(`${formattedHour}:00`)
  }
  return slots
}

// Duration options in hours
export function getDurationOptions(maxHours: number = 8): Array<{ value: number; label: string }> {
  const options: Array<{ value: number; label: string }> = []
  for (let i = 1; i <= maxHours; i++) {
    options.push({
      value: i,
      label: `${i} ${i === 1 ? 'hora' : 'horas'}`,
    })
  }
  return options
}
