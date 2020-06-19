# Base de données

L'Api Camino fonctionne avec une base de données PostgreSQL.

![camino database schema](https://raw.githubusercontent.com/MTES-MCT/camino-api/master/docs-sources/assets/database/camino-db.svg)

```sh
# faire un dump depuis la base de données locale
pg_dump -c -d camino --username=postgres -h localhost -f camino.dump

# importer un dump
psql -d camino --username=postgres -h localhost < camino.dump
```
