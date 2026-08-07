'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { t } from '@/lib/translations'
import {
  FileText,
  Calendar,
  DollarSign,
  LogOut,
  Home,
  Menu,
  X,
  UserCheck,
  ShieldCheck,
  Activity,
} from 'lucide-react'

export default function TechnicianSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [techStatus, setTechStatus] = useState<'Disponible' | 'En intervention' | 'Hors ligne'>('Disponible')

  const navItems = [
    {
      href: '/technician',
      icon: Home,
      label: t('nav.dashboard'),
    },
    {
      href: '/technician/expenses',
      icon: FileText,
      label: t('nav.expenses'),
    },
    {
      href: '/technician/calendar',
      icon: Calendar,
      label: t('nav.calendar'),
    },
    {
      href: '/technician/advance-request',
      icon: DollarSign,
      label: t('nav.advance-request'),
    },
  ]

  const isActive = (href: string) => {
    if (href === '/technician') {
      return pathname === '/technician'
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)

    try {
      await authClient.signOut()
      setMobileMenuOpen(false)
      window.location.href = '/sign-in'
    } catch (error) {
      console.error('Logout failed:', error)
      setIsLoggingOut(false)
    }
  }

  const statusColors = {
    'Disponible': 'bg-emerald-500 text-white',
    'En intervention': 'bg-amber-500 text-white',
    'Hors ligne': 'bg-slate-500 text-white',
  }

  return (
    <>
      {/* DESKTOP SIDEBAR - FIXED PERMANENTLY ON LEFT */}
      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-40
          hidden
          w-64
          flex-col
          border-r
          border-border
          bg-card
          shadow-sm
          md:flex
        "
      >
        {/* Brand Header */}
        <div className="shrink-0 border-b border-border p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-md shadow-primary/20">
              T
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground leading-tight">
                TARCOM PRO
              </h1>
              <p className="text-xs font-medium text-primary flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Espace Technicien
              </p>
            </div>
          </div>
        </div>

        {/* Technician Quick Profile & Status Switcher */}
        <div className="px-4 py-3 border-b border-border/60 bg-secondary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20">
                MB
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-foreground truncate">Mohamed Ben Ali</p>
                <p className="text-[10px] text-muted-foreground font-mono">ID: 23517560</p>
              </div>
            </div>

            <button
              onClick={() => {
                const nextStatus = techStatus === 'Disponible' ? 'En intervention' : techStatus === 'En intervention' ? 'Hors ligne' : 'Disponible'
                setTechStatus(nextStatus)
              }}
              title="Changer de statut"
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-all ${statusColors[techStatus]}`}
            >
              {techStatus}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5" aria-label="Navigation principale">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Menu principal
          </p>

          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`
                  flex
                  min-h-[44px]
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3.5
                  py-2.5
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  ${
                    active
                      ? 'bg-primary/15 text-primary font-semibold border-l-4 border-primary shadow-sm'
                      : 'text-foreground/80 hover:bg-secondary hover:text-foreground'
                  }
                `}
              >
                <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer Logout */}
        <div className="shrink-0 border-t border-border p-4 space-y-2">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="
              flex
              min-h-[42px]
              w-full
              items-center
              gap-3
              rounded-xl
              px-3.5
              py-2.5
              text-sm
              font-medium
              text-muted-foreground
              transition-colors
              hover:bg-destructive/10
              hover:text-destructive
              disabled:opacity-50
            "
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>{isLoggingOut ? 'Déconnexion...' : t('nav.logout')}</span>
          </button>
          <div className="px-3 pt-1 text-[11px] text-muted-foreground flex justify-between">
            <span>RemboursePro v2.4</span>
            <span className="text-emerald-500 font-medium">En ligne</span>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER WITH LEFT HAMBURGER */}
      <header
        className="
          sticky
          top-0
          z-40
          flex
          h-16
          w-full
          items-center
          justify-between
          border-b
          border-border
          bg-card/95
          px-4
          backdrop-blur
          md:hidden
        "
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              border
              border-border
              bg-secondary/50
              text-foreground
              hover:bg-secondary
            "
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-primary">TARCOM PRO</h1>
            <p className="text-xs text-muted-foreground">Technicien · Mohamed Ben Ali</p>
          </div>
        </div>

        <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${statusColors[techStatus]}`}>
          {techStatus}
        </span>
      </header>

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Fermer le menu"
          onClick={() => setMobileMenuOpen(false)}
          onKeyDown={(e) => e.key === 'Enter' && setMobileMenuOpen(false)}
          className="
            fixed
            inset-0
            z-50
            bg-black/60
            backdrop-blur-sm
            transition-opacity
            md:hidden
          "
        />
      )}

      {/* MOBILE DRAWER - SLIDES PERMANENTLY FROM LEFT */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-[60]
          flex
          w-[min(85vw,300px)]
          flex-col
          border-r
          border-border
          bg-card
          shadow-2xl
          transition-transform
          duration-300
          ease-in-out
          md:hidden
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Menu mobile"
      >
        {/* Drawer Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
              T
            </div>
            <div>
              <h2 className="font-bold text-foreground text-sm">TARCOM PRO</h2>
              <p className="text-xs text-primary font-medium">Technicien</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Fermer le menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-secondary"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Drawer Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex
                  min-h-[46px]
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition-colors
                  ${
                    active
                      ? 'bg-primary/15 text-primary font-semibold border-l-4 border-primary'
                      : 'text-foreground hover:bg-secondary'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Drawer Footer Logout */}
        <div className="shrink-0 border-t border-border p-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="
              flex
              min-h-[46px]
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              font-medium
              text-destructive
              hover:bg-destructive/10
            "
          >
            <LogOut className="h-5 w-5" />
            <span>{isLoggingOut ? 'Déconnexion...' : t('nav.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  )
}
