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

## Schéma technique de la base de données

- **Marque**
    - id (PK)
    - nom
- **Événement**
    - id (PK)
    - marque_id (FK)
    - description
    - date
    - catégorie
    - source

Exemple :

| Marque    | Événement                       | Date       | Catégorie | Source             |
|-----------|----------------------------------|------------|-----------|--------------------|
| St Michel | Création du village Bamboula     | 1994-01-01 | Racisme   | lien-source-fiable |

## Stack technique
- **Front-end** : Next.js (React) + Tailwind CSS
- **Base de données** : SQLite (développement) / PostgreSQL (production)
- **Base de données** : Supabase (API REST via @supabase/supabase-js)

## Fonctionnalités principales
- Recherche rapide par marque
- Affichage chronologique des événements
- Informations détaillées et vérifiées, avec sources

## Hébergement
- Solutions gratuites ou peu coûteuses (Vercel, Netlify)

## Contribution et workflow
1. Fork du dépôt
2. Merge Request
3. Validation communautaire avec justification publique

Voir `CONTRIBUTING.md` pour plus d’informations sur la contribution et la modération.

---

## À propos

XXX vous aide à prendre des décisions d'achat éclairées et responsables en vous informant sur les pratiques éthiques, sociales et environnementales des marques. Notre application vous accompagne tout au long de votre parcours d'achat, en vous fournissant des informations factuelles et vérifiées, issues d’une base de données collaborative alimentée par des utilisateurs comme vous.

Nous ne vous empêcherons jamais de passer commande. Nous comprenons que pour de nombreuses raisons, notamment pour les produits de première nécessité, vous pouvez être amenés à acheter des produits de marques dont les pratiques ne sont pas parfaitement alignées avec vos valeurs.

Notre rôle est simplement de vous permettre d’effectuer vos achats en pleine conscience, selon vos propres valeurs et votre seuil de tolérance personnel. Nous restons strictement neutres : vous avez toujours le choix, et notre engagement consiste uniquement à vous fournir les informations nécessaires pour décider librement.

Nous accordons une grande importance à la transparence : toutes les décisions relatives à l’ajout ou au refus d’une marque dans notre base de données sont publiquement accessibles, avec un historique clair et des motifs argumentés.

Enfin, lorsque cela est possible, nous vous encourageons à privilégier l'achat de produits de seconde main, afin de limiter votre impact environnemental et d’éviter de financer directement des entreprises dont vous ne partagez pas les valeurs. Gardez cependant à l'esprit que l'achat en seconde main maintient indirectement la visibilité de ces marques : faites-le donc en connaissance de cause, avec discernement.
