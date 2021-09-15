# Base de données

L'Api Camino fonctionne avec une base de données PostgreSQL.

![camino database schema](https://raw.githubusercontent.com/MTES-MCT/camino-api/master/docs-sources/assets/database/camino-db.svg)

## Chargement des données

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

## Migration des données

Le dossier `migrations` contient toutes les migrations relatives (schéma et données) à la base de données.
Lors du démarrage de l’application, `knex` vérifie si il ne doit pas exécuter des migrations en vérifiant
l’état courant de la base de données via la table `knex_migrations`.

Pour créer une nouvelle migration il faut exécuter la commande suivante :

```bash
npm run db:add-migration -- <nom de la migration>
```

Pour migrer manuellement la base de données sans démarrer l’application, vous pouvez utiliser la commande suivante :

```bash
npm run db:migrate
```

## Affichage des requêtes

Il est possible de tracer l'ensemble des requêtes SQL traitées par le serveur
PostgreSQL avec ces paramètres :

```bash
log_destination = 'stderr'
logging_collector = on
# log_directory = '/var/log/postgresql/'
log_filename = 'postgresql.log'
# log_truncate_on_rotation = on
log_statement = 'all'                   # none, ddl, mod, all
log_line_prefix = '%t'
log_duration = on
# log_min_duration_statement = 10ms
```

Selon la distribution utilisée, l'emplacement des fichiers est le suivant :

- sur Debian, il faut créer un fichier `/etc/postgresql/11/main/conf.d/log.conf`
  (ou autre nom terminant par `.conf`) et les logs seront ensuite disponibles
  dans `/var/log/postgresql/postgresql.log`.
- sur Arch ou certaines images Docker, il faut ajouter la ligne `include = 'custom.conf'` à la fin du fichier `/var/lib/postgres/data/postgresql.conf` et
  créer un fichier `custom.conf` avec les paramètres. Les logs seront ensuite
  disponible dans `/var/lib/postgres/data/log/postgresql.log`.

Une fois, le fichier créé, il faut recharger la configuration de PostgreSQL avec `systemctl reload postrgresql` et `tail -f` sera bien utile.
