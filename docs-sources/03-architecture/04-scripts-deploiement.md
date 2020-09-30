# configuration des scripts de déploiement

## Déploiement de l'API

Créer un fichier `/srv/scripts/api-deploy` contenant:

```bash
#!/bin/bash
# api-deploy
# deploie camino-api depuis le docker hub

cd /srv/www/camino-api
docker-compose pull && docker-compose up -d
cd -
```

Rendre le fichier éxécutable

```bash
sudo chmod +x /srv/scripts/api-deploy
```

## Déploiement de l'UI

Créer un fichier `/srv/scripts/ui-deploy` contenant:

```bash
#!/bin/bash
# ui-deploy
# deploie camino-ui depuis le docker hub

cd /srv/www/camino-ui
docker-compose pull && docker-compose up -d
cd -
```

Rendre le fichier éxécutable

```bash
sudo chmod +x /srv/scripts/ui-deploy
```
