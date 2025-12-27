import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Navbar } from '@/components/layout/navbar'
import { ArrowLeft, MapPin, Calendar, Clock, Phone, Key, AlertCircle } from 'lucide-react'

export default function BookingDetailPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/bookings"
          className="mb-6 inline-flex items-center text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a mis reservas
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-white">Detalle de Reserva</h1>
          <Badge>Confirmada</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-zinc-800 bg-zinc-950">
              <CardHeader>
                <CardTitle>Información del Estacionamiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    Cajón Techado - Foro Sol
                  </h3>
                  <div className="space-y-2 text-sm text-zinc-400">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      15 de Enero, 2025
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      18:00 - 23:00 (5 horas)
                    </div>
                  </div>
                </div>

                <Separator className="bg-zinc-800" />

                <div>
                  <h4 className="mb-2 font-medium text-white">Dirección Exacta</h4>
                  <div className="flex items-start">
                    <MapPin className="mr-2 mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm text-zinc-300">
                      Calle Granjas México 123, Col. Granjas México, Iztacalco, CDMX
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium text-white">Instrucciones de Acceso</h4>
                  <p className="text-sm text-zinc-400">
                    Al llegar, tocar el timbre. El portón se abre automáticamente. El espacio
                    está a mano derecha, número 3. Por favor, estaciona alineado con las marcas.
                  </p>
                </div>

                <div className="rounded-lg bg-blue-950/20 border border-blue-900/30 p-4">
                  <div className="flex items-start gap-2">
                    <Key className="mt-0.5 h-5 w-5 text-blue-400" />
                    <div>
                      <h4 className="font-medium text-blue-300">Código de Acceso</h4>
                      <p className="mt-1 text-lg font-mono text-blue-100">*1234#</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="border-zinc-800 bg-zinc-950">
              <CardHeader>
                <CardTitle>Ubicación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 rounded-lg bg-zinc-800">
                  {/* Aquí iría el mapa de Google Maps */}
                  <div className="flex h-full items-center justify-center text-zinc-500">
                    Mapa con ubicación exacta
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-zinc-800 bg-zinc-950">
              <CardHeader>
                <CardTitle>Contacto del Host</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-zinc-400">Nombre</div>
                  <div className="font-medium text-white">Juan Pérez</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400">Teléfono</div>
                  <div className="flex items-center font-medium text-white">
                    <Phone className="mr-2 h-4 w-4" />
                    55 1234 5678
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Contactar
                </Button>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-950">
              <CardHeader>
                <CardTitle>Resumen de Pago</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>$600 × 5 horas</span>
                  <span>$3,000</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Comisión servicio</span>
                  <span>$150</span>
                </div>
                <Separator className="my-2 bg-zinc-800" />
                <div className="flex justify-between font-semibold text-white">
                  <span>Total pagado</span>
                  <span>$3,150</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-900/30 bg-yellow-950/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-400" />
                  <div>
                    <h4 className="font-medium text-yellow-300">Política de Cancelación</h4>
                    <p className="mt-1 text-xs text-yellow-200/80">
                      Reembolso del 40% si cancelas con más de 1 hora de anticipación.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button className="w-full" size="lg">
                Hacer Check-in
              </Button>
              <Button variant="destructive" className="w-full">
                Cancelar Reserva
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
