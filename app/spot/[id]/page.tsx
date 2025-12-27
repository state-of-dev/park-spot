import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Navbar } from '@/components/layout/navbar'
import { MapPin, Star, Shield, Car, Home, Clock, ArrowLeft } from 'lucide-react'

export default function SpotDetailPage() {
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
              <div
                className="h-64 rounded-lg bg-zinc-800 bg-cover bg-center md:col-span-2"
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&h=400&fit=crop)',
                }}
              />
              <div
                className="h-32 rounded-lg bg-zinc-800 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400&h=200&fit=crop)',
                }}
              />
              <div
                className="h-32 rounded-lg bg-zinc-800 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&h=200&fit=crop)',
                }}
              />
            </div>

            {/* Info */}
            <Card className="border-zinc-800 bg-zinc-950">
              <CardContent className="p-6">
                <h1 className="text-3xl font-semibold text-white">
                  Estacionamiento Techado - Foro Sol
                </h1>
                <div className="mt-2 flex items-center gap-4 text-sm text-zinc-400">
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    A 300m del Foro Sol
                  </div>
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                    4.8 (24 reseñas)
                  </div>
                </div>

                <Separator className="my-6 bg-zinc-800" />

                <div>
                  <h3 className="mb-3 font-semibold text-white">Características</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { icon: Home, label: 'Techado' },
                      { icon: Shield, label: 'Seguro 24/7' },
                      { icon: Car, label: 'Cabe SUV' },
                      { icon: Clock, label: 'Acceso inmediato' },
                    ].map((feature) => (
                      <div key={feature.label} className="flex items-center gap-2 text-zinc-300">
                        <feature.icon className="h-5 w-5 text-primary" />
                        {feature.label}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6 bg-zinc-800" />

                <div>
                  <h3 className="mb-3 font-semibold text-white">Descripción</h3>
                  <p className="text-zinc-400">
                    Estacionamiento techado y seguro a solo 5 minutos caminando del Foro Sol.
                    Perfecto para conciertos y eventos. Cuenta con vigilancia las 24 horas y acceso
                    controlado. Espacio amplio que puede acomodar vehículos grandes como SUVs y
                    camionetas.
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
                    $600
                    <span className="text-base font-normal text-zinc-400">/hora</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">Mínimo 1 hora</p>
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
