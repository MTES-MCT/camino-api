# Camino API

Application en cours de développement, provisoirement accessible [ici](https://camino.site).

Plus d'infos sur le projet [ici](http://camino.beta.gouv.fr/).

---

## Npm scripts

```bash
# Install dependencies.
npm install

# Start server with nodemon
npm run dev

# Start server with node
npm start
```

---

## docker compose

```bash
docker-compose -f ./docker-compose.local.yml up --build
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
