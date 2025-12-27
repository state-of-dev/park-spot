import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import { MapPin, Calendar, DollarSign, Car } from 'lucide-react'

const MOCK_SPOTS = [
  {
    id: '1',
    name: 'Estacionamiento Techado - Foro Sol',
    zone: 'A 300m del Foro Sol',
    price: 600,
    features: ['Techado', 'Seguro', 'Cabe SUV'],
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'Cajón en Cochera - Azteca',
    zone: 'A 500m del Estadio Azteca',
    price: 500,
    features: ['Techado', 'Vigilancia'],
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    name: 'Espacio Amplio - Arena CDMX',
    zone: 'A 200m de Arena CDMX',
    price: 750,
    features: ['Camionetas', 'Seguro', '24/7'],
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&h=300&fit=crop',
  },
]

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">Buscar Estacionamiento</h1>
          <p className="mt-2 text-zinc-400">Encuentra tu lugar perfecto para el evento</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-zinc-800 bg-zinc-950">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  <MapPin className="mr-2 inline h-4 w-4" />
                  Venue
                </label>
                <Input
                  placeholder="Ej: Foro Sol, Azteca..."
                  className="bg-black"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  <Calendar className="mr-2 inline h-4 w-4" />
                  Fecha
                </label>
                <Input
                  type="date"
                  className="bg-black"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  <DollarSign className="mr-2 inline h-4 w-4" />
                  Precio máximo
                </label>
                <Input
                  type="number"
                  placeholder="900"
                  className="bg-black"
                />
              </div>
            </div>
            <Button className="mt-4 w-full md:w-auto">
              Buscar
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          <div className="mb-4 text-sm text-zinc-400">
            {MOCK_SPOTS.length} espacios disponibles
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_SPOTS.map((spot) => (
              <Link key={spot.id} href={`/spot/${spot.id}`}>
                <Card className="overflow-hidden border-zinc-800 bg-zinc-950 transition-colors hover:border-zinc-700">
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${spot.image})` }}
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white">{spot.name}</h3>
                    <div className="mt-1 flex items-center text-sm text-zinc-400">
                      <MapPin className="mr-1 h-3 w-3" />
                      {spot.zone}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {spot.features.map((feature) => (
                        <Badge key={feature} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-semibold text-white">
                        ${spot.price}
                        <span className="text-sm text-zinc-400">/hora</span>
                      </span>
                      <Button size="sm">Ver Detalles</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
