# Projet de session — `incidents-labo-api`

**Cours** : 420-515 Maintenance logiciel
 **Travail** : équipe de 3

---

## Échéances

| Livrable | Date limite |
|---|---|
| **Remise finale du code** : `main` doit contenir la version finale du projet, dans **les deux dépôts** (`incidents-labo-backend`, `incidents-labo-frontend`) | **13 décembre 2026, 11 h 30** |
| **Démonstration orale** (équipe au complet) | **10 ou 11 décembre 2026** (date précise à confirmer avec l'enseignant) |

> ⚠️ Seul le contenu de la branche `main` au moment de l'échéance est évalué. Après
> **13 décembre 2026, 11 h 30**, tout commit ou Pull Request fusionnée sur `main` n'est pas pris en
> compte pour la correction.

---

## Mise en contexte

Le Département d'informatique a besoin d'un outil simple pour que les étudiants signalent les
postes informatiques problématiques dans les locaux (labos) du département — et que les techniciens
suivent ces signalements jusqu'à leur résolution.

Vous héritez d'une petite API, `incidents-labo-api` (Spring Boot, architecture MVC), déjà
fonctionnelle pour les besoins de base : elle gère des **locaux**, des **postes** à l'intérieur de
ces locaux, et des **incidents** signalés sur un poste. Mais :

- son code contient des **code smells** (semaine 6) ;
- elle a quelques **bogues** actifs, pas toujours couverts par un test ;
- sa couverture de tests est incomplète ;
- elle n'a ni pipeline CI, ni conteneur, ni versionnage de livraison, ni déploiement Kubernetes ;
- il lui manque des **fonctionnalités** demandées par le Département (voir le backlog plus bas).

Vous recevez aussi un **frontend React** (Vite, JavaScript) déjà fonctionnel, qui consomme cette
API : liste des locaux, liste des postes d'un local, liste des incidents (avec filtre simple),
création/signalement d'un incident, détail d'un incident. Le frontend est du code **propre**, sans
bogue ni smell injecté — vous l'étendez pour consommer les nouvelles fonctionnalités que vous
ajoutez au backend.

Les couleurs et le style du frontend sont centralisés (variables CSS, pas de couleurs ou polices
codées en dur dispersées dans les composants) pour faciliter un point de départ, mais **la
personnalisation attendue va au-delà d'un changement de palette** : chaque équipe doit **retravailler
le frontend** pour qu'il ait une identité qui lui est propre (mise en page, composants, navigation,
logo, nom du produit) — un même squelette visuel non retravaillé entre les équipes sera pénalisé
(voir barème). L'objectif est que chaque dépôt d'équipe, visité par un employeur, montre un travail
distinct, pas une copie générique du code de base.

Votre mission, en équipe de 3 : **comprendre** le code hérité,
**corriger** ses bogues, **réusiner** ses smells, **ajouter** les fonctionnalités du backlog (API
**et** interface), **automatiser** la vérification et la livraison des **deux applications**
(CI → Docker → GHCR → Release), et les **déployer** sur Kubernetes (AKS) — en suivant un vrai flux
de travail Git (**Gitflow**) avec Pull Requests bloquantes, du début à la fin.

> Répartissez-vous le travail dans l'équipe et planifiez-vous vous-mêmes : chaque changement passe par une Pull Request revue par au moins un
> coéquipier, jamais un push direct sur `develop` ou `main`.


---

## Mise en place de l'organisation GitHub

1. Un membre de l'équipe crée une **organisation GitHub privée** (gratuite) pour l'équipe
   (ex. `equipe-NN-incidents-labo`).
2. Ajoutez **`sfostine`** comme membre de l'organisation avec le rôle **Owner** (tous les accès).
3. Créez **deux dépôts distincts dans cette organisation** (pas dans un compte personnel, et pas un
   seul dépôt monorepo) :
   - un dépôt **backend** (ex. `incidents-labo-backend`), contenant uniquement le code Spring Boot ;
   - un dépôt **frontend** (ex. `incidents-labo-frontend`), contenant uniquement le code React.

   Chaque dépôt doit avoir **son propre pipeline GitHub Actions** (un fichier `.github/workflows/ci.yml`
   par dépôt, indépendant l'un de l'autre) et **publier sa propre image** sur GHCR (ex.
   `incidents-labo-backend:vX.Y.Z` et `incidents-labo-frontend:vX.Y.Z`) — jamais une seule image
   combinant les deux applications. Les deux dépôts doivent chacun suivre leur propre Gitflow
   (branches, PR, tags, releases) et peuvent donc évoluer et être versionnés **indépendamment** (ex.
   `incidents-labo-backend` en `v1.2.0` pendant que `incidents-labo-frontend` est encore en `v1.0.0`).
   Les deux dépôts sont **privés** pendant le développement (protège votre travail des autres équipes,
   mais limite les minutes GitHub Actions gratuites à **2 000 minutes/mois**, partagées entre **tous**
   les dépôts de l'organisation, donc entre vos deux dépôts — pensez au cache Maven/npm dans vos
   workflows pour économiser).
