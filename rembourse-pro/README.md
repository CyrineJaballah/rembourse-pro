# RembourseApp - Système de Gestion de Remboursement Professionnel

Une application web complète pour gérer les demandes de remboursement et les acomptes pour les techniciens et administrateurs. Totalement en français.

## 🎯 Fonctionnalités

### Interface Technicien
- **Tableau de bord** : Visualisation des statistiques des dépenses (total, en attente, approuvées, rejetées)
- **Soumettre une dépense** : Formulaire pour ajouter une dépense avec catégorie, montant, description et reçu
- **Planning** : Calendrier interactif pour visualiser les rendez-vous (RDVs) programmés
- **Demande d'acompte** : Soumission d'une demande d'acompte (une par mois après le 15)
- **Historique** : Vue complète de toutes les dépenses soumises

### Interface Admin
- **Tableau de bord** : Statistiques globales (total dépenses, en attente, acomptes en attente, nombre de techniciens)
- **Gérer les dépenses** : Approuver ou rejeter les dépenses soumises
- **Gérer les RDVs** : Créer et gérer les rendez-vous des techniciens
- **Gérer les acomptes** : Approuver ou rejeter les demandes d'acompte
- **Gérer les utilisateurs** : Voir la liste des techniciens et administrateurs

## 🏗️ Stack Technique

- **Frontend** : Next.js 16 avec React 19, Tailwind CSS
- **Base de données** : Neon PostgreSQL
- **ORM** : Drizzle ORM
- **Authentification** : Better Auth (email + password)
- **API** : Server Actions Next.js
- **Localization** : Français complet

## 📋 Schéma de Base de Données

### Tables Principales

#### `user` - Utilisateurs (Better Auth)
```
id, email, emailVerified, name, image, role, createdAt, updatedAt
```

#### `expenses` - Dépenses
```
id, userId, amount, category, description, receiptUrl, status, createdAt, updatedAt
```

#### `appointments` - Rendez-vous/RDVs
```
id, userId, title, date, startTime, endTime, location, description, status, createdAt, updatedAt
```

#### `advance_requests` - Demandes d'acompte
```
id, userId, amount, status, requestedAt, approvedAt, approvedBy, reason, rejectionReason
```

#### `categories` - Catégories de dépenses
```
id, name, icon, description
```

Catégories par défaut :
- Déplacement
- Hébergement
- Repas
- Équipement
- Outils
- Autre

## 🚀 Démarrage Rapide

### Installation

```bash
# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
# Assurez-vous que DATABASE_URL et BETTER_AUTH_SECRET sont définis
```

### Variables d'Environnement

```env
# Database
DATABASE_URL=postgresql://...

# Authentication
BETTER_AUTH_SECRET=<votre-secret-32-caracteres>
BETTER_AUTH_URL=http://localhost:3000
```

### Démarrer le serveur de développement

```bash
pnpm dev
```

L'application sera disponible à `http://localhost:3000`

## 👥 Utilisateurs de Test

Vous pouvez créer des comptes directement via l'interface d'inscription.

### Rôles Disponibles

À la création d'un compte, l'utilisateur est défini comme **technicien** par défaut. Pour créer un administrateur, modifiez le rôle directement dans la base de données.

## 📱 Accès

### Technicien
```
URL: /technician
Navigation:
- Tableau de bord
- Soumettre une dépense
- Planning (Calendrier)
- Demande d'acompte
```

### Admin
```
URL: /admin
Navigation:
- Tableau de bord
- Gérer les dépenses
- Gérer les RDVs
- Gérer les acomptes
- Gérer les utilisateurs
```

## 🔐 Authentification

- **Méthode** : Email + Mot de passe
- **Stockage** : Sessions cryptées dans cookies
- **Protection** : Toutes les routes sont protégées par vérification de session
- **Redirection** : Les utilisateurs non authentifiés sont redirigés vers `/sign-in`

## 📊 Logique Métier

### Demande d'Acompte
- Une seule demande par mois
- Disponible uniquement à partir du 15 du mois
- Nécessite l'approbation de l'administrateur

### Statut des Dépenses
- **En attente** : En attente d'approbation admin
- **Approuvée** : Approuvée par l'admin
- **Rejetée** : Rejetée par l'admin

### Statut des RDVs
- **Planifié** : RDV programmé
- **Complété** : RDV terminé

## 🎨 Conception

- **Couleur primaire** : Bleu (#2563eb)
- **Mode clair/sombre** : Support complet
- **Responsive** : Mobile-first design
- **Police** : Inter (Google Fonts)

## 📂 Structure du Projet

```
app/
├── api/auth/[...all]/        # Endpoints d'authentification
├── sign-in/                   # Page de connexion
├── sign-up/                   # Page d'inscription
├── technician/
│   ├── page.tsx               # Dashboard technicien
│   ├── expenses/              # Soumettre dépense
│   ├── calendar/              # Planning/Calendrier
│   └── advance-request/       # Demande d'acompte
├── admin/
│   ├── page.tsx               # Dashboard admin
│   ├── expenses/              # Gérer dépenses
│   ├── appointments/          # Gérer RDVs
│   ├── advance-requests/      # Gérer acomptes
│   └── users/                 # Gérer utilisateurs
└── actions/                   # Server Actions

components/
├── technician-sidebar.tsx     # Navigation technicien
├── admin-sidebar.tsx          # Navigation admin
├── auth-form.tsx              # Formulaire d'auth
└── ...

lib/
├── auth.ts                    # Config Better Auth
├── auth-client.ts             # Client Better Auth
├── db/
│   ├── index.ts               # Client Drizzle
│   └── schema.ts              # Schéma DB
├── translations.ts            # Traductions FR
└── ...
```

## 🔧 Server Actions

Toutes les opérations de base de données utilisent les Server Actions Next.js localisées dans `app/actions/` :

- `expenses.ts` : Soumettre, lister, approuver/rejeter des dépenses
- `appointments.ts` : Gérer les rendez-vous
- `advance-requests.ts` : Gérer les demandes d'acompte

## 🛡️ Sécurité

- Toutes les requêtes sont scopées par `userId`
- Vérification du rôle pour les opérations admin
- Validation des entrées utilisateur
- Cookies sécurisés avec Better Auth
- Aucune donnée sensible en client-side

## 📝 Traductions

Toutes les interfaces sont en français. Les traductions sont centralisées dans `lib/translations.ts` pour faciliter la maintenance et les mises à jour futures.

## 📞 Support

Pour toute question ou problème, consulter la documentation de:
- [Next.js](https://nextjs.org/docs)
- [Better Auth](https://authjs.dev)
- [Drizzle ORM](https://orm.drizzle.team)
- [Neon](https://neon.tech/docs)

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2025  
**Langue** : Français
