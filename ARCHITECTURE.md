# Architecture du Projet ODM-Web

## 📁 Structure des Dossiers

```
src/
├── app/                    # App Router Next.js 15
│   ├── api/               # Routes API RESTful
│   │   ├── marques/       # CRUD marques + stats
│   │   ├── evenements/    # CRUD événements
│   │   ├── propositions/  # Système de modération
│   │   ├── decisions/     # Décisions de modération
│   │   ├── beneficiaires/ # CRUD bénéficiaires (centralisés)
│   │   ├── marque-beneficiaire/ # API liaisons marque-bénéficiaire
│   │   ├── suggestions/     # Auto-complétion ultra-rapide (sub-100ms)
│   │   ├── categories/    # Catégories d'événements
│   │   ├── secteurs-marque/ # CRUD secteurs BoycottTips
│   │   └── search-similaire/ # Détection de doublons
│   ├── about/             # Page À propos
│   ├── admin/             # Interface d'administration
│   │   ├── marques/       # Gestion des marques
│   │   ├── beneficiaires/ # Gestion des beneficiaires
│   │   ├── moderation/    # Interface de modération
│   │   ├── secteurs-marque/ # Gestion secteurs BoycottTips
│   │   └── login/         # Authentification admin
│   ├── faq/               # Page FAQ
│   ├── moderation/        # Page modération publique
│   ├── signaler/          # Page de signalement
│   ├── marques/           # Listing et détail marques
│   │   ├── [slug]/        # Page détail marque dynamique (ISR)
│   │   └── page.tsx       # Liste marques avec filtres
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
│   │   ├── SearchBar.tsx   # Input search avec suggestions (composant enfant)
│   │   └── SearchHero.tsx  # Hero search avec navigation (composant parent)
│   ├── events/           # Affichage des événements
│   │   ├── EventCard.tsx  # Carte d'événement enrichie
│   │   ├── ChaineBeneficiaires.tsx # Chaîne financière accordéon avec fermeture extérieure
│   │   └── DirigeantCard.tsx # Carte bénéficiaire avec toutes marques liées (directes + indirectes)
│   ├── MarquesListClient.tsx # Client component liste marques avec filtres
│   ├── MarqueCard.tsx    # Carte marque cliquable
│   ├── forms/            # Formulaires complexes
│   │   ├── SignalementForm.tsx # Formulaire de signalement
│   │   └── SimilarItems.tsx # Détection de doublons UI
│   ├── admin/            # Interface d'administration
│   │   ├── AdminNavigation.tsx # Navigation admin
│   │   ├── DirigeantForm.tsx # Formulaire dirigeant (centralisé)
│   │   ├── MarqueDirigeantForm.tsx # Formulaire liaison
│   │   ├── PropositionDetail.tsx # Détail proposition
│   │   └── PropositionList.tsx # Liste propositions
│   └── index.ts          # Export centralisé
├── hooks/                # Hooks personnalisés
│   ├── useMarquesFilters.ts # 🎯 Gestion filtres avec sync URL bidirectionnelle
│   ├── useDecisions.ts   # Récupération des décisions
│   ├── useAddToHomeScreen.ts # PWA installation
│   └── useMobileDetection.ts # Détection mobile
├── lib/                  # Utilitaires et services
│   ├── services/         # Services métier
│   │   ├── dataService.ts # Service principal (architecture simplifiée)
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

## 🔄 Architecture des Flux de Données

### **Vue d'Ensemble - Architecture Hybride Optimisée**

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│ • Pages publiques → dataService → odm-api (lectures)       │
│ • Pages admin → API Routes → Supabase direct (écritures)   │
│ • Auto-complétion → /suggestions endpoint (sub-100ms)      │
│ • Recherche déléguée → filtrage serveur (réduction trafic) │
└─────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATA SERVICE LAYER                       │
├─────────────────────────────────────────────────────────────┤
│ • Lectures : odm-api avec cache CDN (5-20min TTL)          │
│ • Écritures : Supabase direct (Fiabilité transactionnelle) │
│ • Import dynamique Supabase (pas d'init côté client)       │
└─────────────────────────────────────────────────────────────┘
                         ↓                    ↓
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│           ODM-API               │  │           SUPABASE              │
│     (Netlify Functions)         │  │        (PostgreSQL)             │
├─────────────────────────────────┤  ├─────────────────────────────────┤
│ • SQL JOINs unifiés (anti-N+1)  │  │ • Base de données principale    │
│ • Endpoint /suggestions spécialisé│  │ • Transactions fiables          │
│ • Cache CDN optimisé (96ms avg) │  │ • Validation server-side        │
└─────────────────────────────────┘  └─────────────────────────────────┘
```