4. Activez, dans *Org Settings → Packages*, l'option **« Members will be able to create public
   packages, visible to anyone »** si vous prévoyez publier des images publiques (voir plus bas).
5. **Juste avant la remise finale/démonstration**, rendez **les deux dépôts** publics (*Settings →
   General → Danger Zone → Change visibility*, à répéter pour chacun). Cela règle trois choses d'un
   coup : les minutes GitHub Actions deviennent **illimitées**, les **badges d'état de build** dans
   chaque `README.md` s'affichent correctement pour un visiteur externe (ils ne s'affichent pas
   fiablement sur un dépôt privé sans accès), et votre travail devient visible pour un employeur qui
   consulterait votre profil.

> 💡 **Mettre le projet en valeur sur votre profil personnel.** Une fois un dépôt d'organisation
> rendu public, vous pouvez l'afficher sur votre propre profil GitHub (`github.com/<votre-compte>`),
> même si vous n'en êtes pas propriétaire : sur votre page de profil, cliquez sur **« Customize your
> pins »** (« Personnaliser vos épingles »), dans la section *Popular repositories* / *Pinned*.
> Cette fenêtre liste tous les dépôts **publics** auxquels vous contribuez, y compris ceux des
> organisations dont vous êtes membre — cochez `incidents-labo-backend` et/ou
> `incidents-labo-frontend` pour qu'ils apparaissent en vedette sur votre profil. C'est un bon moyen
> de montrer ce projet à un futur employeur qui visite votre profil, après la fin de la session.

### Badges dans le README

Le `README.md` de **chacun** des deux dépôts doit inclure au minimum un badge d'état de **son propre**
pipeline CI, par exemple, dans `incidents-labo-backend/README.md` :

```markdown
![Build](https://github.com/<organisation>/incidents-labo-backend/actions/workflows/ci.yml/badge.svg)
```

et dans `incidents-labo-frontend/README.md` :

```markdown
![Build](https://github.com/<organisation>/incidents-labo-frontend/actions/workflows/ci.yml/badge.svg)
```

Ajoutez aussi, si applicable, un badge de couverture de tests ou d'analyse SonarCloud, par dépôt.

### Visibilité des images GHCR : privée ou publique

Le premier `docker push` crée toujours un package **privé** sur GHCR — il n'y a aucune façon de le
pousser directement en public. Deux choix pour votre équipe :

- **Images privées** : plus simple à mettre en place, mais pour qu'un membre (ou Kubernetes) puisse
  **tirer** l'image depuis l'extérieur du pipeline (ex. `docker pull` local, ou `imagePullSecrets`
  Kubernetes), **cette personne doit utiliser son propre jeton (PAT) `read:packages`**, en étant
  membre de l'organisation avec accès au package. Ce jeton lui appartient : s'il expire ou qu'elle
  quitte l'équipe, il faut le remplacer.
- **Images publiques (recommandé)** : automatisez le changement de visibilité **juste après avoir
  poussé l'image** dans le pipeline CI, avec un appel à l'API GitHub (nécessite un PAT classique
  admin de l'organisation, stocké en secret d'organisation `PACKAGES_ADMIN_TOKEN` — voir la section
  GHCR du plan de match). Une fois public, **aucun jeton n'est requis** pour tirer l'image, ni pour
  Kubernetes ni pour un membre de l'équipe ou un employeur qui consulte votre profil.

---

## Modèle de données fourni

| Entité | Champs principaux | Relation |
|---|---|---|
| **Local** | id, nom (ex. `S-021`, `S-028`, `S-013`, `R-105Lab`, `R-108LAB`), bâtiment | possède plusieurs Postes |
| **Poste** | id, numéro (ex. `Poste 12`), état (`FONCTIONNEL`/`HORS_SERVICE`) | appartient à un Local |
| **Incident** | id, description, priorité (`BASSE`/`MOYENNE`/`HAUTE`), statut, posteId, date de signalement, technicien assigné | lié à un Poste |

Statuts d'un incident (machine à états) :

```
OUVERT → ASSIGNÉ → EN_COURS → RÉSOLU → FERMÉ
```

---

## Règles de travail obligatoires (Gitflow)

- Branches : `main` (production, toujours déployable), `develop` (intégration), `feature/<nom>`,
  `release/<version>`, `hotfix/<nom>` — comme vu dans le cours.
- **Aucun push direct** sur `main` ou `develop`. Tout changement passe par une **Pull Request**.
- **Chaque Pull Request doit être revue par au moins un autre membre de l'équipe** avant fusion.
- **Aucune fusion n'est permise si le pipeline CI n'est pas vert** (build + tests).
- Un `CHANGELOG.md` est mis à jour à chaque release.

### Participation individuelle obligatoire

**Ce projet est en équipe, mais l'évaluation reste individuelle.** La contribution de chaque membre
doit être visible et vérifiable dans l'historique Git (commits, Pull Requests, revues de code) tout
au long du projet, pas seulement à la fin.

