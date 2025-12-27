import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/navbar'
import { ArrowLeft, Upload } from 'lucide-react'

export default function NewSpotPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/host/spots"
          className="mb-6 inline-flex items-center text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a mis spots
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">Crear Nuevo Spot</h1>
          <p className="mt-2 text-zinc-400">Completa la información de tu espacio</p>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del espacio</Label>
                <Input
                  id="name"
                  placeholder="Ej: Cajón techado"
                  className="mt-2 bg-black"
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe las características de tu espacio..."
                  className="mt-2 bg-black"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  placeholder="Calle, número, colonia..."
                  className="mt-2 bg-black"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Solo se mostrará la zona aproximada hasta que se confirme el pago
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>Precio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Precio por hora (MXN)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="600"
                  className="mt-2 bg-black"
                  min="400"
                  max="900"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Rango recomendado: $400 - $900 MXN
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>Características</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  'Techado',
                  'Vigilancia',
                  'Cámaras',
                  'Iluminado',
                  'Portón eléctrico',
                  'Cabe SUV',
                ].map((feature) => (
                  <label key={feature} className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded" />
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>Fotos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 bg-black">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-zinc-500" />
                  <p className="mt-2 text-sm text-zinc-500">
                    Click para subir fotos (máx. 4)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/host/spots">Cancelar</Link>
            </Button>
            <Button className="flex-1">Publicar Spot</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
