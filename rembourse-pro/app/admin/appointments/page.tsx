'use client'

import { useState } from 'react'
import { t } from '@/lib/translations'
import { InterventionTable } from '@/components/intervention-table'
import { DEMO_INTERVENTIONS } from '@/lib/demo-data'
import { useToast } from '@/lib/toast-context'
import { Calendar, Plus, MapPin, User, FileText } from 'lucide-react'

export default function AdminAppointmentsPage() {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    technicianName: 'Mohamed Ben Ali',
    type: 'PLP Façade',
    title: '',
    date: '2026-08-07',
    startTime: '08:00',
    endTime: '10:00',
    location: '',
    description: '',
  })

  const [appointments, setAppointments] = useState(DEMO_INTERVENTIONS)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.location) {
      showToast('Veuillez remplir les champs obligatoires (Titre & Adresse)', 'warning')
      return
    }

    const newRef = Math.floor(10000000 + Math.random() * 90000000).toString()
    const newAppointment = {
      reference: newRef,
      type: formData.type,
      status: 'Planifié',
      technicianName: formData.technicianName,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      time: `${formData.startTime} - ${formData.endTime}`,
      address: formData.location,
      location: formData.location,
      result: 'Planifié',
      description: formData.description || formData.title,
    }

    setAppointments([newAppointment, ...appointments])
    showToast(`Intervention #${newRef} planifiée avec succès !`, 'success')

    setFormData({
      technicianName: 'Mohamed Ben Ali',
      type: 'PLP Façade',
      title: '',
      date: '2026-08-07',
      startTime: '08:00',
      endTime: '10:00',
      location: '',
      description: '',
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t('admin.appointments.title')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Planification et affectation des ordres d&apos;interventions réseau aux techniciens TARCOM
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <Plus className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">{t('admin.appointments.create')}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">
                Technicien Affecté
              </label>
              <select
                value={formData.technicianName}
                onChange={(e) => setFormData({ ...formData, technicianName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Mohamed Ben Ali">Mohamed Ben Ali (PLP Façade)</option>
                <option value="Youssef Mansouri">Youssef Mansouri (Fibre Optique)</option>
                <option value="Karim Said">Karim Said (Maintenance)</option>
                <option value="Thomas Dubois">Thomas Dubois (Audit Technique)</option>
                <option value="Sarah Martin">Sarah Martin (Dépannage)</option>
              </select>
              <p className="mt-1 text-[11px] text-muted-foreground">Sélectionnez le technicien qualifié.</p>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Type d&apos;Intervention
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="PLP Façade">PLP Façade</option>
                <option value="Fibre Optique">Fibre Optique</option>
                <option value="Maintenance Raccordement">Maintenance Raccordement</option>
                <option value="Dépannage Urgence">Dépannage Urgence</option>
                <option value="Audit Technique">Audit Technique</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Titre de l&apos;Ordre de Mission
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Exemple: Pose & raccordement Façade 15 Rue Exemple"
                className="w-full px-3.5 py-2.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">Intitulé clair pour la feuille de route du technicien.</p>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Date d&apos;Intervention
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Début
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Fin Prévue
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Adresse Complète
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Exemple: 15 Rue Exemple, 75001 Paris"
                className="w-full px-3.5 py-2.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">Adresse d&apos;intervention avec code d&apos;accès si applicable.</p>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Notes & Consignes
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Exemple: Boîtier optique 3ème étage droite. Contacter M. Martin au 06 12 34 56 78."
                className="w-full px-3.5 py-2.5 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-sm"
            >
              Planifier l&apos;Intervention
            </button>
          </form>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Planning & Ordres de Mission
            </h2>
            <span className="text-xs text-muted-foreground font-mono">{appointments.length} planifié(s)</span>
          </div>

          <InterventionTable data={appointments} />
        </div>
      </div>
    </div>
  )
}