### **Flux par Type d'Opération**

#### 🔍 **Lectures (Consultation publique)**
```typescript
// 🎯 ARCHITECTURE RECHERCHE - Pattern URL-first avec redirections
SearchHero → handleSearch → Router navigation
  ├── Match exact trouvé → router.push(`/marques/${slug}`)
  └── Pas de match → router.push(`/marques?search=${query}`)

// 📄 Page /marques avec filtres URL-based
MarquesPage → MarquesListClient → useMarquesFilters (sync URL ↔ state)
  ├── URL params → dispatch actions (UPDATE_SEARCH, SET_SORT, etc.)
  └── State changes → router.replace avec nouveaux params

// ⚡ Suggestions ultra-rapides
SearchHero → dataService.getSuggestions(query, 10)
  → odm-api /suggestions?q=${query}&limit=10
  → AbortController pour race conditions
  → Debouncing 200ms

// 🎯 État "Pas de résultats"
MarquesListClient → filteredMarques.length === 0 && hasSearchQuery
  → Message collaboratif avec CTA signalement
  → Scroll automatique vers filtres (450px mobile / 550px desktop)

// 🔗 Navigation inter-pages avec scroll
MarqueCard/MarquesBadges → onClick handler
  → sessionStorage.setItem('scrollToResults', 'true')
  → router.push(`/marques/${slug}`)
  → MarquePageClient useEffect → scroll avec offsets fixes

// 4. Chaîne de bénéficiaires
ChaineBeneficiaires → dataService.getBeneficiairesChaine()
  → odm-api /beneficiaires/chaine?marqueId=X&profondeur=5
  → Algorithme récursif avec SQL JOINs → Protection cycles
  → Structure unifiée sans duplication → Interface accordéon
```

> Note SearchHero (comportement actuel):
> - **Suggestions**: Match préfixe (startsWith) via `/suggestions` endpoint (ILIKE `q%`)
> - **Navigation match exact**: Redirect vers `/marques/${slug}` si suggestion sélectionnée
> - **Navigation no match**: Redirect vers `/marques?search=${query}` pour afficher résultats filtrés
> - **Source tracking**: Paramètre `source` pour analytics ('marques_list' vs 'marque_detail')
> - **Filtres avancés**: Secteur, bénéficiaire, tri disponibles sur `/marques`

## ⚙️ Développement local (Netlify Dev)

Le projet a migré de Vercel vers Netlify. Le développement local se fait désormais via Netlify Dev.

1) Prérequis
- Node.js 22+
- Netlify CLI: `npm install -g netlify-cli`

2) Variables d'environnement (fichier `.env.local` à la racine de `odm-web/`)
```env
# URL de l'API d'extension (odm-api)
# Production (par défaut)
NEXT_PUBLIC_EXTENSION_API_URL="https://odm-api.netlify.app"

# Local (si vous lancez aussi l'API en local via Netlify Dev)
# NEXT_PUBLIC_EXTENSION_API_URL="http://localhost:8888"
```

3) Lancer l'application web
```bash
cd odm-web
netlify dev
```
- Le port est configuré dans `odm-web/netlify.toml` (`[dev] port = 3001`).
- Le plugin officiel `@netlify/plugin-nextjs` prend en charge le dev server Next.js.

4) (Optionnel) Lancer l'API en local
```bash
cd odm-api
netlify dev
```
- Netlify Dev expose les functions sur `http://localhost:8888` par défaut.
- Dans ce cas, définissez `NEXT_PUBLIC_EXTENSION_API_URL=http://localhost:8888` côté `odm-web`.

