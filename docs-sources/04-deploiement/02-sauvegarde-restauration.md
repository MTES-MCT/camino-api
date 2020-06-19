# Sauvegardes et restaurations

## Sauvegarde

```sh
# sauvegarde la base de données et les fichiers (exécutable)
/srv/scripts/backup
```

- écrase le fichier `/srv/backups/camino.sql` avec un export de la base de données
- écrase le dossier `/srv/backups/files` avec les fichiers
- ajoute une archive nommée `yyyymmdd_hhMMss-camino.tar.gz` contenant les deux dossiers ci-dessus

### Automation

La sauvegarde est executés chaque jours à 2h (tâche cron).

Les tâches sont exécutées par l'utilisateur `git`.
Le fichier cron se trouve ici: `/var/spool/cron/crontabs/git`.

## Restauration

```sh
# restaure la base de données et les fichiers (exécutable)
/srv/scripts/restore
```

- restaure la base de données à partir du fichier `/srv/backups/camino.sql`
- restaure les fichiers à partir du dossier `/srv/backups/files`
