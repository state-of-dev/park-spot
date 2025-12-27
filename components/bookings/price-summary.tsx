import { Separator } from '@/components/ui/separator'
import { calculatePlatformFee, calculateTotal } from '@/lib/utils'

interface PriceSummaryProps {
  pricePerHour: number
  duration: number
  feePercent?: number
}

export function PriceSummary({
  pricePerHour,
  duration,
  feePercent = 5,
}: PriceSummaryProps) {
  const basePrice = pricePerHour * duration
  const platformFee = calculatePlatformFee(basePrice, feePercent)
  const total = calculateTotal(basePrice, feePercent)

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-zinc-400">
        <span>
          ${pricePerHour.toLocaleString()} × {duration}{' '}
          {duration === 1 ? 'hora' : 'horas'}
        </span>
        <span>${basePrice.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-zinc-400">
        <span>Comisión de servicio ({feePercent}%)</span>
        <span>${platformFee.toLocaleString()}</span>
      </div>
      <Separator className="my-2 bg-zinc-800" />
      <div className="flex justify-between text-lg font-semibold text-white">
        <span>Total</span>
        <span>${total.toLocaleString()}</span>
      </div>
    </div>
  )
}
