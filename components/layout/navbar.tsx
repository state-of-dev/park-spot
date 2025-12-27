'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ParkingSquare, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <ParkingSquare className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-white">
              ParkSpot
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Link
              href="/search"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Buscar Estacionamiento
            </Link>
            <Link
              href="/host"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Rentar mi Espacio
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Cómo Funciona
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Registrarse</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-800 bg-black md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="/search"
              className="block rounded-md px-3 py-2 text-base text-zinc-400 hover:bg-zinc-800 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Buscar Estacionamiento
            </Link>
            <Link
              href="/host"
              className="block rounded-md px-3 py-2 text-base text-zinc-400 hover:bg-zinc-800 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Rentar mi Espacio
            </Link>
            <Link
              href="/how-it-works"
              className="block rounded-md px-3 py-2 text-base text-zinc-400 hover:bg-zinc-800 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cómo Funciona
            </Link>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/auth/signup">Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
