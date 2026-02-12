'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Navbar } from '@/components/layout/navbar'
import { MapPin, ArrowLeft, Loader2, X, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

type TimeSlot = {
  startTime: string
  endTime: string
  available: boolean
  booking?: boolean
}

interface SpotDetailPageProps {
  params: Promise<{ id: string }>
}

export default function SpotDetailPage({ params }: SpotDetailPageProps) {
  const router = useRouter()
  const supabase = createClient()

  const [spotId, setSpotId] = useState<string | null>(null)
  const [spot, setSpot] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set())
  const [isBooking, setIsBooking] = useState(false)

  // Unwrap params
  useEffect(() => {
    params.then(({ id }) => setSpotId(id))
  }, [params])

  useEffect(() => {
    if (spotId) {
      loadSpotAndUser()
    }
  }, [spotId])

  useEffect(() => {
    if (selectedDate && spot) {
      loadTimeSlots()
    }
  }, [selectedDate, spot])

  const loadSpotAndUser = async () => {
    if (!spotId) return

    try {
      const { data: spotData, error } = await supabase
        .from('spots')
        .select('*, host:profiles!spots_host_id_fkey(full_name)')
        .eq('id', spotId)
        .single()

      if (error || !spotData) {
        toast.error('Spot no encontrado')
        router.push('/search')
        return
      }

      setSpot(spotData)

      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()
        setUser({ ...authUser, profile })
      }

      // Set today as default
      const today = new Date()
      setSelectedDate(today.toISOString().split('T')[0])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTimeSlots = async () => {
    if (!selectedDate || !spot) return

    const date = new Date(selectedDate)
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const schedule = spot.availability_schedule?.schedule?.[dayName]

    if (!schedule) {
      setTimeSlots([])
      return
    }

    const slots: TimeSlot[] = []
    const [startHour] = schedule.start.split(':').map(Number)
    const [endHour] = schedule.end.split(':').map(Number)

    for (let hour = startHour; hour < endHour; hour++) {
      const nextHour = hour + 1
      slots.push({
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${nextHour.toString().padStart(2, '0')}:00`,
        available: true,
        booking: false
      })
    }

    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    const { data: existingBookings } = await supabase
      .from('bookings')
      .select('start_time, end_time')
      .eq('spot_id', spot.id)
      .gte('start_time', startOfDay.toISOString())
      .lte('start_time', endOfDay.toISOString())
      .in('status', ['pending', 'confirmed'])

    const bookedHours = new Set<number>()
    existingBookings?.forEach(booking => {
      const start = new Date(booking.start_time)
      const end = new Date(booking.end_time)
      let current = new Date(start)
      while (current < end) {
        bookedHours.add(current.getHours())
        current.setHours(current.getHours() + 1)
      }
    })

    setTimeSlots(slots.map(slot => ({
      ...slot,
      available: !bookedHours.has(parseInt(slot.startTime.split(':')[0]))
    })))
  }

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.available) return

    const newSelected = new Set(selectedSlots)
    if (newSelected.has(slot.startTime)) {
      newSelected.delete(slot.startTime)
    } else {
      newSelected.add(slot.startTime)
    }
    setSelectedSlots(newSelected)
  }

  const handleConfirmBooking = async () => {
    if (selectedSlots.size === 0) {
      toast.error('Selecciona al menos un horario')
      return
    }

    if (!user) {
      toast.error('Debes iniciar sesión para reservar')
      router.push('/auth/login?redirectTo=/spot/' + spotId)
      return
    }

    if (user.profile?.role !== 'driver') {
      toast.error('Solo los drivers pueden hacer reservas')
      return
    }

    setIsBooking(true)

    try {
      // Sort slots to get continuous booking time
      const sortedSlots = Array.from(selectedSlots).sort()
      const firstSlot = sortedSlots[0]
      const lastSlot = sortedSlots[sortedSlots.length - 1]
      const lastSlotEnd = timeSlots.find(s => s.startTime === lastSlot)?.endTime

      const startDateTime = new Date(`${selectedDate}T${firstSlot}:00`)
      const endDateTime = new Date(`${selectedDate}T${lastSlotEnd}:00`)

      const durationHours = selectedSlots.size
      const priceBase = spot.price_per_hour * durationHours
      const platformFee = Math.floor(priceBase * 0.15)
      const total = priceBase + platformFee

      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          spot_id: spot.id,
          driver_id: user.id,
          host_id: spot.host_id,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          duration_hours: durationHours,
          price_base_cents: priceBase,
          platform_fee_cents: platformFee,
          total_cents: total,
          status: 'pending',
          spot_snapshot: {
            title: spot.title,
            address: spot.address_exact,
            price: spot.price_per_hour,
            photos: spot.photos
          },
          booking_code: ''
        }])
        .select()
        .single()

      if (bookingError) throw bookingError

      toast.success('¡Reserva creada!')
      router.push(`/bookings/${bookingData.id}`)
    } catch (error: any) {
      console.error('Error:', error)
      toast.error('Error al reservar')
    } finally {
      setIsBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!spot) return null

  const today = new Date()
  const minDate = today.toISOString().split('T')[0]
  const pricePerHour = spot.price_per_hour / 100
  const fee = Math.floor(spot.price_per_hour * 0.15) / 100
  const totalPerHour = pricePerHour + fee
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/search"
          className="mb-6 inline-flex items-center text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a búsqueda
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              {spot.photos && spot.photos.length > 0 ? (
                <>
                  <div
                    className="h-64 rounded-lg bg-zinc-800 bg-cover bg-center md:col-span-2"
                    style={{ backgroundImage: `url(${spot.photos[0]})` }}
                  />
                  {spot.photos[1] && (
                    <div
                      className="h-32 rounded-lg bg-zinc-800 bg-cover bg-center"
                      style={{ backgroundImage: `url(${spot.photos[1]})` }}
                    />
                  )}
                  {spot.photos[2] && (
                    <div
                      className="h-32 rounded-lg bg-zinc-800 bg-cover bg-center"
                      style={{ backgroundImage: `url(${spot.photos[2]})` }}
                    />
                  )}
                </>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-lg bg-zinc-800 md:col-span-2">
                  <MapPin className="h-16 w-16 text-zinc-600" />
                </div>
              )}
            </div>

            {/* Info */}
            <Card className="border-zinc-800 bg-zinc-950">
              <CardContent className="p-6">
                <h1 className="text-3xl font-semibold text-white">
                  {spot.title}
                </h1>
                <div className="mt-2 flex items-center gap-4 text-sm text-zinc-400">
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {spot.address_exact}
                  </div>
                </div>

                <Separator className="my-6 bg-zinc-800" />

                {spot.tags && spot.tags.length > 0 && (
                  <>
                    <div>
                      <h3 className="mb-3 font-semibold text-white">Características</h3>
                      <div className="flex flex-wrap gap-2">
                        {spot.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Separator className="my-6 bg-zinc-800" />
                  </>
                )}

                <div>
                  <h3 className="mb-3 font-semibold text-white">Descripción</h3>
                  <p className="text-zinc-400">
                    {spot.description}
                  </p>
                </div>

                <Separator className="my-6 bg-zinc-800" />

                <div>
                  <h3 className="mb-3 font-semibold text-white">
                    Ubicación aproximada
                  </h3>
                  <div className="h-64 rounded-lg bg-zinc-800">
                    {/* Aquí iría el mapa de Google Maps */}
                    <div className="flex h-full items-center justify-center text-zinc-500">
                      Mapa (zona aproximada)
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    La dirección exacta se revelará después del pago
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div>
            <Card className="sticky top-24 border-zinc-800 bg-zinc-950">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="text-3xl font-semibold text-white">
                    ${pricePerHour.toFixed(0)}
                    <span className="text-base font-normal text-zinc-400">/hora</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">Reserva por slots de 1 hora</p>
                </div>

                <Separator className="my-4 bg-zinc-800" />

                <div className="space-y-6">
                  {/* Date Selector */}
                  <div>
                    <label htmlFor="date" className="mb-3 flex items-center text-sm font-semibold text-white">
                      <Calendar className="mr-2 h-4 w-4" />
                      Fecha de reserva
                    </label>
                    <input
                      id="date"
                      type="date"
                      min={minDate}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full rounded-lg border-2 border-zinc-800 bg-zinc-900 px-4 py-3 text-white transition-colors hover:border-zinc-700 focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div>
                      <h3 className="mb-4 text-sm font-semibold text-white">
                        Horarios disponibles
                      </h3>
                      {timeSlots.length === 0 ? (
                        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-center">
                          <p className="text-sm text-zinc-400">
                            No hay horarios disponibles este día
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            {timeSlots.map((slot) => {
                              const isSelected = selectedSlots.has(slot.startTime)
                              return (
                                <button
                                  key={slot.startTime}
                                  type="button"
                                  onClick={() => handleSlotClick(slot)}
                                  disabled={!slot.available}
                                  className={`group relative rounded-lg border-2 p-4 text-left transition-all ${
                                    !slot.available
                                      ? 'cursor-not-allowed border-zinc-800 bg-zinc-900/30 opacity-60'
                                      : isSelected
                                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                                      : 'border-zinc-700 bg-zinc-900 hover:scale-105 hover:border-primary hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-base font-bold text-white">
                                      {slot.startTime.replace(':00', '')}h
                                    </span>
                                    {!slot.available && <X className="h-4 w-4 text-red-400" />}
                                  </div>
                                  <div className="text-xs font-medium text-zinc-400">
                                    {slot.available ? `$${totalPerHour.toFixed(0)}` : 'Ocupado'}
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {selectedSlots.size > 0 && (
                  <>
                    <Separator className="my-4 bg-zinc-800" />

                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-white">Resumen de reserva</h3>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-zinc-400">
                          <span>Precio por hora</span>
                          <span>${pricePerHour.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>Horas seleccionadas</span>
                          <span>{selectedSlots.size}</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>Subtotal</span>
                          <span>${(pricePerHour * selectedSlots.size).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>Comisión (15%)</span>
                          <span>${(fee * selectedSlots.size).toFixed(2)}</span>
                        </div>
                        <Separator className="my-2 bg-zinc-800" />
                        <div className="flex justify-between text-lg font-bold text-white">
                          <span>Total</span>
                          <span>${(totalPerHour * selectedSlots.size).toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleConfirmBooking}
                        disabled={isBooking}
                        className="w-full rounded-lg bg-primary py-3 font-semibold text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isBooking ? (
                          <span className="flex items-center justify-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Procesando...
                          </span>
                        ) : (
                          'Confirmar reserva'
                        )}
                      </button>
                    </div>
                  </>
                )}

                {selectedSlots.size === 0 && (
                  <>
                    <Separator className="my-4 bg-zinc-800" />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-zinc-400">
                        <span>Precio por hora</span>
                        <span>${pricePerHour.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Comisión (15%)</span>
                        <span>${fee.toFixed(2)}</span>
                      </div>
                      <Separator className="my-2 bg-zinc-800" />
                      <div className="flex justify-between font-semibold text-white">
                        <span>Total por hora</span>
                        <span>${totalPerHour.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
