# Flux GeoJSON

Les flux géographiques de Camino exposent les informations sur les titres miniers et autorisations au format GeoJSON.

Ces flux sont générés via l'[API Rest de Camino](https://docs.camino.beta.gouv.fr/pages/Utilisation/03-rest.html).

Chaque titre minier contient les périmètres géographiques ainsi que les propriétés suivantes :

- identifiant, nom, type, nature, domaine minier, et statut
- dates de demande, début et fin
- surface (en km²) du périmètre
- territoires concernés (communes, départements, et régions)
- administrations concernées
- titulaires et amodiataires avec leur numéro de Siren
- engagement financier
- substances
- volume

## Utilisation

### URL

L’url d'accès aux flux de camino est du type : `https://api.camino.beta.gouv.fr/titres?format=geojson`.

### Paramètres

Le paramètre `format=geojson` définit le format des données.

Le résultat de la requête peut être filtré en ajoutant des paramètres à l’url. Les noms et valeurs de ces paramètres sont les mêmes que ceux utilisés dans les filtres sur le site [camino](https://camino.beta.gouv.fr).

#### Construire une requête filtrée avec des paramètres

1. Effectuer une recherche filtrée sur le site [Camino](https://camino.beta.gouv.fr). Par exemple, pour n'afficher que les titres de type _concessions_ du domaine _hydrocarbures_ avec un statut _valide_ l'url est : `https://camino.beta.gouv.fr/titres?domainesIds=h&statutsIds=val&typesIds=cx`.

2. Modifier cette url en ajoutant `api.` après `https://`, et `&format=geojson` en fin de chaîne. L'url modifiée est : `https://api.camino.beta.gouv.fr/titres?domainesIds=h&statutsIds=val&typesIds=cx&format=geosjson`.

3. Le résultat s'affiche au format GeoJSON.

### Authentification

Certains titres miniers et autorisations nécessitent d'être identifiés pour être consultés. Un compte sur Camino est requis pour effectuer cette requête.

#### Construire une requête avec authentification

Ajouter les identifiants Camino dans l'url. L'identifiant à Camino est un email, pour l'utiliser dans l'url, il faut remplacer le caratère `@` par `%40`. Le caractère `@` est ajouté après le mot de passe.

Exemple: `https://mon-email%40mon-domaine.tld:mon-mot-de-passe@api.camino.beta.gouv.fr/titres?format=geosjson`.

### Proxy du **RIE** (Réseau Interministériel de l'État)

- hôte : `pfrie-std.proxy.e2.rie.gouv.fr`
- Port : `8080`

## Utilisation dans QGIS

Les flux GeoJSON de Camino peuvent être affichés dans [QGIS](https://www.qgis.org) sous forme de couche.

Les donnés importées sont automatiquement mises à jour à chaque ouverture ou rafraîchissement du projet.

### Import avec le plugin dédié camino-flux-QGIS

Camino dispose d'un plugin dédié pour simplifier l'utilisation des flux GeoJSON.

Les instructions sont disponibles sur cette page : [https://github.com/MTES-MCT/camino-flux-QGIS](https://github.com/MTES-MCT/camino-flux-QGIS).

### Import sans plugin

1. Dans le menu _Couches_, sélectionner _Gestionnaire des sources de données_, puis choisir l'option _Vecteur_.
2. Dans la popup, utiliser les réglages suivants :

- type de source : `Protocole : HTTP(S), cloud, etc.`
- encodage : `UTF-8`
- Protocole :
  - Type : `GeoJSON`
  - URI : `https://api.camino.beta.gouv.fr/titres?format=geojson` (ou une URL plus spécifique, selon les instructions ci-dessus)

![camino qgis data sources manager](https://raw.githubusercontent.com/MTES-MCT/camino-api/master/docs-sources/assets/flux/camino-qgis-data-source-manager.jpg)
