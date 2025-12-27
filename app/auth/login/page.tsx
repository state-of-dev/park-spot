import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ParkingSquare } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950">
        <CardHeader className="space-y-1 text-center">
          <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
            <ParkingSquare className="h-8 w-8 text-primary" />
            <span className="text-2xl font-semibold text-white">ParkSpot</span>
          </Link>
          <CardTitle className="text-2xl text-white">Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              className="bg-black"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-black"
            />
          </div>
          <Button className="w-full" size="lg">
            Iniciar Sesión
          </Button>
          <div className="text-center text-sm text-zinc-400">
            ¿No tienes cuenta?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Regístrate
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
