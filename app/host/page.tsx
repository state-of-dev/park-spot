import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/navbar'
import { DollarSign, Calendar, MapPin, Plus, TrendingUp } from 'lucide-react'

const STATS = [
  { label: 'Ingresos del mes', value: '$12,450', icon: DollarSign, trend: '+15%' },
  { label: 'Reservas totales', value: '24', icon: Calendar, trend: '+8%' },
  { label: 'Spots activos', value: '3', icon: MapPin, trend: '0%' },
  { label: 'Tasa ocupación', value: '78%', icon: TrendingUp, trend: '+12%' },
]

const RECENT_BOOKINGS = [
  { id: '1', spot: 'Cajón Techado', date: '15 Ene 2025', time: '18:00 - 23:00', amount: 3000 },
  { id: '2', spot: 'Espacio Amplio', date: '20 Ene 2025', time: '19:00 - 22:00', amount: 1800 },
  { id: '3', spot: 'Cajón Techado', date: '25 Ene 2025', time: '17:00 - 23:00', amount: 3600 },
]

export default function HostDashboardPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
            <p className="mt-2 text-zinc-400">Gestiona tus espacios y reservas</p>
          </div>
          <Button asChild>
            <Link href="/host/spots/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Spot
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <Card key={stat.label} className="border-zinc-800 bg-zinc-950">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <stat.icon className="h-8 w-8 text-primary" />
                  <span className="text-sm text-green-500">{stat.trend}</span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-semibold text-white">{stat.value}</div>
                  <div className="mt-1 text-sm text-zinc-400">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="pt-6">
              <MapPin className="mb-3 h-8 w-8 text-primary" />
              <h3 className="font-semibold text-white">Mis Spots</h3>
              <p className="mt-1 text-sm text-zinc-400">Ver y gestionar tus espacios</p>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link href="/host/spots">Ver Spots</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="pt-6">
              <Calendar className="mb-3 h-8 w-8 text-primary" />
              <h3 className="font-semibold text-white">Reservas</h3>
              <p className="mt-1 text-sm text-zinc-400">Revisa tus reservas activas</p>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link href="/host/bookings">Ver Reservas</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="pt-6">
              <DollarSign className="mb-3 h-8 w-8 text-primary" />
              <h3 className="font-semibold text-white">Ingresos</h3>
              <p className="mt-1 text-sm text-zinc-400">Detalles de tus ganancias</p>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link href="/host/earnings">Ver Ingresos</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader>
            <CardTitle>Próximas Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_BOOKINGS.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 p-4"
                >
                  <div>
                    <div className="font-medium text-white">{booking.spot}</div>
                    <div className="mt-1 text-sm text-zinc-400">
                      {booking.date} • {booking.time}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">${booking.amount}</div>
                    <Button variant="ghost" size="sm" className="mt-1" asChild>
                      <Link href={`/host/bookings/${booking.id}`}>Ver detalles</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
