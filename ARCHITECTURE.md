# Architecture du Projet

## 📁 Structure des dossiers

```
src/
├── app/                    # App Router Next.js 15
│   ├── api/               # Routes API RESTful
│   │   ├── marques/       # CRUD marques + stats
│   │   ├── evenements/    # CRUD événements
│   │   ├── propositions/  # Système de modération
│   │   ├── decisions/     # Décisions de modération
│   │   ├── dirigeants/    # Dirigeants controversés
│   │   ├── categories/    # Catégories d'événements
│   │   └── search-similaire/ # Détection de doublons
│   ├── about/             # Page À propos
│   ├── admin/             # Interface d'administration
│   │   ├── marques/       # Gestion des marques
│   │   ├── dirigeants/    # Gestion des dirigeants
│   │   ├── moderation/    # Interface de modération
│   │   └── login/         # Authentification admin
│   ├── faq/               # Page FAQ
│   ├── moderation/        # Page modération publique
│   ├── recherche/         # Page de recherche avancée
│   ├── signaler/          # Page de signalement
│   ├── marques/           # Listing des marques
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal responsive
│   ├── metadata.ts        # Métadonnées SEO
│   └── page.tsx           # Landing page
├── components/            # Composants réutilisables
│   ├── ui/               # Design System
│   │   ├── LoadingSpinner.tsx # Spinner avec variants
│   │   ├── Badge.tsx      # Badges avec couleurs dynamiques
│   │   ├── Captcha.tsx    # Composant Captcha sécurisé
│   │   ├── HoneypotField.tsx # Champ anti-bot
│   │   ├── AddToHomeScreenBanner.tsx # PWA prompts
│   │   ├── IOSInstallInstructions.tsx # Guide install iOS
│   │   └── JudicialCondemnationNotice.tsx # Avis légaux
│   ├── search/           # Système de recherche
│   │   └── SearchBar.tsx  # Barre avec auto-complétion
│   ├── events/           # Affichage des événements
│   │   ├── EventCard.tsx  # Carte d'événement enrichie
│   │   ├── EventList.tsx  # Liste avec gestion d'état
│   │   └── DirigeantCard.tsx # Carte dirigeant
│   ├── forms/            # Formulaires complexes
│   │   ├── SignalementForm.tsx # Formulaire de signalement
│   │   └── SimilarItems.tsx # Détection de doublons UI
│   ├── admin/            # Interface d'administration
│   │   ├── AdminNavigation.tsx # Navigation admin
│   │   ├── DirigentForm.tsx # Formulaire dirigeant
│   │   ├── PropositionDetail.tsx # Détail proposition
│   │   └── PropositionList.tsx # Liste propositions
│   └── index.ts          # Export centralisé
├── hooks/                # Hooks personnalisés
│   ├── useSearch.ts      # Recherche avec URL sync
│   ├── useSuggestions.ts # Auto-complétion intelligente
│   ├── useDecisions.ts   # Récupération des décisions
│   ├── useAddToHomeScreen.ts # PWA installation
│   └── useMobileDetection.ts # Détection mobile
├── lib/                  # Utilitaires et services
│   ├── services/         # Services métier
│   │   ├── api.ts        # Service API principal (singleton)
│   │   ├── marquesService.ts # Service marques legacy
│   │   └── moderation.ts # Service de modération
│   ├── auth/             # Authentification
│   │   └── admin.ts      # Auth admin avec tokens
│   ├── security/         # Sécurité
│   │   └── honeypot.ts   # Protection anti-spam
│   ├── theme/            # Design System
│   │   └── colors.ts     # Palette de couleurs
│   ├── utils/            # Utilitaires
│   │   ├── constants.ts  # Configuration centralisée
│   │   └── helpers.ts    # Fonctions utilitaires
│   ├── validation/       # Validation robuste
│   │   └── schemas.ts    # Schémas avec messages français
│   └── supabaseClient.ts # Configuration Supabase
├── middleware.ts         # Protection routes admin
└── types/                # Types TypeScript complets
    └── index.ts          # Types métier centralisés
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

### **Recherche Unifiée (Marques + Dirigeants)**
1. `SearchBar` → `handleSearchChange` avec debouncing
2. `useSearch` → `performSearch` (événements + dirigeants)
3. `apiService` → `GET /api/evenements` + `GET /api/dirigeants`
4. `EventList` → Affichage résultats mixtes avec état de chargement
5. Synchronisation avec URL pour partage/navigation

### **Auto-complétion Intelligente**
1. `SearchBar` → `handleInputChange` en temps réel
2. `useSuggestions` → `updateSuggestions` avec filtrage
3. Navigation clavier (↑↓ Enter Escape)
4. `SearchBar` → Dropdown avec highlighting
5. Sélection automatique et complétion

### **Système de Modération Collaborative**
1. `SignalementForm` → Validation + détection doublons
2. `apiService` → `POST /api/propositions` avec sécurité
3. Interface admin → `PropositionList` avec workflow
4. `moderation.ts` → Conversion propositions → événements
5. `GET /api/decisions` → Transparence des décisions

### **Détection de Doublons**
1. `SimilarItems` → Recherche similarité en temps réel
2. `apiService` → `GET /api/search-similaire` avec fuzzy matching
3. Affichage suggestions avec scores de similarité
4. Prévention création doublons automatique

## 🛡️ Validation et Sécurité

### **API Routes (Architecture RESTful)**
- **Validation robuste** : Schémas avec messages français personnalisés
- **Protection CORS** : Configuration sécurisée pour production
- **Gestion d'erreurs** : Codes HTTP appropriés + logging
- **Rate limiting** : Protection contre les abus
- **Authentification** : Middleware pour routes admin protégées

### **Frontend Multi-couches**
- **Sanitisation** : XSS prevention sur tous les inputs
- **Honeypot + Captcha** : Double protection anti-spam
- **Validation client** : UX optimisée avec feedback immédiat
- **HTTPS Only** : Force HTTPS en production
- **CSP Headers** : Content Security Policy strict

### **Base de Données (Supabase)**
- **Row Level Security** : Permissions granulaires par table
- **Requêtes optimisées** : Index sur colonnes de recherche
- **Relations normalisées** : Foreign keys avec CASCADE
- **Backup automatique** : Supabase managed backups

## 📊 Base de données

### **Modèles Supabase**
```sql
-- Structure Supabase actuelle

