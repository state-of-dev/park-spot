import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Phone, Key, FileText } from 'lucide-react'

interface SpotPrivateInfoProps {
  address: string
  phone: string
  instructions: string
  accessCode?: string
}

export function SpotPrivateInfo({
  address,
  phone,
  instructions,
  accessCode,
}: SpotPrivateInfoProps) {
  return (
    <div className="space-y-4">
      <Card className="border-zinc-800 bg-zinc-950">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium text-white">Dirección Exacta</h4>
                <p className="mt-1 text-sm text-zinc-300">{address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium text-white">Teléfono de Contacto</h4>
                <p className="mt-1 text-sm text-zinc-300">{phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium text-white">Instrucciones de Acceso</h4>
                <p className="mt-1 text-sm text-zinc-300">{instructions}</p>
              </div>
            </div>

            {accessCode && (
              <div className="flex items-start gap-3 rounded-lg bg-blue-950/20 p-3">
                <Key className="mt-0.5 h-5 w-5 text-blue-400" />
                <div>
                  <h4 className="font-medium text-blue-300">Código de Acceso</h4>
                  <p className="mt-1 font-mono text-lg text-blue-100">{accessCode}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-zinc-500">
        Esta información es privada y solo la ves porque completaste el pago
      </p>
    </div>
  )
}
