# Base de données

L'Api Camino fonctionne avec une base de données PostgreSQL.

![camino database schema](https://raw.githubusercontent.com/MTES-MCT/camino-api/master/docs-sources/assets/database/camino-db.svg)

Le fichier `package.json` fournit des commandes pour réaliser des dumps et des
imports de la base de données au format binaire. Vous pouvez définir le nom
d'utilisateur de la base de données ou le nom du serveur via les [variables
d'environnement de PostgreSQL](https://docs.postgresql.fr/12/libpq-envars.html).

```sh
# faire un dump depuis la base de données locale (./camino.sql)
npm run db:dump

# importer un dump (./camino.sql)
npm run db:import
```
