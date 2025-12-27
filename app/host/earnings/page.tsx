import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/navbar'
import { DollarSign, TrendingUp, Calendar, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

const EARNINGS_DATA = {
  thisMonth: 12450,
  lastMonth: 10800,
  total: 45600,
  pending: 1800,
}

const TRANSACTIONS = [
  {
    id: '1',
    date: '15 Ene 2025',
    booking: 'Cajón Techado - Reserva #ABC123',
    amount: 3000,
    status: 'completed',
  },
  {
    id: '2',
    date: '20 Ene 2025',
    booking: 'Espacio Amplio - Reserva #DEF456',
    amount: 1800,
    status: 'pending',
  },
  {
    id: '3',
    date: '10 Ene 2025',
    booking: 'Cochera Segura - Reserva #GHI789',
    amount: 2000,
    status: 'completed',
  },
  {
    id: '4',
    date: '5 Ene 2025',
    booking: 'Cajón Techado - Reserva #JKL012',
    amount: 2400,
    status: 'completed',
  },
]

export default function EarningsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Ingresos</h1>
            <p className="mt-2 text-zinc-400">Resumen de tus ganancias</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <DollarSign className="h-8 w-8 text-primary" />
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="mt-4">
                <div className="text-2xl font-semibold text-white">
                  ${EARNINGS_DATA.thisMonth.toLocaleString()}
                </div>
                <div className="mt-1 text-sm text-zinc-400">Este mes</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Calendar className="h-8 w-8 text-zinc-600" />
              </div>
              <div className="mt-4">
                <div className="text-2xl font-semibold text-white">
                  ${EARNINGS_DATA.lastMonth.toLocaleString()}
                </div>
                <div className="mt-1 text-sm text-zinc-400">Mes anterior</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-4">
                <div className="text-2xl font-semibold text-white">
                  ${EARNINGS_DATA.total.toLocaleString()}
                </div>
                <div className="mt-1 text-sm text-zinc-400">Total acumulado</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mt-4">
                <div className="text-2xl font-semibold text-white">
                  ${EARNINGS_DATA.pending.toLocaleString()}
                </div>
                <div className="mt-1 text-sm text-zinc-400">Pendiente</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader>
            <CardTitle>Historial de Transacciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 text-left">
                    <th className="pb-3 text-sm font-medium text-zinc-400">Fecha</th>
                    <th className="pb-3 text-sm font-medium text-zinc-400">Reserva</th>
                    <th className="pb-3 text-sm font-medium text-zinc-400">Monto</th>
                    <th className="pb-3 text-sm font-medium text-zinc-400">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {TRANSACTIONS.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-zinc-800">
                      <td className="py-4 text-sm text-zinc-300">{transaction.date}</td>
                      <td className="py-4 text-sm text-zinc-300">{transaction.booking}</td>
                      <td className="py-4 text-sm font-semibold text-white">
                        ${transaction.amount.toLocaleString()}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs ${
                            transaction.status === 'completed'
                              ? 'bg-green-950/50 text-green-400'
                              : 'bg-yellow-950/50 text-yellow-400'
                          }`}
                        >
                          {transaction.status === 'completed' ? 'Completado' : 'Pendiente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="mt-6 border-blue-900/30 bg-blue-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <DollarSign className="mt-0.5 h-5 w-5 text-blue-400" />
              <div>
                <h3 className="font-medium text-blue-300">Información de Pagos</h3>
                <p className="mt-1 text-sm text-blue-200/80">
                  Los pagos se transfieren directamente a tu cuenta PayPal al completarse
                  cada reserva. Los fondos pueden tardar de 1 a 3 días hábiles en reflejarse.
                  PayPal cobra una comisión del 3.49% + $0.49 MXN por transacción.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
