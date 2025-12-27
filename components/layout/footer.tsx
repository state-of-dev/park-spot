import Link from 'next/link'
import { ParkingSquare } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <ParkingSquare className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold text-white">
                ParkSpot
              </span>
            </Link>
            <p className="mt-4 text-sm text-zinc-400">
              La plataforma de estacionamiento para eventos masivos en CDMX.
              Encuentra tu lugar o renta tu espacio de manera segura.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white">Producto</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/search" className="text-sm text-zinc-400 hover:text-white">
                  Buscar Estacionamiento
                </Link>
              </li>
              <li>
                <Link href="/host" className="text-sm text-zinc-400 hover:text-white">
                  Rentar mi Espacio
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-zinc-400 hover:text-white">
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-zinc-400 hover:text-white">
                  Precios
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white">Compañía</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className="text-sm text-zinc-400 hover:text-white">
                  Acerca de
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-zinc-400 hover:text-white">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-zinc-400 hover:text-white">
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-zinc-400 hover:text-white">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-zinc-800 pt-8">
          <p className="text-center text-sm text-zinc-500">
            © {new Date().getFullYear()} ParkSpot CDMX. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
