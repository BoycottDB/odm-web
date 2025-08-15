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
│   │   ├── dirigeants/    # CRUD dirigeants V2 (centralisés)
│   │   ├── marque-dirigeant/ # API liaisons marque-dirigeant V2
│   │   ├── categories/    # Catégories d'événements
│   │   ├── secteurs-marque/ # CRUD secteurs BoycottTips
│   │   └── search-similaire/ # Détection de doublons
│   ├── about/             # Page À propos
│   ├── admin/             # Interface d'administration
│   │   ├── marques/       # Gestion des marques
│   │   ├── dirigeants/    # Gestion des dirigeants
│   │   ├── moderation/    # Interface de modération
│   │   ├── secteurs-marque/ # Gestion secteurs BoycottTips
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
│   │   ├── MarquesBadges.tsx # Badges marques avec navigation cliquable
│   │   ├── Captcha.tsx    # Composant Captcha sécurisé
│   │   ├── HoneypotField.tsx # Champ anti-bot
│   │   ├── AddToHomeScreenBanner.tsx # PWA prompts
│   │   ├── IOSInstallInstructions.tsx # Guide install iOS
│   │   ├── JudicialCondemnationNotice.tsx # Avis légaux
│   │   └── BoycottTipsSection.tsx # Section conseils boycott avec modal
│   ├── search/           # Système de recherche
│   │   └── SearchBar.tsx  # Barre avec auto-complétion
│   ├── events/           # Affichage des événements
│   │   ├── EventCard.tsx  # Carte d'événement enrichie
│   │   ├── EventList.tsx  # Liste avec gestion d'état
│   │   └── DirigeantCard.tsx # Carte dirigeant avec toutes marques liées
│   ├── forms/            # Formulaires complexes
│   │   ├── SignalementForm.tsx # Formulaire de signalement
│   │   └── SimilarItems.tsx # Détection de doublons UI
│   ├── admin/            # Interface d'administration
│   │   ├── AdminNavigation.tsx # Navigation admin
│   │   ├── DirigeantForm.tsx # Formulaire dirigeant V2 (centralisé)
│   │   ├── MarqueDirigeantForm.tsx # Formulaire liaison V2
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
│   └── supabaseClient.ts # Configuration Supabase (supabaseAdmin uniquement)
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
3. `dataService` → Lectures via extension-api avec cache CDN
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
2. API directe → `POST /api/propositions` avec sécurité
3. Interface admin → `PropositionList` avec workflow
4. `moderation.ts` → Conversion propositions → événements
5. `GET /api/decisions` → Transparence des décisions

### **Détection de Doublons**
1. `SimilarItems` → Recherche similarité en temps réel
2. API directe → `GET /api/search-similaire` avec fuzzy matching
3. Affichage suggestions avec scores de similarité
4. Prévention création doublons automatique

### **Système BoycottTips (Conseils de Boycott)**
1. `BoycottTipsSection` → Affichage conditionnel selon disponibilité
2. Logique de priorité : Message spécifique marque > Message secteur > Pas de bouton
3. `formatMarkdown` → Rendu avec support images et groupes d'images
4. Modal lightbox → Affichage images agrandies avec navigation
5. Interface admin → CRUD secteurs via `/admin/secteurs-marque`

#### **Architecture BoycottTips**
```
SecteurMarque (1) ←→ (N) Marque
│
├── message_boycott_tips (secteur)    # Message générique par secteur
└── Marque.message_boycott_tips       # Message spécifique (priorité)
```

#### **Syntaxe Markdown Étendue**
- **Texte enrichi** : `**gras**`, `*italique*`
- **Listes** : `• élément` (avec espacement optimisé)
- **Images individuelles** : `![alt](url)` (responsive avec modal)
- **Groupes d'images** : `[img-group]![](url1)![](url2)[/img-group]` (height fixe, width auto)
- **Modal interactive** : Clic sur image → affichage plein écran avec fermeture

#### **Composants BoycottTips**
- **`BoycottTipsSection`** : Bouton shiny + section dépliable
- **Modal lightbox** : Image agrandie avec overlay et bouton fermeture
- **Interface admin** : Page CRUD pour secteurs avec assignation marques
- **API `/secteurs-marque`** : CRUD complet avec validation

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
- **API-First Security** : `supabaseAdmin` uniquement côté serveur avec validation applicative
- **Aucun accès client** : Pas de RLS, toute sécurité dans les API routes
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
  secteur_marque_id INTEGER REFERENCES "SecteurMarque"(id),
  message_boycott_tips TEXT,
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

