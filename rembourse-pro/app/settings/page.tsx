'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Bell, Lock, User, Zap } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [emailDigest, setEmailDigest] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">Settings</h2>
            <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
          </div>

          <div className="max-w-2xl space-y-6">
            {/* Profile Section */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <User className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Profile</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Sarah Johnson"
                    className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="sarah@company.com"
                    className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Department</label>
                  <select className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all">
                    <option>Engineering</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                    <option>Operations</option>
                  </select>
                </div>
                <button className="rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <Bell className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Approval Notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified when your expenses are approved or rejected</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="h-5 w-5 rounded border-border cursor-pointer"
                  />
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Weekly Digest</p>
                      <p className="text-sm text-muted-foreground">Receive weekly summary of your reimbursements</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailDigest}
                      onChange={(e) => setEmailDigest(e.target.checked)}
                      className="h-5 w-5 rounded border-border cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <Lock className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Security</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full rounded-lg border border-border bg-card px-4 py-3 text-left font-medium text-foreground hover:bg-secondary transition-colors">
                  Change Password
                </button>
                <button className="w-full rounded-lg border border-border bg-card px-4 py-3 text-left font-medium text-foreground hover:bg-secondary transition-colors">
                  Two-Factor Authentication
                </button>
                <button className="w-full rounded-lg border border-border bg-card px-4 py-3 text-left font-medium text-foreground hover:bg-secondary transition-colors">
                  Active Sessions
                </button>
              </div>
            </div>

            {/* Billing Section */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <Zap className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Billing</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Plan</p>
                    <p className="text-sm text-muted-foreground">Professional Plan</p>
                  </div>
                  <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
