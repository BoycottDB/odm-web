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
  marque_parent_id INTEGER REFERENCES "Marque"(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

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

-- ARCHITECTURE V2 - Bénéficiaires Normalisés
CREATE TABLE "Beneficiaires" (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  impact_generique TEXT,
  type_beneficiaire VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "controverse_beneficiaire" (
  id SERIAL PRIMARY KEY,
  beneficiaire_id INTEGER REFERENCES "Beneficiaires"(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  source_url TEXT NOT NULL,
  ordre INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Marque_beneficiaire" (
  id SERIAL PRIMARY KEY,
  marque_id INTEGER REFERENCES "Marque"(id) ON DELETE CASCADE,
  beneficiaire_id INTEGER REFERENCES "Beneficiaires"(id) ON DELETE CASCADE,
  lien_financier TEXT NOT NULL,
  impact_specifique TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table pour les relations entre bénéficiaires (relations transitives)
CREATE TABLE "beneficiaire_relation" (
  id SERIAL PRIMARY KEY,
  beneficiaire_source_id INTEGER REFERENCES "Beneficiaires"(id) ON DELETE CASCADE,
  beneficiaire_cible_id INTEGER REFERENCES "Beneficiaires"(id) ON DELETE CASCADE,
  description_relation TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(beneficiaire_source_id, beneficiaire_cible_id)
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
  marque_nom TEXT NOT NULL,
  marque_id INTEGER REFERENCES "Marque"(id),
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  categorie_id INTEGER REFERENCES "Categorie"(id),
  source_url TEXT NOT NULL,
  statut VARCHAR(20) DEFAULT 'en_attente', -- 'approuvee' | 'rejetee'
  commentaire_admin TEXT,
  titre_controverse TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
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
CREATE INDEX idx_marque_parent ON "Marque"(marque_parent_id);
CREATE INDEX idx_evenement_categorie ON "Evenement"(categorie_id);
CREATE INDEX idx_evenement_date ON "Evenement"(date DESC);
CREATE INDEX idx_evenement_titre ON "Evenement" USING gin(to_tsvector('french', titre));
CREATE INDEX idx_proposition_statut ON "Proposition"(statut);
CREATE INDEX idx_proposition_marque ON "Proposition"(marque_id);
CREATE INDEX idx_categorie_actif ON "Categorie"(actif);
CREATE INDEX idx_categorie_ordre ON "Categorie"(ordre);
-- Index V2 - Bénéficiaires normalisés
CREATE INDEX idx_beneficiaires_nom ON "Beneficiaires" USING gin(to_tsvector('french', nom));
CREATE INDEX idx_beneficiaires_type ON "Beneficiaires"(type_beneficiaire);
CREATE INDEX idx_controverse_beneficiaire_id ON "controverse_beneficiaire"(beneficiaire_id);
CREATE INDEX idx_controverse_titre ON "controverse_beneficiaire" USING gin(to_tsvector('french', titre));
CREATE INDEX idx_marque_beneficiaire_marque ON "Marque_beneficiaire"(marque_id);
CREATE INDEX idx_marque_beneficiaire_beneficiaire ON "Marque_beneficiaire"(beneficiaire_id);
CREATE INDEX idx_beneficiaire_relation_source ON "beneficiaire_relation"(beneficiaire_source_id);
CREATE INDEX idx_beneficiaire_relation_cible ON "beneficiaire_relation"(beneficiaire_cible_id);
CREATE INDEX idx_secteur_nom ON "SecteurMarque"(nom);

-- Index legacy (rétrocompatibilité)
CREATE INDEX idx_dirigeant_nom ON "Dirigeant" USING gin(to_tsvector('french', nom || ' ' || COALESCE(prenom, '')));
```

### **Architecture V2 - Bénéficiaires Normalisés avec Relations Transitives**

#### **Évolution Architecturale (2024-08)**
Migration d'un système monolithique vers une architecture normalisée pour les bénéficiaires controversés avec support des **relations transitives** :

#### **Principe : "À qui profitent vos achats ?"**
Toutes les relations suivent la logique du **flux d'argent depuis le consommateur** :

```
Achat consommateur → Marque → Bénéficiaire direct → Bénéficiaire indirect
```

**Exemples concrets :**
- `Herta → Nestlé` : Les achats Herta profitent à Nestlé (filiale)
- `Nestlé → BlackRock` : Les profits Nestlé profitent à BlackRock (actionnaire)
- **Chaîne complète** : `Achat Herta → Profit Nestlé → Profit BlackRock`

#### **Architecture des Relations**

**Relations Marque → Bénéficiaire** (table `Marque_beneficiaire`)
```sql
Herta → Nestlé     (lien_financier: "Filiale à 100%")
Nike → BlackRock   (lien_financier: "BlackRock actionnaire avec 8%")
```

**Relations Bénéficiaire → Bénéficiaire** (table `beneficiaire_relation`)
```sql
Nestlé → BlackRock  (description_relation: "BlackRock actionnaire principal")
```

**Résultat pour l'utilisateur :**
- Recherche "Herta" → Affichage Nestlé (direct) + BlackRock (transitif via Nestlé)
- Distinction visuelle : direct (orange) vs transitif (bleu)

#### **Sections Marques Directes vs Indirectes (2025-01)**
Chaque bénéficiaire affiche maintenant ses marques liées en sections séparées :

**Marques directement liées :**
- Marques directement associées au bénéficiaire (excluant la marque de recherche)
- Style : badges orange standard

**Marques indirectement liées :**
- Marques des bénéficiaires qui profitent au bénéficiaire via relations transitives
- Groupées par bénéficiaire intermédiaire
- Style : badges bleus pour distinction visuelle

**Exemples concrets :**
```
Recherche "Herta" :
├── Nestlé (direct)
│   └── Marques directes: [Nescafé] (orange)
└── BlackRock (transitif)
    ├── Marques directes: [Nike, Starbucks] (orange)
    └── Marques indirectes via Nestlé: [Herta, Nescafé] (bleu)

Recherche "Starbucks" :
└── BlackRock (direct)
    ├── Marques directes: [Nike] (orange)
    └── Marques indirectes via Nestlé: [Herta, Nescafé] (bleu)
```

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
Beneficiaires: {
  id, nom, impact_generique, type_beneficiaire
  -- ✅ Données centralisées et réutilisables
}

controverse_beneficiaire: {
  beneficiaire_id, titre, source_url, ordre
  -- ✅ Controverses liées aux bénéficiaires
}

Marque_beneficiaire: {
  marque_id, beneficiaire_id, lien_financier, impact_specifique
  -- ✅ Relation pure avec spécificités par marque
}
```

#### **Avantages Architecture V2**
- **Réutilisabilité** : Un bénéficiaire lié à plusieurs marques
- **Consistance** : Mise à jour centralisée des controverses
- **Performance** : Moins de duplication, requêtes optimisées
- **Évolutivité** : Ajout de nouveaux champs bénéficiaire sans impact sur relations
- **Flexibilité** : Système d'impact hybride (spécifique + générique + fallback)

#### **Logique Métier - Impact Hybride**
```typescript
// Priorité des messages d'impact
const getImpactMessage = (liaison: MarqueBeneficiaire) => {
  return liaison.impact_specifique                    // 1. Spécifique marque (priorité)
      || liaison.beneficiaire.impact_generique        // 2. Générique bénéficiaire
      || "Impact à définir"                          // 3. Fallback par défaut
}
```

#### **Composants Frontend V2**
- **`BeneficiaireForm`** : CRUD bénéficiaires centralisés (nom, impact_generique, type_beneficiaire)
- **`ControverseBeneficiaireForm`** : CRUD controversies (titre, source_url, beneficiaire_id)
- **`MarqueBeneficiaireForm`** : Gestion liaisons marque-bénéficiaire (lien, impact)
- **`DirigeantCard`** : Affichage public avec sections séparées marques directes/indirectes
- **`MarquesBadges`** : Badges avec variants `public`, `admin`, et `indirect` (style bleu)
- **API `/beneficiaires`** : ~~Endpoint bénéficiaire-centrique~~ *(Supprimé - logique intégrée dans `/marques`)*
- **API `/marque-beneficiaire`** : Endpoint relation pure CRUD

#### **Types TypeScript - Sections Marques**
```typescript
interface Beneficiaire {
  // ... propriétés existantes
  marques_directes?: Array<{id: number, nom: string}>; 
  marques_indirectes?: {
    [beneficiaireIntermediaire: string]: Array<{id: number, nom: string}>;
  };
}

interface BeneficiaireComplet {
  // ... propriétés existantes  
  marques_directes?: Array<{id: number, nom: string}>;
  marques_indirectes?: {
    [beneficiaireIntermediaire: string]: Array<{id: number, nom: string}>;
  };
}
```

#### **Migration et Compatibilité**
- **Rétrocompatibilité** : Interface publique identique (`BeneficiaireResult`)  
- **Migration SQL** : Script `migration-beneficiaires-v2.sql` avec transformation automatique
- **Types TypeScript** : `MarqueBeneficiaireLegacy` et `BeneficiaireComplet` enrichis avec `toutes_marques`
- **Extension API** : Format `beneficiaires_controverses` maintenu pour extensions

## ⚠️ Dette Technique

### **MarqueDirigeantLegacy - Compatibilité Extension**

**Problème :** Couche de compatibilité temporaire pour l'extension browser qui double la complexité du code.

**Impact actuel :**
- Double maintenance des formats (V2 moderne + legacy)
- **Extension API** : `dirigeant_controverse` généré automatiquement pour compatibilité
- **Web App** : transformations dans `useSearch.ts`, `EventList.tsx`
- Types alias inutiles (`Dirigeant`, `MarqueDirigeant`, `MarqueDirigeantLegacy`)
- Code duplicatif dans l'API pour maintenir les deux formats

**Plan de nettoyage :**
1. **Phase 1** : Migrer extension browser vers format `beneficiaires_marque`
2. **Phase 2** : Supprimer `MarqueDirigeantLegacy` et toute la logique `dirigeant_controverse`
3. **Phase 3** : Simplifier `useSearch` pour utiliser directement le format V2

**Bénéfices attendus :**
- Code 30% plus simple
- Performances améliorées (moins de transformations)
- Un seul format de données partout
- Maintenance facilitée

**Fichiers concernés :**
- `src/types/index.ts` : Types legacy (`MarqueDirigeantLegacy`)
- `src/hooks/useSearch.ts` : Transformations format legacy → V2
- **`extension-api/netlify/functions/marques.js`** : Génération automatique `dirigeant_controverse`
- `src/components/events/EventList.tsx` : Logique de transformation
- `Xtension/` : Extension browser utilisant encore le format legacy

**Exemple de dette technique :**
```javascript
// Dans extension-api/netlify/functions/marques.js
// ❌ Code duplicatif pour compatibilité
dirigeant_controverse = {
  controverses: controversesStructurees.map(c => c.titre).join(' | '),
  sources: controversesStructurees.map(c => c.source_url),
  // ... transformation V2 → legacy
}

// ✅ Format moderne utilisé par web app
beneficiaires_marque: [{ 
  beneficiaire: { 
    controverses: controversesStructurees, // Format structuré
    marques_directes: [...],
    marques_indirectes: {...}
  }
}]
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
DirigeantCard → Extension-API.marques → toutes_marques[] ✅ *(beneficiaires endpoint supprimé)*

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
