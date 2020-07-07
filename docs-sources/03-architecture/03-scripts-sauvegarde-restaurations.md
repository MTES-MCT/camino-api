# Configuration des sauvegardes et restaurations

Ces étapes sont à réaliser lors de la configuration du serveur, afin de créer les commandes de [sauvegarde et restaurations](../backup-restore.md).

## Dossiers de sauvegarde

```sh
# crée le dossier de sauvegarde
sudo mkdir /srv/backups
```

## Sauvegarde de la base de données

Créer un fichier `/srv/scripts/database-backup` contenant:

```sh
#!/bin/bash
# database-backup
# sauvegarde la base de donnees depuis le conteneur Docker

rm -rf /srv/backups/camino.sql

docker exec camino-api_postgres_1 pg_dump --clean --if-exists --format c --no-owner --no-privileges --dbname=camino --host=localhost > /srv/backups/camino.sql

sudo chown git:users /srv/backups/camino.sql
```

## Sauvegarde des fichiers

Créer un fichier `/srv/scripts/files-backup` contenant:

```sh
#!/bin/bash
# files-backup
# sauvegarde les fichiers depuis le volume Docker

rm -rf /srv/backups/files/*

docker cp camino-api_app_1:/app/files/. /srv/backups/files/

sudo chown git:users -R /srv/backups/files
```

## Création d'un fichier d'archive

Créer un fichier `/srv/scripts/backups-archive` contenant:

```sh
#!/bin/bash
# backups-archive
# cree une archive a partir du dossier `files` et du fichier `camino.sql`

cd /srv/backups
tar -zcvf /srv/backups/`date +%Y%m%d"_"%H%M%S`-camino.tar.gz files/* camino.sql
cd -
```

## Sauvegarde complète

Créer un fichier `/srv/scripts/backup` incluant les trois commandes ci-dessus.

```sh
#!/bin/bash
# backup

# sauvegarde la base de donnees
/srv/scripts/database-backup

# sauvegarde les fichiers
/srv/scripts/files-backup

# cree un fichier d'archive
/srv/scripts/backups-archive
```

## Restauration de la base de données

Créer un fichier `/srv/scripts/database-restore` contenant:

```sh
#!/bin/bash
# database-restore
# restaure la base de donnees dans le conteneur Docker a partir de la derniere sauvegarde

docker exec -i camino-api_postgres_1 pg_restore --clean --if-exists --no-owner --no-privileges --dbname=camino < /srv/backups/camino.sql
```

## Restauration des fichiers

Créer un fichier `/srv/scripts/files-restore` contenant:

```sh
#!/bin/bash
# files-restore
# restore les fichiers dans le volume Docker a partir de la derniere sauvegarde

docker cp /srv/backups/files/. camino-api_app_1:/app/files/
```

## Restauration complète

Créer un fichier `/srv/scripts/restore` incluant les deux commandes ci-dessus.

```sh
#!/bin/bash
# restore

# restaure la base de donnees
/srv/scripts/database-restore

# restaure les fichiers
/srv/scripts/files-restore
```

### Permissions

```sh
# attribue le dossier `scripts` à l'utilisateur `git` et au groupe `users`
sudo chown -R git:users /srv/scripts/

# attribue le dossier `backups` à l'utilisateur `git` et au groupe `users`
sudo chown -R git:users /srv/backups

# rend les fichiers du dossier `scripts` exécutables pour le groupe
sudo chmod -R g+x /srv/scripts/

# rend les fichiers du dossier `backups` accessibles en écriture pour le groupe
sudo chmod -R g+w /srv/backups/
```
