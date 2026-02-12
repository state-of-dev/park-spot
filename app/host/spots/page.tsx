'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import { Plus, MapPin, DollarSign, Eye, EyeOff, ParkingSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import type { Spot } from '@/types'

export default function HostSpotsPage() {
  const { profile, loading: authLoading } = useAuth()
  const [spots, setSpots] = useState<Spot[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (profile) fetchSpots()
  }, [profile])

  const fetchSpots = async () => {
    try {
      const { data, error } = await supabase
        .from('spots')
        .select('*')
        .eq('host_id', profile!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSpots(data || [])
    } catch (error: any) {
      console.error('Error fetching spots:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (spotId: string, currentlyActive: boolean) => {
    try {
      const { error } = await supabase
        .from('spots')
        .update({ is_active: !currentlyActive })
        .eq('id', spotId)

      if (error) throw error

      setSpots(spots.map((s) => (s.id === spotId ? { ...s, is_active: !currentlyActive } : s)))
      toast.success(currentlyActive ? 'Anuncio desactivado' : 'Anuncio activado')
    } catch (error: any) {
      toast.error('Error al actualizar el anuncio')
    }
  }

  if (authLoading || loading) {
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Mis Anuncios</h1>
            <p className="mt-2 text-zinc-400">
              {spots.length} anuncio{spots.length !== 1 ? 's' : ''} publicado{spots.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button asChild>
            <Link href="/host/spots/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Anuncio
            </Link>
          </Button>
        </div>

        {spots.length === 0 ? (
          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="flex flex-col items-center py-16 text-center">
              <ParkingSquare className="mb-4 h-16 w-16 text-zinc-600" />
              <h3 className="mb-2 text-xl font-semibold text-white">
                No tienes anuncios aún
              </h3>
              <p className="mb-6 max-w-md text-sm text-zinc-400">
                Publica tu primer espacio de estacionamiento y empieza a recibir reservas.
              </p>
              <Button asChild>
                <Link href="/host/spots/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear mi primer anuncio
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {spots.map((spot) => (
              <Card key={spot.id} className="overflow-hidden border-zinc-800 bg-zinc-950">
                {/* Photo */}
                {spot.photos?.[0] && (
                  <div
                    className="h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${spot.photos[0]})` }}
                  />
                )}

                <CardContent className="p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{spot.title}</h3>
                      <div className="mt-1 flex items-center text-sm text-zinc-400">
                        <MapPin className="mr-1 h-3 w-3 shrink-0" />
                        <span className="truncate">{spot.address_exact}</span>
                      </div>
                    </div>
                    <Badge variant={spot.is_active ? 'default' : 'secondary'}>
                      {spot.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>

                  {/* Tags */}
                  {spot.tags?.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {spot.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                      {spot.tags.length > 3 && (
                        <span className="text-xs text-zinc-500">+{spot.tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="mb-4 flex items-center text-lg font-semibold text-white">
                    <DollarSign className="mr-1 h-5 w-5" />
                    {(spot.price_per_hour / 100).toLocaleString()}
                    <span className="ml-1 text-sm font-normal text-zinc-400">/hora</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleActive(spot.id, spot.is_active)}
                    >
                      {spot.is_active ? (
                        <><EyeOff className="mr-1 h-3 w-3" /> Desactivar</>
                      ) : (
                        <><Eye className="mr-1 h-3 w-3" /> Activar</>
                      )}
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/spot/${spot.id}`}>Ver</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
