import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import {
  Search,
  CreditCard,
  MapPin,
  CheckCircle2,
  Home,
  Upload,
  DollarSign,
  Calendar,
  Shield,
  Clock,
  Users,
  TrendingUp,
} from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-zinc-800 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            ¿Cómo Funciona ParkSpot?
          </h1>
          <p className="mt-6 text-lg text-zinc-400">
            Conectamos conductores con propietarios de estacionamientos cerca de eventos.
            Simple, seguro y rentable para todos.
          </p>
        </div>
      </section>

      {/* For Drivers */}
      <section className="border-b border-zinc-800 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold text-white">Para Conductores</h2>
            <p className="mt-4 text-zinc-400">Encuentra tu lugar en 3 pasos</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-zinc-800 bg-zinc-950">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">1. Busca</h3>
                <p className="text-zinc-400">
                  Ingresa el venue y la fecha del evento. Ve todos los espacios disponibles
                  en el mapa con precios y características.
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-950">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">2. Reserva y Paga</h3>
                <p className="text-zinc-400">
                  Selecciona el horario que necesitas y paga de forma segura con PayPal.
                  Tu reserva queda confirmada al instante.
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-950">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">3. Llega y Disfruta</h3>
                <p className="text-zinc-400">
                  Después del pago recibes la dirección exacta, instrucciones de acceso y
                  contacto del host. ¡Listo para el evento!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Hosts */}
      <section className="border-b border-zinc-800 bg-zinc-950 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold text-white">Para Hosts</h2>
            <p className="mt-4 text-zinc-400">Genera ingresos en 4 pasos</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-zinc-800 bg-black">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">1. Regístrate</h3>
                <p className="text-sm text-zinc-400">
                  Crea tu cuenta y elige el plan que se ajuste a tus necesidades.
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-black">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">2. Conecta PayPal</h3>
                <p className="text-sm text-zinc-400">
                  Vincula tu cuenta para recibir pagos directamente y de forma automática.
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-black">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">3. Publica</h3>
                <p className="text-sm text-zinc-400">
                  Sube fotos, establece tu precio y configura disponibilidad.
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-black">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">4. Recibe Reservas</h3>
                <p className="text-sm text-zinc-400">
                  Empieza a ganar dinero durante eventos cercanos a tu ubicación.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-zinc-800 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold text-white">Beneficios de ParkSpot</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Shield,
                title: 'Pago Seguro',
                description: 'Todas las transacciones protegidas. PayPal garantiza tu dinero.',
              },
              {
                icon: Clock,
                title: 'Ahorra Tiempo',
                description: 'Reserva con anticipación. Olvídate de buscar lugar el día del evento.',
              },
              {
                icon: CheckCircle2,
                title: 'Verificado',
                description: 'Todos los espacios son verificados antes de ser publicados.',
              },
              {
                icon: Users,
                title: 'Comunidad Confiable',
                description: 'Sistema de reseñas para hosts y conductores.',
              },
              {
                icon: TrendingUp,
                title: 'Precios Justos',
                description: 'Transparencia total. Sin cargos ocultos ni sorpresas.',
              },
              {
                icon: MapPin,
                title: 'Cerca del Evento',
                description: 'Encuentra lugares a pocos minutos caminando del venue.',
              },
            ].map((benefit) => (
              <Card key={benefit.title} className="border-zinc-800 bg-zinc-950">
                <CardContent className="pt-6">
                  <benefit.icon className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="mb-2 font-semibold text-white">{benefit.title}</h3>
                  <p className="text-sm text-zinc-400">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-white">¿Listo para empezar?</h2>
          <p className="mt-4 text-lg text-zinc-400">
            Únete a ParkSpot hoy y descubre una nueva forma de estacionar en eventos
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Crear Cuenta</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/search">Buscar Estacionamiento</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