-- ARCHITECTURE V2 - Dirigeants Normalisés
CREATE TABLE "dirigeants" (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  controverses TEXT NOT NULL,
  sources JSONB NOT NULL,
  impact_generique TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "marque_dirigeant" (
  id SERIAL PRIMARY KEY,
  marque_id INTEGER REFERENCES "Marque"(id) ON DELETE CASCADE,
  dirigeant_id INTEGER REFERENCES "dirigeants"(id) ON DELETE CASCADE,
  lien_financier VARCHAR(500) NOT NULL,
  impact_specifique TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(marque_id, dirigeant_id)
);

-- Tables legacy (rétrocompatibilité - peuvent être supprimées après migration)
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

-- Table pour les secteurs de marques (BoycottTips)
CREATE TABLE "SecteurMarque" (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  message_boycott_tips TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_marque_nom ON "Marque" USING gin(to_tsvector('french', nom));
CREATE INDEX idx_marque_secteur ON "Marque"(secteur_marque_id);
CREATE INDEX idx_evenement_categorie ON "Evenement"(categorie);
CREATE INDEX idx_evenement_date ON "Evenement"(date DESC);
CREATE INDEX idx_proposition_status ON "Proposition"(status);
-- Index V2 - Dirigeants normalisés
CREATE INDEX idx_dirigeants_nom ON "dirigeants" USING gin(to_tsvector('french', nom));
CREATE INDEX idx_dirigeants_controverses ON "dirigeants" USING gin(to_tsvector('french', controverses));
CREATE INDEX idx_marque_dirigeant_marque ON "marque_dirigeant"(marque_id);
CREATE INDEX idx_marque_dirigeant_dirigeant ON "marque_dirigeant"(dirigeant_id);
CREATE INDEX idx_secteur_nom ON "SecteurMarque"(nom);

-- Index legacy (rétrocompatibilité)
CREATE INDEX idx_dirigeant_nom ON "Dirigeant" USING gin(to_tsvector('french', nom || ' ' || COALESCE(prenom, '')));
```

### **Architecture V2 - Dirigeants Normalisés**

#### **Évolution Architecturale (2024-08)**
Migration d'un système monolithique vers une architecture normalisée pour les bénéficiaires controversés :

**V1 (Legacy)** : Données dirigeant dupliquées pour chaque marque
```sql
-- Structure V1 (obsolète)
DirigeantMarque: {
  dirigeantId, marqueId, poste, dateDebut, dateFin
  -- ❌ Pas de controverses ni sources centralisées
}
```

**V2 (Actuel)** : Architecture normalisée avec réutilisabilité
```sql
-- Structure V2 (actuelle)
dirigeants: {
  id, nom, controverses, sources[], impact_generique
  -- ✅ Données centralisées et réutilisables
}

marque_dirigeant: {
  marque_id, dirigeant_id, lien_financier, impact_specifique
  -- ✅ Relation pure avec spécificités par marque
}
```

#### **Avantages Architecture V2**
- **Réutilisabilité** : Un dirigeant lié à plusieurs marques
- **Consistance** : Mise à jour centralisée des controverses
- **Performance** : Moins de duplication, requêtes optimisées
- **Évolutivité** : Ajout de nouveaux champs dirigeant sans impact
- **Flexibilité** : Impact générique + spécifique par marque

#### **Logique Métier - Impact Hybride**
```typescript
// Priorité des messages d'impact
const getImpactMessage = (liaison: MarqueDirigeant) => {
  return liaison.impact_specifique        // 1. Spécifique marque (priorité)
      || liaison.dirigeant.impact_generique // 2. Générique dirigeant
      || "Impact à définir"               // 3. Fallback par défaut
}
```

#### **Composants Frontend V2**
- **`DirigeantForm`** : CRUD dirigeants centralisés (nom, controverses, sources)
- **`MarqueDirigeantForm`** : Gestion liaisons marque-dirigeant (lien, impact)
- **`DirigeantCard`** : Affichage public avec toutes marques liées et navigation cliquable
- **API `/dirigeants`** : Endpoint dirigeant-centrique avec marques liées
- **API `/marque-dirigeant`** : Endpoint relation pure CRUD

#### **Migration et Compatibilité**
- **Rétrocompatibilité** : Interface publique identique (`DirigeantResult`)  
- **Migration SQL** : Script `migration-dirigeants-v2.sql` avec transformation automatique
- **Types TypeScript** : `MarqueDirigeantLegacy` et `DirigeantComplet` enrichis avec `toutes_marques`
- **Extension API** : Format `dirigeants_controverses` maintenu pour extensions

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
- **`BoycottTipsSection`** : Bouton shiny + section dépliable + modal images
- **`SearchBar`** : Auto-complétion + navigation clavier + états loading
- **`ShareButton`** : Partage adaptatif mobile (natif) / desktop (copie lien)
  - Détection robuste via User Agent (`/iphone|ipad|ipod|android/`)
  - Position flottante avec adaptation PWA banner (`canInstall ? 'bottom-20' : 'bottom-6'`)
  - Feedback visuel "Copié !" pendant 2 secondes sur desktop
  - Préservation encodage URL (`Nestl%C3%A9`) via `rawSearchQuery`
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

## 🌊 Architecture des Flux de Données

### **Vue d'ensemble - Architecture Hybride Optimisée**

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│ • Pages publiques → dataService → Extension-API (lecture)  │
│ • Pages admin → API Routes → Supabase direct (écriture)    │
│ • useSearch → dataService → Extension-API (lecture)        │
└─────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATA SERVICE LAYER                       │
├─────────────────────────────────────────────────────────────┤
│ • Lectures : Extension-API (Cache CDN)                     │
│ • Écritures : Supabase direct (Fiabilité transactionnelle) │
│ • Import dynamique Supabase (pas d'init côté client)       │
└─────────────────────────────────────────────────────────────┘
                         ↓                    ↓
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│        EXTENSION-API            │  │           SUPABASE              │
│     (Netlify Functions)         │  │        (PostgreSQL)             │
├─────────────────────────────────┤  ├─────────────────────────────────┤
│ • Cache CDN multi-niveaux       │  │ • Base de données principale    │
│ • toutes_marques par bénéf.     │  │ • Transactions fiables          │
│ • Performance ~50ms             │  │ • Validation server-side        │
└─────────────────────────────────┘  └─────────────────────────────────┘
```

### **Flux de Données par Type d'Opération**

#### 🔍 **Lectures (Consultation publique)**
```typescript
// 1. Page de recherche (useSearch.ts)
useSearch → dataService.getMarques() → Extension-API → Cache CDN (30min)

// 2. Affichage dirigeants avec toutes marques liées
DirigeantCard → Extension-API.beneficiaires → toutes_marques[] ✅

// 3. BoycottTips et secteurs
dataService.getSecteurs() → Extension-API → Cache CDN (15min)
```

#### ✏️ **Écritures (Administration)**
```typescript
// 1. Création/modification marque
Admin → /api/marques → Supabase direct → Validation + Transaction

// 2. Gestion dirigeants V2
Admin → /api/dirigeants → Supabase direct → Architecture normalisée
Admin → /api/marque-dirigeant → Supabase direct → Relations

// 3. Modération collaborative
Public → /api/propositions → Supabase direct → Workflow modération
```

### **Points Clés de l'Architecture**

#### ✅ **Avantages**
- **Performance** : Cache CDN multi-niveaux (5-30min TTL)
- **Fiabilité** : Écritures transactionnelles Supabase
- **Sécurité** : Pas de client Supabase côté frontend
- **Cohérence** : Single source of truth via dataService
- **Scalabilité** : Netlify 99.9% uptime + auto-scaling

#### 🔧 **Implémentation Technique**
```typescript
// dataService.ts - Import dynamique pour éviter init côté client
async createMarque(data: MarqueCreateRequest): Promise<Marque> {
  const { supabaseAdmin } = await import('@/lib/supabaseClient');
  // ... écriture directe Supabase
}

async getMarques(): Promise<Marque[]> {
  return this.fetchFromExtensionApi<Marque[]>('marques');
  // ... lecture Extension-API avec cache
}
```

#### 🚀 **Données Enrichies - Toutes Marques Liées**
```typescript
// Extension-API enrichit automatiquement les bénéficiaires
{
  "nom": "Pierre Edouard Stérin",
  "toutes_marques": [
    {"id": 16, "nom": "Smartbox"},
    {"id": 17, "nom": "Wonderbox"},
    {"id": 22, "nom": "Animaj"},
    // ... 10 autres marques
  ]
}
```

### **Architecture Finale : Cohérente et Optimale**

Cette architecture respecte parfaitement les principes de performance et fiabilité :
- ✅ **Lectures optimisées** : Extension-API avec cache CDN
- ✅ **Écritures fiables** : Supabase direct avec transactions
- ✅ **Sécurité renforcée** : Import dynamique, pas d'exposition client
- ✅ **Single point of truth** : dataService centralisé
- ✅ **Performance constante** : ~50ms avec Netlify 99.9% uptime

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
# Supabase Configuration (Server-side only)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Admin Authentication
ADMIN_TOKEN="your-secure-admin-token"

# Extension API Configuration (Required)
NEXT_PUBLIC_EXTENSION_API_URL="https://odm-api.netlify.app"

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
