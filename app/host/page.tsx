import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import { DollarSign, Calendar, MapPin, Plus, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function HostDashboardPage() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Verify user is a host
  if (!profile || profile.role !== 'host') {
    redirect('/search')
  }

  // Get host's spots
  const { data: spots } = await supabase
    .from('spots')
    .select('*')
    .eq('host_id', user.id)

  const activeSpots = spots?.filter(s => s.is_active) || []

  // Get host's bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      spot:spots(title),
      driver:profiles!bookings_driver_id_fkey(full_name)
    `)
    .eq('host_id', user.id)
    .order('start_time', { ascending: true })

  const upcomingBookings = bookings?.filter(b =>
    new Date(b.start_time) > new Date() &&
    b.status !== 'cancelled'
  ).slice(0, 5) || []

  const pendingBookings = bookings?.filter(b => b.status === 'pending') || []

  // Calculate stats
  const totalBookings = bookings?.length || 0
  const completedBookings = bookings?.filter(b => b.status === 'completed') || []
  const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.price_base_cents || 0), 0)

  // Current month stats
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisMonthBookings = bookings?.filter(b =>
    new Date(b.start_time) >= firstDayOfMonth && b.status === 'completed'
  ) || []
  const thisMonthRevenue = thisMonthBookings.reduce((sum, b) => sum + (b.price_base_cents || 0), 0)
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
          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <DollarSign className="h-8 w-8 text-green-500" />
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="mt-4">
                <div className="text-2xl font-semibold text-white">
                  ${(totalRevenue / 100).toFixed(2)}
                </div>
                <div className="mt-1 text-sm text-zinc-400">Ingresos totales</div>
                <div className="mt-2 text-xs text-zinc-500">
                  Este mes: ${(thisMonthRevenue / 100).toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <AlertCircle className="h-8 w-8 text-yellow-500" />
                {pendingBookings.length > 0 && (
                  <Badge className="bg-yellow-500/10 text-yellow-500">
                    {pendingBookings.length}
                  </Badge>
                )}
              </div>
              <div className="mt-4">
                <div className="text-2xl font-semibold text-white">{pendingBookings.length}</div>
                <div className="mt-1 text-sm text-zinc-400">Pendientes de aprobar</div>
                {pendingBookings.length > 0 && (
                  <Button asChild variant="link" className="mt-2 h-auto p-0 text-xs text-yellow-500">
                    <Link href="/host/bookings">Revisar ahora</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-4">
                <div className="text-2xl font-semibold text-white">{totalBookings}</div>
                <div className="mt-1 text-sm text-zinc-400">Reservas totales</div>
                <div className="mt-2 text-xs text-zinc-500">
                  Completadas: {completedBookings.length}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-4">
                <div className="text-2xl font-semibold text-white">{activeSpots.length}</div>
                <div className="mt-1 text-sm text-zinc-400">Spots activos</div>
                <div className="mt-2 text-xs text-zinc-500">
                  Total: {spots?.length || 0}
                </div>
              </div>
            </CardContent>
          </Card>
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
            {upcomingBookings.length === 0 ? (
              <div className="py-8 text-center text-zinc-400">
                <Calendar className="mx-auto mb-2 h-12 w-12 opacity-20" />
                <p>No hay reservas próximas</p>
                <p className="mt-1 text-sm">Las reservas aparecerán aquí cuando los drivers reserven tus spots</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking: any) => {
                  const startDate = new Date(booking.start_time)
                  const endDate = new Date(booking.end_time)

                  const statusConfig = {
                    pending: { icon: AlertCircle, color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', label: 'Pendiente' },
                    confirmed: { icon: CheckCircle2, color: 'bg-green-500/10 text-green-500 border-green-500/20', label: 'Confirmada' },
                  }

                  const status = statusConfig[booking.status as keyof typeof statusConfig] || {
                    icon: Clock,
                    color: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
                    label: booking.status
                  }
                  const StatusIcon = status.icon

                  return (
                    <Link
                      key={booking.id}
                      href="/host/bookings"
                      className="flex items-center justify-between rounded-lg border border-zinc-800 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-900/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white">{booking.spot?.title || 'Spot'}</h4>
                          <Badge className={`${status.color} border`}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {status.label}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {startDate.toLocaleDateString('es-MX')} • {startDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">
                          {booking.driver?.full_name || 'Driver'} • #{booking.booking_code}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">${(booking.price_base_cents / 100).toFixed(2)}</div>
                        <div className="mt-1 text-xs text-zinc-500">
                          {booking.duration_hours}h
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
