export const fr = {
  // Navigation
  'nav.dashboard': 'Tableau de bord',
  'nav.expenses': 'Soumettre une dépense',
  'nav.calendar': 'Planning',
  'nav.advance-request': 'Demande d\'acompte',
  'nav.history': 'Historique',
  'nav.admin': 'Admin',
  'nav.manage-expenses': 'Gérer les dépenses',
  'nav.manage-appointments': 'Gérer les RDVs',
  'nav.manage-advances': 'Gérer les acomptes',
  'nav.manage-users': 'Gérer les utilisateurs',
  'nav.settings': 'Paramètres',
  'nav.logout': 'Déconnexion',

  // Auth
  'auth.sign-in': 'Connexion',
  'auth.email': 'Email',
  'auth.password': 'Mot de passe',
  'auth.sign-up': 'Créer un compte',
  'auth.name': 'Nom complet',
  'auth.no-account': 'Pas de compte?',
  'auth.have-account': 'Vous avez un compte?',
  'auth.sign-in-button': 'Se connecter',
  'auth.sign-up-button': 'S\'inscrire',
  'auth.error': 'Erreur d\'authentification',

  // Technician Dashboard
  'tech.dashboard.title': 'Tableau de bord',
  'tech.dashboard.total-submitted': 'Total soumis',
  'tech.dashboard.pending': 'En attente',
  'tech.dashboard.approved': 'Approuvé',
  'tech.dashboard.rejected': 'Rejeté',
  'tech.dashboard.monthly-trend': 'Tendance mensuelle',
  'tech.dashboard.recent-expenses': 'Dépenses récentes',

  // Technician Expenses
  'tech.expenses.title': 'Soumettre une dépense',
  'tech.expenses.amount': 'Montant (€)',
  'tech.expenses.category': 'Catégorie',
  'tech.expenses.description': 'Description',
  'tech.expenses.upload-receipt': 'Ajouter un reçu',
  'tech.expenses.submit': 'Soumettre',
  'tech.expenses.list': 'Vos dépenses',
  'tech.expenses.status': 'Statut',
  'tech.expenses.date': 'Date',
  'tech.expenses.no-expenses': 'Aucune dépense soumise',

  // Technician Calendar
  'tech.calendar.title': 'Planning',
  'tech.calendar.today': 'Aujourd\'hui',
  'tech.calendar.appointments': 'Rendez-vous',
  'tech.calendar.no-appointments': 'Aucun rendez-vous pour ce jour',
  'tech.calendar.time': 'Heure',
  'tech.calendar.location': 'Lieu',
  'tech.calendar.description': 'Description',

  // Technician Advance Request
  'tech.advance.title': 'Demande d\'acompte',
  'tech.advance.amount': 'Montant demandé (€)',
  'tech.advance.reason': 'Raison',
  'tech.advance.submit': 'Demander',
  'tech.advance.available-after-15th': 'Les demandes d\'acomptes sont disponibles à partir du 15 de chaque mois',
  'tech.advance.already-requested': 'Vous avez déjà demandé un acompte ce mois-ci',
  'tech.advance.history': 'Historique de vos demandes',
  'tech.advance.status': 'Statut',
  'tech.advance.requested-at': 'Demandé le',
  'tech.advance.approved-at': 'Approuvé le',

  // Status badges
  'status.pending': 'En attente',
  'status.approved': 'Approuvé',
  'status.rejected': 'Rejeté',
  'status.scheduled': 'Planifié',
  'status.completed': 'Complété',

  // Admin
  'admin.dashboard.title': 'Tableau de bord administrateur',
  'admin.dashboard.total-expenses': 'Total des dépenses',
  'admin.dashboard.pending-expenses': 'Dépenses en attente',
  'admin.dashboard.pending-advances': 'Acomptes en attente',
  'admin.dashboard.total-technicians': 'Total de techniciens',

  // Admin Expenses
  'admin.expenses.title': 'Gérer les dépenses',
  'admin.expenses.technician': 'Technicien',
  'admin.expenses.amount': 'Montant',
  'admin.expenses.category': 'Catégorie',
  'admin.expenses.status': 'Statut',
  'admin.expenses.date': 'Date',
  'admin.expenses.approve': 'Approuver',
  'admin.expenses.reject': 'Rejeter',
  'admin.expenses.view-receipt': 'Voir le reçu',
  'admin.expenses.no-expenses': 'Aucune dépense',

  // Admin Appointments
  'admin.appointments.title': 'Gérer les rendez-vous',
  'admin.appointments.technician': 'Technicien',
  'admin.appointments.date': 'Date',
  'admin.appointments.time': 'Heure',
  'admin.appointments.location': 'Lieu',
  'admin.appointments.create': 'Créer un RDV',
  'admin.appointments.edit': 'Modifier',
  'admin.appointments.delete': 'Supprimer',
  'admin.appointments.title-label': 'Titre',
  'admin.appointments.start-time': 'Heure de début',
  'admin.appointments.end-time': 'Heure de fin',

  // Admin Advance Requests
  'admin.advances.title': 'Gérer les acomptes',
  'admin.advances.technician': 'Technicien',
  'admin.advances.amount': 'Montant',
  'admin.advances.reason': 'Raison',
  'admin.advances.requested-at': 'Demandé le',
  'admin.advances.approve': 'Approuver',
  'admin.advances.reject': 'Rejeter',
  'admin.advances.reason-label': 'Motif du rejet',
  'admin.advances.no-advances': 'Aucune demande d\'acompte',

  // Categories
  'category.travel': 'Déplacement',
  'category.accommodation': 'Hébergement',
  'category.meals': 'Repas',
  'category.equipment': 'Équipement',
  'category.tools': 'Outils',
  'category.other': 'Autre',

  // Common
  'common.submit': 'Soumettre',
  'common.cancel': 'Annuler',
  'common.save': 'Enregistrer',
  'common.delete': 'Supprimer',
  'common.edit': 'Modifier',
  'common.back': 'Retour',
  'common.loading': 'Chargement...',
  'common.error': 'Une erreur est survenue',
  'common.success': 'Succès',
  'common.no-data': 'Aucune donnée',
}

export type TranslationKey = keyof typeof fr

export function t(key: TranslationKey): string {
  return fr[key] || key
}