#### ✏️ **Écritures (Administration & Modération)**
```typescript
// 1. Administration optimisée
Admin → /api/marques → Supabase direct → Validation + Transaction
Admin → /api/beneficiaires → Supabase direct → Architecture centralisée
Admin → /api/marque-beneficiaire → Supabase direct → Relations unifiées

// 2. Modération collaborative
Public → SignalementForm → Validation + détection doublons
  → /api/propositions → Supabase direct → Workflow optimisé

// 3. Synchronisation cache
Écriture → Supabase direct → Invalidation cache intelligent
  → Revalidation CDN → Cohérence données temps réel
```

#### 🚀 **Optimisations Payload**
```typescript
// Pattern: Conditional Data Loading
const endpoint = search ? 'marques-search' : 'marques-all'

// Mode recherche : données complètes (chaîne bénéficiaires)
if (search) {
  marque.total_beneficiaires_chaine = 4
  marque.chaine_beneficiaires = [/* chaîne complète */]
}
// Mode liste : données minimales (performance)
else {
  // Pas de chaîne = payload réduit 40%
}

// Événements simplifiés (6 propriétés vs 12+ avant)
evenement = {
  id, titre, date, source_url, reponse, condamnation_judiciaire, categorie
  // ❌ Supprimé: marque_id, description, categorie_id, created_at, updated_at, marque
}
```

### **Architecture Chaîne Financière**
```
Maybelline → Groupe L'Oréal → Nestlé SA → BlackRock + Vanguard
 (niveau 0)     (niveau 1)    (niveau 2)    (niveau 3)
     ↓              ↓             ↓             ↓
  Marques        Marques       Marques      Marques
  directes       indirectes    transitives   finales
```

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

## 📊 Architecture de Données

### **Base de Données Unifiée (Supabase PostgreSQL)**

