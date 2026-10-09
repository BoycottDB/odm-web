# Architecture d'odm-web

Site Next.js 15 (App Router) de **Qui j'enrichis ?**. Ce document décrit l'organisation du code. La présentation du projet est dans le [README](README.md).

## Flux de données

```
Navigateur
   │
   ▼
odm-web (Next.js sur Netlify)
   ├─ Lectures ──► DataService ──► odm-api (Netlify Functions, cache) ──► Supabase (clé anon, lecture seule)
   └─ Écritures ─► Routes /api/* ──► supabaseAdmin (clé service_role) ──► Supabase
```

- **Lectures** : toutes passent par [dataService.ts](src/lib/services/dataService.ts), qui appelle `NEXT_PUBLIC_EXTENSION_API_URL/.netlify/functions/<nom>`. Voir le [README d'odm-api](https://github.com/BoycottDB/odm-api) pour la liste des fonctions.
- **Écritures** : routes `src/app/api/*`, côté serveur uniquement, avec le client unique `supabaseAdmin` ([supabaseClient.ts](src/lib/supabaseClient.ts)). Aucune clé Supabase n'est envoyée au navigateur.

## Organisation de `src/`

| Dossier | Contenu |
|---|---|
| `app/` | Pages et routes API (App Router) |
| `app/api/` | Routes d'écriture et d'administration, plus quelques lectures réservées à l'admin |
| `components/` | Composants React : `ui/` (génériques), `events/` (controverses, chaîne de bénéficiaires), `forms/` (signalement), `search/`, `admin/` |
| `hooks/` | Hooks React (filtres de marques, détection mobile, ajout à l'écran d'accueil, décisions) |
| `lib/services/` | `dataService` (lectures via odm-api, écritures via `/api`), `marquesService`, `moderation` (conversion d'un signalement approuvé en controverse) |
| `lib/validation/` | Schémas de validation des routes API, messages en français |
| `lib/auth/`, `middleware.ts` | Authentification admin |
| `lib/security/` | Honeypot anti-spam du formulaire de signalement |
| `lib/analytics.ts` | Événements Umami (sans cookies) |
| `types/` | Types partagés (détail dans `TYPES.md` à la racine du dépôt parent) |

## Pages publiques

| Route | Rendu | Rôle |
|---|---|---|
| `/` | client | Accueil : présentation, vidéo, FAQ |
| `/marques` | ISR 10 min | Liste des marques, filtres, tri |
| `/marques/[slug]` | ISR 10 min, pré-générée (`generateStaticParams`) | Fiche marque : controverses, chaîne de bénéficiaires, conseils |
| `/signaler` | ISR 10 min | Formulaire de signalement |
| `/faq`, `/faq/*` | statique | FAQ (argent, modération, alternatives, pourquoi) |
| `/mentions-legales` | statique | Mentions légales |

## Administration et sécurité

- **Accès admin** : `/admin/*` exige le cookie `admin_token`, comparé à `ADMIN_TOKEN` ([admin.ts](src/lib/auth/admin.ts)). Sans `ADMIN_TOKEN` défini, tout accès est refusé.
- **Écritures** : [middleware.ts](src/middleware.ts) refuse toute écriture sur `/api/*` sans token admin, sauf deux exceptions publiques : `POST /api/propositions` (signalement) et `POST /api/sondage-ecommerce`.
- **Signalements** : stockés en `en_attente`, sans email ni IP, protégés par un honeypot et un captcha. Ils ne deviennent des controverses qu'après approbation ([moderation.ts](src/lib/services/moderation.ts)). La lecture des signalements est réservée à l'admin.
- **Supabase** : RLS activé sur toutes les tables. Le rôle anon (odm-api) n'a que `SELECT` sur les tables publiques, et `Proposition` est réservée à `service_role`.

## Chaîne de bénéficiaires

Une marque est liée à des bénéficiaires (`Marque_beneficiaire`), eux-mêmes liés entre eux (`beneficiaire_relation`). odm-api remonte cette chaîne récursivement, avec une protection contre les cycles, et [ChaineBeneficiaires.tsx](src/components/events/ChaineBeneficiaires.tsx) l'affiche. Schéma complet : `SCHEMA.md` à la racine du dépôt parent.

## Conseils de boycott

Le champ `message_boycott_tips` (par marque ou par secteur) accepte un Markdown étendu : listes, images, galeries, liens. Syntaxe : [MARKDOWN_SYNTAX.md](MARKDOWN_SYNTAX.md).

## Suivi

- **Umami** : statistiques sans cookies. Le script est injecté dans `layout.tsx`, et les événements (`source_click`, `search_error`…) passent par `safeTrack` ([analytics.ts](src/lib/analytics.ts)).
- **Sentry** : erreurs côté client, serveur et edge (`sentry.*.config.ts`). `beforeSend` retire les données personnelles.
- **`/admin/metrics`** : santé d'odm-api et métriques internes.

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Écritures côté serveur |
| `NEXT_PUBLIC_EXTENSION_API_URL` | URL d'odm-api (`https://odm-api.netlify.app`, ou `http://localhost:8888` en local) |
| `ADMIN_TOKEN` | Accès à l'administration |
