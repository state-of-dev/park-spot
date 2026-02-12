'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import { MapPin, Calendar, Clock, DollarSign, Check, X as XIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import type { BookingStatus } from '@/types'

interface BookingRow {
  id: string
  booking_code: string
  start_time: string
  end_time: string
  duration_hours: number
  total_cents: number
  status: BookingStatus
  proposed_start_time: string | null
  proposed_end_time: string | null
  spot: { title: string; address_exact: string }
  host: { full_name: string | null; phone: string | null }
}

type TabFilter = 'all' | 'upcoming' | 'in_progress' | 'completed'

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  confirmed: { label: 'Confirmada', variant: 'default' },
  completed: { label: 'Completada', variant: 'outline' },
  cancelled: { label: 'Cancelada', variant: 'destructive' },
  no_show: { label: 'No Show', variant: 'destructive' },
  reschedule_pending: { label: 'Reagendamiento propuesto', variant: 'secondary' },
  reschedule_rejected: { label: 'Reagendamiento rechazado', variant: 'destructive' },
}

export default function BookingsPage() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabFilter>('all')

  useEffect(() => {
    if (profile) fetchBookings()
  }, [profile])

  // Realtime subscription
  useEffect(() => {
    if (!profile) return

    const channel = supabase
      .channel('driver-bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings', filter: `driver_id=eq.${profile.id}` },
        () => { fetchBookings() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [profile])

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id, booking_code, start_time, end_time, duration_hours,
          total_cents, status, proposed_start_time, proposed_end_time,
          spot:spots!bookings_spot_id_fkey(title, address_exact),
          host:profiles!bookings_host_id_fkey(full_name, phone)
        `)
        .eq('driver_id', profile!.id)
        .order('start_time', { ascending: false })

      if (error) throw error
      setBookings((data as any) || [])
    } catch (error: any) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptReschedule = async (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId)
    if (!booking) return

    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          start_time: booking.proposed_start_time,
          end_time: booking.proposed_end_time,
          proposed_start_time: null,
          proposed_end_time: null,
        })
        .eq('id', bookingId)

      if (error) throw error
      toast.success('Reagendamiento aceptado')
      fetchBookings()
    } catch (error: any) {
      toast.error('Error al aceptar reagendamiento')
    }
  }

  const handleRejectReschedule = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

      if (error) throw error
      toast.success('Reserva cancelada')
      fetchBookings()
    } catch (error: any) {
      toast.error('Error al rechazar')
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

      if (error) throw error
      toast.success('Reserva cancelada')
      fetchBookings()
    } catch (error: any) {
      toast.error('Error al cancelar')
    }
  }

  const now = new Date()
  const filtered = bookings.filter((b) => {
    const start = new Date(b.start_time)
    const end = new Date(b.end_time)

    if (activeTab === 'upcoming') return ['pending', 'confirmed', 'reschedule_pending'].includes(b.status) && start > now
    if (activeTab === 'in_progress') return b.status === 'confirmed' && start <= now && end > now
    if (activeTab === 'completed') return ['completed', 'cancelled', 'no_show'].includes(b.status)
    return true
  }).sort((a, b) => {
    // When showing "all", sort by priority: cancelled/no_show last
    if (activeTab === 'all') {
      const aCancelled = ['cancelled', 'no_show'].includes(a.status)
      const bCancelled = ['cancelled', 'no_show'].includes(b.status)

      if (aCancelled && !bCancelled) return 1 // a goes after b
      if (!aCancelled && bCancelled) return -1 // a goes before b
    }

    // Otherwise maintain start_time order (already sorted from query)
    return 0
  })

  const formatDateTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-zinc-400">Cargando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">Mis Reservas</h1>
          <p className="mt-2 text-zinc-400">Revisa y gestiona tus reservas</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {([
            ['all', 'Todas'],
            ['upcoming', 'Próximamente'],
            ['in_progress', 'En Curso'],
            ['completed', 'Finalizadas'],
          ] as const).map(([key, label]) => (
            <Button
              key={key}
              variant={activeTab === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(key)}
            >
              {label}
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <Calendar className="mb-4 h-12 w-12 text-zinc-600" />
              <h3 className="mb-2 text-lg font-semibold text-white">
                No hay reservas en esta categoría
              </h3>
              <p className="text-sm text-zinc-400">
                Tus reservas aparecerán aquí cuando reserves un estacionamiento
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => {
              const statusConf = STATUS_LABELS[booking.status] || { label: booking.status, variant: 'outline' as const }

              return (
                <Card key={booking.id} className="border-zinc-800 bg-zinc-950">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      {/* Header */}
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-white">{booking.spot?.title}</h3>
                            <Badge variant={statusConf.variant as any}>{statusConf.label}</Badge>
                            <span className="text-xs text-zinc-500">#{booking.booking_code}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xl font-semibold text-white">
                          <DollarSign className="h-5 w-5 text-green-500" />
                          {(booking.total_cents / 100).toLocaleString()}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="space-y-1 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 shrink-0" />
                          {formatDateTime(booking.start_time)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 shrink-0" />
                          {booking.duration_hours} hora{booking.duration_hours !== 1 ? 's' : ''}
                        </div>
                        {/* Show address only for confirmed bookings */}
                        {booking.status === 'confirmed' && booking.spot?.address_exact && (
                          <div className="flex items-center gap-2 text-white">
                            <MapPin className="h-4 w-4 shrink-0 text-primary" />
                            {booking.spot.address_exact}
                          </div>
                        )}
                      </div>

                      {/* Reschedule proposal from host */}
                      {booking.status === 'reschedule_pending' && booking.proposed_start_time && (
                        <div className="space-y-3 rounded-lg border border-yellow-800 bg-yellow-950/30 p-4">
                          <p className="text-sm font-medium text-yellow-300">
                            El host propone una nueva fecha:
                          </p>
                          <p className="text-sm text-white">
                            {formatDateTime(booking.proposed_start_time)}
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleAcceptReschedule(booking.id)}>
                              <Check className="mr-1 h-3 w-3" /> Aceptar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectReschedule(booking.id)}
                            >
                              <XIcon className="mr-1 h-3 w-3" /> Rechazar y cancelar
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Cancel button for pending/confirmed */}
                      {['pending', 'confirmed'].includes(booking.status) && (
                        <div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            <XIcon className="mr-1 h-3 w-3" /> Cancelar reserva
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
