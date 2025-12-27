import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import { User, Mail, Phone, MapPin, Calendar, Settings, Star } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-white">Mi Perfil</h1>
          <Button variant="outline" asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="border-zinc-800 bg-zinc-950 lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Juan" />
                  <AvatarFallback>JP</AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-semibold text-white">Juan Pérez</h2>
                <p className="text-sm text-zinc-400">Miembro desde Enero 2025</p>
                <div className="mt-4 flex gap-2">
                  <Badge>Driver</Badge>
                  <Badge variant="secondary">Host</Badge>
                </div>

                <div className="mt-6 w-full space-y-3">
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <Mail className="h-4 w-4 text-zinc-500" />
                    juan@email.com
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <Phone className="h-4 w-4 text-zinc-500" />
                    +52 55 1234 5678
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <MapPin className="h-4 w-4 text-zinc-500" />
                    Ciudad de México
                  </div>
                </div>

                <Button className="mt-6 w-full" variant="outline">
                  Editar Perfil
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats & Activity */}
          <div className="space-y-6 lg:col-span-2">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-zinc-800 bg-zinc-950">
                <CardContent className="pt-6">
                  <div className="text-2xl font-semibold text-white">12</div>
                  <div className="text-sm text-zinc-400">Reservas totales</div>
                </CardContent>
              </Card>
              <Card className="border-zinc-800 bg-zinc-950">
                <CardContent className="pt-6">
                  <div className="text-2xl font-semibold text-white">3</div>
                  <div className="text-sm text-zinc-400">Spots publicados</div>
                </CardContent>
              </Card>
              <Card className="border-zinc-800 bg-zinc-950">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-2xl font-semibold text-white">
                    4.8
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  </div>
                  <div className="text-sm text-zinc-400">Calificación</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-zinc-800 bg-zinc-950">
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: 'booking',
                      title: 'Reserva confirmada',
                      description: 'Cajón Techado - Foro Sol',
                      date: '15 Ene 2025',
                    },
                    {
                      type: 'spot',
                      title: 'Nuevo spot publicado',
                      description: 'Espacio Amplio - Arena CDMX',
                      date: '10 Ene 2025',
                    },
                    {
                      type: 'payment',
                      title: 'Pago recibido',
                      description: '$1,800 MXN',
                      date: '8 Ene 2025',
                    },
                  ].map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 rounded-lg border border-zinc-800 p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{activity.title}</div>
                        <div className="text-sm text-zinc-400">{activity.description}</div>
                      </div>
                      <div className="text-sm text-zinc-500">{activity.date}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-zinc-800 bg-zinc-950">
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button variant="outline" asChild>
                    <Link href="/search">Buscar Estacionamiento</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/bookings">Ver Mis Reservas</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/host/spots/new">Publicar Spot</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/host">Dashboard Host</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
