'use client'

import { useState, useMemo } from 'react'
import { getAppointments, getAppointmentsByDate } from '@/app/actions/appointments'
import { t } from '@/lib/translations'
import useSWR from 'swr'
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react'

async function appointmentsFetcher() {
  return getAppointments()
}

export default function CalendarPage() {
  const { data: appointments = [], isLoading } = useSWR('/api/appointments', appointmentsFetcher, {
    revalidateOnFocus: false,
  })
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const appointmentsByDate = useMemo(() => {
    const map: { [key: string]: typeof appointments } = {}
    appointments.forEach((apt: any) => {
      const dateStr = apt.date
      if (!map[dateStr]) {
        map[dateStr] = []
      }
      map[dateStr].push(apt)
    })
    return map
  }, [appointments])

  const monthDays = Array.from({ length: daysInMonth(currentDate) }, (_, i) => i + 1)
  const firstDay = firstDayOfMonth(currentDate)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => null)

  const calendarDays = [...emptyDays, ...monthDays]

  const formatDateString = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const selectedDateApts = selectedDate ? (appointmentsByDate[selectedDate] || []) : []

  const formatTime = (time: string | null) => {
    if (!time) return 'N/A'
    return time.substring(0, 5)
  }

  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">{t('tech.calendar.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground capitalize">{monthName}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square"></div>
              }

              const dateStr = formatDateString(currentDate.getFullYear(), currentDate.getMonth(), day)
              const dayApts = appointmentsByDate[dateStr] || []
              const isSelected = selectedDate === dateStr
              const today = new Date()
              const isToday =
                day === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear()

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square rounded-lg border transition-colors flex flex-col items-center justify-start p-2 text-sm ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary'
                      : isToday
                      ? 'bg-primary/10 border-primary text-foreground'
                      : dayApts.length > 0
                      ? 'bg-blue-50 border-blue-200 text-foreground'
                      : 'bg-secondary border-border text-foreground hover:bg-secondary/80'
                  }`}
                >
                  <span className="font-medium">{day}</span>
                  {dayApts.length > 0 && (
                    <span className="text-xs mt-1">{dayApts.length} RDV</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Appointments for selected date */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">{t('tech.calendar.appointments')}</h2>

          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">{t('common.loading')}</p>
          ) : selectedDate ? (
            selectedDateApts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">{t('tech.calendar.no-appointments')}</p>
            ) : (
              <div className="space-y-4">
                {selectedDateApts.map((apt: any) => (
                  <div key={apt.id} className="border border-border rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-2">{apt.title}</h3>
                    {apt.startTime && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatTime(apt.startTime)}
                          {apt.endTime && ` - ${formatTime(apt.endTime)}`}
                        </span>
                      </div>
                    )}
                    {apt.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{apt.location}</span>
                      </div>
                    )}
                    {apt.description && (
                      <p className="text-sm text-foreground mt-2">{apt.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            <p className="text-muted-foreground text-center py-8">Sélectionnez une date pour voir les rendez-vous</p>
          )}
        </div>
      </div>
    </main>
  )
}
