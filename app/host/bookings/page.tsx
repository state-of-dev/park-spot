import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import { Calendar, Clock, MapPin, User, DollarSign } from 'lucide-react'

const BOOKINGS = [
  {
    id: '1',
    spot: 'Cajón Techado',
    driver: 'Carlos González',
    date: '15 Ene 2025',
    time: '18:00 - 23:00',
    duration: '5 horas',
    amount: 3000,
    status: 'confirmed',
    checkIn: false,
  },
  {
    id: '2',
    spot: 'Espacio Amplio',
    driver: 'María López',
    date: '20 Ene 2025',
    time: '19:00 - 22:00',
    duration: '3 horas',
    amount: 2250,
    status: 'upcoming',
    checkIn: false,
  },
  {
    id: '3',
    spot: 'Cajón Techado',
    driver: 'Juan Pérez',
    date: '10 Ene 2025',
    time: '17:00 - 21:00',
    duration: '4 horas',
    amount: 2400,
    status: 'completed',
    checkIn: true,
  },
]

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  confirmed: { label: 'Confirmada', variant: 'default' },
  upcoming: { label: 'Próxima', variant: 'secondary' },
  completed: { label: 'Completada', variant: 'outline' },
}

export default function HostBookingsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">Reservas Recibidas</h1>
          <p className="mt-2 text-zinc-400">Gestiona las reservas de tus espacios</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button variant="default" size="sm">Todas</Button>
          <Button variant="outline" size="sm">Próximas</Button>
          <Button variant="outline" size="sm">Completadas</Button>
          <Button variant="outline" size="sm">Canceladas</Button>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {BOOKINGS.map((booking) => (
            <Card key={booking.id} className="border-zinc-800 bg-zinc-950">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{booking.spot}</h3>
                      <Badge variant={STATUS_CONFIG[booking.status].variant}>
                        {STATUS_CONFIG[booking.status].label}
                      </Badge>
                      {booking.checkIn && (
                        <Badge variant="outline" className="border-green-700 text-green-400">
                          Check-in ✓
                        </Badge>
                      )}
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <User className="h-4 w-4" />
                        {booking.driver}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Calendar className="h-4 w-4" />
                        {booking.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Clock className="h-4 w-4" />
                        {booking.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-white">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        ${booking.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/host/bookings/${booking.id}`}>Ver Detalles</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {BOOKINGS.length === 0 && (
          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <Calendar className="mb-4 h-12 w-12 text-zinc-600" />
              <h3 className="mb-2 text-lg font-semibold text-white">
                No tienes reservas todavía
              </h3>
              <p className="text-sm text-zinc-400">
                Las reservas aparecerán aquí cuando los conductores reserven tus espacios
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
