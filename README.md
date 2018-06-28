# Camino API

> API GraphQl de [Camino](http://camino.beta.gouv.fr/)

---

## Technologies

- Node.js
- Express.js
- Express-GraphQL
- PostgreSQL
- Knex.js
- Objection.js
- Eslint
- Prettier
- Standardjs

---

## Configuration et imports des données

- Requiert une base de données PostgreSQL.
- Renommer le fichier `.env.example` en `.env` et le compléter.
- Le dossier `/_tools/sources` doit contenir les données au format json.

```bash
# installe les dépendances
npm install

# crée les tables
npx knex --knexfile=./conf/knex.js migrate:latest

# importe les données
npx knex --knexfile=./conf/knex.js seed:run
```

---

## Développement

```bash
# démarre le serveur avec nodemon
npm run dev

# démarre le serveur avec node
npm start
```

---

## Docker

### Développement local

```bash
# démarre l'application et la base de données dans des conteneurs Docker
# en mode `development`
# accessible à http://localhost:NODE_PORT
docker-compose -f ./docker-compose.local.yml up --build
```

### Tester l'application en local dans un environnement de production

Pré-requis:

- une installation locale active de https://github.com/jwilder/nginx-proxy
- un certificat ssl auto-signé
- [instructions](https://medium.com/@francoisromain/set-a-local-web-development-environment-with-custom-urls-and-https-3fbe91d2eaf0)

```bash
# démarre l'application et la base de données dans un container Docker
# en mode `production`
# accessible à https://api.camino.local
docker-compose -f ./docker-compose.local.yml up --build
```

### Production

Pré-requis:

- une installation active de https://github.com/jwilder/nginx-proxy
- [instructions](https://medium.com/@francoisromain/host-multiple-websites-with-https-inside-docker-containers-on-a-single-server-18467484ab95)

```bash
# démarre l'application et la base de données dans un container Docker
# en mode `production`
# écoute sur http://api.camino.pw
docker-compose up -d --build
```

---

## PostgreSQL

![camino database schema](_docs/camino-db.png)

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
