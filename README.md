# Camino API

Application en cours de développement, provisoirement accessible [ici](https://camino.site).

Plus d'infos sur le projet [ici](http://camino.beta.gouv.fr/).

---

## Npm scripts

```bash
# Installe les dépendances
npm install

# Démarre le serveur avec nodemon
npm run dev

# Démarre le serveur avec node
npm start
```

---

## Docker

### Pour du dévelopement local

```bash
# Démarre l'application et la base de donnée dans des conteneurs Docker
# en mode `development`
# écoute sur http://localhost:4000
docker-compose -f ./docker-compose.local.yml up --build
```

### Pour du tester l'application en local dans un environement de production

requiert:

* une installation locale et active de https://github.com/jwilder/nginx-proxy
* un certificat ssl auto-signé

[instructions](https://medium.com/@francoisromain/set-a-local-web-development-environment-with-custom-urls-and-https-3fbe91d2eaf0)

```bash
# Démarre l'application dans un container Docker
# en mode `production`
# écoute sur https://api.camino.local
docker-compose -f ./docker-compose.local.yml up --build
```

### Version de production

[instructions](https://medium.com/@francoisromain/host-multiple-websites-with-https-inside-docker-containers-on-a-single-server-18467484ab95)

```bash
# Démarre l'application dans un container Docker
# en mode `production`
# écoute sur http://api.camino.pw
docker-compose up -d --build
```

---

## postgres

```bash
# create tables
npx knex --knexfile=./conf/knex.js migrate:latest

# import data
npx knex --knexfile=./conf/knex.js seed:run
```

---

## Contribution

Voir `contributing.md` (en anglais) pour plus d'infos.

---

## Credits

#### Production

* [La Fabrique Numérique, Ministère de la transition écologique et solidaire](https://www.ecologique-solidaire.gouv.fr/inauguration-fabrique-numerique-lincubateur-des-ministeres-charges-lecologie-et-des-territoires)

#### Équipe

* Guillaume Levieux, intrapreneur
* Joeffrey Arruyer, coach
* [François Romain](http://francoisromain.com), dévelopeur
