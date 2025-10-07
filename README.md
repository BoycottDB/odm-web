### Our service focuses primarily on brands consumed in France. If you would like a similar service in your country, don't hesitate to fork this project and launch it!
### Let's launch the era of piracy everywhere!

![Alt Text](https://media1.tenor.com/m/Nt6Zju-KjTsAAAAC/luffy-one-piece.gif)

# Répertoire Collaboratif des Marques à Boycotter

## Présentation du projet
Ce projet a pour but d’informer les consommateurs sur les pratiques éthiques, sociales et environnementales des marques, afin de leur permettre de prendre des décisions d’achat éclairées et responsables. L’approche est collaborative, transparente et strictement neutre.

## Valeurs fondamentales
- **Transparence totale** : Toutes les décisions (ajout ou refus d’une marque) sont publiques et argumentées.
- **Collaboration communautaire** : Contribution ouverte à tous, avec validation par modération communautaire stricte.
- **Neutralité et responsabilité individuelle** : Information claire sans jugement moral ; chaque utilisateur reste libre de son choix.
- **Non lucratif** : Seuls les dons éventuels serviront à couvrir les frais d’hébergement.

## Fonctionnement du projet
- **Base de données collaborative** : Stockée dans un dépôt Git public (GitHub/GitLab). Contributions via merge requests, modération transparente, historique clair et accessible.
- **Workflow de contribution** :
    1. Fork du dépôt
    2. Création d’une merge request
    3. Validation (ou refus justifié) par la communauté
    4. Historique public et argumenté
- **Modération** : Chaque validation ou refus est justifié publiquement dans un onglet dédié.
- **Automatisation future** : Formulaires simplifiés pour contributeurs non-techniques.

## Architecture de la Base de Données

### Modèles Principaux
- **Marque** : Marques et entreprises référencées avec secteur d'activité
- **Événement** : Controverses et pratiques documentées
- **Bénéficiaire** : Bénéficiaires controversés avec liens financiers vers marques
- **BeneficiaireRelation** : Relations financières entre bénéficiaires (chaîne récursive)
- **SecteurMarque** : Secteurs d'activité pour conseils de boycott ciblés
- **Proposition** : Système de modération collaborative
- **Décision** : Historique transparent des validations/rejets

### Relations
```
Marque (1) ←→ (N) Événement
Marque (N) ←→ (N) Bénéficiaire (via MarqueBénéficiaire)
Bénéficiaire (N) ←→ (N) Bénéficiaire (via BeneficiaireRelation - chaîne récursive)
Marque (N) ←→ (1) SecteurMarque (optionnel)
Proposition (1) ←→ (1) Décision
```

### Exemple de Données
| Marque | Événement | Date | Catégorie | Condamnation Judiciaire | Source |
|--------|-----------|------|-----------|------------------------|--------|
| Danone | Contamination usine Miribel | Sept. | Sécurité alimentaire | ❌ | [Lien officiel] |
| Meta | Amende RGPD record | Mai | Protection données | ✅ | [Décision CNIL] |

## Stack Technique

### Frontend
- **Framework** : Next.js 15 avec App Router
- **Language** : TypeScript strict
- **Styling** : Tailwind CSS + Design System personnalisé
- **UI Components** : Composants React modulaires
- **PWA** : Installation native iOS/Android

### Backend & Base de Données
- **Architecture Hybride** : Lectures via odm-api (cache CDN), écritures directes Supabase
- **BaaS** : Supabase (PostgreSQL + API REST)
- **ODM API** : Netlify Functions pour cache optimisé et performance
- **Algorithmes Avancés** : Chaîne récursive de bénéficiaires avec détection de cycles
- **ORM** : Client Supabase TypeScript avec DataService abstraction layer
- **Auth** : Authentification admin par token
- **Storage** : Assets et images via Supabase Storage

### Sécurité & Validation
- **Protection spam** : Honeypot + Captcha + Rate limiting
- **Validation** : Schémas personnalisés côté client et serveur
- **Middleware** : Protection routes admin
- **CORS** : Configuration sécurisée pour production

### Performance & SEO
- **Architecture Hybride** : Cache CDN multi-niveaux (5-20min TTL) via odm-api optimisé
- **SQL JOINs Unifiés** : Requêtes optimisées éliminant les anti-patterns N+1
- **Endpoint Spécialisé** : API suggestions ultra-rapide (96ms) pour auto-complétion
- **Recherche Déléguée** : Filtrage serveur pour réduire le transfert de données
- **Fallback Automatique** : Basculement transparent vers Supabase direct si API indisponible
- **SSR/SSG** : Pre-rendering Next.js pour SEO optimal
- **Image Optimization** : Next.js Image avec WebP
- **Bundle Splitting** : Code splitting automatique
- **Edge Functions** : Réponses ultra-rapides depuis le CDN global

## Fonctionnalités Principales

### Interface Utilisateur
- **🎯 Recherche Intelligente** : SearchHero avec suggestions temps réel et navigation automatique
- **⚡ Auto-complétion <100ms** : Suggestions ultra-rapides avec AbortController anti-race-conditions
- **📱 Design Responsive** : Mobile-first avec PWA native
- **🔗 Navigation Fluide** : URLs SEO-friendly (`/marques/[slug]`) avec scroll automatique
- **🎨 Filtres Avancés** : Recherche, secteur, bénéficiaire, tri avec sync URL bidirectionnelle
- **♿ Accessibilité** : WCAG 2.1 compliant, navigation clavier fluide
- **💡 Conseils de Boycott** : Recommandations pratiques par marque et secteur

#### Architecture Recherche (SearchHero)

**Pattern URL-first avec redirections intelligentes :**
- **Suggestions** : Match préfixe via `/suggestions` endpoint (ILIKE `q%`, sub-100ms)
- **Navigation match exact** : Redirect vers `/marques/${slug}` si marque trouvée
- **Navigation no-match** : Redirect vers `/marques?search=${query}` avec état "Pas de résultats"
- **Filtres URL-based** : Tous les filtres persistés dans l'URL (refresh-safe)
- **Source tracking** : Analytics différencié (`marques_list` vs `marque_detail`)

### Système de Données
- **📊 Affichage Enrichi** : Chronologie, catégories, condamnations judiciaires
- **🔗 Chaîne de Bénéficiaires** : Traçabilité financière complète (ex: Maybelline → L'Oréal → Nestlé → BlackRock)
- **💰 Relations Financières** : Algorithme récursif pour découvrir les bénéficiaires indirects
- **🏢 Marques Directes** : Marques directement liées à chaque bénéficiaire
- **🔗 Marques Indirectes** : Marques accessibles via chaîne de bénéficiaires intermédiaires
- **📋 Sources Vérifiées** : Liens directs vers sources officielles
- **⚖️ Notices Légales** : Disclaimers pour condamnations judiciaires
- **🎯 BoycottTips** : Conseils personnalisés par marque et secteur d'activité

### Modération Collaborative
- **✍️ Signalements** : Formulaire sécurisé avec détection de doublons
- **🤝 Validation Communautaire** : Interface admin pour modération
- **📝 Transparence** : Historique public des décisions
- **🛡️ Anti-spam** : Protection multicouche contre les abus

### Administration
- **👥 Gestion Marques** : CRUD complet avec statistiques et structure unifiée
- **👤 Gestion Bénéficiaires** : Création et liaison avec marques via relations optimisées
- **🏷️ Gestion Secteurs** : Catégorisation marques pour BoycottTips
- **📋 Interface Modération** : Workflow optimisé pour les propositions
- **📊 Dashboard Monitoring** : Health checks essentiels avec design unifié

## Déploiement & Infrastructure

### Hébergement
- **Frontend** : Netlify (déploiement automatique depuis Git)
- **Backend** : Supabase (BaaS managed PostgreSQL)
- **CDN** : Global edge network pour performance mondiale
- **Monitoring** : UptimeRobot + Sentry + Dashboard admin intégré

### CI/CD
- **Git Workflow** : Déploiements automatiques depuis `main`
- **Preview Deployments** : Environnement de test pour chaque PR
- **Type Checking** : Validation TypeScript automatique
- **Linting** : ESLint + Prettier pour qualité de code

### Performance & Monitoring
- **Bundle Analysis** : Optimisation taille automatique
- **Core Web Vitals** : Monitoring performance continue
- **Image Optimization** : Compression et formats modernes automatiques

#### Système de Surveillance Intégré
- **Dashboard Admin** : Interface `/admin/metrics` minimaliste
  - Health checks essentiels uniquement (odm-api + Supabase)
  - Temps de réponse et status opérationnel
  - Refresh manuel (auto-refresh optionnel)
  - Design harmonisé avec interface admin
  
- **Monitoring Externe** : Stack complémentaire optimisée
  - **UptimeRobot** : Surveillance uptime 24/7 avec alertes SMS/email
  - **Sentry** : Error tracking + performance monitoring détaillé
  - **Dashboard admin** : Diagnostic ponctuel et debug interne
  
- **Architecture Monitoring** : Rôles distincts et complémentaires
  - Pas de redondance - chaque outil a sa fonction spécifique
  - Coût optimisé (suppression métriques non-critiques)
  - Focus sur disponibilité système plutôt que stats métier
  
- **Privacy-First** : 100% RGPD compliant
  - Aucune donnée personnelle collectée
  - Métriques techniques essentielles uniquement
  - Monitoring système sans impact utilisateur

## Contribution & Développement

### Setup Développement
```bash
# Installation
npm install

# CLI Netlify (recommandé)
npm i -g netlify-cli

# Configuration environnement
cp .env.example .env.local
# Variables requises :
# SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY (obligatoire)
# NEXT_PUBLIC_EXTENSION_API_URL=https://odm-api.netlify.app (obligatoire)
#   → en local (si l'API est lancée avec Netlify Dev) : NEXT_PUBLIC_EXTENSION_API_URL=http://localhost:8888
# ADMIN_TOKEN=your_admin_token (pour l'interface admin)

# Variables monitoring (optionnelles) :
# SENTRY_DSN=your_sentry_dsn (error tracking)
# NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn (client-side errors)

# Lancement développement (recommandé)
netlify dev

# (Optionnel) Next.js dev server
# npm run dev
```

### Workflow de Contribution
1. **Fork** du repository
2. **Branche feature** : `git checkout -b feature/nouvelle-fonctionnalite`
3. **Développement** avec tests et validation TypeScript
4. **Pull Request** avec description détaillée
5. **Review** communautaire et validation automatique
6. **Merge** après approbation

### Standards de Code
- **TypeScript strict** : Pas de `any`, interfaces complètes
- **ESLint + Prettier** : Formatage automatique
- **Composants fonctionnels** : Hooks uniquement, pas de classes
- **Messages français** : Interface utilisateur en français
- **Performance first** : Optimisations systématiques

### Tests & Qualité
```bash
# Validation complète avant commit
npm run type-check  # TypeScript
npm run lint        # Code quality
npm run build       # Production build

# Monitoring en développement
npm run dev         # Dashboard admin : /admin/metrics
                   # Health checks : http://localhost:3000/api/admin/metrics
```

### Documentation
- **CLAUDE.md** : Instructions pour IA et développeurs
- **ARCHITECTURE.md** : Documentation technique détaillée
- **MONITORING.md** : Guide complet surveillance système (11 types monitoring)
- **Code Comments** : JSDoc pour fonctions complexes uniquement

### Architecture des Données
L'application utilise une **architecture simplifiée** pour optimiser performances et maintenance :

- **Lectures** : Via [odm-api](../odm-api/) avec cache CDN (5-30min)
- **Écritures** : Direct vers Supabase pour fiabilité transactionnelle
- **Performance** : Temps de réponse constant (~50ms) grâce au cache CDN
- **Configuration** : Une seule variable d'environnement (`NEXT_PUBLIC_EXTENSION_API_URL`)

Cette architecture simplifie la maintenance en éliminant la complexité des fallbacks tout en conservant les avantages du cache CDN et la fiabilité de Netlify.

---

## À propos

Notre plateforme vous aide à prendre des décisions d'achat éclairées et responsables en vous informant sur les pratiques éthiques, sociales et environnementales des marques. Notre application vous accompagne tout au long de votre parcours d'achat, en vous fournissant des informations factuelles et vérifiées, issues d’une base de données collaborative alimentée par des utilisateurs comme vous.

Nous ne vous empêcherons jamais de passer commande. Nous comprenons que pour de nombreuses raisons, notamment pour les produits de première nécessité, vous pouvez être amenés à acheter des produits de marques dont les pratiques ne sont pas parfaitement alignées avec vos valeurs.

Notre rôle est simplement de vous permettre d’effectuer vos achats en pleine conscience, selon vos propres valeurs et votre seuil de tolérance personnel. Nous restons strictement neutres : vous avez toujours le choix, et notre engagement consiste uniquement à vous fournir les informations nécessaires pour décider librement.

Nous accordons une grande importance à la transparence : toutes les décisions relatives à l’ajout ou au refus d’une marque dans notre base de données sont publiquement accessibles, avec un historique clair et des motifs argumentés.

Enfin, lorsque cela est possible, nous vous encourageons à privilégier l'achat de produits de seconde main, afin de limiter votre impact environnemental et d’éviter de financer directement des entreprises dont vous ne partagez pas les valeurs. Gardez cependant à l'esprit que l'achat en seconde main maintient indirectement la visibilité de ces marques : faites-le donc en connaissance de cause, avec discernement.
