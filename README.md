# incidents-labo-api — Frontend

Interface React (Vite) permettant de consulter les locaux et postes, signaler des incidents et suivre
leur résolution. Elle consomme l'API REST du dossier `backend/` (aucune donnée simulée/mockée).

## Démarrer le projet

```bash
npm install
npm run dev
```

L'application démarre sur `http://localhost:5173`. En développement, les appels vers `/api/...` sont
automatiquement redirigés vers le backend (`http://localhost:8080`) grâce au proxy configuré dans
`vite.config.js` — démarrez donc aussi le backend en parallèle.

## Construire pour la production

```bash
npm run build
```

Les fichiers statiques sont générés dans `dist/`. En production (Kubernetes), c'est l'Ingress qui route
les requêtes `/api` vers le backend et `/` vers ces fichiers statiques — aucune URL de backend n'est
donc codée en dur dans le frontend.

## Structure

| Dossier | Rôle |
|---|---|
| `src/api` | Client HTTP centralisé (`fetch`) vers l'API REST |
| `src/pages` | Les 5 pages de l'application |
| `src/components` | Composants réutilisables (navigation, états de chargement/erreur) |
| `src/index.css` | Variables de thème et styles globaux — personnalisez-les pour votre identité visuelle |

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Liste des locaux | Affiche tous les locaux |
| `/locaux/:localId/postes` | Postes d'un local | Liste des postes d'un local sélectionné |
| `/incidents` | Liste des incidents | Avec filtres par statut et priorité |
| `/incidents/nouveau` | Signaler un incident | Formulaire de création |
| `/incidents/:id` | Détail d'un incident | Détails + changement de statut |

## Personnalisation attendue

Ce code de base est volontairement simple et **sans bogue injecté** : votre équipe doit se l'approprier
en retravaillant la mise en page, les composants, la navigation et l'identité visuelle (logo, nom,
palette) — voir `ENONCE_PROJET.md` pour les exigences précises.

## État du build

<!-- Remplacez OWNER/REPO par l'organisation et le dépôt réels de votre équipe -->
![Frontend CI](https://github.com/OWNER/REPO/actions/workflows/frontend-ci.yml/badge.svg)
