'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import { MapPin, Calendar, DollarSign, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Spot } from '@/types'

export default function SearchPage() {
  const supabase = createClient()
  const [spots, setSpots] = useState<Spot[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    fetchSpots()
  }, [])

  const fetchSpots = async () => {
    try {
      let query = supabase
        .from('spots')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      const { data, error } = await query
      if (error) throw error
      setSpots(data || [])
    } catch (error: any) {
      console.error('Error fetching spots:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = spots.filter((spot) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      const matchesTitle = spot.title.toLowerCase().includes(term)
      const matchesTags = spot.tags?.some((t) => t.toLowerCase().includes(term))
      const matchesDesc = spot.description.toLowerCase().includes(term)
      if (!matchesTitle && !matchesTags && !matchesDesc) return false
    }
    if (maxPrice && spot.price_per_hour / 100 > parseInt(maxPrice)) return false
    return true
  })

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">Buscar Estacionamiento</h1>
          <p className="mt-2 text-zinc-400">Encuentra tu lugar perfecto para el evento</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-zinc-800 bg-zinc-950">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  <Search className="mr-2 inline h-4 w-4" />
                  Buscar
                </label>
                <Input
                  placeholder="Ej: Techado, Foro Sol, privada..."
                  className="bg-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  <DollarSign className="mr-2 inline h-4 w-4" />
                  Precio máximo por hora
                </label>
                <Input
                  type="number"
                  placeholder="900"
                  className="bg-black"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          <div className="mb-4 text-sm text-zinc-400">
            {loading ? 'Buscando...' : `${filtered.length} espacio${filtered.length !== 1 ? 's' : ''} disponible${filtered.length !== 1 ? 's' : ''}`}
          </div>

          {!loading && filtered.length === 0 ? (
            <Card className="border-zinc-800 bg-zinc-950">
              <CardContent className="flex flex-col items-center py-16 text-center">
                <MapPin className="mb-4 h-12 w-12 text-zinc-600" />
                <h3 className="mb-2 text-lg font-semibold text-white">
                  No se encontraron estacionamientos
                </h3>
                <p className="text-sm text-zinc-400">
                  Intenta con otros filtros o vuelve más tarde
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((spot) => (
                <Link key={spot.id} href={`/spot/${spot.id}`}>
                  <Card className="overflow-hidden border-zinc-800 bg-zinc-950 transition-colors hover:border-zinc-700">
                    {spot.photos?.[0] ? (
                      <div
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${spot.photos[0]})` }}
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-zinc-800">
                        <MapPin className="h-12 w-12 text-zinc-600" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white">{spot.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                        {spot.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {spot.tags?.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-semibold text-white">
                          ${(spot.price_per_hour / 100).toLocaleString()}
                          <span className="text-sm text-zinc-400">/hora</span>
                        </span>
                        <Button size="sm">Ver Detalles</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
