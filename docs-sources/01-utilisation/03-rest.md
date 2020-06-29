# API REST de Camino

L'API REST de Camino permet d'accéder aux données en lecture seule dans différents formats.

## Formats

Les données sont disponibles au formats :

- [JSON](https://www.json.org) : tableau d'objets JavaScript
- [CSV](https://fr.wikipedia.org/wiki/Comma-separated_values) : valeurs séparées par des virgules
- [XLSx](https://fr.wikipedia.org/wiki/XLSX) : Microsoft Excel
- [ODS](https://www.openoffice.org/) : Apache OpenOffice
- [GeoJSON](https://geojson.org/) (pour certaines ressources uniquement) : JSON Géographique

## URL

L'API REST de Camino est accessible à cette url : [api.camino.beta.gouv.fr/<ressource>](https://api.camino.beta.gouv.fr/).

## Méthode

Toutes les ressources sont interrogeables avec la méthode `GET`.

## Ressources

### `/titres`

Retourne la liste des titres.

#### Paramètres

- `format` : format des données (`json`, `geojson`, `csv`, `xlsx` ou `ods`)
- `ordre` : tri par ordre (`asc` : ascendant ou `desc` : descendant)
- `colonne` : colonne sur laquelle se fait le tri (`activites`, `nom`, `statut`, `type` ou `domaine`)
- `typesIds` : liste de types de titres
- `domainesIds` : liste de domaines de titres
- `statutsIds` : liste de statuts de titres
- `substances` : substances de titres
- `noms` : noms de titres
- `entreprises` : entreprises titulaires ou amodiataires
- `references` : références métier de titres
- `territoires` : territoires géographiques

## `/demarches`

Retourne la liste des démarches.

#### Paramètres

- `format` : format des données (`json`, `csv`, `xlsx` ou `ods`)
- `ordre` : tri par ordre (`asc` : ascendant ou `desc` : descendant)
- `colonne` : colonne sur laquelle se fait le tri (`titreNom`, `titreDomaine`, `titreType`, `titreStatut`, `type` ou `statut`)
- `typesIds` : liste de types des démarches
- `statutsIds` : liste de statuts des démarches
- `etapesInclues` : liste d'étapes incluses dans les démarches
- `etapesExclues` : liste d'étapes exclues dans les démarches
- `titresTypesIds` : liste de types de titres
- `titresDomainesIds` : liste de domaines de titres
- `titresStatutsIds` : liste de statuts de titres
- `titresNoms` : noms de titres
- `titresEntreprises` : entreprises titulaires ou amodiataires
- `titresSubstances` : substances de titres
- `titresReferences` : références métier de titres
- `titresTerritoires` : territoires géographiques

### /activites

Retourne la liste des activités.

#### Paramètres

- `format` : format des données (`json`, `csv`, `xlsx` ou `ods`)
- `ordre` : tri par ordre (`asc` : ascendant ou `desc` : descendant)
- `colonne` : colonne sur laquelle se fait le tri (`titreNom`, `titulaire`, `periode` ou `statut`)
- `typesIds` : liste de types des activités
- `statutsIds` : liste de statuts des activités
- `annees` : années des activités
- `titresTypesIds` : liste de types de titres
- `titresDomainesIds` : liste de domaines de titres
- `titresStatutsIds` : liste de statuts de titres
- `titresNoms` : noms de titres
- `titresEntreprises` : entreprises titulaires ou amodiataires
- `titresSubstances` : substances de titres
- `titresReferences` : références métier de titres
- `titresTerritoires` : territoires géographiques

### /utilisateurs

Retourne la liste des utilisateurs

#### Paramètres

- `format` : format des données (`json`, `csv`, `xlsx` ou `ods`)
- `ordre` : tri par ordre (`asc` : ascendant ou `desc` : descendant)
- `colonne` : colonne sur laquelle se fait le tri (`nom`, `prenom`, `email`, `permission` ou `lien`)
- `entrepriseIds` : liste d'entreprises des utilisateurs
- `administrationIds` : liste d'administrations des utilisateurs
- `permissionIds` : liste de permissions des utilisateurs
- `noms` : noms des utilisateurs
- `emails` : emails des utilisateurs

### /entreprises

Retourne la liste des entreprises.

#### Paramètres

- `format` : format des données (`json`, `csv`, `xlsx` ou `ods`)
- `noms` : noms des entreprises

## Authentification

L'API REST est accessible avec un identifiant Camino.

L'identifiant doit être injecté dans le header HTTP `Authentication` avec une des valeurs suivantes :

- `Basic <IDENTIFIANT>`. `IDENTIFIANT` est `mon-email%40domaine.tld:mon-mot-depasse` encodé en base 64.
- `Bearer <TOKEN>`. `TOKEN` reçu après authentification sur le site Camino.

L'identifiant peut être ajouté dans l'URL, le navigateur va le convertir en base 64 et l'injecter dans le header :

- `https://mon-email%40domaine.tld:mon-mot-depasse@<URL>`

Pour plus d'informations, voir la [documentation développeur Mozilla](https://developer.mozilla.org/fr/docs/Web/HTTP/Authentication).

## Exemples

### Requête sans authentification

- la liste des titres
- du domaine minier M
- dont le type est un permis d'exploitation
- localisés en Guyane

`https://api.camino.beta.gouv.fr/titres?domainesIds=m&typesIds=ax&territoires=guyane`

### Requête avec authentification

- la liste des activités
- de l'entreprise `mon-entreprise`
- pour l'utilisateur avec l'identifiant `mon-email@domaine.tld` et le mot de passe: `mon-mot-de-passe`. Dans l'url, le signe `@` de l'adresse email doit être converti en `%20`.

`https://mon-email%40domaine.tld:mon-mot-de-passe@api.camino.beta.gouv.fr/activites`
