### Our service focuses primarily on brands consumed in France. If you would like a similar service in your country, don't hesitate to fork this project and launch it!
### Let's launch the era of piracy everywhere!

![Alt Text](https://media1.tenor.com/m/Nt6Zju-KjTsAAAAC/luffy-one-piece.gif)

# Qui j'enrichis ?

Quand j'achète cette marque, qui s'enrichit ? Le site remonte la chaîne de propriété d'une marque jusqu'aux groupes et aux personnes qui en profitent, et montre leurs controverses, datées et sourcées. Chacun décide ensuite en conscience.

## Principes

- **Des faits sourcés** : chaque controverse renvoie à sa source et affiche la réponse de l'entreprise quand elle existe.
- **Contributions modérées** : tout le monde peut signaler une controverse via le formulaire du site. Les signalements sont anonymes (aucun email ni IP stockés) et relus avant publication. Les décisions de modération sont publiques.
- **Respect des utilisateurs** : statistiques sans cookies (Umami), aucun suivi publicitaire.
- **Non lucratif** : ni publicité, ni partenariat commercial.

## Stack

- Next.js 15 (App Router), TypeScript strict, Tailwind CSS
- Supabase (PostgreSQL), accédé uniquement côté serveur
- Lectures via [odm-api](https://github.com/BoycottDB/odm-api) (Netlify Functions + cache CDN), écritures directes vers Supabase
- Hébergement Netlify, erreurs suivies avec Sentry

Détails techniques : [ARCHITECTURE.md](ARCHITECTURE.md).

## Développement

```bash
npm install
cp .env.example .env.local   # SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_EXTENSION_API_URL, ADMIN_TOKEN
netlify dev                  # ou npm run dev
```

Avant chaque commit :

```bash
npm run type-check && npm run lint
```

## Contribuer

- **Données** (une controverse, un lien de propriété) : passez par le formulaire « Signaler » du site.
- **Code** : fork, branche, puis pull request.

## Licence

[AGPL-3.0](LICENSE) : vous pouvez réutiliser, modifier et redistribuer ce code, à condition de publier vos modifications sous la même licence, y compris si vous le faites tourner sur un site.
