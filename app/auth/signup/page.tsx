'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ParkingSquare, Car, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

type UserRole = 'driver' | 'host'
type ScheduleType = '9to6' | '9to9' | 'custom'

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(false)
  const [scheduleType, setScheduleType] = useState<ScheduleType>('9to6')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('full_name') as string
    const phone = formData.get('phone') as string

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario')
      }

      // 2. Create profile with role-specific data
      const profileData: any = {
        id: authData.user.id,
        role: selectedRole,
        full_name: fullName,
        phone,
      }

      // Add role-specific fields
      if (selectedRole === 'driver') {
        profileData.vehicle_size = formData.get('vehicle_size') as string
        profileData.license_plate = formData.get('license_plate') as string
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([profileData])

      if (profileError) throw profileError

      // 3. If host, create first spot with uploaded photo
      if (selectedRole === 'host') {
        const spotTitle = formData.get('spot_title') as string
        const spotDescription = formData.get('spot_description') as string
        const spotAddress = formData.get('spot_address') as string
        const spotPhoto = formData.get('spot_photo') as File

        // Upload photo to Supabase Storage
        let photoUrl = ''
        if (spotPhoto && spotPhoto.size > 0) {
          const fileExt = spotPhoto.name.split('.').pop()
          const fileName = `${authData.user.id}/${Date.now()}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('spot-photos')
            .upload(fileName, spotPhoto)

          if (uploadError) {
            console.error('Error uploading photo:', uploadError)
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('spot-photos')
              .getPublicUrl(fileName)
            photoUrl = publicUrl
          }
        }

        // Build availability schedule based on selected type
        let availabilitySchedule: any = { type: 'weekly', schedule: {} }

        if (scheduleType === '9to6') {
          // 9 AM - 6 PM, Monday to Friday
          availabilitySchedule.schedule = {
            monday: { start: '09:00', end: '18:00' },
            tuesday: { start: '09:00', end: '18:00' },
            wednesday: { start: '09:00', end: '18:00' },
            thursday: { start: '09:00', end: '18:00' },
            friday: { start: '09:00', end: '18:00' }
          }
        } else if (scheduleType === '9to9') {
          // 9 AM - 9 PM, Monday to Sunday
          availabilitySchedule.schedule = {
            monday: { start: '09:00', end: '21:00' },
            tuesday: { start: '09:00', end: '21:00' },
            wednesday: { start: '09:00', end: '21:00' },
            thursday: { start: '09:00', end: '21:00' },
            friday: { start: '09:00', end: '21:00' },
            saturday: { start: '09:00', end: '21:00' },
            sunday: { start: '09:00', end: '21:00' }
          }
        } else {
          // Custom - default to 9-6 weekdays, can edit later
          availabilitySchedule.schedule = {
            monday: { start: '09:00', end: '18:00' },
            tuesday: { start: '09:00', end: '18:00' },
            wednesday: { start: '09:00', end: '18:00' },
            thursday: { start: '09:00', end: '18:00' },
            friday: { start: '09:00', end: '18:00' }
          }
        }

        // Create spot (with temporary coordinates, we'll add Google Maps later)
        const { error: spotError } = await supabase
          .from('spots')
          .insert([{
            host_id: authData.user.id,
            title: spotTitle,
            description: spotDescription,
            address_exact: spotAddress,
            lat_exact: 19.4326, // CDMX default, we'll update with real coords later
            lng_exact: -99.1332,
            lat_fuzzy: 19.4326,
            lng_fuzzy: -99.1332,
            price_per_hour: 50000, // $50 MXN default
            photos: photoUrl ? [photoUrl] : [],
            tags: [],
            availability_schedule: availabilitySchedule,
            is_active: true
          }])

        if (spotError) {
          console.error('Error creating spot:', spotError)
          // Don't throw, profile was created successfully
        }
      }

      toast.success('¡Cuenta creada exitosamente!')

      // Redirect based on role
      if (selectedRole === 'driver') {
        router.push('/driver')
      } else {
        router.push('/host')
      }
    } catch (error: any) {
      console.error('Error en registro:', error)
      toast.error(error.message || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || 'Error al conectar con Google')
    }
  }

  if (!selectedRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4">
        <Card className="w-full max-w-2xl border-zinc-800 bg-zinc-950">
          <CardHeader className="space-y-1 text-center">
            <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
              <ParkingSquare className="h-8 w-8 text-primary" />
              <span className="text-2xl font-semibold text-white">ParkSpot</span>
            </Link>
            <CardTitle className="text-2xl text-white">Crear Cuenta</CardTitle>
            <CardDescription>Selecciona tu tipo de cuenta</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => setSelectedRole('driver')}
              className="flex flex-col items-center gap-4 rounded-lg border-2 border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-primary hover:bg-zinc-800"
            >
              <div className="rounded-full bg-primary/10 p-4">
                <Car className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white">Driver</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Busca y reserva estacionamientos
                </p>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('host')}
              className="flex flex-col items-center gap-4 rounded-lg border-2 border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-primary hover:bg-zinc-800"
            >
              <div className="rounded-full bg-primary/10 p-4">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white">Host</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Publica y renta tus espacios
                </p>
              </div>
            </button>
          </CardContent>
          <div className="px-6 pb-6 text-center text-sm text-zinc-400">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950">
        <CardHeader className="space-y-1 text-center">
          <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
            <ParkingSquare className="h-8 w-8 text-primary" />
            <span className="text-2xl font-semibold text-white">ParkSpot</span>
          </Link>
          <CardTitle className="text-2xl text-white">
            Registro como {selectedRole === 'driver' ? 'Driver' : 'Host'}
          </CardTitle>
          <CardDescription>Completa el formulario para registrarte</CardDescription>
          <button
            onClick={() => setSelectedRole(null)}
            className="text-sm text-primary hover:underline"
          >
            Cambiar tipo de cuenta
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campos comunes */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre completo</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Juan Pérez"
                className="bg-black"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                className="bg-black"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+52 55 1234 5678"
                className="bg-black"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="bg-black"
                required
                minLength={6}
              />
            </div>

            {/* Campos específicos para Driver */}
            {selectedRole === 'driver' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="vehicle_size">Tamaño del auto</Label>
                  <select
                    id="vehicle_size"
                    name="vehicle_size"
                    className="flex h-10 w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Selecciona</option>
                    <option value="compacto">Compacto</option>
                    <option value="sedan">Sedán</option>
                    <option value="suv">SUV</option>
                    <option value="pickup">Pickup</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license_plate">Placas</Label>
                  <Input
                    id="license_plate"
                    name="license_plate"
                    type="text"
                    placeholder="ABC-123-D"
                    className="bg-black"
                    required
                  />
                </div>
              </>
            )}

            {/* Campos específicos para Host */}
            {selectedRole === 'host' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="spot_title">Título del espacio</Label>
                  <Input
                    id="spot_title"
                    name="spot_title"
                    type="text"
                    placeholder="Ej: Estacionamiento techado en Polanco"
                    className="bg-black"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spot_description">Descripción</Label>
                  <textarea
                    id="spot_description"
                    name="spot_description"
                    placeholder="Describe tu espacio (seguridad, facilidades, etc.)"
                    className="flex min-h-[80px] w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm text-white ring-offset-background placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spot_address">Dirección</Label>
                  <Input
                    id="spot_address"
                    name="spot_address"
                    type="text"
                    placeholder="Empieza a escribir la dirección..."
                    className="bg-black"
                    required
                  />
                  <p className="text-xs text-zinc-500">
                    Autocomplete de Google próximamente
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spot_photo">Foto del espacio</Label>
                  <Input
                    id="spot_photo"
                    name="spot_photo"
                    type="file"
                    accept="image/*"
                    className="bg-black"
                    required
                  />
                  <p className="text-xs text-zinc-500">
                    Sube una foto clara de tu espacio de estacionamiento
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Horario de disponibilidad</Label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setScheduleType('9to6')}
                      className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                        scheduleType === '9to6'
                          ? 'border-primary bg-primary/10'
                          : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                      }`}
                    >
                      <div className="font-medium text-white">9:00 AM - 6:00 PM</div>
                      <div className="text-sm text-zinc-400">Lunes a Viernes</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setScheduleType('9to9')}
                      className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                        scheduleType === '9to9'
                          ? 'border-primary bg-primary/10'
                          : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                      }`}
                    >
                      <div className="font-medium text-white">9:00 AM - 9:00 PM</div>
                      <div className="text-sm text-zinc-400">Lunes a Domingo</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setScheduleType('custom')}
                      className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                        scheduleType === 'custom'
                          ? 'border-primary bg-primary/10'
                          : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                      }`}
                    >
                      <div className="font-medium text-white">Personalizado</div>
                      <div className="text-sm text-zinc-400">Configurar después</div>
                    </button>
                  </div>
                </div>
              </>
            )}

            <Button className="w-full" size="lg" type="submit" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>

          <div className="text-center text-sm text-zinc-400">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
