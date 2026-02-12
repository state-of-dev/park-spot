'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import { Mail, Phone, Car, Save, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { profile, loading: authLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    vehicle_size: '',
    license_plate: '',
    rfc: '',
    billing_email: '',
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        vehicle_size: profile.vehicle_size || '',
        license_plate: profile.license_plate || '',
        rfc: profile.rfc || '',
        billing_email: profile.billing_email || '',
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', profile?.id)

      if (error) throw error

      toast.success('Perfil actualizado correctamente')
      setIsEditing(false)
      router.refresh()
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Error al actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-zinc-400">Cargando...</div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-zinc-400">Debes iniciar sesión para ver tu perfil</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-white">Mi Perfil</h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              Editar Perfil
            </Button>
          )}
        </div>

        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                  {profile.full_name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold text-white">{profile.full_name}</h2>
                <Badge className="mt-2">
                  {profile.role === 'driver' ? 'Driver' : 'Host'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campos comunes */}
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nombre completo</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="bg-black"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-black"
                    required
                  />
                </div>

                {/* Campos específicos para Driver */}
                {profile.role === 'driver' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="vehicle_size">Tamaño del auto</Label>
                      <select
                        id="vehicle_size"
                        value={formData.vehicle_size}
                        onChange={(e) => setFormData({ ...formData, vehicle_size: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
                        value={formData.license_plate}
                        onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
                        className="bg-black"
                      />
                    </div>
                  </>
                )}

                {/* Campos específicos para Host */}
                {profile.role === 'host' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="rfc">RFC</Label>
                      <Input
                        id="rfc"
                        value={formData.rfc}
                        onChange={(e) => setFormData({ ...formData, rfc: e.target.value })}
                        className="bg-black"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="billing_email">Email de facturación</Label>
                      <Input
                        id="billing_email"
                        type="email"
                        value={formData.billing_email}
                        onChange={(e) => setFormData({ ...formData, billing_email: e.target.value })}
                        className="bg-black"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  <Button type="submit" disabled={loading} className="flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                    <div className="text-white">{profile.id}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Phone className="h-4 w-4" />
                      Teléfono
                    </div>
                    <div className="text-white">{profile.phone || 'No configurado'}</div>
                  </div>

                  {profile.role === 'driver' && (
                    <>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Car className="h-4 w-4" />
                          Tamaño del auto
                        </div>
                        <div className="text-white capitalize">
                          {profile.vehicle_size || 'No configurado'}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm text-zinc-400">Placas</div>
                        <div className="text-white">
                          {profile.license_plate || 'No configurado'}
                        </div>
                      </div>
                    </>
                  )}

                  {profile.role === 'host' && (
                    <>
                      <div className="space-y-1">
                        <div className="text-sm text-zinc-400">RFC</div>
                        <div className="text-white">{profile.rfc || 'No configurado'}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm text-zinc-400">Email de facturación</div>
                        <div className="text-white">
                          {profile.billing_email || 'No configurado'}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
