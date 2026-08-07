'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { t } from '@/lib/translations'
import { BarChart3, FileText, Calendar, DollarSign, Users, LogOut, Home, Menu, X, ShieldAlert } from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const navItems = [
    { href: '/admin', icon: Home, label: 'Tableau de bord' },
    { href: '/admin/expenses', icon: FileText, label: t('nav.manage-expenses') },
    { href: '/admin/appointments', icon: Calendar, label: t('nav.manage-appointments') },
    { href: '/admin/advance-requests', icon: DollarSign, label: t('nav.manage-advances') },
    { href: '/admin/users', icon: Users, label: t('nav.manage-users') },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await authClient.signOut()
      router.push('/sign-in')
    } catch (err) {
      console.error(err)
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      {/* DESKTOP ADMIN SIDEBAR - FIXED LEFT */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden md:flex w-64 flex-col border-r border-border bg-card shadow-sm">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-md shadow-primary/20">
              A
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">TARCOM ADMIN</h1>
              <p className="text-xs font-medium text-amber-500 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Administration
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Gestion Globale
          </p>
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary/15 text-primary font-semibold border-l-4 border-primary shadow-sm'
                    : 'text-foreground/80 hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>{isLoggingOut ? 'Déconnexion...' : t('nav.logout')}</span>
          </button>
          <div className="px-3 text-[11px] text-muted-foreground flex justify-between">
            <span>RemboursePro Admin</span>
            <span className="text-emerald-500 font-medium">Connecté</span>
          </div>
        </div>
      </aside>

      {/* MOBILE ADMIN HEADER */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary/50 text-foreground hover:bg-secondary"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-primary">TARCOM ADMIN</h1>
            <p className="text-xs text-muted-foreground">Panneau Administrateur</p>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* MOBILE ADMIN DRAWER - SLIDES PERMANENTLY FROM LEFT */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex w-[min(85vw,300px)] flex-col border-r border-border bg-card shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
              A
            </div>
            <div>
              <h2 className="font-bold text-foreground text-sm">TARCOM ADMIN</h2>
              <p className="text-xs text-amber-500 font-medium">Administration</p>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-secondary">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary/15 text-primary font-semibold border-l-4 border-primary'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  )
}
