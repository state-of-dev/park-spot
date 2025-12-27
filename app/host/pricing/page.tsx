import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/navbar'
import { Check } from 'lucide-react'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 699,
    description: 'Perfecto para comenzar',
    features: [
      '1 slot de estacionamiento',
      '1 domicilio',
      'Horarios ilimitados',
      'Dashboard básico',
      'Soporte por email',
    ],
    recommended: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 1199,
    description: 'Para hosts activos',
    features: [
      'Slots ilimitados',
      '1 domicilio',
      'Todo lo de Starter',
      'Analíticas avanzadas',
      'Prioridad en búsquedas',
      'Soporte prioritario',
    ],
    recommended: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 2299,
    description: 'Para profesionales',
    features: [
      'Slots ilimitados',
      'Domicilios ilimitados',
      'Todo lo de Pro',
      'Múltiples ubicaciones',
      'Reportes detallados',
      'Soporte dedicado',
    ],
    recommended: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            Planes de Suscripción
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            Elige el plan perfecto para tus necesidades
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative border-zinc-800 bg-zinc-950 ${
                plan.recommended ? 'ring-2 ring-primary' : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-block rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
                    Recomendado
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-sm text-zinc-400">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-semibold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-zinc-400">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-full"
                  variant={plan.recommended ? 'default' : 'outline'}
                  size="lg"
                >
                  Elegir {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="p-8">
              <h2 className="mb-6 text-center text-2xl font-semibold text-white">
                Preguntas Frecuentes
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    q: '¿Puedo cancelar en cualquier momento?',
                    a: 'Sí, puedes cancelar tu suscripción en cualquier momento sin penalizaciones.',
                  },
                  {
                    q: '¿Qué pasa con la comisión por transacción?',
                    a: 'Los drivers pagan una comisión del 5% sobre el precio base. Tú recibes el 100% del precio que estableciste.',
                  },
                  {
                    q: '¿Cuándo recibo mis pagos?',
                    a: 'Los pagos se transfieren directamente a tu cuenta PayPal al completarse cada reserva.',
                  },
                  {
                    q: '¿Hay periodo de prueba?',
                    a: 'Ofrecemos 7 días de prueba gratuita en todos los planes para nuevos usuarios.',
                  },
                ].map((faq) => (
                  <div key={faq.q}>
                    <h3 className="mb-2 font-semibold text-white">{faq.q}</h3>
                    <p className="text-sm text-zinc-400">{faq.a}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-zinc-400">
            ¿Tienes dudas?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contáctanos
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
