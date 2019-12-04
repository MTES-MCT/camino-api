# Sauvegardes et restaurations de la base de données et des fichiers

## Sauvegarde

```sh
# exécutable de sauvegarde
/srv/scripts/backup
```

- écrase le fichier `/srv/backups/camino.sql` avec un export de la base de données
- écrase le dossier `/srv/backups/files` avec les fichiers
- ajoute une archive nommée `yyyymmdd_hhMMss.tar.gz` contenant les deux dossiers ci-dessus

## Restauration

```sh
# exécutable de sauvegarde
/srv/scripts/restore
```

- restaure la base de données à partir du fichier `/srv/backups/camino.sql`
- restaure les fichiers à partir du dossier `/srv/backups/files`
