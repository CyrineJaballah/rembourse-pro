'use client'

import { useState } from 'react'
import { createUserAction } from '@/app/actions/users'
import { UserPlus, X, Check, Loader2 } from 'lucide-react'

export function CreateUserModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const result = await createUserAction(formData)

    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      setSuccess(result.message || 'Utilisateur créé avec succès !')
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(null)
      }, 1500)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 font-medium text-sm transition-all"
      >
        <UserPlus className="w-4 h-4" />
        Ajouter un Utilisateur
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-foreground mb-1">Créer un nouvel utilisateur</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Seuls les administrateurs peuvent ajouter des techniciens ou des admins.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nom complet</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Exemple: Mohamed Ben Ali"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">Entrez le nom complet du technicien ou admin.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Adresse Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Exemple: mohamed.benali@tarcom.fr"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">Adresse professionnelle servant à la connexion.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Mot de passe initial</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  placeholder="Exemple: Tech2026!"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">Au moins 8 caractères (ex: Tech2026!).</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Rôle</label>
                <select
                  name="role"
                  defaultValue="technician"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="technician">Technicien</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg text-xs">
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 text-green-600 rounded-lg text-xs font-medium">
                  <Check className="w-4 h-4" />
                  {success}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 text-sm font-medium"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Créer l'utilisateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
