import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Navbar } from '@/components/layout/navbar'
import { MapPin, Star, Shield, Car, Home, Clock, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function SpotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Get spot details
  const { data: spot, error } = await supabase
    .from('spots')
    .select(`
      *,
      host:profiles!spots_host_id_fkey(full_name)
    `)
    .eq('id', id)
    .single()

  if (error || !spot) {
    notFound()
  }
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
                <div className="mb-6">
                  <div className="text-3xl font-semibold text-white">
                    ${(spot.price_per_hour / 100).toLocaleString()}
                    <span className="text-base font-normal text-zinc-400">/hora</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">Mínimo 1 hora, máximo 8 horas</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      Fecha del evento
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        Hora inicio
                      </label>
                      <input
                        type="time"
                        className="w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        Duración
                      </label>
                      <select className="w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-white">
                        <option>1 hora</option>
                        <option>2 horas</option>
                        <option>3 horas</option>
                        <option>4 horas</option>
                        <option>5 horas</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Separator className="my-6 bg-zinc-800" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>$600 × 3 horas</span>
                    <span>$1,800</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Comisión de servicio (5%)</span>
                    <span>$90</span>
                  </div>
                  <Separator className="my-2 bg-zinc-800" />
                  <div className="flex justify-between text-lg font-semibold text-white">
                    <span>Total</span>
                    <span>$1,890</span>
                  </div>
                </div>

                <Button className="mt-6 w-full" size="lg">
                  Reservar Ahora
                </Button>

                <p className="mt-4 text-center text-xs text-zinc-500">
                  No se te cobrará todavía
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
