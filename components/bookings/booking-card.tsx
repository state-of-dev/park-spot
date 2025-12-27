import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Clock } from 'lucide-react'

interface BookingCardProps {
  id: string
  spot: string
  zone: string
  date: string
  time: string
  duration: string
  total: number
  status: 'confirmed' | 'upcoming' | 'completed' | 'cancelled'
}

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmada', variant: 'default' as const },
  upcoming: { label: 'Próxima', variant: 'secondary' as const },
  completed: { label: 'Completada', variant: 'outline' as const },
  cancelled: { label: 'Cancelada', variant: 'destructive' as const },
}

export function BookingCard({
  id,
  spot,
  zone,
  date,
  time,
  duration,
  total,
  status,
}: BookingCardProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-950">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="font-semibold text-white">{spot}</h3>
              <Badge variant={STATUS_CONFIG[status].variant}>
                {STATUS_CONFIG[status].label}
              </Badge>
            </div>

            <div className="space-y-1 text-sm text-zinc-400">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                {zone}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {date}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {time} ({duration})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 md:flex-col md:items-end">
            <div className="text-right">
              <div className="text-sm text-zinc-400">Total</div>
              <div className="text-2xl font-semibold text-white">${total}</div>
            </div>
            <Button asChild>
              <Link href={`/bookings/${id}`}>Ver Detalles</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
