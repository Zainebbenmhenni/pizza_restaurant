# Forno Rosso — site de commande en ligne pour pizzeria

Starter complet et fonctionnel, sur le même principe que mysushiesbly.fr (catégories,
fiches produits, panier, commande) mais pensé pour une pizzeria.

## Stack technique

- **Next.js 14 (App Router) + TypeScript** — un seul projet fait à la fois le site
  (pages, SEO, rendu serveur) et l'API (routes `api/*`), pas besoin d'un backend séparé.
- **Tailwind CSS** — design sur-mesure (voir palette « four à bois » dans `tailwind.config.ts`).
- **PostgreSQL + Prisma ORM** — base relationnelle : catégories, produits, tailles,
  commandes, lignes de commande. Le schéma est dans `prisma/schema.prisma`.
- **React Context + localStorage** pour le panier côté client (pas de rechargement,
  survit à un rafraîchissement de page).

### Pourquoi ce choix

- **PostgreSQL** plutôt que MongoDB : les données sont fortement relationnelles
  (une commande a plusieurs lignes, chaque ligne référence un produit et une taille) —
  exactement le cas d'usage où le relationnel + Prisma brille (migrations typées,
  requêtes sûres, cohérence garantie).
- **Next.js** plutôt que React seul + Express séparé : un seul déploiement, de bonnes
  performances SEO (important pour un restaurant qui veut être trouvé sur Google),
  et des routes API intégrées pour recevoir les commandes.

## Démarrage

```bash
npm install
cp .env.example .env      # renseigne DATABASE_URL avec ta base Postgres
npx prisma migrate dev --name init
npm run prisma:seed       # crée les catégories et pizzas de démonstration
npm run dev
```

Le site tourne sur http://localhost:3000.

### Base de données rapide sans rien installer localement

Tu peux utiliser un Postgres gratuit hébergé (Neon, Supabase, Railway) : crée un
projet, copie l'URL de connexion fournie dans `DATABASE_URL`, puis lance les
commandes `prisma migrate` et `prisma:seed` ci-dessus.

## Structure

```
src/app/
  page.tsx                 → accueil (hero + catégories)
  menu/[category]/page.tsx → liste des produits d'une catégorie
  product/[id]/page.tsx    → fiche produit (taille, quantité, ajout panier)
  panier/page.tsx          → panier (localStorage)
  commande/page.tsx        → formulaire de commande → POST /api/orders
  commande/confirmee/      → page de confirmation
  api/orders/route.ts      → crée la commande + ses lignes en base
src/components/            → Header, Footer, cartes produit, contexte panier
prisma/schema.prisma       → modèle de données
prisma/seed.ts             → données de démonstration (catégories + pizzas)
```

## Ce qu'il reste à faire pour la mise en production

1. **Photos réelles** : remplace les chemins `/images/*.jpg` (actuellement des
   placeholders) par tes vraies photos dans `public/images/`.
2. **Paiement en ligne** : brancher Stripe Checkout dans `commande/page.tsx` et
   `api/orders/route.ts` (actuellement configuré en "paiement à la livraison").
3. **Espace admin** : une page protégée (ou Prisma Studio en interne) pour gérer
   commandes, stock et disponibilité des produits — `npm run prisma:studio` donne
   déjà une interface d'admin basique sur la base de données.
4. **Zones de livraison / horaires** : ajouter un modèle `DeliveryZone` et une
   vérification du code postal si tu veux reproduire cette partie du site de référence.
5. **Notifications** : email/SMS de confirmation (Resend, Twilio) déclenché dans la
   route `api/orders`.
6. **Déploiement** : Vercel (fait pour Next.js) + base Postgres hébergée (Neon/Supabase).

## Design

Palette volontairement éloignée du cliché "crème + terracotta" : fond quasi-noir
(`#1C1712`, ambiance four à bois), rouge sauce tomate cuite (`#C1440E`), jaune
semoule (`#F3E6C8`). Typographie : Fraunces (display, chaleureuse) + Work Sans (texte).
