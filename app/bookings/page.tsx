import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import { MapPin, Calendar, Clock } from 'lucide-react'

const BOOKINGS = [
  {
    id: '1',
    spot: 'Cajón Techado - Foro Sol',
    zone: 'A 300m del Foro Sol',
    date: '15 Ene 2025',
    time: '18:00 - 23:00',
    duration: '5 horas',
    total: 3000,
    status: 'confirmed',
  },
  {
    id: '2',
    spot: 'Espacio Amplio - Arena CDMX',
    zone: 'A 200m de Arena CDMX',
    date: '20 Ene 2025',
    time: '19:00 - 22:00',
    duration: '3 horas',
    total: 2250,
    status: 'upcoming',
  },
  {
    id: '3',
    spot: 'Cochera Segura - Azteca',
    zone: 'A 500m del Estadio Azteca',
    date: '10 Ene 2025',
    time: '17:00 - 21:00',
    duration: '4 horas',
    total: 2000,
    status: 'completed',
  },
]

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  confirmed: { label: 'Confirmada', variant: 'default' },
  upcoming: { label: 'Próxima', variant: 'secondary' },
  completed: { label: 'Completada', variant: 'outline' },
}

export default function BookingsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">Mis Reservas</h1>
          <p className="mt-2 text-zinc-400">Revisa y gestiona tus reservas</p>
        </div>

        <div className="space-y-4">
          {BOOKINGS.map((booking) => (
            <Card key={booking.id} className="border-zinc-800 bg-zinc-950">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="font-semibold text-white">{booking.spot}</h3>
                      <Badge variant={STATUS_CONFIG[booking.status].variant}>
                        {STATUS_CONFIG[booking.status].label}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-zinc-400">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        {booking.zone}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {booking.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {booking.time} ({booking.duration})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:flex-col md:items-end">
                    <div className="text-right">
                      <div className="text-sm text-zinc-400">Total</div>
                      <div className="text-2xl font-semibold text-white">
                        ${booking.total}
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/bookings/${booking.id}`}>Ver Detalles</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
