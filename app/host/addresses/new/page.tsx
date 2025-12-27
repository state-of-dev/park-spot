import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/navbar'
import { ArrowLeft, MapPin } from 'lucide-react'

export default function NewAddressPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/host/addresses"
          className="mb-6 inline-flex items-center text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a domicilios
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">Nuevo Domicilio</h1>
          <p className="mt-2 text-zinc-400">
            Agrega la ubicación donde ofrecerás estacionamiento
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>Información del Domicilio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del domicilio</Label>
                <Input
                  id="name"
                  placeholder="Ej: Mi casa Foro Sol"
                  className="mt-2 bg-black"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Un nombre descriptivo para identificar esta ubicación
                </p>
              </div>

              <div>
                <Label htmlFor="address">Dirección completa</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="address"
                    placeholder="Buscar dirección..."
                    className="bg-black pl-10"
                  />
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  Usa el autocompletado para encontrar tu dirección exacta
                </p>
              </div>

              <div>
                <Label htmlFor="instructions">Instrucciones de acceso</Label>
                <Textarea
                  id="instructions"
                  placeholder="Ej: Tocar el timbre, el portón se abre automáticamente..."
                  className="mt-2 bg-black"
                  rows={4}
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Instrucciones que verá el conductor después de pagar
                </p>
              </div>

              <div>
                <Label htmlFor="contact">Teléfono de contacto</Label>
                <Input
                  id="contact"
                  type="tel"
                  placeholder="+52 55 1234 5678"
                  className="mt-2 bg-black"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Se compartirá con el conductor solo después de confirmar la reserva
                </p>
              </div>

              <div>
                <Label htmlFor="code">Código de acceso (opcional)</Label>
                <Input
                  id="code"
                  placeholder="*1234#"
                  className="mt-2 bg-black"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Si tu domicilio tiene código de entrada
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>Ubicación en el Mapa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 rounded-lg bg-zinc-800">
                <div className="flex h-full items-center justify-center text-zinc-500">
                  Mapa interactivo de Google Maps
                </div>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                La ubicación exacta solo se mostrará al conductor después del pago.
                En la búsqueda aparecerá una zona aproximada.
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/host/addresses">Cancelar</Link>
            </Button>
            <Button className="flex-1">Guardar Domicilio</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
