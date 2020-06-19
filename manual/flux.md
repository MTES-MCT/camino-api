# Flux

Les flux géographiques de Camino fournissent au format geojson les données spatiales des périmètres des titres miniers ainsi que les données non spatiales suivantes :
- l'identifiant, le nom, le type, la nature (exploitation ou exploration) le domaine, et le statut du titre,
- la date de la demande, ainsi que les dates de début et de fin d'octroi,
- la surface (en km²) du périmètre du titre,
- les administrations concernées par le titre, ainsi que ses références,
- les titulaires et amodiataires, ainsi que leur n°siren
- l'engagement financier,
- les substances qui font l'objet du titre,
- le volume

## URL

L’url d'accès aux flux de camino est du type https://api.camino.beta.gouv.fr/titres?format=geojson

- cette url correspond au mode non authentifié
- __format=geojson__ est un paramètre obligatoire de la requête.

## Import de flux geojson

Sans authentification, l’import n’est possible que sur les flux publiques, c’est à dire ceux proposés par Camino hors connexion.

### Mode authentifié

S'effectue en ajoutant __'compte_camino':'mot_de_passe'@__ dans l'url comme indiqué ici 

![qgis url api camino screenshot](flux_screenshot/qgis-url-api-camino-screenshot.png)

Point d’attention :
- le compte camino étant un email, il est nécessaire de remplacer le caratère __@__ de l'email par __%40__
- les __:__ entre l’email et le mot de passe
- le caractère __@__ après le mot de passe

### Import avec filtres
Il est possible d’ajouter des paramètres à l’url afin de filtrer la requête.
1. Effectuer une recherche filtrée à partir de Camino

2. Copier l’url dans votre navigateur

https://camino.beta.gouv.fr/titres?vueId=carte&domainesIds=h&statutsIds=val&typesIds=cx&zoom=8&centre=48.87555444355432,4.246215820312501

3. Ajouter __api.__ devant camino, et __&format=geojson__ en bout de chaîne.

https://**api.**camino.beta.gouv.fr/titres?vueId=carte&domainesIds=h&statutsIds=val&typesIds=cx&zoom=8&centre=48.87555444355432,4.246215820312501&__format=geosjson__

L’utilisation des filtres est bien entendu cumulable avec le mode authentifié.


## Import de flux geojson dans QGIS

L'import et l'intégration de flux geojson dans un projet QGIS au travers de l'API les rend dynamique.

Ainsi, lors de la ré-ouverture du projet ou à chaque rafraîssement, les donnés de la couche concernée sont automatiquement mises à jour. 


### Import au travers du plugin camino-flux-QGIS

Camino dispose de son propre plugin permettant de façon simplifiée l'import et le chargement sous forme de couche dans QGIS des flux geojson.

Il est disponible pour les versions 3.x de QGIS.

Les informations d'installation et d'utilisation sont disponibles sur le lien github [https://github.com/MTES-MCT/camino-flux-QGIS](https://github.com/MTES-MCT/camino-flux-QGIS)

La documentation utilisateur au format pdf est disponible dans le plugin et également [ici](https://github.com/MTES-MCT/camino-flux-QGIS/blob/master/doc/camino_doc.pdf)

### Import à partir du Gestionnaire des sources de données | Vecteur

- type de source : Protocole : HTTP(S), cloud, etc. 
- encodage : UTF-8
- Protocole :
  - Type : GeoJSON
  - URI : https://api.camino.beta.gouv.fr/titres?format=geojson

![qgis data sources manager screenshot](flux_screenshot/qgis-data-sources-manager-screenshot.png)

## Sur le réseau interministériel de l'Etat (__RIE__)

Les éléments de configuration du le proxy sont :

  * Hôte : __pfrie-std.proxy.e2.rie.gouv.fr__
  * Port : __8080__
