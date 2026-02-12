'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ParkingSquare, Menu, X, User, Calendar, Building2, LogOut, LayoutDashboard, CalendarCheck } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { BookingNotifications } from '@/components/notifications/BookingNotifications'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { profile, loading, signOut, isAuthenticated } = useAuth()
  const userRole = profile?.role

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
            {!isAuthenticated && (
              <Link
                href="/host"
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Rentar mi Espacio
              </Link>
            )}
            <Link
              href="/how-it-works"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Cómo Funciona
            </Link>
          </div>

          {/* Desktop Auth Buttons or User Menu */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Registrarse</Link>
                </Button>
              </>
            ) : (
              <>
                <BookingNotifications />
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-2 transition-colors hover:bg-zinc-800">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {profile?.full_name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-white">{profile?.full_name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-zinc-800 bg-zinc-950">
                  <DropdownMenuLabel className="text-white">
                    Mi Cuenta
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex cursor-pointer items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>

                  {userRole === 'driver' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/driver" className="flex cursor-pointer items-center gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/bookings" className="flex cursor-pointer items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Mis Reservas</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {userRole === 'host' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/host" className="flex cursor-pointer items-center gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/host/bookings" className="flex cursor-pointer items-center gap-2">
                          <CalendarCheck className="h-4 w-4" />
                          <span>Mis Reservas</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/host/spots" className="flex cursor-pointer items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>Mis Anuncios</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="flex cursor-pointer items-center gap-2 text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </>
            )}
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
            {isAuthenticated && (
              <div className="mb-4 flex items-center gap-3 rounded-md bg-zinc-900 p-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {profile?.full_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">{profile?.full_name}</span>
                  <span className="text-xs text-zinc-400">
                    {userRole === 'driver' ? 'Driver' : 'Host'}
                  </span>
                </div>
              </div>
            )}

            <Link
              href="/search"
              className="block rounded-md px-3 py-2 text-base text-zinc-400 hover:bg-zinc-800 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Buscar Estacionamiento
            </Link>
            {!isAuthenticated && (
              <Link
                href="/host"
                className="block rounded-md px-3 py-2 text-base text-zinc-400 hover:bg-zinc-800 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Rentar mi Espacio
              </Link>
            )}
            <Link
              href="/how-it-works"
              className="block rounded-md px-3 py-2 text-base text-zinc-400 hover:bg-zinc-800 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cómo Funciona
            </Link>

            {isAuthenticated ? (
              <div className="space-y-1 pt-4">
                <Link
                  href="/profile"
                  className="block rounded-md px-3 py-2 text-base text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mi Perfil
                </Link>

                {userRole === 'driver' && (
                  <>
                    <Link
                      href="/driver"
                      className="block rounded-md px-3 py-2 text-base text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/bookings"
                      className="block rounded-md px-3 py-2 text-base text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mis Reservas
                    </Link>
                  </>
                )}

                {userRole === 'host' && (
                  <>
                    <Link
                      href="/host"
                      className="block rounded-md px-3 py-2 text-base text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/host/bookings"
                      className="block rounded-md px-3 py-2 text-base text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mis Reservas
                    </Link>
                    <Link
                      href="/host/spots"
                      className="block rounded-md px-3 py-2 text-base text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mis Anuncios
                    </Link>
                  </>
                )}

                <button
                  onClick={signOut}
                  className="w-full rounded-md px-3 py-2 text-left text-base text-red-400 hover:bg-zinc-800"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth/login">Iniciar Sesión</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/auth/signup">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
