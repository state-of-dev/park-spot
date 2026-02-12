'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Navbar } from '@/components/layout/navbar'
import { Calendar, Clock, User, DollarSign, Check, RefreshCw, X as XIcon } from 'lucide-react'
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
  price_base_cents: number
  total_cents: number
  status: BookingStatus
  reschedule_count: number
  proposed_start_time: string | null
  proposed_end_time: string | null
  driver: { full_name: string | null; phone: string | null; license_plate: string | null }
  spot: { title: string }
}

type TabFilter = 'all' | 'upcoming' | 'in_progress' | 'completed'

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  confirmed: { label: 'Confirmada', variant: 'default' },
  completed: { label: 'Completada', variant: 'outline' },
  cancelled: { label: 'Cancelada', variant: 'destructive' },
  no_show: { label: 'No Show', variant: 'destructive' },
  reschedule_pending: { label: 'Reagendamiento pendiente', variant: 'secondary' },
  reschedule_rejected: { label: 'Reagendamiento rechazado', variant: 'destructive' },
}

export default function HostBookingsPage() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabFilter>('all')
  const [rescheduleId, setRescheduleId] = useState<string | null>(null)
  const [proposedDate, setProposedDate] = useState('')
  const [proposedTime, setProposedTime] = useState('')

  useEffect(() => {
    if (profile) fetchBookings()
  }, [profile])

  // Realtime subscription
  useEffect(() => {
    if (!profile) return

    const channel = supabase
      .channel('host-bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings', filter: `host_id=eq.${profile.id}` },
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
          price_base_cents, total_cents, status, reschedule_count,
          proposed_start_time, proposed_end_time,
          driver:profiles!bookings_driver_id_fkey(full_name, phone, license_plate),
          spot:spots!bookings_spot_id_fkey(title)
        `)
        .eq('host_id', profile!.id)
        .order('start_time', { ascending: false })

      if (error) throw error
      setBookings((data as any) || [])
    } catch (error: any) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId)

      if (error) throw error
      toast.success('Reserva aceptada')
      fetchBookings()
    } catch (error: any) {
      toast.error('Error al aceptar la reserva')
    }
  }

  const handleCancel = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

      if (error) throw error
      toast.success('Reserva cancelada')
      fetchBookings()
    } catch (error: any) {
      toast.error('Error al cancelar la reserva')
    }
  }

  const handleReschedule = async (bookingId: string) => {
    if (!proposedDate || !proposedTime) {
      toast.error('Selecciona fecha y hora')
      return
    }

    const booking = bookings.find((b) => b.id === bookingId)
    if (!booking) return

    const proposedStart = new Date(`${proposedDate}T${proposedTime}`)
    const proposedEnd = new Date(proposedStart.getTime() + booking.duration_hours * 60 * 60 * 1000)

    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'reschedule_pending',
          proposed_start_time: proposedStart.toISOString(),
          proposed_end_time: proposedEnd.toISOString(),
          reschedule_count: 1,
        })
        .eq('id', bookingId)

      if (error) throw error
      toast.success('Propuesta de reagendamiento enviada')
      setRescheduleId(null)
      setProposedDate('')
      setProposedTime('')
      fetchBookings()
    } catch (error: any) {
      toast.error('Error al reagendar')
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

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">Reservas Recibidas</h1>
          <p className="mt-2 text-zinc-400">Gestiona las reservas de tus espacios</p>
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
                Las reservas aparecerán aquí cuando los conductores reserven tus espacios
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
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">{booking.spot?.title}</h3>
                        <Badge variant={statusConf.variant as any}>{statusConf.label}</Badge>
                        <span className="text-xs text-zinc-500">#{booking.booking_code}</span>
                      </div>

                      {/* Info Grid */}
                      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <User className="h-4 w-4 shrink-0" />
                          {booking.driver?.full_name || 'Driver'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Calendar className="h-4 w-4 shrink-0" />
                          {formatDateTime(booking.start_time)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Clock className="h-4 w-4 shrink-0" />
                          {booking.duration_hours}h
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          ${(booking.total_cents / 100).toLocaleString()}
                        </div>
                      </div>

                      {/* Reschedule proposal info */}
                      {booking.status === 'reschedule_pending' && booking.proposed_start_time && (
                        <div className="rounded-lg border border-yellow-800 bg-yellow-950/30 p-3">
                          <p className="text-sm text-yellow-300">
                            Propuesta enviada: {formatDateTime(booking.proposed_start_time)}
                          </p>
                          <p className="text-xs text-yellow-500">Esperando respuesta del driver</p>
                        </div>
                      )}

                      {/* Actions */}
                      {booking.status === 'pending' && (
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" onClick={() => handleAccept(booking.id)}>
                            <Check className="mr-1 h-3 w-3" /> Aceptar
                          </Button>
                          {booking.reschedule_count === 0 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setRescheduleId(rescheduleId === booking.id ? null : booking.id)}
                            >
                              <RefreshCw className="mr-1 h-3 w-3" /> Reagendar
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => handleCancel(booking.id)}>
                            <XIcon className="mr-1 h-3 w-3" /> Cancelar
                          </Button>
                        </div>
                      )}

                      {/* Reschedule Form */}
                      {rescheduleId === booking.id && (
                        <div className="mt-2 space-y-3 rounded-lg border border-zinc-800 bg-black p-4">
                          <p className="text-sm font-medium text-white">Proponer nueva fecha y hora</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">Fecha</Label>
                              <Input
                                type="date"
                                value={proposedDate}
                                onChange={(e) => setProposedDate(e.target.value)}
                                className="mt-1 bg-zinc-900"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Hora</Label>
                              <Input
                                type="time"
                                value={proposedTime}
                                onChange={(e) => setProposedTime(e.target.value)}
                                className="mt-1 bg-zinc-900"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleReschedule(booking.id)}>
                              Enviar propuesta
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setRescheduleId(null)}>
                              Cancelar
                            </Button>
                          </div>
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
