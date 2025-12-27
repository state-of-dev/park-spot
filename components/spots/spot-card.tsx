import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, DollarSign } from 'lucide-react'

interface SpotCardProps {
  id: string
  name: string
  zone: string
  price: number
  features: string[]
  image: string
}

export function SpotCard({ id, name, zone, price, features, image }: SpotCardProps) {
  return (
    <Link href={`/spot/${id}`}>
      <Card className="overflow-hidden border-zinc-800 bg-zinc-950 transition-colors hover:border-zinc-700">
        <div
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <CardContent className="p-4">
          <h3 className="font-semibold text-white">{name}</h3>
          <div className="mt-1 flex items-center text-sm text-zinc-400">
            <MapPin className="mr-1 h-3 w-3" />
            {zone}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {features.map((feature) => (
              <Badge key={feature} variant="secondary">
                {feature}
              </Badge>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-2xl font-semibold text-white">
              ${price}
              <span className="text-sm text-zinc-400">/hora</span>
            </span>
            <Button size="sm">Ver Detalles</Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
