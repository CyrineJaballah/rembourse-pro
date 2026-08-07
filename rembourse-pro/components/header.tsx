'use client'

import { Bell, LogOut, Menu, Settings, User } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <span className="text-sm font-bold text-primary-foreground">RP</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Application Tarcom</h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="relative rounded-full p-2 hover:bg-secondary transition-colors">
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </button>

          <div className="relative group">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 transition-all">
              <User className="h-5 w-5 text-primary" />
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="p-4 border-b border-border">
                <p className="text-sm font-medium text-foreground">Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">sarah@company.com</p>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded transition-colors">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-secondary rounded transition-colors">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
