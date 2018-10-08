# Manipuler la base de données

## Recréer la base de données dans son conteneur Docker

```sh
# stopper le conteneur de l'API
docker stop camino-api_app_1

# démarrer psql dans le conteneur de la base de données
docker exec -it camino-api_postgres_1 psql postgres
```

```psql
# supprimer la base de données et la re-créer
DROP DATABASE camino; CREATE DATABASE camino;

# quitter psql
\q
```

```sh
# redémarrer le conteneur Docker de l'API
docker start camino-api_app_1
```

## Démarrer un shell dans le conteneur Docker de l'API

```sh
# start a shell in the camino-api app
docker exec -it camino-api_app_1 sh
```

## Faire un dump de la base de données locale et l'uploader sur le serveur

```bash
pg_dump camino > camino.sql && scp camino.sql <user>@<ip>:/srv/tmp/dumps/camino.sql
```

## Importer la base de données depuis le répertoire tmp vers le conteneur Docker

```sh
# se placer dans le dossier /tmp ou se trouve le dump
cd /srv/tmp/dumps/

# importer la base de données depuis le dump
cat camino.sql | docker exec -i caminoapi_postgres_1 psql -U postgres -d camino
```
