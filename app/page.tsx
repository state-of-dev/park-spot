import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import {
  ParkingSquare,
  Shield,
  DollarSign,
  MapPin,
  Calendar,
  Search,
  Home,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-gradient-to-b from-black to-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Estacionamiento seguro
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                para eventos masivos
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              Encuentra tu lugar perfecto cerca de Foro Sol, Estadio Azteca, Arena CDMX y más.
              O renta tu espacio y genera ingresos durante los eventos.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="text-base">
                <Link href="/search">
                  <Search className="mr-2 h-5 w-5" />
                  Buscar Estacionamiento
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="/host">
                  <Home className="mr-2 h-5 w-5" />
                  Rentar mi Espacio
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { label: 'Venues', value: '8+' },
              { label: 'Eventos/año', value: '500+' },
              { label: 'Hosts activos', value: '100+' },
              { label: 'Reservas', value: '1K+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-semibold text-white">{stat.value}</div>
                <div className="mt-1 text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-zinc-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              ¿Por qué elegir ParkSpot?
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              La manera más segura y confiable de estacionar en eventos
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: 'Pago Seguro',
                description: 'Todas las transacciones protegidas con PayPal. Tu dinero está seguro.',
              },
              {
                icon: MapPin,
                title: 'Ubicaciones Verificadas',
                description: 'Todos los espacios son verificados antes de publicarse.',
              },
              {
                icon: DollarSign,
                title: 'Precios Justos',
                description: 'Tarifas competitivas y transparentes. Sin sorpresas.',
              },
              {
                icon: Calendar,
                title: 'Reserva Anticipada',
                description: 'Asegura tu lugar antes del evento. Olvídate del estrés.',
              },
            ].map((feature) => (
              <Card key={feature.title} className="border-zinc-800 bg-zinc-950">
                <CardContent className="pt-6">
                  <feature.icon className="h-10 w-10 text-primary" />
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - Drivers */}
      <section className="border-b border-zinc-800 bg-zinc-950 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              ¿Cómo funciona para conductores?
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Encuentra tu estacionamiento en 3 simples pasos
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Busca tu evento',
                description: 'Selecciona la fecha y el venue del evento al que asistirás.',
              },
              {
                step: '2',
                title: 'Elige tu espacio',
                description: 'Compara precios, ubicaciones y características. Reserva el mejor para ti.',
              },
              {
                step: '3',
                title: 'Paga y disfruta',
                description: 'Pago seguro con PayPal. Recibe la dirección exacta y las instrucciones.',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-lg font-semibold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-zinc-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - Hosts */}
      <section className="border-b border-zinc-800 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              ¿Cómo funciona para hosts?
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Genera ingresos con tu espacio en 4 pasos
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {[
              {
                step: '1',
                title: 'Regístrate',
                description: 'Crea tu cuenta y elige tu plan de suscripción.',
              },
              {
                step: '2',
                title: 'Conecta PayPal',
                description: 'Vincula tu cuenta PayPal para recibir pagos automáticamente.',
              },
              {
                step: '3',
                title: 'Publica tu espacio',
                description: 'Agrega fotos, precio y disponibilidad de tu estacionamiento.',
              },
              {
                step: '4',
                title: 'Recibe reservas',
                description: 'Empieza a generar ingresos durante eventos cercanos.',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800 text-lg font-semibold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/host/pricing">
                Ver Planes de Suscripción
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Venues Section */}
      <section className="border-b border-zinc-800 bg-zinc-950 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Venues disponibles
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Estacionamiento cerca de los principales venues de CDMX
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              'Foro Sol',
              'Estadio Azteca',
              'Arena CDMX',
              'Palacio de los Deportes',
              'Auditorio Nacional',
              'Autódromo Hermanos Rodríguez',
              'Estadio Olímpico UNAM',
              'Teatro Metropolitan',
            ].map((venue) => (
              <Card key={venue} className="border-zinc-800 bg-black">
                <CardContent className="flex items-center gap-3 pt-6">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-white">{venue}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-zinc-800 bg-gradient-to-r from-blue-950/50 to-zinc-950 p-12 text-center">
            <ParkingSquare className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">
              ¿Listo para empezar?
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Únete a cientos de usuarios que ya confían en ParkSpot
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Registrarse Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/how-it-works">
                  Saber Más
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
