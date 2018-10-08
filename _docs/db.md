# Instructions

Faire un dump de la base de données en local et copier vers le serveur

```bash
pg_dump camino > camino.sql && scp camino.sql <user>@<ip>:/srv/tmp/dumps/camino.sql
```

se connecter au conteneur

```
docker stop camino-api_app_1
docker exec -it camino-api_postgres_1 psql postgres
DROP DATABASE camino; CREATE DATABASE camino;
\q
cd /srv/tmp/dumps/
cat camino.sql | docker exec -i caminoapi_postgres_1 psql -U postgres -d camino
```

```
docker start camino-api_app_1
docker exec -it camino-api_app_1 sh
```
