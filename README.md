# Camino API

[![Build Status][ci-img]][ci] [![codecov][codecov-img]][codecov] [![Dependency Status][dep-img]][dep]

[ci-img]: https://travis-ci.org/MTES-MCT/camino-api.svg?branch=master
[ci]: https://travis-ci.org/MTES-MCT/camino-api
[codecov-img]: https://codecov.io/gh/MTES-MCT/camino-api/branch/master/graph/badge.svg
[codecov]: https://codecov.io/gh/MTES-MCT/camino-api
[dep-img]: https://david-dm.org/MTES-MCT/camino-api.svg
[dep]: https://david-dm.org/MTES-MCT/camino-api

> API GraphQL de [Camino](http://camino.beta.gouv.fr/): [api.camino.beta.gouv.fr](https://api.camino.beta.gouv.fr)

---

## Technologies

- [Node.js](https://nodejs.org/)
- [Express.js](http://expressjs.com)
- [PostgreSQL](https://www.postgresql.org/)
- [Express-GraphQL](https://github.com/graphql/express-graphql)
- [Knex.js](https://knexjs.org/)
- [Objection.js](http://vincit.github.io/objection.js/)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Standardjs](https://standardjs.com/)
- [Docker](https://www.docker.com/)

---

## Environnement

- Node.js (v.10 ou plus) et npm
- PostgreSQL (v.10 ou plus)

---

## Utilisation

### Configuration et imports des données

- Cloner ce repo : `git clone https://github.com/MTES-MCT/camino-api.git`.
- Renommer le fichier `.env-example` en `.env` et le compléter.
- Créer une base de données PostgreSQL correspondant au fichier `.env`.
- À l'intérieur du dossier `/backups`, coller le fichier `camino-public.sql` disponible ici : [Camino database](https://github.com/MTES-MCT/camino-database).

### Installation

```bash
# installe les dépendances
npm install

# importe les données depuis /database/camino-public.sql
npm run db:import-public

# crée un utilisateur admin
npm run db:user
```

### Développement

```bash
# démarre le serveur avec nodemon
npm run dev
```

### Production

```bash
# compile l'application avec typescript
npm run build

# démarre le serveur
npm run start
```

---

## Tests

### Tests unitaires

```sh
# lance les tests en local
npm run test:jest
```

### Tests de bout-en-bout

Ces tests sont lancés depuis `camino-ui` avec la commande `npm run test:cypress`.

Pour que cela fonctionne l'API doit être lancée avec `npm run dev`.

Pour que les tests soient plus rapides, on peut utiliser une version publique de la base de données contenant seulement certains titres miniers.

```bash
# crée une copie de la base de données (publique)
npm run db:dump-public

# importe et met à jour la base de données publique et crée un utilisateur super-admin
npm run test:cypress

# lance le serveur
npm run dev
```

---

## Utilitaires

### Récupérer la base de données de production

Pré-requis: avoir un utilisateur se connectant en SSH sur le serveur de production.

```sh
# récupère la dernière version de la base de données de production
# - depuis le serveur: `/srv/backups/camino.sql`
# - vers le dossier local: `/backups/camino.sql`
u=votre-nom-d-utilisateur npm run db:prod-fetch
```

### Exporter la base de données publique vers le serveur de test

Pré-requis: avoir un utilisateur se connectant en SSH sur le serveur de test.

```sh
# exporte la base de données
# - depuis le dossier local: `/backups/camino-public.sql`
# - vers le serveur de test: `/srv/backups/camino.sql`
u=votre-nom-d-utilisateur npm run db:test-push
```

---

## Documentation

La documentation [est disponible ici](https://github.com/MTES-MCT/camino-api/tree/master/manual).

---

## Structure des fichiers

```bash
.
│
├── knex                 # `scripts de création et d'import de la base de données (npm run migrate)
│   ├── migrations       # `création de la base de données`
│   └── seeds            # `import depuis les fichier /sources vers la base de données`
│
├── manual               # `source de la documentation générée avec esdoc`
│
└── src                  # `fichiers sources. Transformés avec npm run build.`
    ├── index            # `point d'entrée`
    │
    ├── api              # `API graphql`
    │   ├── resolvers    # `liens entre l'API et la base de données`
    │   ├── schemas      # `description des nœuds de l'API`
    │   └── types        # `types graphQl customs`
    │
    ├── config           #
    │   ├── index        # `variables globales`
    │   └── knex         # `connexion à la base de données`
    │
    ├── database         # `base de données PostgreSQL`
    │   ├── models       # `modèles de la base de données (knex.js / objection.js)`
    │   └── queries      # `requêtes à la base de données (knex.js / objection.js)`
    │
    ├── business         # `logique métier`
    │   ├── processes    # `scripts de traitement`
    │   ├── rules        # `lois et procédures administratives`
    │   ├── utils        # `utilitaires de filtrage et de classement`
    │   ├── daily        # `scripts de mise à jour quotidiens (npm run daily)`
    │   ├── etape-update # `script effectués lors de la mise à jour d'une étape`
    │   └── monthly      # `scripts de mise à jour mensuels (npm run monthly)`
    │
    └── tools            # `outils`
        ├── dev          # `outils de développement`
        ├── export       # `exportation de la base de données vers des spreadsheets (npm run export)`
        ├── import       # `import de spreadsheets vers des fichiers json dans /sources (npm run import)`
        ├── api-...      # `connexion aux api externes`
        └── emails-send  # `envoi d'email`

```

---

## PostgreSQL

![camino database schema](manual/database/camino-db.svg)

---

## Contribution

Voir [contributing.md](contributing.md) (en anglais) pour plus d'infos.

---

## Crédits

### Production

- [La Fabrique Numérique, Ministère de la transition écologique et solidaire](https://www.ecologique-solidaire.gouv.fr/inauguration-fabrique-numerique-lincubateur-des-ministeres-charges-lecologie-et-des-territoires)

### Équipe

- Guillaume Levieux, intrapreneur
- Joeffrey Arruyer, coach
- [François Romain](http://francoisromain.com), développeur
- [Adrien Risser](https://github.com/risseraka), développeur

---

## Licence

Camino API, le cadastre minier numérique ouvert

[AGPL 3 ou plus récent](https://spdx.org/licenses/AGPL-3.0-or-later.html)
