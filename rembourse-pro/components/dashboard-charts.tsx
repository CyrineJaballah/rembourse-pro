'use client'

import React, { useState } from 'react'
import { DEMO_CHARTS } from '@/lib/demo-data'
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Users, Layers } from 'lucide-react'

export function DashboardCharts() {
  const [activeTab, setActiveTab] = useState<'daily' | 'tech' | 'distribution'>('daily')

  const maxDaily = Math.max(...DEMO_CHARTS.dailyInterventions.map((d) => d.ok + d.nok + d.pending))
  const maxTech = Math.max(...DEMO_CHARTS.technicianPerformance.map((t) => t.interventions))

  return (
    <div className="space-y-6">
      {/* Charts Container */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        {/* Header Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Statistiques & Analytics de Performance
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Suivi en temps réel des interventions et techniciens TARCOM</p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-secondary rounded-xl border border-border">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'daily' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Quotidien
            </button>
            <button
              onClick={() => setActiveTab('tech')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'tech' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Techniciens
            </button>
            <button
              onClick={() => setActiveTab('distribution')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'distribution' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Distribution
            </button>
          </div>
        </div>

        {/* Tab 1: Daily Interventions Bar Chart */}
        {activeTab === 'daily' && (
          <div className="space-y-4">
            <div className="flex items-center justify-end gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" /> OK
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-500" /> En cours
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-red-500" /> NOK
              </div>
            </div>

            <div className="h-64 flex items-end gap-3 pt-6 pb-2 border-b border-border px-2">
              {DEMO_CHARTS.dailyInterventions.map((item) => {
                const total = item.ok + item.nok + item.pending
                const heightPct = Math.round((total / maxDaily) * 100)
                const okPct = Math.round((item.ok / total) * 100)
                const pendingPct = Math.round((item.pending / total) * 100)
                const nokPct = 100 - okPct - pendingPct

                return (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {total}
                    </div>

                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[48px] rounded-t-xl overflow-hidden flex flex-col justify-end transition-all duration-300 group-hover:brightness-110 shadow-sm"
                    >
                      <div style={{ height: `${nokPct}%` }} className="bg-red-500 w-full" title={`NOK: ${item.nok}`} />
                      <div style={{ height: `${pendingPct}%` }} className="bg-amber-500 w-full" title={`Pending: ${item.pending}`} />
                      <div style={{ height: `${okPct}%` }} className="bg-emerald-500 w-full" title={`OK: ${item.ok}`} />
                    </div>

                    <span className="text-[11px] font-medium text-muted-foreground truncate w-full text-center">
                      {item.day}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Technicians Performance Chart */}
        {activeTab === 'tech' && (
          <div className="space-y-4">
            {DEMO_CHARTS.technicianPerformance.map((tech) => {
              const widthPct = Math.round((tech.interventions / maxTech) * 100)

              return (
                <div key={tech.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-foreground flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-primary" /> {tech.name}
                    </span>
                    <span className="text-muted-foreground">
                      {tech.interventions} interventions · <span className="text-emerald-500 font-bold">{tech.successRate}% OK</span>
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className="bg-gradient-to-r from-primary to-emerald-500 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Tab 3: Distribution Cards & Progress */}
        {activeTab === 'distribution' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* OK/NOK Distribution */}
            <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <PieChartIcon className="w-4 h-4 text-primary" /> Distribution OK / NOK
              </h4>
              {DEMO_CHARTS.statusDistribution.map((st) => {
                const total = 1245
                const pct = Math.round((st.value / total) * 100)

                return (
                  <div key={st.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{st.name}</span>
                      <span className="font-bold" style={{ color: st.color }}>
                        {st.value.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-card rounded-full h-2 overflow-hidden border border-border/50">
                      <div style={{ width: `${pct}%`, backgroundColor: st.color }} className="h-full rounded-full" />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Intervention Types Distribution */}
            <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-primary" /> Types d&apos;interventions
              </h4>
              {DEMO_CHARTS.typeDistribution.map((t) => (
                <div key={t.type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{t.type}</span>
                    <span className="font-bold text-primary">
                      {t.count} ({t.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-card rounded-full h-2 overflow-hidden border border-border/50">
                    <div style={{ width: `${t.percentage}%` }} className="bg-primary h-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
