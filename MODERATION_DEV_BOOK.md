# Dev Book : Système de Modération

## 🎯 Objectif

Implémenter un système de modération complet permettant aux utilisateurs de proposer des marques et événements, avec validation par un administrateur unique et affichage public contrôlé des décisions.

## 📋 Contraintes et Exigences

### Contraintes de Confidentialité
- ❌ **Aucune donnée utilisateur** stockée (pas d'email, nom, pseudo)
- ❌ **Jamais afficher** les propositions en cours de validation
- ✅ **Afficher publiquement** uniquement les décisions validées par la modération
- 🔒 **Contrôle granulaire** sur ce qui devient public
- 🤐 **Anonymat total** - aucun nom de contributeur ou modérateur affiché

### Contraintes de Sécurité
- 🤖 **Protection anti-bots** basique (captcha uniquement)
- 🔍 **Détection de doublons** en temps réel
- ✅ **Validation stricte** des données
- ❌ **Pas de rate limiting** (simplicité d'usage privilégiée)

### Contraintes UX
- 💡 **Suggestions intelligentes** pour éviter les doublons
- 🚀 **Interface fluide** pour la saisie
- 📱 **Responsive** sur tous devices
- 📝 **Résumé des valeurs** sur la page de proposition
- 🔗 **Lien vers page "À propos"** pour plus d'informations

---

## 🏗️ Architecture Technique

### Base de Données Supabase

#### Nouvelle table `Proposition`
```sql
CREATE TABLE "Proposition" (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('marque', 'evenement')),
  data JSONB NOT NULL,
  statut TEXT NOT NULL DEFAULT 'en_attente' 
    CHECK (statut IN ('en_attente', 'approuve', 'rejete')),
  commentaire_admin TEXT,
  decision_publique BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_proposition_statut ON "Proposition"(statut);
CREATE INDEX idx_proposition_type ON "Proposition"(type);
CREATE INDEX idx_proposition_decision_publique ON "Proposition"(decision_publique);
```


### Structure de Données TypeScript

```typescript
interface Proposition {
  id: number;
  type: 'marque' | 'evenement';
  data: MarqueProposition | EvenementProposition;
  statut: 'en_attente' | 'approuve' | 'rejete';
  commentaire_admin?: string;
  decision_publique: boolean;
  created_at: string;
  updated_at: string;
}

interface MarqueProposition {
  nom: string;
}

interface EvenementProposition {
  marque_nom: string;  // Nom de la marque (peut être nouvelle)
  marque_id?: number;  // ID si marque existante
  description: string;
  date: string;
  categorie: string;
  source: string;
  source_url?: string;
}

interface DecisionPublique {
  id: number;
  type: 'marque' | 'evenement';
  titre: string;
  statut: 'approuve' | 'rejete';
  commentaire_admin: string;
  date: string;
}
```

---

## 🔧 Chantiers de Développement

### Phase 1 : Base Technique (3-4 jours)

#### 1.1 Types et Validation
**Fichiers :** `src/types/index.ts`, `src/lib/validation/schemas.ts`
- [ ] Ajouter interfaces `Proposition`, `DecisionPublique`
- [ ] Créer schémas de validation pour propositions
- [ ] Validation de sécurité (longueur, caractères spéciaux, URLs)

#### 1.2 Service API Étendu  
**Fichier :** `src/lib/services/api.ts`
- [ ] Méthodes CRUD pour propositions
- [ ] Méthode de recherche de doublons potentiels
- [ ] Méthode pour décisions publiques

#### 1.3 Routes API Backend
**Fichiers :** `src/app/api/propositions/route.ts`, `src/app/api/decisions-publiques/route.ts`
- [ ] `POST /api/propositions` - Créer proposition
- [ ] `GET /api/propositions` - Lister (admin seulement)
- [ ] `PATCH /api/propositions/[id]` - Modifier statut (admin)
- [ ] `GET /api/decisions-publiques` - Décisions à afficher
- [ ] `GET /api/search-similaire` - Détection doublons

### Phase 2 : Sécurité (1-2 jours)

#### 2.1 Protection Anti-Bots
**Fichiers :** `src/lib/security/`, `src/components/ui/Captcha.tsx`
- [ ] Intégration hCaptcha ou reCAPTCHA v3
- [ ] Validation honeypot (champ caché)

#### 2.2 Authentification Admin
**Fichiers :** `src/lib/auth/`, `middleware.ts`
- [ ] Système de token/session simple pour admin unique
- [ ] Middleware de protection routes admin

### Phase 3 : Interface Utilisateur (4-5 jours)

#### 3.1 Formulaire de Proposition
**Fichiers :** `src/app/proposer/page.tsx`, `src/components/forms/`
- [ ] Page `/proposer` avec section héro + résumé des valeurs
- [ ] Lien vers page "À propos" pour plus d'informations
- [ ] Formulaire dynamique avec choix type (Marque ou Événement)
- [ ] Auto-complétion marques existantes
- [ ] Détection de doublons en temps réel
- [ ] Design cohérent avec les autres pages (gradients orange/amber)
- [ ] Validation front-end + feedback UX
- [ ] Confirmation de soumission anonyme

#### 3.2 Recherche de Doublons Intelligente
**Fichiers :** `src/hooks/useDoubleCheck.ts`, `src/components/forms/SimilarItems.tsx`
- [ ] Hook de recherche par similarité
- [ ] Algorithme de fuzzy matching (nom, description)
- [ ] Composant d'affichage des éléments similaires
- [ ] Interface "Continuer malgré tout" vs "Annuler"

#### 3.3 Interface d'Administration
**Fichiers :** `src/app/admin/`, `src/components/admin/`
- [ ] Page `/admin/moderation` - Dashboard admin unique
- [ ] Liste des propositions en attente
- [ ] Détail d'une proposition avec actions
- [ ] Formulaire de décision (approuver/rejeter uniquement)
- [ ] Gestion de la visibilité publique des décisions
- [ ] Historique complet des actions (sans noms)

### Phase 4 : Intégration avec Modération Publique (2 jours)

#### 4.1 Mise à Jour Page Modération Existante
**Fichier :** `src/app/moderation/page.tsx`
- [ ] Remplacer exemples hardcodés par vraies données
- [ ] Afficher uniquement décisions marquées comme publiques
- [ ] Système de pagination pour l'historique
- [ ] Filtrages par type, date, statut

#### 4.2 Hooks et Services
**Fichiers :** `src/hooks/useDecisions.ts`, `src/lib/services/moderationService.ts`
- [ ] Hook pour récupérer décisions publiques
- [ ] Service de modération avec gestion cache
- [ ] Rafraîchissement automatique des données

### Phase 5 : Workflow de Modération (2 jours)

#### 5.1 Processus d'Approbation
**Fichiers :** `src/lib/moderation/`, `src/app/api/moderation/`
- [ ] Logique d'approbation → création marque/événement
- [ ] Gestion des marques nouvelles vs existantes
- [ ] Audit trail des actions admin (anonyme)

#### 5.2 Gestion des Rejets
- [ ] Templates de réponses pour rejets courants
- [ ] Système de commentaires admin pour justifier les décisions

### Phase 6 : Optimisations et Tests (2 jours)

#### 6.1 Performance
- [ ] Indexation base de données
- [ ] Cache pour recherches fréquentes
- [ ] Pagination et lazy loading

#### 6.2 Tests
- [ ] Tests unitaires des validators
- [ ] Tests d'intégration API
- [ ] Tests end-to-end du workflow complet

#### 6.3 Monitoring Basique
- [ ] Logs des propositions et décisions (anonymes)

---

## 🎨 Spécifications UX/UI Détaillées

### Page de Proposition

#### Section Héro (inspirée de la page À propos)
```
┌─────────────────────────────────────────────────────────────┐
│     Section Hero - Gradient orange/amber/yellow             │
│                                                             │
│         🤝 Proposer une nouvelle entrée                     │
│    Contribuez à l'enrichissement collaboratif              │
│           de notre base de données                         │
└─────────────────────────────────────────────────────────────┘
```

#### Section Valeurs (Résumé)
```
┌─────────────────────────────────────────────────────────────┐
│ 📋 Nos valeurs en bref                                      │
│ • Transparence totale sur toutes les décisions             │
│ • Neutralité et information factuelle                      │
│ • Collaboration communautaire avec modération stricte      │
│ • Projet non lucratif et open source                       │
│                                                             │
│ 👉 [En savoir plus sur notre mission] → /about             │
└─────────────────────────────────────────────────────────────┘
```

#### Formulaire (Design carte blanche avec bordure)
```
┌─────────────────────────────────────────────────────────────┐
│ Type de contribution:                                       │
│ ○ Nouvelle marque                                          │
│ ● Nouvel événement                                         │ 
├─────────────────────────────────────────────────────────────┤
│ Marque: [Nike_____________] [🔍]                           │
│         ↳ 📋 2 marques similaires trouvées                │
├─────────────────────────────────────────────────────────────┤
│ Description: [______________________________]             │
│ Date: [__/__/____]                                         │
│ Catégorie: [Dropdown___________]                           │
│ Source: [URL_________________________]                     │
├─────────────────────────────────────────────────────────────┤
│ ⚠️ Éléments similaires dans la base:                       │
│ • Nike - Travail des enfants (2023)                        │
│ • Nike - Pollution (2022)                                  │
│ [Continuer malgré tout] [Revoir ma saisie]                 │
├─────────────────────────────────────────────────────────────┤
│ [🤖 Captcha]                                               │
│ [Proposer] [Annuler]                                       │
└─────────────────────────────────────────────────────────────┘
```

#### États du Formulaire
- **Vide** : Champs normaux
- **Saisie en cours** : Suggestions temps réel
- **Doublons détectés** : Warning avec options
- **Validation** : Loading + feedback
- **Succès** : Confirmation + next steps
- **Erreur** : Messages clairs + retry

### Dashboard Admin

#### Vue Liste
```
┌─────────────────────────────────────┐
│ 📋 Propositions en attente (12)     │
├─────────────────────────────────────┤
│ [Toutes] [Marques] [Événements]     │
├─────────────────────────────────────┤
│ 🔴 Urgent • Nike - Nouveau scandale │
│    📅 Il y a 2h • 👤 user@email.com  │
│    [Voir] [Approuver] [Rejeter]     │
├─────────────────────────────────────┤  
│ 🟡 Normal • Nouvelle marque "Zara"  │
│    📅 Il y a 4h • 👤 anonymous       │
│    [Voir] [Approuver] [Rejeter]     │
└─────────────────────────────────────┘
```

#### Vue Détail Admin
```
┌─────────────────────────────────────┐
│ 📝 Proposition #123                 │
├─────────────────────────────────────┤
│ Type: Événement                     │
│ Marque: Nike                        │
│ Description: [Texte complet...]     │
│ Source: [URL cliquable]             │
│ Soumis: Il y a 2 heures            │
├─────────────────────────────────────┤
│ 🔍 Vérifications automatiques:      │
│ ✅ Source accessible                │
│ ✅ Pas de doublon exact            │
│ ⚠️ 2 événements similaires trouvés │
├─────────────────────────────────────┤
│ 📝 Commentaire admin (si refus):   │
│ [__________________________]      │
│                                    │
│ ☐ Rendre cette décision publique   │
├─────────────────────────────────────┤
│ [✅ Approuver] [❌ Rejeter]         │
└─────────────────────────────────────┘
```

---

## 🔒 Sécurité - Spécifications Techniques


### Validation de Sécurité
```typescript
// Règles de validation renforcées
const SECURITY_RULES = {
  description: {
    minLength: 10,
    maxLength: 1000,
    forbiddenPatterns: [
      /\b(viagra|casino|crypto)\b/i,  // Spam keywords
      /<script|javascript:/i,          // XSS attempts
      /\b\d{4}-\d{4}-\d{4}-\d{4}\b/  // Credit cards
    ]
  },
  source: {
    requireHttps: false // ⚠️ MODIFIÉ : Plus de liste blanche - validation URL basique seulement
  }
};
```

### Détection de Doublons
```typescript
// Algorithme de similarité
interface SimilarityScore {
  marque: number;      // Correspondance nom marque (0-1)
  description: number; // Similarité description (0-1)
  date: number;        // Proximité temporelle (0-1)  
  overall: number;     // Score global (0-1)
}

// Seuils d'alerte
const SIMILARITY_THRESHOLDS = {
  HIGH: 0.8,    // Doublon très probable
  MEDIUM: 0.6,  // À vérifier
  LOW: 0.4      // Mention seulement
};
```

---

## 📊 Métriques et Monitoring

### Logs Basiques
- Propositions créées (anonymes)
- Décisions d'approbation/rejet
- Échecs de validation

---

## 🚀 Plan de Déploiement

### Phase de Test
1. **Environnement de staging** avec données de test
2. **Tests par équipe restreinte** de modérateurs
3. **Validation workflow** complet bout en bout

### Déploiement Progressif
1. **Soft launch** - Formulaire actif, modération privée
2. **Bêta publique** - Quelques décisions rendues publiques
3. **Production complète** - Tous les workflows actifs

### Migration de Données
- Script de migration des décisions existantes (si besoin)
- Import des marques/événements actuels
- Création comptes modérateurs initiaux

---

## ⚙️ Configuration et Variables d'Environnement

```env
# Sécurité
HCAPTCHA_SITE_KEY=your_site_key
HCAPTCHA_SECRET_KEY=your_secret_key
ADMIN_TOKEN=secure_random_token

# Moderation
SIMILARITY_THRESHOLD=0.6
```

---

## ✅ MISES À JOUR RÉCENTES (2024-08-01)

### Changements Majeurs Implémentés

#### 1. Simplification du Formulaire de Proposition
- **❌ RETIRÉ** : Sélection de catégorie par l'utilisateur  
- **✅ AJOUTÉ** : Date par défaut = aujourd'hui + empêche dates futures
- **💡 RAISON** : L'admin assignera la catégorie plus tard - plus facile pour l'utilisateur

#### 2. Amélioration UX Détection de Doublons
- **❌ RETIRÉ** : Boutons "Revoir ma saisie" / "Continuer quand même" (trop forts)
- **❌ RETIRÉ** : Comparaison avec marques similaires (pas utile)
- **✅ AJOUTÉ** : Information simple et bienveillante sur les événements similaires
- **💡 RAISON** : Pas de pression - juste informatif

#### 3. Suppression Liste Blanche Sources
- **❌ RETIRÉ** : Validation stricte domaines autorisés (`lemonde.fr`, etc.)
- **✅ AJOUTÉ** : Validation URL basique seulement
- **💡 RAISON** : Trop restrictif - l'admin peut juger de la fiabilité

#### 4. Simplification Interface Admin
- **❌ RETIRÉ** : Séparation "Tous" vs "Événements" 
- **✅ AJOUTÉ** : Page `/admin` avec redirection intelligente (token → modération, sinon → login)
- **💡 RAISON** : Il n'y a que des événements maintenant

#### 5. Système de Catégories Refactorisé
- **✅ AJOUTÉ** : Table `Categories` avec structure complète (emoji, couleur, ordre)
- **✅ MIGRÉ** : Événements de `categorie` (string) vers `categorieId` (number + jointure)
- **✅ CORRIGÉ** : API recherche similaire inclut maintenant les catégories
- **💡 IMPACT** : Plus de "Non classé" - catégories s'affichent correctement

### Fichiers Principaux Modifiés
```
src/components/forms/PropositionForm.tsx     # Formulaire simplifié
src/components/forms/SimilarItems.tsx       # Détection doublons informative  
src/lib/validation/schemas.ts               # Plus de liste blanche URLs
src/app/admin/page.tsx                      # Redirection intelligente
src/app/admin/moderation/page.tsx           # Plus de filtres séparés
src/app/api/evenements/route.ts             # Jointure avec Categories
src/app/api/search-similaire/route.ts       # Jointure avec Categories
```

### États Actuels
- ✅ **Formulaire** : Simplifié, date par défaut, pas de catégorie utilisateur
- ✅ **Détection doublons** : Informative, pas de boutons d'action
- ✅ **Sources** : Toutes URLs acceptées (validation basique)
- ✅ **Admin** : Interface unifiée, redirection automatique
- ✅ **Catégories** : Système complet avec jointures fonctionnelles

---

## 📚 Documentation Technique

### Pour les Développeurs
- [ ] README détaillé du système de modération
- [ ] Documentation API avec exemples
- [ ] Guide de contribution pour nouveaux modérateurs
- [ ] Troubleshooting guide

### Pour l'Administrateur
- [ ] Manuel d'utilisation de l'interface admin
- [ ] Critères de validation détaillés
- [ ] FAQ modération

### Pour les Utilisateurs
- [ ] Guide "Comment proposer une entrée"
- [ ] Explication du processus de validation
- [ ] Conseils pour des propositions de qualité

---

## 🔮 Améliorations Futures (V2)

### Fonctionnalités Avancées
- **API publique** pour accès aux données
- **Export** vers formats standards (CSV, JSON)
- **Widget** pour sites partenaires

### Intelligence Artificielle
- **Pré-validation automatique** par IA des sources
- **Classification automatique** des catégories
- **Détection de sentiment** dans les descriptions
- **Suggestion de sources** complémentaires

### Intégrations
- **Webhook** vers Discord/Slack pour équipe mod
- **Export** vers formats standards (CSV, JSON)
- **Synchronisation** avec autres bases éthiques
- **Widget** pour sites partenaires

---

## ✅ Checklist Finale

### Avant Mise en Production
- [ ] Tous les tests passent
- [ ] Sécurité validée par audit
- [ ] Performance testée en charge
- [ ] Documentation complétée
- [ ] Équipe modération formée
- [ ] Monitoring en place
- [ ] Plan de rollback préparé

### Post-Déploiement
- [ ] Surveillance logs première semaine
- [ ] Collecte feedback utilisateurs
- [ ] Ajustements seuils de sécurité si besoin
- [ ] Optimisations performance selon usage réel

---

**Estimation totale : 2-3 semaines de développement à temps plein**

*Ce dev book constitue la feuille de route complète pour implémenter un système de modération robuste, sécurisé et user-friendly qui respecte vos exigences de transparence et de contrôle.*