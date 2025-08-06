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
- **Marque** : Marques et entreprises référencées
- **Événement** : Controverses et pratiques documentées
- **Dirigeant** : Dirigeants controversés avec liens vers marques
- **Proposition** : Système de modération collaborative
- **Décision** : Historique transparent des validations/rejets

### Relations
```
Marque (1) ←→ (N) Événement
Marque (N) ←→ (N) Dirigeant (via DirigeantMarque)
Proposition (1) ←→ (1) Décision
```

### Exemple de Données
| Marque | Événement | Date | Catégorie | Condamnation Judiciaire | Source |
|--------|-----------|------|-----------|------------------------|--------|
| Danone | Contamination usine Miribel | 2022-09-15 | Sécurité alimentaire | ❌ | [Lien officiel] |
| Meta | Amende RGPD record | 2023-05-22 | Protection données | ✅ | [Décision CNIL] |

## Stack Technique

### Frontend
- **Framework** : Next.js 15 avec App Router
- **Language** : TypeScript strict
- **Styling** : Tailwind CSS + Design System personnalisé
- **UI Components** : Composants React modulaires
- **PWA** : Installation native iOS/Android

### Backend & Base de Données
- **BaaS** : Supabase (PostgreSQL + API REST)
- **ORM** : Client Supabase TypeScript
- **Auth** : Authentification admin par token
- **Storage** : Assets et images via Supabase Storage

### Sécurité & Validation
- **Protection spam** : Honeypot + Captcha + Rate limiting
- **Validation** : Schémas personnalisés côté client et serveur
- **Middleware** : Protection routes admin
- **CORS** : Configuration sécurisée pour production

### Performance & SEO
- **SSR/SSG** : Pre-rendering Next.js pour SEO optimal
- **Image Optimization** : Next.js Image avec WebP
- **Bundle Splitting** : Code splitting automatique
- **Caching** : Stratégies de cache intelligentes

## Fonctionnalités Principales

### Interface Utilisateur
- **🔍 Recherche Unifiée** : Marques + dirigeants avec auto-complétion intelligente
- **📱 Design Responsive** : Mobile-first avec PWA native
- **⚡ Performance** : Chargement instantané avec cache optimisé
- **♿ Accessibilité** : WCAG 2.1 compliant, navigation clavier

### Système de Données
- **📊 Affichage Enrichi** : Chronologie, catégories, condamnations judiciaires
- **🔗 Dirigeants Controversés** : Liens entre dirigeants et marques
- **📋 Sources Vérifiées** : Liens directs vers sources officielles
- **⚖️ Notices Légales** : Disclaimers pour condamnations judiciaires

### Modération Collaborative
- **✍️ Signalements** : Formulaire sécurisé avec détection de doublons
- **🤝 Validation Communautaire** : Interface admin pour modération
- **📝 Transparence** : Historique public des décisions
- **🛡️ Anti-spam** : Protection multicouche contre les abus

### Administration
- **👥 Gestion Marques** : CRUD complet avec statistiques
- **👤 Gestion Dirigeants** : Création et liaison avec marques
- **📋 Interface Modération** : Workflow optimisé pour les propositions
- **📈 Analytics** : Statistiques d'usage et performance

## Déploiement & Infrastructure

### Hébergement
- **Frontend** : Vercel (déploiement automatique depuis Git)
- **Backend** : Supabase (BaaS managed PostgreSQL)
- **CDN** : Global edge network pour performance mondiale
- **Monitoring** : Uptime monitoring + error tracking

### CI/CD
- **Git Workflow** : Déploiements automatiques depuis `main`
- **Preview Deployments** : Environnement de test pour chaque PR
- **Type Checking** : Validation TypeScript automatique
- **Linting** : ESLint + Prettier pour qualité de code

### Performance
- **Bundle Analysis** : Optimisation taille automatique
- **Core Web Vitals** : Monitoring performance continue
- **Image Optimization** : Compression et formats modernes automatiques

## Contribution & Développement

### Setup Développement
```bash
# Installation
npm install

# Configuration environnement
cp .env.example .env.local
# Remplir SUPABASE_URL et SUPABASE_ANON_KEY

# Lancement développement
npm run dev
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
```

### Documentation
- **CLAUDE.md** : Instructions pour IA et développeurs
- **ARCHITECTURE.md** : Documentation technique détaillée
- **MODERATION_DEV_BOOK.md** : Guide de modération
- **Code Comments** : JSDoc pour fonctions complexes uniquement

---

## À propos

Notre plateforme vous aide à prendre des décisions d'achat éclairées et responsables en vous informant sur les pratiques éthiques, sociales et environnementales des marques. Notre application vous accompagne tout au long de votre parcours d'achat, en vous fournissant des informations factuelles et vérifiées, issues d’une base de données collaborative alimentée par des utilisateurs comme vous.

Nous ne vous empêcherons jamais de passer commande. Nous comprenons que pour de nombreuses raisons, notamment pour les produits de première nécessité, vous pouvez être amenés à acheter des produits de marques dont les pratiques ne sont pas parfaitement alignées avec vos valeurs.

Notre rôle est simplement de vous permettre d’effectuer vos achats en pleine conscience, selon vos propres valeurs et votre seuil de tolérance personnel. Nous restons strictement neutres : vous avez toujours le choix, et notre engagement consiste uniquement à vous fournir les informations nécessaires pour décider librement.

Nous accordons une grande importance à la transparence : toutes les décisions relatives à l’ajout ou au refus d’une marque dans notre base de données sont publiquement accessibles, avec un historique clair et des motifs argumentés.

Enfin, lorsque cela est possible, nous vous encourageons à privilégier l'achat de produits de seconde main, afin de limiter votre impact environnemental et d’éviter de financer directement des entreprises dont vous ne partagez pas les valeurs. Gardez cependant à l'esprit que l'achat en seconde main maintient indirectement la visibilité de ces marques : faites-le donc en connaissance de cause, avec discernement.
