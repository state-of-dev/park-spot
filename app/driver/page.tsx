import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Clock } from 'lucide-react'

export default async function DriverDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'driver') {
    redirect('/host')
  }

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      spot:spots(title, address_exact)
    `)
    .eq('driver_id', user.id)
    .order('start_time', { ascending: false })

  const upcomingBookings = bookings?.filter(b =>
    new Date(b.start_time) > new Date() &&
    b.status !== 'cancelled'
  ) || []

  const pastBookings = bookings?.filter(b =>
    new Date(b.end_time) < new Date() ||
    b.status === 'completed'
  ) || []

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">Mis Reservas</h1>
          <p className="mt-2 text-zinc-400">Gestiona tus estacionamientos reservados</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="pt-6">
              <MapPin className="mb-3 h-8 w-8 text-primary" />
              <div className="text-2xl font-semibold text-white">{upcomingBookings.length}</div>
              <div className="mt-1 text-sm text-zinc-400">Próximas reservas</div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="pt-6">
              <Calendar className="mb-3 h-8 w-8 text-primary" />
              <div className="text-2xl font-semibold text-white">{bookings?.length || 0}</div>
              <div className="mt-1 text-sm text-zinc-400">Total de reservas</div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="pt-6">
              <Clock className="mb-3 h-8 w-8 text-primary" />
              <div className="text-2xl font-semibold text-white">{pastBookings.length}</div>
              <div className="mt-1 text-sm text-zinc-400">Reservas pasadas</div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        <Card className="mb-8 border-zinc-800 bg-zinc-950">
          <CardHeader>
            <CardTitle>Próximas Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length === 0 ? (
              <div className="py-12 text-center">
                <MapPin className="mx-auto mb-4 h-16 w-16 text-zinc-700" />
                <h3 className="mb-2 text-lg font-medium text-white">
                  No tienes reservas próximas
                </h3>
                <p className="text-zinc-400">
                  Busca y reserva espacios de estacionamiento en la sección de búsqueda
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking: any) => {
                  const startDate = new Date(booking.start_time)
                  const endDate = new Date(booking.end_time)
                  return (
                    <div
                      key={booking.id}
                      className="flex items-start justify-between rounded-lg border border-zinc-800 p-4"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-white">
                          {booking.spot?.title || 'Spot'}
                        </div>
                        <div className="mt-1 text-sm text-zinc-400">
                          {booking.spot?.address_exact}
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm text-zinc-500">
                          <span>
                            📅 {startDate.toLocaleDateString('es-MX')}
                          </span>
                          <span>
                            🕐 {startDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span>
                            🎫 {booking.booking_code}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">
                          ${(booking.total_cents / 100).toFixed(2)}
                        </div>
                        <div className="mt-2">
                          <span className={`inline-block rounded px-2 py-1 text-xs ${
                            booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500' :
                            booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-zinc-500/10 text-zinc-500'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>Historial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pastBookings.slice(0, 5).map((booking: any) => {
                  const startDate = new Date(booking.start_time)
                  return (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between border-b border-zinc-800 pb-3 last:border-0"
                    >
                      <div>
                        <div className="text-sm font-medium text-white">
                          {booking.spot?.title || 'Spot'}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {startDate.toLocaleDateString('es-MX')}
                        </div>
                      </div>
                      <div className="text-sm text-zinc-400">
                        ${(booking.total_cents / 100).toFixed(2)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