#### **Tables Principales**
```sql
-- Marques et secteurs
CREATE TABLE "Marque" (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) UNIQUE NOT NULL,
  secteur_marque_id INTEGER REFERENCES "SecteurMarque"(id),
  message_boycott_tips TEXT,
  marque_parent_id INTEGER REFERENCES "Marque"(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "SecteurMarque" (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  message_boycott_tips TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Événements et catégories
CREATE TABLE "Evenement" (
  id SERIAL PRIMARY KEY,
  marque_id INTEGER REFERENCES "Marque"(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP NOT NULL,
  reponse TEXT,
  categorie_id INTEGER REFERENCES "Categorie"(id),
  proposition_source_id INTEGER,
  source_url TEXT NOT NULL,
  condamnation_judiciaire BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Categorie" (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  description TEXT,
  emoji TEXT,
  couleur TEXT,
  actif BOOLEAN DEFAULT TRUE,
  ordre INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Architecture Bénéficiaires Normalisés**

**Principe central : "À qui profitent vos achats ?"**

L'architecture suit le flux d'argent depuis le consommateur :
```
Achat consommateur → Marque → Bénéficiaire direct → Bénéficiaire indirect
```

**Exemple concret :**
- `Herta → Nestlé → BlackRock` : Les achats Herta profitent à Nestlé (filiale), puis à BlackRock (actionnaire)

```sql
-- Bénéficiaires centralisés
CREATE TABLE "Beneficiaires" (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  impact_generique TEXT,
  type_beneficiaire VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Controverses liées aux bénéficiaires
CREATE TABLE "controverse_beneficiaire" (
  id SERIAL PRIMARY KEY,
  beneficiaire_id INTEGER REFERENCES "Beneficiaires"(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  source_url TEXT NOT NULL,
  ordre INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Relations marque → bénéficiaire
CREATE TABLE "Marque_beneficiaire" (
  id SERIAL PRIMARY KEY,
  marque_id INTEGER REFERENCES "Marque"(id) ON DELETE CASCADE,
  beneficiaire_id INTEGER REFERENCES "Beneficiaires"(id) ON DELETE CASCADE,
  lien_financier TEXT NOT NULL,
  impact_specifique TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Relations transitives entre bénéficiaires
CREATE TABLE "beneficiaire_relation" (
  id SERIAL PRIMARY KEY,
  beneficiaire_source_id INTEGER REFERENCES "Beneficiaires"(id) ON DELETE CASCADE,
  beneficiaire_cible_id INTEGER REFERENCES "Beneficiaires"(id) ON DELETE CASCADE,
  description_relation TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(beneficiaire_source_id, beneficiaire_cible_id)
);
```

#### **Tables Système (Modération & Legacy)**
```sql
-- Système de modération collaborative
CREATE TABLE "Proposition" (
  id SERIAL PRIMARY KEY,
  marque_nom TEXT NOT NULL,
  marque_id INTEGER REFERENCES "Marque"(id),
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  categorie_id INTEGER REFERENCES "Categorie"(id),
  source_url TEXT NOT NULL,
  statut VARCHAR(20) DEFAULT 'en_attente',
  commentaire_admin TEXT,
  titre_controverse TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Decision" (
  id SERIAL PRIMARY KEY,
  "propositionId" INTEGER REFERENCES "Proposition"(id) ON DELETE CASCADE,
  action VARCHAR(20) NOT NULL,
  raison TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tables legacy (rétrocompatibilité)
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
```

#### **Index de Performance**
```sql
-- Index principaux
CREATE INDEX idx_marque_nom ON "Marque" USING gin(to_tsvector('french', nom));
CREATE INDEX idx_marque_secteur ON "Marque"(secteur_marque_id);
CREATE INDEX idx_evenement_date ON "Evenement"(date DESC);
CREATE INDEX idx_evenement_titre ON "Evenement" USING gin(to_tsvector('french', titre));

CREATE INDEX idx_beneficiaires_nom ON "Beneficiaires" USING gin(to_tsvector('french', nom));
CREATE INDEX idx_marque_beneficiaire_marque ON "Marque_beneficiaire"(marque_id);
CREATE INDEX idx_beneficiaire_relation_source ON "beneficiaire_relation"(beneficiaire_source_id);
```

### **Évolution Architecturale**

**Ancien système** : Données dupliquées
```sql
DirigeantMarque: { dirigeantId, marqueId, poste }
-- ❌ Pas de controverses centralisées
```

**Architecture normalisée** :
```sql
Beneficiaires: { nom, impact_generique, type_beneficiaire }
-- ✅ Données centralisées et réutilisables
```

**Avantages :**
- **Réutilisabilité** : Un bénéficiaire → Plusieurs marques
- **Consistance** : Controverses centralisées
- **Performance** : Requêtes optimisées, moins de duplication
- **Relations transitives** : Support des chaînes financières complexes

### **Types TypeScript Optimisés**

```typescript
// Interface principale allégée (payload réduit 40%)
interface Marque {
  id: number;
  nom: string;
  evenements?: Evenement[];
  message_boycott_tips?: string;
  // Chaîne complète pour recherches
  total_beneficiaires_chaine?: number;
  chaine_beneficiaires?: ChaineNode[];
  // Secteur simplifié
  secteur_marque?: {
    nom: string;
    message_boycott_tips?: string;
  };
  // Admin uniquement
  beneficiaires_marque?: Array<{/* format admin */}>;
  secteur_marque_id?: number;
}

// Événements allégés (6 propriétés essentielles)
interface Evenement {
  id: number | string;
  titre: string;
  date: string;
  source_url: string;
  reponse?: string;
  condamnation_judiciaire?: boolean;
  categorie?: Categorie | null;
  // ❌ SUPPRIMÉ: marque_id, description, categorie_id, created_at, updated_at, marque
}

// Chaîne de bénéficiaires unifiée
interface ChaineNode {
  beneficiaire: {
    id: number;
    nom: string;
    controverses: ControverseBeneficiaire[];
    type_beneficiaire: string;
  };
  niveau: number;
  lien_financier: string;
  marques_directes: Array<{id: number, nom: string}>;
  marques_indirectes: Record<string, Array<{id: number, nom: string}>>;
}
```

## ⚠️ Points d'Attention Technique

### **Performance & Optimisations**

**Optimisations majeures implémentées :**
- ✅ **Payload réduit 40%** : Suppression propriétés redondantes endpoint `/marques`
- ✅ **Conditional Data Loading** : Chaîne bénéficiaires seulement pour recherches
- ✅ **Événements simplifiés** : 6 propriétés essentielles (vs 12+ avant)
- ✅ **Cache adaptatif** : 10min recherche / 20min liste selon usage
- ✅ **Structure unifiée** : `chaine_beneficiaires` remplace patterns N+1
- ✅ **SQL JOINs optimisés** : Élimination complète des anti-patterns N+1

### **Compatibilité Extension - Status**

**Couche de compatibilité maintenue** pour l'extension browser :
- **Extension API** : Format `dirigeant_controverse` généré automatiquement
- **Web App** : Utilise le format unifié `beneficiaires_marque`
- **Transformations minimales** : Réduites grâce aux SQL JOINs optimisés

**Architecture :**
```javascript
// Format Web App optimisé (payload réduit 40%)
return {
  id: marque.id,
  nom: marque.nom,
  evenements: evenementsSimplifies, // 6 propriétés vs 12+
  total_beneficiaires_chaine: 4,    // Compteur unifié
  chaine_beneficiaires: [...],      // Structure unifiée
  secteur_marque: {                 // Objet simplifié
    nom: "Cosmétiques",
    message_boycott_tips: "..."
  }
  // ❌ Supprimé: nbControverses, nbCondamnations, beneficiaires_marque, etc.
}

// Extensions : endpoints séparés (brands-*) non impactés
```

**Gains performance :**
- **Payload réduit 40%** : Suppression redondances
- **Conditional Loading** : Données selon contexte
- **Cache optimisé** : TTL adaptatif par usage
- **Structure unifiée** : Fin des patterns N+1

### **Surveillance Continue**

**Métriques de performance :**
- **Payload réduit 40%** : Temps de réponse amélioré
- **Cache hit ratio** : >85% grâce à TTL adaptatif
- **Conditional Loading** : Données selon besoin réel
- **SQL optimisé** : Requêtes unifiées sans patterns N+1

**Pattern Conditional Loading :**
```javascript
// Pattern : données selon contexte
let donneesChaine = {
  chaine_beneficiaires: [],
  total_beneficiaires_chaine: 0
}

// Mode recherche : chaîne complète (Maybelline → L'Oréal → Nestlé → BlackRock)
if (search) {
  donneesChaine = await construireChaineCompletePourMarque(marque.id, 5)
}
// Mode liste : payload minimal (performance)

return {
  ...marqueEssentielle,
  ...donneesChaine // Ajout conditionnel selon usage
}
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
  --primary-500: #f97316;  /* berry principal */
  --primary-600: #ea580c;  /* berry hover */
  --primary-900: #9a3412;  /* berry foncé */
  
  /* Palette secondaire */
  --secondary-50: #fffbeb; /* Amber léger */
  --secondary-500: #f59e0b; /* Amber principal */
  --secondary-600: #d97706; /* Amber hover */
  
  /* Couleurs sémantiques */
  --success: #10b981;     /* Vert validation */
  --warning: #f59e0b;     /* berry alerte */
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
- **Focus** : Ring berry avec offset pour accessibilité
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

## 🚀 Cas d'étude : Optimisation page /marques

### Problème initial (Sept 2025)
- **TTFB** : 1.6s (client-side fetching + useEffect)
- **UX** : Spinner générique pendant chargement complet
- **Architecture** : Client Component avec état local et hydration lourde
- **Payload** : 23KB pour ~150 marques chargées d'un coup

### Solution implémentée
- **Pattern Streaming SSR** : Suspense + Server Components séparés
- **ISR Cache** : `revalidate = 600` (10 minutes) + fetch tags (`'marques-stats'`) pour revalidation ciblée
- **Skeleton premium** : Remplacement spinner générique par skeleton réaliste
- **Server Components** : Composants server par défaut (hydratation minimale)
- **Architecture modulaire** : Séparation page wrapper + composant données

### Résultats mesurés
- **TTFB** : 1.6s → 0.1s (**93% amélioration**)
- **Temps total** : 1.6s → 0.7s (**55% amélioration**)
- **UX** : Header instantané + skeleton fluide → perception de rapidité

### Architecture finale optimisée
```typescript
// 1. Page wrapper (rendu instantané)
export const revalidate = 600; // ISR Cache 10min
export default function MarquesPage() {
  return (
    <Layout>
      <Suspense fallback={<MarquesSkeleton count={8} />}> 
        <MarquesList />
      </Suspense>
    </Layout>
  );
}

// 2. Composant données (Server Component)
async function MarquesList() {
  const marques = await dataService.getMarquesStats();
  // Tri déjà effectué côté API
  return marques.map(marque =>
    <MarqueCard key={marque.id} marque={marque} />
  );
}

// 3. Carte optimisée (Server Component)
const MarqueCard = ({ marque }) => {
  // Server Component: pas de hooks client; navigation via <Link />
  // Rendu optimisé...
};
```

#### Targeted revalidation via fetch tags
- Fetch côté web utilise `next: { tags: ['marques-stats'] }`
- Invalidation ciblée possible via `revalidateTag('marques-stats')` après une écriture

### Fichiers créés/modifiés
- `src/app/marques/page.tsx` → Wrapper Suspense + ISR (revalidate 600s, skeleton 8)
- `src/components/MarquesList.tsx` → Server Component données (pas de tri client)
- `src/components/MarqueCard.tsx` → Server Component (chevron léger, +X overflow)
- `src/components/MarquesSkeleton.tsx` → Skeleton premium

### Pattern réutilisable pour autres pages lourdes
```typescript
// Template pour pages avec données volumineuses
export const revalidate = 300; // Cache adaptatif selon usage

export default function HeavyDataPage() {
  return (
    <PageLayout>
      <InstantHeader />
      <Suspense fallback={<RealisticSkeleton />}>
        <HeavyDataComponent />
      </Suspense>
    </PageLayout>
  );
}
```

### Prochaines optimisations applicables
- **Pagination intelligente** : 50 items + infinite scroll
- **Virtualisation** : react-window pour >100 éléments
- **Search debouncing** : Filtrage client-side optimisé
- **Progressive loading** : Marques prioritaires d'abord

---

## 📈 Roadmap & Optimisations

### **Performance & UX**
- **React Query/SWR** : Cache intelligent + synchronisation
- **Virtualisation** : `@tanstack/react-virtual` pour listes longues
- **Service Worker** : Cache offline + background sync
- **Image Optimization** : Next.js Image + WebP + responsive
- **Web Vitals** : Monitoring CLS, FCP, LCP

### **Fonctionnalités Métier**
- **Recherche Avancée** : Full-text search + filtres avancés
- **API Publique** : OpenAPI pour développeurs tiers
- **Multi-langue** : i18n avec next-intl
- **Export Data** : CSV/JSON des données

### **Infrastructure**
- **Tests** : Jest + Testing Library + E2E Playwright
- **CI/CD** : GitHub Actions + preview deployments
- **Monitoring** : Sentry + Analytics privacy-first
- **Sécurité** : OWASP scanning + dependency auditing

## 🔧 Configuration

### **Variables d'Environnement**
```env
# Supabase (Server-side uniquement)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Extension API (Requis)
NEXT_PUBLIC_EXTENSION_API_URL="https://odm-api.netlify.app"

# Authentification admin
ADMIN_TOKEN="your-secure-admin-token"

# Application
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
NEXT_PUBLIC_APP_ENV="production"

# Sécurité
ENCRYPTION_KEY="your-32-char-encryption-key"

# Optionnel : Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="your-domain.com"
SENTRY_DSN="your-sentry-dsn"
```

### **Configuration Technique**
- **TypeScript** : Strict mode, path mapping `@/*` → `./src/*`
- **Tailwind CSS** : Design system avec breakpoints personnalisés
- **Next.js 15** : App Router, Turbopack, optimisations
- **Sécurité** : API-first, validation centralisée, HTTPS only