> ⚠️ **Tout membre dont la participation est jugée insuffisante (peu ou pas de commits, aucune PR,
> aucune revue, absence de contribution réelle au code/tests/pipeline/déploiement) obtiendra
> automatiquement la note de 0 % pour le projet — et non une simple réduction de points.**
> Une charge de travail inégale entre les membres, si elle est confirmée (historique Git, témoignage
> de l'équipe), peut mener à des notes individuelles différentes pour la même équipe.

### Démonstration orale (semaine 15)

Chaque équipe présente son projet en **démonstration le 10 ou le 11 décembre 2026** (semaine 15 —
date précise par équipe à confirmer avec l'enseignant). Tous les membres doivent être présents et
actifs durant la démonstration (déploiement en direct, explication du pipeline, des choix de
réusinage, etc.).

> ⚠️ **Tout membre incapable d'expliquer le code, ses choix de conception, ou le fonctionnement du
> pipeline CI/CD et du déploiement lors de la démonstration obtient automatiquement la note de
> 0 % pour le projet**, peu importe sa contribution apparente dans l'historique Git. Chaque membre
> doit être en mesure de répondre à des questions sur **n'importe quelle partie** du projet, pas
> seulement la partie qu'il a codée.

---

## Backlog de fonctionnalités à ajouter (choisissez 4 à 5, en équipe)

1. **Historique des changements de statut d'un incident** — chaque transition de statut est
   conservée avec horodatage, consultable via un nouvel endpoint.
2. **Assignation automatique** d'un incident à un technicien selon une règle simple (ex. round-robin
   ou technicien avec le moins d'incidents actifs).
3. **Filtrage et recherche** des incidents par local, priorité, statut, ou plage de dates.
4. **Statistiques par local** — nombre d'incidents ouverts, temps moyen de résolution, poste le plus
   signalé.
5. **Mise hors service automatique d'un poste** après un nombre configurable d'incidents `HAUTE`
   priorité non résolus.
6. **Export CSV** de la liste des incidents, pour que le Département puisse produire un rapport.
7. **Commentaires sur un incident** — un technicien ou un étudiant peut ajouter un commentaire de
   suivi, horodaté.

Chaque fonctionnalité choisie doit être développée sur sa propre branche `feature/...`, avec ses
propres tests, et justifiée en termes de **SemVer** (MINEUR ou MAJEUR?) au moment de sa release.

---

## Livrables attendus en fin de projet

- **Deux dépôts GitHub** de l'équipe (`incidents-labo-backend`, `incidents-labo-frontend`), chacun
  avec son propre historique Gitflow complet (branches, PR revues, commits atomiques).
- Un pipeline **GitHub Actions indépendant par dépôt** : build, tests, couverture (JaCoCo côté
  backend), analyse **SonarCloud**, scan **Trivy**, publication de **sa propre image** sur **GHCR**,
  création automatique de **Release** sur tag `vX.Y.Z` — le backend et le frontend sont construits,
  testés et publiés **séparément**, jamais par un seul pipeline combiné.
- Au moins **2 versions taguées, par dépôt** (ex. `v1.0.0` pour la base corrigée/réusinée, `v1.1.0`
  ou `v2.0.0` après l'ajout des fonctionnalités), avec un `CHANGELOG.md` à jour **dans chacun des
  deux dépôts**.
- Manifestes **Kubernetes** (Deployment, Service, ConfigMap, Secret, Ingress) et un **chart Helm**
  pour le **backend et le frontend**, référençant chacun **sa propre image GHCR**, déployés avec
  succès sur un cluster **AKS** personnel — avec une adresse accessible depuis un navigateur au
  moment de la démonstration.
- Un `README.md` **dans chacun des deux dépôts**, documentant au minimum : architecture, badge de
  build, instructions de déploiement; le `README.md` du backend documente aussi les smells et
  bogues corrigés et les fonctionnalités ajoutées.

---

## Barème indicatif (100 points) — à ajuster par l'enseignant

| Critère | Points |
|---|---|
| Processus Git : Gitflow respecté, PR revues par un coéquipier, aucune fusion sans CI verte | 8 |
| Correction des bogues fournis | 8 |
| Réusinage des code smells identifiés, comportement préservé | 8 |
| Tests unitaires/intégration + couverture JaCoCo raisonnable | 8 |
| Pipeline CI complet, **indépendant pour chacun des deux dépôts** (build, tests, SonarCloud, Trivy, image GHCR, Release) | 12 |
| Fonctionnalités du backlog ajoutées (4-5, API **et** interface), tests et versionnage SemVer justifié | 15 |
| Frontend fonctionnel, bien intégré à l'API, qualité du code React | 8 |
| Identité visuelle **et** structure du frontend retravaillées (pas seulement la palette) | 5 |
| Déploiement Kubernetes fonctionnel (AKS, Helm, backend et frontend) | 8 |
| Qualité du `README.md` et du `CHANGELOG.md` | 5 |
| **Démonstration orale (semaine 15)** : clarté, déploiement en direct fonctionnel, capacité de chaque membre à expliquer n'importe quelle partie du projet | 15 |

> Rappel : un membre incapable d'expliquer le code ou le processus lors de la démonstration obtient
> **0 % pour l'ensemble du projet**, indépendamment des points ci-dessus (voir « Démonstration
> orale » plus haut).