CREATE TABLE "Marque" (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Evenement" (
  id SERIAL PRIMARY KEY,
  "marqueId" INTEGER REFERENCES "Marque"(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  categorie VARCHAR(100) NOT NULL,
  source TEXT NOT NULL,
  "condamnationJudiciaire" BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Dirigeant" (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "DirigeantMarque" (
  id SERIAL PRIMARY KEY,
  "dirigeantId" INTEGER REFERENCES "Dirigeant"(id) ON DELETE CASCADE,
  "marqueId" INTEGER REFERENCES "Marque"(id) ON DELETE CASCADE,
  poste VARCHAR(255),
  "dateDebut" DATE,
  "dateFin" DATE,
  UNIQUE("dirigeantId", "marqueId")
);

CREATE TABLE "Proposition" (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL, -- 'marque' | 'evenement' | 'dirigeant'
  data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'en_attente', -- 'approuvee' | 'rejetee'
  "raisonRejet" TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Decision" (
  id SERIAL PRIMARY KEY,
  "propositionId" INTEGER REFERENCES "Proposition"(id) ON DELETE CASCADE,
  action VARCHAR(20) NOT NULL, -- 'approuvee' | 'rejetee'
  raison TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_marque_nom ON "Marque" USING gin(to_tsvector('french', nom));
CREATE INDEX idx_evenement_categorie ON "Evenement"(categorie);
CREATE INDEX idx_evenement_date ON "Evenement"(date DESC);
CREATE INDEX idx_proposition_status ON "Proposition"(status);
CREATE INDEX idx_dirigeant_nom ON "Dirigeant" USING gin(to_tsvector('french', nom || ' ' || COALESCE(prenom, '')));
```

## 🎨 Design System

### **Design System Complet**

#### **Typographie (Mobile-First)**
- **H1**: `text-4xl md:text-6xl font-light` (Display Large)
- **H2**: `text-2xl md:text-4xl font-light` (Display Medium)
- **H3**: `text-xl md:text-2xl font-medium` (Headline Large)
- **H4**: `text-lg md:text-xl font-medium` (Headline Medium)
- **Body Large**: `text-base md:text-lg font-light` (16-18px)
- **Body Medium**: `text-sm md:text-base font-medium` (14-16px)
- **Caption**: `text-xs font-medium` (Labels, metadata)

#### **Palette de Couleurs Étendue**
```css
:root {
  /* Palette principale */
  --primary-50: #fff7ed;   /* Backgrounds légers */
  --primary-500: #f97316;  /* Orange principal */
  --primary-600: #ea580c;  /* Orange hover */
  --primary-900: #9a3412;  /* Orange foncé */
  
  /* Palette secondaire */
  --secondary-50: #fffbeb; /* Amber léger */
  --secondary-500: #f59e0b; /* Amber principal */
  --secondary-600: #d97706; /* Amber hover */
  
  /* Couleurs sémantiques */
  --success: #10b981;     /* Vert validation */
  --warning: #f59e0b;     /* Orange alerte */
  --error: #ef4444;       /* Rouge erreur */
  --info: #3b82f6;        /* Bleu information */
}
```

#### **Système de Composants Avancé**
- **`LoadingSpinner`** : 3 tailles (sm/md/lg) avec animation fluide
- **`Badge`** : Couleurs dynamiques basées sur catégories + variants
- **`EventCard`** : Design responsive avec états hover/focus
- **`SearchBar`** : Auto-complétion + navigation clavier + états loading
- **`AddToHomeScreenBanner`** : PWA prompt adaptatif iOS/Android
- **`JudicialCondemnationNotice`** : Composant légal avec disclaimers
- **`Captcha`** : Intégration sécurisée anti-bot
- **`HoneypotField`** : Champ invisible anti-spam

#### **Responsive Breakpoints**
```css
/* Tailwind breakpoints personnalisés */
sm: 640px   /* Mobile large */
md: 768px   /* Tablette */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

#### **États Interactifs**
- **Hover** : Élévation subtile + changement couleur
- **Focus** : Ring orange avec offset pour accessibilité
- **Active** : Scale légère (scale-95) pour feedback tactile
- **Loading** : Skeleton screens + spinners contextuels
- **Error** : Bordures rouges + messages inline
- **Success** : Feedback vert + animations de validation

## 🚀 Scripts disponibles

```bash
# Développement
npm run dev              # Next.js dev avec Turbopack (ultra-rapide)
npm run type-check       # TypeScript strict checking
npm run lint             # ESLint avec règles personnalisées
npm run lint:fix         # Auto-fix des problèmes ESLint

# Production
npm run build           # Build optimisé pour production
npm run start           # Serveur production Next.js
npm run analyze         # Analyse de la taille du bundle

# Qualité et Maintenance
npm run clean           # Nettoie .next et node_modules/.cache

# Tests (à implémenter)
# npm run test           # Tests unitaires Jest
# npm run test:e2e       # Tests E2E Playwright
# npm run test:coverage  # Rapport de couverture
```

## 📈 Optimisations futures

### **Performance & UX**
- [ ] **React Query/SWR** : Cache intelligent + synchronisation
- [ ] **Virtualisation** : `@tanstack/react-virtual` pour listes longues
- [ ] **Service Worker** : Cache offline + background sync
- [ ] **Image Optimization** : Next.js Image + WebP + responsive
- [ ] **Code Splitting** : Dynamic imports par route
- [ ] **Preloading** : Link prefetching pour navigation instantanée
- [ ] **Bundle Analysis** : Optimisation des imports tiers
- [ ] **Web Vitals** : Monitoring CLS, FCP, LCP

### **Fonctionnalités Métier**
- [ ] **Recherche Avancée** : Full-text search Supabase + filtres
- [ ] **Système de Votes** : Validation communautaire des événements
- [ ] **Notifications** : Push notifications pour nouveaux événements
- [ ] **Export Data** : CSV/JSON des marques et événements
- [ ] **API Publique** : OpenAPI pour développeurs tiers
- [ ] **Historique** : Tracking des modifications avec audit log
- [ ] **Multi-langue** : i18n avec next-intl
- [ ] **Mode Sombre** : Theme switcher avec persistance

### **Infrastructure & DevOps**
- [ ] **Tests Complets** : Jest + Testing Library + Playwright E2E
- [ ] **CI/CD** : GitHub Actions avec preview deployments
- [ ] **Monitoring** : Sentry pour error tracking
- [ ] **Analytics** : Privacy-first avec Plausible/Umami
- [ ] **Performance** : Lighthouse CI + Core Web Vitals
- [ ] **Security** : OWASP scanning + dependency auditing
- [ ] **Scalabilité** : Edge computing + CDN global
- [ ] **Backup Strategy** : Base données + assets backup automatique

## 🔧 Configuration

### **Environment Variables**
```env
# Supabase Configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Admin Authentication
ADMIN_TOKEN="your-secure-admin-token"

# Next.js Configuration
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
NEXT_PUBLIC_APP_ENV="production"

# Security
ENCRYPTION_KEY="your-32-char-encryption-key"

# Optional: Analytics & Monitoring
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="your-domain.com"
SENTRY_DSN="your-sentry-dsn"
```

### **TypeScript Config**
- Strict mode activé
- Path mapping configuré
- Import optimization

Cette architecture garantit la maintenabilité, la scalabilité et les performances du projet.
