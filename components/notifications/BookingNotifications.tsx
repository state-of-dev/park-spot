'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { Bell, Check, X, Calendar, MapPin, Clock, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Notification {
  id: string
  booking_code: string
  status: string
  start_time: string
  duration_hours: number
  spot?: { title: string; address_exact?: string }
  driver?: { full_name: string }
  host?: { full_name: string }
}

export function BookingNotifications() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!profile) return

    // Initial fetch
    fetchNotifications()

    // Realtime subscription
    const filter = profile.role === 'host'
      ? `host_id=eq.${profile.id}`
      : `driver_id=eq.${profile.id}`

    const channel = supabase
      .channel('booking-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            if (profile.role === 'host' && payload.new.status === 'pending') {
              toast.success('Nueva reserva recibida!', {
                description: 'Tienes una reserva pendiente de aprobar'
              })
            } else if (profile.role === 'driver') {
              toast.success('Reserva creada!', {
                description: 'Tu reserva está pendiente de aprobación'
              })
            }
          } else if (payload.eventType === 'UPDATE') {
            if (profile.role === 'driver' && payload.new.status === 'confirmed') {
              toast.success('Reserva confirmada!', {
                description: 'Tu reserva ha sido aceptada por el host'
              })
            }
          }
          fetchNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [profile])

  const fetchNotifications = async () => {
    if (!profile) return

    const query = supabase
      .from('bookings')
      .select(`
        id, booking_code, status, start_time, duration_hours,
        spot:spots(title, address_exact),
        driver:profiles!bookings_driver_id_fkey(full_name),
        host:profiles!bookings_host_id_fkey(full_name)
      `)
      .order('start_time', { ascending: false })
      .limit(10)

    if (profile.role === 'host') {
      query.eq('host_id', profile.id)
        .in('status', ['pending', 'confirmed'])
    } else {
      query.eq('driver_id', profile.id)
        .in('status', ['pending', 'confirmed', 'reschedule_pending'])
    }

    const { data } = await query

    setNotifications((data as any) || [])

    // Count unread (pending for host, any active for driver)
    const unread = profile.role === 'host'
      ? (data?.filter(n => n.status === 'pending') || []).length
      : (data?.filter(n => ['pending', 'reschedule_pending'].includes(n.status)) || []).length

    setUnreadCount(unread)
  }

  const handleAccept = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId)

      if (error) throw error
      toast.success('Reserva aceptada')
      fetchNotifications()
    } catch (error) {
      toast.error('Error al aceptar')
    }
  }

  const handleReject = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

      if (error) throw error
      toast.success('Reserva cancelada')
      fetchNotifications()
    } catch (error) {
      toast.error('Error al cancelar')
    }
  }

  if (!profile) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative rounded-full p-2 transition-colors hover:bg-zinc-800">
          <Bell className="h-5 w-5 text-zinc-400" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-yellow-500 px-1 text-xs text-black">
              {unreadCount}
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 border-zinc-800 bg-zinc-950">
        <DropdownMenuLabel className="text-white">
          Notificaciones
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />

        {notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-zinc-500">
            No hay notificaciones
          </div>
        ) : (
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-1 p-1">
              {notifications.map((notification) => {
                const startDate = new Date(notification.start_time)
                const isPending = notification.status === 'pending'
                const isReschedulePending = notification.status === 'reschedule_pending'

                return (
                  <div
                    key={notification.id}
                    className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-white">
                          {notification.spot?.title}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
                          <Calendar className="h-3 w-3" />
                          {startDate.toLocaleDateString('es-MX')}
                          <Clock className="ml-2 h-3 w-3" />
                          {notification.duration_hours}h
                        </div>
                        {profile.role === 'host' && (
                          <div className="mt-1 text-xs text-zinc-500">
                            {notification.driver?.full_name || 'Driver'}
                          </div>
                        )}
                      </div>
                      <Badge className={
                        isPending || isReschedulePending
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-green-500/10 text-green-500'
                      }>
                        {isPending ? 'Pendiente' : isReschedulePending ? 'Reagendar' : 'Confirmada'}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      {profile.role === 'host' && isPending && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 flex-1 text-xs"
                            onClick={() => handleAccept(notification.id)}
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Aceptar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 flex-1 text-xs"
                            onClick={() => handleReject(notification.id)}
                          >
                            <X className="mr-1 h-3 w-3" />
                            Rechazar
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        asChild
                      >
                        <Link href={profile.role === 'host' ? '/host/bookings' : '/bookings'}>
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Ver detalle
                        </Link>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}

        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem asChild>
          <Link
            href={profile.role === 'host' ? '/host/bookings' : '/bookings'}
            className="cursor-pointer text-center text-xs text-primary"
          >
            Ver todas las reservas
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
