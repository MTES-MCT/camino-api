# Manipuler la base de données

## Recréer la base de données dans son conteneur Docker

```sh
# stopper le conteneur de l'API
docker stop camino-api_app_1

# démarrer psql dans le conteneur de la base de données
docker exec -it camino-api_postgres_1 psql postgres
```

```sql
# supprimer la base de données et la re-créer
DROP DATABASE camino; CREATE DATABASE camino;

# quitter psql
\q
```

```sh
# redémarrer le conteneur Docker de l'API
docker start camino-api_app_1
```

## Faire une sauvegarde de la base de données vers l'extérieur

```sh
docker exec -t camino-api_postgres_1 pg_dumpall -c -U postgres > /srv/tmp/dumps/dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
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
cat camino.sql | docker exec -i camino-api_postgres_1 psql -U postgres -d camino
```

## Copier les fichiers pdf (files) sur le serveur

```bash
# localement
tar -zcvf files.tar.gz files/*
scp -r files.tar.gz <user>@<ip>:/srv/tmp/camino-api-files
```

```bash
# sur le serveur
# copie les fichiers dans le volume
cd /srv/tmp/camino-api-files
tar -zxvf files.tar.gz
docker cp /srv/tmp/camino-api-files/. camino-api_app_1:/app/files/

# ou pour la version locale
docker cp files/. camino-api_app_1:/app/files/
```

Inspecter le volume

```bash
# crée un container avec l'image Docker busybox pour inspécter le contenu du volume
docker run -it --rm -v camino-api_files:/vol busybox ls -l /vol
```
