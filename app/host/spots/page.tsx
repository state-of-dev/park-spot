import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import { Plus, MapPin, DollarSign, MoreVertical } from 'lucide-react'

const SPOTS = [
  {
    id: '1',
    name: 'Cajón Techado',
    address: 'Granjas México, Iztacalco',
    price: 600,
    status: 'active',
    bookings: 12,
  },
  {
    id: '2',
    name: 'Espacio Amplio',
    address: 'Granjas México, Iztacalco',
    price: 750,
    status: 'active',
    bookings: 8,
  },
  {
    id: '3',
    name: 'Cochera Segura',
    address: 'Granjas México, Iztacalco',
    price: 500,
    status: 'inactive',
    bookings: 0,
  },
]

export default function HostSpotsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Mis Spots</h1>
            <p className="mt-2 text-zinc-400">Gestiona tus espacios de estacionamiento</p>
          </div>
          <Button asChild>
            <Link href="/host/spots/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Spot
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SPOTS.map((spot) => (
            <Card key={spot.id} className="border-zinc-800 bg-zinc-950">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{spot.name}</h3>
                    <div className="mt-1 flex items-center text-sm text-zinc-400">
                      <MapPin className="mr-1 h-3 w-3" />
                      {spot.address}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center text-lg font-semibold text-white">
                    <DollarSign className="mr-1 h-5 w-5" />
                    {spot.price}
                    <span className="ml-1 text-sm font-normal text-zinc-400">/hora</span>
                  </div>
                  <Badge variant={spot.status === 'active' ? 'default' : 'secondary'}>
                    {spot.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>

                <div className="mb-4 rounded-lg bg-black p-3">
                  <div className="text-sm text-zinc-400">Reservas totales</div>
                  <div className="text-xl font-semibold text-white">{spot.bookings}</div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/host/spots/${spot.id}`}>Editar</Link>
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link href={`/spot/${spot.id}`}>Ver</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
