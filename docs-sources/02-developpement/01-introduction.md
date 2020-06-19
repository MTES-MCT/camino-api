# Développement de l'API de Camino

> [github.com/MTES-MCT/camino-api](https://github.com/MTES-MCT/camino-api)

## Technologies

- [TypeScript](https://typescriptlang.org/)
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

## Guide de démarrage

### Environnement

- Node.js (v.10 ou plus) et npm
- PostgreSQL (v.10 ou plus)

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
npm run db:public-import

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

# importe la base de données publique
# met à jour les données (daily)
# crée un utilisateur super-admin
# lance le serveur de dev
npm run test:cypress
```

---

## Structure des fichiers

```bash
.
│
├── dev                  # `scripts de développement`
├── knex                 # `scripts de création et d'import de la base de données (npm run migrate)
│   ├── migrations       # `création de la base de données`
│   └── seeds            # `import depuis les fichier /sources vers la base de données`
│
├── docs-sources         # `source de la documentation générée avec typeDoc`
│
└── src                  # `fichiers sources. Transformés avec npm run build.`
    ├── index            # `point d'entrée`
    │
    ├── api              # `APIs`
    │   ├── graphql      # `API Graphql`
    │   └── rest         # `API Rest`
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
        ├── export       # `exportation de la base de données vers des spreadsheets (npm run export)`
        ├── import       # `import de spreadsheets vers des fichiers json dans /sources (npm run import)`
        ├── api-...      # `connexion aux api externes`
        └── emails-send  # `envoi d'email`

```

---

## Contribution

Voir [contributing.md](https://github.com/MTES-MCT/camino-api/blob/master/contributing.md) (en anglais) pour plus d'infos.
