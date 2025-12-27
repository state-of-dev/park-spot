import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Navbar } from '@/components/layout/navbar'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/profile"
          className="mb-6 inline-flex items-center text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al perfil
        </Link>

        <h1 className="mb-8 text-3xl font-semibold text-white">Configuración</h1>

        <div className="space-y-6">
          {/* Personal Info */}
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Actualiza tus datos personales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    defaultValue="Juan"
                    className="mt-2 bg-black"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    defaultValue="Pérez"
                    className="mt-2 bg-black"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="juan@email.com"
                  className="mt-2 bg-black"
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  defaultValue="+52 55 1234 5678"
                  className="mt-2 bg-black"
                />
              </div>
              <Button>Guardar Cambios</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>Configura cómo quieres recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Email</div>
                  <div className="text-sm text-zinc-400">
                    Recibe confirmaciones y recordatorios por email
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <Separator className="bg-zinc-800" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">SMS</div>
                  <div className="text-sm text-zinc-400">
                    Recibe notificaciones importantes por SMS
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <Separator className="bg-zinc-800" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">WhatsApp</div>
                  <div className="text-sm text-zinc-400">
                    Recibe actualizaciones por WhatsApp
                  </div>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>
              <Button>Guardar Preferencias</Button>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>Actualiza tu contraseña</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  className="mt-2 bg-black"
                />
              </div>
              <div>
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  className="mt-2 bg-black"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="mt-2 bg-black"
                />
              </div>
              <Button>Cambiar Contraseña</Button>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
              <CardDescription>Gestiona tus métodos de pago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-zinc-800 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600">
                      <span className="text-sm font-semibold text-white">PP</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">PayPal</div>
                      <div className="text-sm text-zinc-400">juan@email.com</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Desconectar
                  </Button>
                </div>
              </div>
              <Button variant="outline">Agregar Método de Pago</Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-900/30 bg-red-950/20">
            <CardHeader>
              <CardTitle className="text-red-400">Zona de Peligro</CardTitle>
              <CardDescription>Acciones irreversibles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-red-300">Eliminar Cuenta</div>
                  <div className="text-sm text-red-200/60">
                    Esta acción no se puede deshacer
                  </div>
                </div>
                <Button variant="destructive">Eliminar Cuenta</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
