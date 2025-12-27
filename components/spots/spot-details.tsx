import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MapPin, Star } from 'lucide-react'

interface SpotDetailsProps {
  name: string
  zone: string
  rating?: number
  reviews?: number
  features: string[]
  description: string
}

export function SpotDetails({
  name,
  zone,
  rating = 0,
  reviews = 0,
  features,
  description,
}: SpotDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">{name}</h1>
        <div className="mt-2 flex items-center gap-4 text-sm text-zinc-400">
          <div className="flex items-center">
            <MapPin className="mr-1 h-4 w-4" />
            {zone}
          </div>
          {rating > 0 && (
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
              {rating} ({reviews} reseñas)
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-zinc-800" />

      <div>
        <h3 className="mb-3 font-semibold text-white">Características</h3>
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <Badge key={feature} variant="secondary">
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-800" />

      <div>
        <h3 className="mb-3 font-semibold text-white">Descripción</h3>
        <p className="text-zinc-400">{description}</p>
      </div>
    </div>
  )
}
