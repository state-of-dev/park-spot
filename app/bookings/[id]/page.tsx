import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Hash,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function BookingDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: booking, error } = await supabase
    .from('bookings')
    .select(
      `
      *,
      spot:spots(id, title, address_exact, photos),
      driver:profiles!bookings_driver_id_fkey(full_name, phone),
      host:profiles!bookings_host_id_fkey(full_name, phone)
    `
    )
    .eq('id', id)
    .single()

  if (error || !booking) {
    notFound()
  }

  if (booking.driver_id !== user.id && booking.host_id !== user.id) {
    redirect('/driver')
  }

  const isDriver = booking.driver_id === user.id
  const startDate = new Date(booking.start_time)
  const endDate = new Date(booking.end_time)

  const statusConfig = {
    pending: {
      label: 'Pendiente',
      icon: AlertCircle,
      color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    },
    confirmed: {
      label: 'Confirmada',
      icon: CheckCircle2,
      color: 'bg-green-500/10 text-green-500 border-green-500/20'
    },
    completed: {
      label: 'Completada',
      icon: CheckCircle2,
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    },
    cancelled: {
      label: 'Cancelada',
      icon: XCircle,
      color: 'bg-red-500/10 text-red-500 border-red-500/20'
    }
  }

  const status = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = status.icon

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={isDriver ? '/driver' : '/host'}
          className="mb-6 inline-flex items-center text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-white">Reserva</h1>
          <Badge className={`${status.color} border px-3 py-1`}>
            <StatusIcon className="mr-1 h-4 w-4" />
            {status.label}
          </Badge>
        </div>

        <div className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>{booking.spot?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start text-sm text-zinc-400">
                <MapPin className="mr-2 mt-0.5 h-4 w-4" />
                {booking.spot?.address_exact}
              </div>

              <Separator className="bg-zinc-800" />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex items-center text-sm text-zinc-400">
                    <Calendar className="mr-2 h-4 w-4" />
                    Fecha
                  </div>
                  <p className="mt-1 font-medium text-white">
                    {startDate.toLocaleDateString('es-MX')}
                  </p>
                </div>

                <div>
                  <div className="flex items-center text-sm text-zinc-400">
                    <Clock className="mr-2 h-4 w-4" />
                    Horario
                  </div>
                  <p className="mt-1 font-medium text-white">
                    {startDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div>
                  <div className="flex items-center text-sm text-zinc-400">
                    <Hash className="mr-2 h-4 w-4" />
                    Código
                  </div>
                  <p className="mt-1 font-mono text-lg font-semibold text-white">
                    {booking.booking_code}
                  </p>
                </div>

                <div>
                  <div className="flex items-center text-sm text-zinc-400">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Total
                  </div>
                  <p className="mt-1 text-lg font-semibold text-white">
                    ${(booking.total_cents / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
