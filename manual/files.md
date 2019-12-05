# Fichiers

## En local

### Envoyer les fichiers pdf (files) vers le serveur

```sh
# crée une archive
tar -zcvf files.tar.gz files/*

# envoie l'archive vers le serveur
scp -r files.tar.gz <user>@<ip>:/srv/tmp
```

### Récupérer les fichiers sur le serveur

```sh
# récupère les fichiers sur le serveur
scp -r <user>@<ip>:/srv/tmp/files/* files
```

## Sur le serveur

### Copier les fichiers depuis le volume

```bash
docker cp camino-api_app_1:/app/files/. /srv/tmp/files/
```

### Copier les fichiers vers le volume

```bash
# désarchive les fichiers
tar -zxvf /srv/tmp/files.tar.gz

# copie les fichiers vers le volume
docker cp /srv/tmp/files/. camino-api_app_1:/app/files/
```

### Inspecter le volume

```bash
# crée un container avec l'image Docker busybox pour inspecter le contenu du volume
docker run -it --rm -v camino-api_files:/vol busybox ls -l /vol
```
