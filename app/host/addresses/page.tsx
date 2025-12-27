import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import { Plus, MapPin, Home, Edit, Trash2 } from 'lucide-react'

const ADDRESSES = [
  {
    id: '1',
    name: 'Mi Casa Foro Sol',
    address: 'Calle Granjas México 123, Granjas México, Iztacalco',
    zone: 'A 300m del Foro Sol',
    spots: 2,
    isActive: true,
  },
  {
    id: '2',
    name: 'Departamento Arena CDMX',
    address: 'Av. de las Granjas 800, Santa Cruz Meyehualco',
    zone: 'A 400m de Arena CDMX',
    spots: 1,
    isActive: true,
  },
]

export default function AddressesPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Mis Domicilios</h1>
            <p className="mt-2 text-zinc-400">
              Gestiona las ubicaciones donde ofreces estacionamiento
            </p>
          </div>
          <Button asChild>
            <Link href="/host/addresses/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Domicilio
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {ADDRESSES.map((address) => (
            <Card key={address.id} className="border-zinc-800 bg-zinc-950">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <Home className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-white">
                        {address.name}
                      </h3>
                      {address.isActive && <Badge>Activo</Badge>}
                    </div>

                    <div className="ml-8 space-y-1 text-sm text-zinc-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {address.address}
                      </div>
                      <div className="text-xs text-zinc-500">{address.zone}</div>
                    </div>

                    <div className="ml-8 mt-3">
                      <span className="text-sm text-zinc-400">
                        {address.spots} {address.spots === 1 ? 'spot' : 'spots'} publicados
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 md:flex-col">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/host/addresses/${address.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {ADDRESSES.length === 0 && (
          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <Home className="mb-4 h-12 w-12 text-zinc-600" />
              <h3 className="mb-2 text-lg font-semibold text-white">
                No tienes domicilios registrados
              </h3>
              <p className="mb-6 text-sm text-zinc-400">
                Agrega tu primer domicilio para empezar a publicar spots
              </p>
              <Button asChild>
                <Link href="/host/addresses/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primer Domicilio
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
