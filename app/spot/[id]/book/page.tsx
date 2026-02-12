'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Navbar } from '@/components/layout/navbar'
import { ArrowLeft, Calendar, MapPin, Loader2, Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

type TimeSlot = {
  startTime: string
  endTime: string
  available: boolean
  booking?: boolean
}

export default function BookSpotPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()

  const [spot, setSpot] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const [selectedDate, setSelectedDate] = useState('')
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  useEffect(() => {
    fetchSpotAndUser()
  }, [])

  useEffect(() => {
    if (selectedDate && spot) {
      loadTimeSlots()
    }
  }, [selectedDate, spot])

  const fetchSpotAndUser = async () => {
    try {
      // Get authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        toast.error('Debes iniciar sesión para reservar')
        router.push('/auth/login?redirectTo=/spot/' + params.id)
        return
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profile?.role !== 'driver') {
        toast.error('Solo los drivers pueden hacer reservas')
        router.push('/spot/' + params.id)
        return
      }

      setUser({ ...authUser, profile })

      // Get spot details
      const { data: spotData, error } = await supabase
        .from('spots')
        .select('*, host:profiles!spots_host_id_fkey(full_name)')
        .eq('id', params.id)
        .single()

      if (error || !spotData) {
        toast.error('Spot no encontrado')
        router.push('/search')
        return
      }

      setSpot(spotData)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  const loadTimeSlots = async () => {
    if (!selectedDate || !spot) return

    const date = new Date(selectedDate)
    const dayName = date.toLocaleDateString('en-US', { weekday: 'lowercase' })

    const schedule = spot.availability_schedule?.schedule?.[dayName]

    if (!schedule) {
      setTimeSlots([])
      return
    }

    // Generate 1-hour slots
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

    // Check existing bookings
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

    // Mark booked slots
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

  const handleSlotClick = async (slot: TimeSlot) => {
    if (!slot.available || slot.booking || !user || !spot) return

    // Update UI immediately
    setTimeSlots(prev => prev.map(s =>
      s.startTime === slot.startTime ? { ...s, booking: true } : s
    ))

    try {
      const startDateTime = new Date(`${selectedDate}T${slot.startTime}:00`)
      const endDateTime = new Date(`${selectedDate}T${slot.endTime}:00`)

      const priceBase = spot.price_per_hour
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
          duration_hours: 1,
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

      toast.success('¡Slot reservado!')
      router.push(`/bookings/${bookingData.id}`)
    } catch (error: any) {
      console.error('Error:', error)
      toast.error('Error al reservar')
      setTimeSlots(prev => prev.map(s =>
        s.startTime === slot.startTime ? { ...s, booking: false } : s
      ))
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-white">Cargando...</div>
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

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={`/spot/${spot.id}`}
          className="mb-6 inline-flex items-center text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Link>

        <h1 className="mb-2 text-3xl font-semibold text-white">{spot.title}</h1>
        <div className="mb-8 flex items-center text-zinc-400">
          <MapPin className="mr-2 h-4 w-4" />
          {spot.address_exact}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border-zinc-800 bg-zinc-950">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-white mb-2">
                      Selecciona una fecha
                    </label>
                    <input
                      id="date"
                      type="date"
                      min={minDate}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-white"
                    />
                  </div>

                  {selectedDate && (
                    <div>
                      <h3 className="mb-3 text-sm font-medium text-white">
                        Horarios Disponibles (Haz clic para reservar)
                      </h3>
                      {timeSlots.length === 0 ? (
                        <p className="text-sm text-zinc-400">
                          No hay horarios disponibles para esta fecha
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot.startTime}
                              type="button"
                              onClick={() => handleSlotClick(slot)}
                              disabled={!slot.available || slot.booking}
                              className={`rounded-lg border-2 p-4 text-left transition-all ${
                                !slot.available
                                  ? 'cursor-not-allowed border-zinc-800 bg-zinc-900/50 opacity-50'
                                  : slot.booking
                                  ? 'border-primary bg-primary/20'
                                  : 'border-zinc-800 bg-zinc-900 hover:border-primary hover:bg-zinc-800'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-lg font-semibold text-white">
                                  {slot.startTime.replace(':00', '')} - {slot.endTime.replace(':00', '')}
                                </span>
                                {!slot.available && <X className="h-5 w-5 text-red-500" />}
                                {slot.booking && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                                {slot.available && !slot.booking && <Check className="h-5 w-5 text-green-500 opacity-0 group-hover:opacity-100" />}
                              </div>
                              <div className="text-sm text-zinc-400">
                                {slot.available ? (
                                  <>
                                    ${pricePerHour.toFixed(0)}/hora
                                    <div className="text-xs text-zinc-500 mt-1">
                                      Total: ${totalPerHour.toFixed(2)}
                                    </div>
                                  </>
                                ) : (
                                  <span className="text-red-500">Reservado</span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      <p className="mt-4 text-xs text-zinc-500">
                        Cada slot es de 1 hora. Haz clic en varios slots para reservar más tiempo.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24 border-zinc-800 bg-zinc-950">
              <CardContent className="p-6">
                {spot.photos?.[0] && (
                  <div
                    className="mb-4 h-32 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${spot.photos[0]})` }}
                  />
                )}

                <Separator className="my-4 bg-zinc-800" />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Precio por hora</span>
                    <span className="font-semibold text-white">${pricePerHour.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Comisión (15%)</span>
                    <span className="text-zinc-400">${fee.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div className="flex justify-between">
                    <span className="font-semibold text-white">Total por hora</span>
                    <span className="text-xl font-bold text-primary">${totalPerHour.toFixed(2)}</span>
                  </div>
                </div>

                {selectedDate && (
                  <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                    <div className="flex items-center text-sm text-zinc-300">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(selectedDate).toLocaleDateString('es-MX', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </div>
                  </div>
                )}

                <p className="mt-4 text-xs text-center text-zinc-500">
                  Haz clic en un horario disponible para reservar al instante
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
