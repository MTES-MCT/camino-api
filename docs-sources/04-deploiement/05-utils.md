# Scripts

## Utilitaires

### Récupérer la base de données de production

Pré-requis: avoir un utilisateur se connectant en SSH sur le serveur de production.

```sh
# récupère la dernière version de la base de données de production
# - depuis le serveur: `/srv/backups/camino.sql`
# - vers le dossier local: `/backups/camino.sql`
u=votre-nom-d-utilisateur npm run db:prod-fetch
```

### Exporter la base de données publique vers le serveur de test

Pré-requis: avoir un utilisateur se connectant en SSH sur le serveur de test.

```sh
# exporte la base de données
# - depuis le dossier local: `/backups/camino-public.sql`
# - vers le serveur de test: `/srv/backups/camino.sql`
u=votre-nom-d-utilisateur npm run db:test-push
```

### Recréer la base de données en production

Pré-requis: avoir un utilisateur se connectant en SSH sur le serveur de production.

```sh

# Se connecter dans le container
docker exec -ti camino-api_app_1 sh
npm run db:migrate
npm nun ss:import
npm run db:seed

```

---
