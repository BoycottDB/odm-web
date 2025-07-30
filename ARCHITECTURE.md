# Architecture du Projet

## 📁 Structure des dossiers

```
src/
├── app/                    # App Router Next.js 15
│   ├── api/               # Routes API
│   │   ├── marques/       # CRUD marques
│   │   └── evenements/    # CRUD événements
│   ├── about/             # Page À propos
│   ├── moderation/        # Page Modération
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base
│   ├── search/           # Composants de recherche
│   ├── events/           # Composants d'événements
│   └── index.ts          # Export centralisé
├── hooks/                # Hooks personnalisés
│   ├── useSearch.ts      # Logique de recherche
│   └── useSuggestions.ts # Logique de suggestions
├── lib/                  # Utilitaires et services
│   ├── services/         # Services API
│   ├── utils/            # Utilitaires
│   ├── validation/       # Schémas de validation

└── types/                # Types TypeScript
    └── index.ts          # Types centralisés
```

## 🏗️ Patterns et Principes

### **1. Séparation des responsabilités**
- **Composants UI** : Affichage uniquement
- **Hooks** : Logique métier réutilisable
- **Services** : Communication avec les APIs
- **Types** : Définitions centralisées

### **2. Composition over Inheritance**
- Composants modulaires et réutilisables
- Props interfaces bien définies
- Hooks composables

### **3. Type Safety**
- TypeScript strict
- Interfaces pour tous les objets
- Validation des données API

### **4. Performance**
- Memoization avec `useCallback`
- Lazy loading des composants
- Optimisation des requêtes

## 🔄 Flux de données

### **Recherche d'événements**
1. `SearchBar` → `handleSearchChange`
2. `useSearch` → `performSearch`
3. `apiService` → `GET /api/evenements`
4. `EventList` → Affichage des résultats

### **Suggestions**
1. `SearchBar` → `handleSearchChange`
2. `useSuggestions` → `updateSuggestions`
3. Filtrage local des marques
4. `SearchBar` → Affichage dropdown

## 🛡️ Validation et Sécurité

### **API Routes**
- Validation des inputs avec schemas
- Gestion d'erreurs centralisée
- Logging des erreurs
- Status codes appropriés

### **Frontend**
- Sanitisation des données
- Validation côté client
- Gestion des états d'erreur

## 📊 Base de données

### **Modèles Supabase**
```sql
model Marque {
  id         Int         @id @default(autoincrement())
  nom        String      @unique
  evenements Evenement[]
}

model Evenement {
  id          Int      @id @default(autoincrement())
  marque      Marque   @relation(fields: [marqueId], references: [id])
  marqueId    Int
  description String
  date        DateTime
  categorie   String
  source      String
}
```

## 🎨 Design System

### **Type Scale Material Design**
- H1: `text-6xl/7xl font-light` (96px)
- H2: `text-3xl font-light` (48px)
- H3: `text-2xl font-medium` (24px)
- Body 1: `text-lg font-light` (18px)
- Body 2: `text-base font-medium` (16px)

### **Palette de couleurs**
- Primaire: Orange (orange-500 à orange-600)
- Secondaire: Amber (amber-500 à amber-600)
- Accent: Yellow (yellow-50 pour backgrounds)

### **Composants UI**
- `LoadingSpinner` : Indicateur de chargement
- `Badge` : Labels colorés
- `EventCard` : Carte d'événement
- `SearchBar` : Barre de recherche avec suggestions

## 🚀 Scripts disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run type-check       # Vérification TypeScript

# Production
npm run build           # Build de production
npm run start           # Serveur de production

# Base de données

npm run db:push         # Pousser le schéma
npm run db:seed         # Seeder la base
npm run db:reset        # Reset complet


# Qualité du code
npm run lint            # Linter
npm run lint:fix        # Fix automatique
npm run clean           # Nettoyer .next
```

## 📈 Optimisations futures

### **Performance**
- [ ] React Query pour le cache
- [ ] Virtualisation des listes longues
- [ ] Service Worker pour le cache offline
- [ ] Image optimization

### **Fonctionnalités**
- [ ] Recherche full-text avec Algolia
- [ ] Système de votes/ratings
- [ ] Notifications push
- [ ] Export des données

### **Scalabilité**
- [ ] Migration vers PostgreSQL
- [ ] Microservices architecture
- [ ] CDN pour les assets
- [ ] Monitoring et analytics

## 🔧 Configuration

### **Environment Variables**
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### **TypeScript Config**
- Strict mode activé
- Path mapping configuré
- Import optimization

Cette architecture garantit la maintenabilité, la scalabilité et les performances du projet.
