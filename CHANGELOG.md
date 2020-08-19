# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.24.49](https://github.com/MTES-MCT/camino-api/compare/v0.24.48...v0.24.49) (2020-08-19)


### Features

* **business:** prend en compte l'étape d'informations historiques incomplètes dans le calcul des statuts ([#500](https://github.com/MTES-MCT/camino-api/issues/500)) ([5ff29bc](https://github.com/MTES-MCT/camino-api/commit/5ff29bc6a3bf2d6ec70bb9d7aecad9c925cf3567))
* **data:** insère les données de la base titres DEB ([#501](https://github.com/MTES-MCT/camino-api/issues/501)) ([7d18db6](https://github.com/MTES-MCT/camino-api/commit/7d18db66d3afde1add5ca118aa16160d45d1613d))
* **démarche:** ajoute l'arbre de prolongation des ARM en Guyane ([#483](https://github.com/MTES-MCT/camino-api/issues/483)) ([cf4b57c](https://github.com/MTES-MCT/camino-api/commit/cf4b57cae6ebcc3bf600718a546ca964f92bf384))
* **démarche:** ajoute l’arbre de renonciation et les règles de publicité des ARM en Guyane ([#484](https://github.com/MTES-MCT/camino-api/issues/484)) ([0334577](https://github.com/MTES-MCT/camino-api/commit/03345772026b4ad56242ef88a91f2e818a70f8e5))


### Bug Fixes

* **documents:** corrige le renommage de dossiers de documents lors de l'édition d'un titre ([#498](https://github.com/MTES-MCT/camino-api/issues/498)) ([01714f7](https://github.com/MTES-MCT/camino-api/commit/01714f72c74dcef8d574a61f8ff331274e072c8c))
* **etapes:** corrige la disparition des références de titres lors de l'édition ([#499](https://github.com/MTES-MCT/camino-api/issues/499)) ([5a10756](https://github.com/MTES-MCT/camino-api/commit/5a10756f8746ad91f210439ffb94a7d0f7011193))
* **tools:** corrige le script de recherche d'incohérences de documents ([#497](https://github.com/MTES-MCT/camino-api/issues/497)) ([d0e6c90](https://github.com/MTES-MCT/camino-api/commit/d0e6c9018e982444b2a1c915f0a43e2a933113cb))

### [0.24.48](https://github.com/MTES-MCT/camino-api/compare/v0.24.47...v0.24.48) (2020-08-04)


### Features

* **export:** ajoute les travaux ([5aaf7c1](https://github.com/MTES-MCT/camino-api/commit/5aaf7c15d8cc67c1b6cd93d3f15b3102e72cdbe4))
* ajoute les travaux ([#495](https://github.com/MTES-MCT/camino-api/issues/495)) ([afef33e](https://github.com/MTES-MCT/camino-api/commit/afef33eb51d650fca99a3b4d589db6691b7c184a))
* **arm:** permet d’ajouter le récépissé déclaration loi sur l’eau à n’importe quel moment ([#493](https://github.com/MTES-MCT/camino-api/issues/493)) ([7afd536](https://github.com/MTES-MCT/camino-api/commit/7afd536836c01df2e7f8656f03b71019ec94e554))
* **utilisateur:** envoie un email à l'administrateur lors de la création ([#490](https://github.com/MTES-MCT/camino-api/issues/490)) ([8c5d080](https://github.com/MTES-MCT/camino-api/commit/8c5d080ecf45661a2d01eb433b99b6c277ee683d))


### Bug Fixes

* ajoute l'url de l'utilisateur dans l'email lors de la création de compte ([821e8e1](https://github.com/MTES-MCT/camino-api/commit/821e8e1c183fcccda89dd6444be181e9f0b1a6f4))
* restreint la création de titres aux admins ([a2f0a3b](https://github.com/MTES-MCT/camino-api/commit/a2f0a3b836b8d148a6a6bbf3f1f5063b81a7fb31))
* **entreprise:** retourne null si l'id n'exsite pas ([431cab7](https://github.com/MTES-MCT/camino-api/commit/431cab780fbbaffef51b4d1ee77e5b35d5dd6bb8))
* **titre:** corrige la condition de création ([#491](https://github.com/MTES-MCT/camino-api/issues/491)) ([4ecce2f](https://github.com/MTES-MCT/camino-api/commit/4ecce2f8418ab9a723991f5fc51ccedc708133b1))

### [0.24.47](https://github.com/MTES-MCT/camino-api/compare/v0.24.45...v0.24.47) (2020-07-23)


### Features

* enregistre l'ordre des substances ([#476](https://github.com/MTES-MCT/camino-api/issues/476)) ([a123629](https://github.com/MTES-MCT/camino-api/commit/a12362973ab9391bbacc98dbb62767c3e53b50c1))

### [0.24.46](https://github.com/MTES-MCT/camino-api/compare/v0.24.45...v0.24.46) (2020-07-22)

### [0.24.45](https://github.com/MTES-MCT/camino-api/compare/v0.24.43...v0.24.45) (2020-07-22)


### Features

* **activités:**  définit un ordre de présentation ([#455](https://github.com/MTES-MCT/camino-api/issues/455)) ([ce877e5](https://github.com/MTES-MCT/camino-api/commit/ce877e595bab519449b2f33c66ad12ca168ab9dc))
* **activités:** ajoute des filtres ([#467](https://github.com/MTES-MCT/camino-api/issues/467)) ([310dc58](https://github.com/MTES-MCT/camino-api/commit/310dc583a086adf797e9f6c854450761396a8fa4))
* **documents:** gère la permission des suppressions pour les entreprises ([#474](https://github.com/MTES-MCT/camino-api/issues/474)) ([6ad8c8c](https://github.com/MTES-MCT/camino-api/commit/6ad8c8c4f4243c2ccc97c91ce64c58cca01780f8))


### Bug Fixes

* conserve les propriétés lors de l'enregistrement ([#487](https://github.com/MTES-MCT/camino-api/issues/487)) ([a0ca1e5](https://github.com/MTES-MCT/camino-api/commit/a0ca1e58ed9f902093dcfdd73904784e8fecd90a))
* **arm:** corrige l'arbre d'instruction de l'octroi d'ARM ([#482](https://github.com/MTES-MCT/camino-api/issues/482)) ([6ff9878](https://github.com/MTES-MCT/camino-api/commit/6ff98786f88e26fde9db706aa8f4739df20964ab))
* **démarches:** corrige le calcul des démarches d'annulation ([#465](https://github.com/MTES-MCT/camino-api/issues/465)) ([14ca9b6](https://github.com/MTES-MCT/camino-api/commit/14ca9b64052a34c16275065a1153d0a8a9e938e0))
* **entreprises:** expose le décompte des activités ([#469](https://github.com/MTES-MCT/camino-api/issues/469)) ([957856b](https://github.com/MTES-MCT/camino-api/commit/957856b28a0d27b1ca3ede2374f731342e9cd241))
* **filtres:** ne sépare pas les mots qui contiennent un `-` ([#470](https://github.com/MTES-MCT/camino-api/issues/470)) ([f405db7](https://github.com/MTES-MCT/camino-api/commit/f405db7646d8b29f0d144fc30b9f7dba5b3ceb8d))

### [0.24.44](https://github.com/MTES-MCT/camino-api/compare/v0.24.43...v0.24.44) (2020-07-15)


### Features

* **activités:**  définit un ordre de présentation ([#455](https://github.com/MTES-MCT/camino-api/issues/455)) ([ce877e5](https://github.com/MTES-MCT/camino-api/commit/ce877e595bab519449b2f33c66ad12ca168ab9dc))
* **activités:** ajoute des filtres ([#467](https://github.com/MTES-MCT/camino-api/issues/467)) ([310dc58](https://github.com/MTES-MCT/camino-api/commit/310dc583a086adf797e9f6c854450761396a8fa4))
* **documents:** gère la permission des suppressions pour les entreprises ([#474](https://github.com/MTES-MCT/camino-api/issues/474)) ([6ad8c8c](https://github.com/MTES-MCT/camino-api/commit/6ad8c8c4f4243c2ccc97c91ce64c58cca01780f8))


### Bug Fixes

* **démarches:** corrige le calcul des démarches d'annulation ([#465](https://github.com/MTES-MCT/camino-api/issues/465)) ([14ca9b6](https://github.com/MTES-MCT/camino-api/commit/14ca9b64052a34c16275065a1153d0a8a9e938e0))
* **entreprises:** expose le décompte des activités ([#469](https://github.com/MTES-MCT/camino-api/issues/469)) ([957856b](https://github.com/MTES-MCT/camino-api/commit/957856b28a0d27b1ca3ede2374f731342e9cd241))
* **filtres:** ne sépare pas les mots qui contiennent un `-` ([#470](https://github.com/MTES-MCT/camino-api/issues/470)) ([f405db7](https://github.com/MTES-MCT/camino-api/commit/f405db7646d8b29f0d144fc30b9f7dba5b3ceb8d))

### [0.24.43](https://github.com/MTES-MCT/camino-api/compare/v0.24.42...v0.24.43) (2020-07-01)


### Features

* **définitions:** expose les descriptions ([#444](https://github.com/MTES-MCT/camino-api/issues/444)) ([8380b62](https://github.com/MTES-MCT/camino-api/commit/8380b62dc6f9c9b8b2814b62c4e89b0f98a868fb))
* **étapes:** met à jour la cohérence de l'arbre d'instruction de l'octroi d'ARM ([#428](https://github.com/MTES-MCT/camino-api/issues/428)) ([6fe11e7](https://github.com/MTES-MCT/camino-api/commit/6fe11e763b9e0230316d76b9ff8d95d9881227bc))
* **export:** ajoute les dates et statuts des étapes d'instruction ([#434](https://github.com/MTES-MCT/camino-api/issues/434)) ([fa3ea20](https://github.com/MTES-MCT/camino-api/commit/fa3ea204aa57bb877827d9141e2c8e9bf9ba123d))
* **metas:** met à jour des définitions ([#463](https://github.com/MTES-MCT/camino-api/issues/463)) ([c2f5e4c](https://github.com/MTES-MCT/camino-api/commit/c2f5e4cd4d743e0453e47d982055b0daac705ae3))
* **titres:** ajoute la pagination sur les titres ([#426](https://github.com/MTES-MCT/camino-api/issues/426)) ([580ab9c](https://github.com/MTES-MCT/camino-api/commit/580ab9cd077082959861ad7627cf83b786e96887))
* **titres:** ajoute un paramètre `périmetre` ([#441](https://github.com/MTES-MCT/camino-api/issues/441)) ([49ce2aa](https://github.com/MTES-MCT/camino-api/commit/49ce2aabf737d6a90787592cefbfaf4a21d23874))
* **titres:** retourne les titres en fonction d'un périmètre ([#442](https://github.com/MTES-MCT/camino-api/issues/442)) ([23255cf](https://github.com/MTES-MCT/camino-api/commit/23255cf167306756626c5cc7685d9c1000099f15))


### Bug Fixes

* **api:** corrige la requête des étapes en cas d'utilisateur d'une administration sans lien vers une administration ([5013bc7](https://github.com/MTES-MCT/camino-api/commit/5013bc76f1419229a01b449fd3c962d59c160335))
* **documents:** ajoute la propriété `entreprisesLecture` si `publicLecture` est `true` ([#438](https://github.com/MTES-MCT/camino-api/issues/438)) ([da93662](https://github.com/MTES-MCT/camino-api/commit/da93662e248dfbabaaa7cbcea1e5ab0384df5a57))
* **download:** corrige le téléchargement des titres au format CSV ([#449](https://github.com/MTES-MCT/camino-api/issues/449)) ([11666c9](https://github.com/MTES-MCT/camino-api/commit/11666c9b5b89c926d36b9f74e58d082e47357978))
* **entreprise:** corrige la récupération des titres ([#448](https://github.com/MTES-MCT/camino-api/issues/448)) ([ba49b7b](https://github.com/MTES-MCT/camino-api/commit/ba49b7b6d8c71feedbb5dae30d3ffba1d4cda5fe))
* **étapes:** corrige l'affichage de doublons pour les éditeurs ([#459](https://github.com/MTES-MCT/camino-api/issues/459)) ([953dfe1](https://github.com/MTES-MCT/camino-api/commit/953dfe1da5eff500a27d492524bd91ed87a3468a))
* **rest:** corrige le type de retour pour le format JSON ([#452](https://github.com/MTES-MCT/camino-api/issues/452)) ([1c2d862](https://github.com/MTES-MCT/camino-api/commit/1c2d862e0bf776b66392b9a51a33241f07e4cfb3))
* **titres:** corrige la requête de tri par nom ([#447](https://github.com/MTES-MCT/camino-api/issues/447)) ([c0a051d](https://github.com/MTES-MCT/camino-api/commit/c0a051dad1b6fc5b9a7afe8602d266c0ad89a6b8))
* **titres:** corrige la requête sur les titres ([#450](https://github.com/MTES-MCT/camino-api/issues/450)) ([fd6c23a](https://github.com/MTES-MCT/camino-api/commit/fd6c23a9a82698e13677225d06e8b81a1d8ef455))
* **utilisateur:** oblige un admin, editeur ou lecteur à être attaché à une administration ([#458](https://github.com/MTES-MCT/camino-api/issues/458)) ([e48f501](https://github.com/MTES-MCT/camino-api/commit/e48f501a9fe8a5eebfbab959dd521a223797db4d))

### [0.24.42](https://github.com/MTES-MCT/camino-api/compare/v0.24.41...v0.24.42) (2020-06-17)


### Features

* **api:** valide les dates envoyées par les clients de l'API ([#421](https://github.com/MTES-MCT/camino-api/issues/421)) ([c032cb2](https://github.com/MTES-MCT/camino-api/commit/c032cb291c27a7baac2b71bbd1d97d2d502c4713))
* **utilisateurs:** rassemble les champs 'noms' et 'prénoms' du filtre en un seul champ ([#422](https://github.com/MTES-MCT/camino-api/issues/422)) ([16eb9a3](https://github.com/MTES-MCT/camino-api/commit/16eb9a383eb4d6ec58c01046472c8be5ab9d79de))
* **utils:** gère les caractères spéciaux dans stringSplit ([#425](https://github.com/MTES-MCT/camino-api/issues/425)) ([143b1c7](https://github.com/MTES-MCT/camino-api/commit/143b1c7317bc3fde64c4d7f8c6c8be2f1952da52))


### Bug Fixes

* **utilisateurs:** prend en compte tous les mots recherchés dans le champ nom ([#427](https://github.com/MTES-MCT/camino-api/issues/427)) ([c3e7261](https://github.com/MTES-MCT/camino-api/commit/c3e7261d7c5638919cbc28fdaddad0c8c5d4c1dd))

### [0.24.41](https://github.com/MTES-MCT/camino-api/compare/v0.24.40...v0.24.41) (2020-06-10)


### Features

* **activites:** ajoute le filtre par statut de rapport d'activité ([#415](https://github.com/MTES-MCT/camino-api/issues/415)) ([37ca7af](https://github.com/MTES-MCT/camino-api/commit/37ca7af08865981c14f82d04daacc0815f0244ed))
* **activités:** ajoute un lien "Je donne mon avis" dans l'email de confirmation ([#417](https://github.com/MTES-MCT/camino-api/issues/417)) ([c4ddfe4](https://github.com/MTES-MCT/camino-api/commit/c4ddfe406331b737df406cc654cfa5b684348cca))
* **api:** expose les définitions ([#414](https://github.com/MTES-MCT/camino-api/issues/414)) ([13f9601](https://github.com/MTES-MCT/camino-api/commit/13f96013c4c1b7ae8b28fef7e7e3fc951d8e0ff8))
* **étapes:** filtre les types d'étapes en fonction de leur date de fin ([#420](https://github.com/MTES-MCT/camino-api/issues/420)) ([7899648](https://github.com/MTES-MCT/camino-api/commit/7899648455d2d18047e1abc1ce8a8adb8cae8c1f))
* **substances:** ajoute une colonne ([820e896](https://github.com/MTES-MCT/camino-api/commit/820e896161c0618b67888a55b764075612322df4))
* crée des documents spécifiques (étapes, activtés, entreprises) ([#416](https://github.com/MTES-MCT/camino-api/issues/416)) ([34d84d7](https://github.com/MTES-MCT/camino-api/commit/34d84d7cfa5486b2e786500e171226ac8de867b9))


### Bug Fixes

* corrige la requête sur les titres ([db6d1d9](https://github.com/MTES-MCT/camino-api/commit/db6d1d982191fb445d6eb42ee16f359714a74e25))
* permet aux utilisateurs entreprise de modifier leur documents ([ff1e90c](https://github.com/MTES-MCT/camino-api/commit/ff1e90c9e1512716c9825598c5e7feef7e068d7a))
* **documents:** autorise les entreprises à modifier leurs documents ([2d37b67](https://github.com/MTES-MCT/camino-api/commit/2d37b676c70b06fe3e573760795e902129858a47))
* **documents:** corrige la disparition de fichier à l'enregistrement ([b755864](https://github.com/MTES-MCT/camino-api/commit/b7558648256b1d60e5f14d82bd5da2fa3a8c8d61))
* affiche le bouton d'ajout de document pour un utilisateur entreprise ([24dfbbe](https://github.com/MTES-MCT/camino-api/commit/24dfbbee423bf917bf4dd505a4330e806efa5fb7))
* **entreprises:** ajoute un paramètre de création de documents ([6ea0322](https://github.com/MTES-MCT/camino-api/commit/6ea0322d97e567eca9a209cbf86159469c335a83))
* **fichiers:** corrige le retour d'erreur en cas de fichier introuvable ([c1c8927](https://github.com/MTES-MCT/camino-api/commit/c1c8927eabfb0dfc33cbb0946ba6b12b345f28e5))
* corrige les permissions utilisateur ([6d5842c](https://github.com/MTES-MCT/camino-api/commit/6d5842c25a00fee9bb3897ea6c8fd6689addc1e9))
* **activites:** corrige la requête de récupération des années ([a54fe8c](https://github.com/MTES-MCT/camino-api/commit/a54fe8c24b46ac086b6e4b94089357312da112f2))
* **daily:** ajoute les options d'insertion pour les documents des titulaires ([#419](https://github.com/MTES-MCT/camino-api/issues/419)) ([012452f](https://github.com/MTES-MCT/camino-api/commit/012452f63c4f0ebb7a3f3d35391538c044393934))
* **migrate:** garde le hash du document pendant la migration ([f42d8c0](https://github.com/MTES-MCT/camino-api/commit/f42d8c0e0bd1af6b1b3973aa7147d4d6cb6c94ac))
* **utilisateurs:** corrige le filtre email ([#418](https://github.com/MTES-MCT/camino-api/issues/418)) ([36ea532](https://github.com/MTES-MCT/camino-api/commit/36ea532669d61fcebc3e457922872a865995eeab))
* ajoute une colonne ordre ([a27de09](https://github.com/MTES-MCT/camino-api/commit/a27de09e5ea03d514c7fb6d547da53a4ffea78d7))
* corrige l'import de GraphQLResolve ([d01e91f](https://github.com/MTES-MCT/camino-api/commit/d01e91fb7ff9410ef20a761a234dffa60fd271dd))

### [0.24.40](https://github.com/MTES-MCT/camino-api/compare/v0.24.38...v0.24.40) (2020-06-02)


### Features

* **activités:** ajoute les filtres des titres ([#398](https://github.com/MTES-MCT/camino-api/issues/398)) ([4b12e68](https://github.com/MTES-MCT/camino-api/commit/4b12e68d37534b94f33c1c6bdf1e4b1d0c14f113))
* **entreprises:** ajout les filtres et la pagination sur les entreprises ([#386](https://github.com/MTES-MCT/camino-api/issues/386)) ([d3169b8](https://github.com/MTES-MCT/camino-api/commit/d3169b845c7376aa9570a941019a1c845102194d))


### Bug Fixes

* **activites:** respecte le format de données des champs pour les téléchargements ([#406](https://github.com/MTES-MCT/camino-api/issues/406)) ([1dca9b3](https://github.com/MTES-MCT/camino-api/commit/1dca9b3cdda2c3c6a8504b094647beb7a46167c7))
* **api:** corrige le nom du retour pour les listes vides d'activités et entreprises ([#408](https://github.com/MTES-MCT/camino-api/issues/408)) ([de06f47](https://github.com/MTES-MCT/camino-api/commit/de06f4761a6696a8c637c164f2384ce5eec16bc0))
* **api:** corrige les listes de données sensibles en mode déconnecté ([#407](https://github.com/MTES-MCT/camino-api/issues/407)) ([391b2fc](https://github.com/MTES-MCT/camino-api/commit/391b2fc10b6e092d6b797de4a7c1b140f2ffa4e0))
* **business:** améliore les performances de la requête de titre(s) avant le changement d'id(s) ([#403](https://github.com/MTES-MCT/camino-api/issues/403)) ([32ed6d3](https://github.com/MTES-MCT/camino-api/commit/32ed6d3df25a347eaf0393f4b0d9a11daa086f03))
* **business:** corrige la mise à jour d'ids de titres ([#402](https://github.com/MTES-MCT/camino-api/issues/402)) ([aeef412](https://github.com/MTES-MCT/camino-api/commit/aeef412a5ca225feb5e21e8b06e9f949f1c5876b))
* **business:** mets à jour les id d'étapes dans les contenus de titre ([#410](https://github.com/MTES-MCT/camino-api/issues/410)) ([a541e86](https://github.com/MTES-MCT/camino-api/commit/a541e86f027489c23077c82f167b569611c6ef76))
* **database:** augmente la taille limite des urls en base ([#413](https://github.com/MTES-MCT/camino-api/issues/413)) ([615fac2](https://github.com/MTES-MCT/camino-api/commit/615fac2633abd3044a6f4ad4f0fb06705376cea4))
* **documents:** corrige la suppression et modification d'un document si le titre n'existe plus ([#404](https://github.com/MTES-MCT/camino-api/issues/404)) ([2fd8691](https://github.com/MTES-MCT/camino-api/commit/2fd86911d9d7064f9c1d8c24cf732a9a1fd62db8))
* **entreprises:** corrige la mise à jour des entreprises ([9f72973](https://github.com/MTES-MCT/camino-api/commit/9f72973b938b08f6582ca5cb5c467c2e28126e67))
* **etapes:** corrige le type de données pour les volumes et engagement ([#409](https://github.com/MTES-MCT/camino-api/issues/409)) ([8c6cf8e](https://github.com/MTES-MCT/camino-api/commit/8c6cf8ec165339f2fa062b4b0e8b042ea231b701))
* **périmètres:** corrige la conversion des projections ([#411](https://github.com/MTES-MCT/camino-api/issues/411)) ([4d8e042](https://github.com/MTES-MCT/camino-api/commit/4d8e04255a23a903896bbcc241e70d4707bab7f1))
* **rest:** corrige le graph de la requête de titres ([#401](https://github.com/MTES-MCT/camino-api/issues/401)) ([ae668f0](https://github.com/MTES-MCT/camino-api/commit/ae668f033f4d2cf7247eb8a306578c6e99ee4683))

### [0.24.39](https://github.com/MTES-MCT/camino-api/compare/v0.24.38...v0.24.39) (2020-05-20)


### Features

* **activités:** ajoute les filtres des titres ([#398](https://github.com/MTES-MCT/camino-api/issues/398)) ([4b12e68](https://github.com/MTES-MCT/camino-api/commit/4b12e68d37534b94f33c1c6bdf1e4b1d0c14f113))
* **entreprises:** ajout les filtres et la pagination sur les entreprises ([#386](https://github.com/MTES-MCT/camino-api/issues/386)) ([d3169b8](https://github.com/MTES-MCT/camino-api/commit/d3169b845c7376aa9570a941019a1c845102194d))


### Bug Fixes

* **activites:** respecte le format de données des champs pour les téléchargements ([#406](https://github.com/MTES-MCT/camino-api/issues/406)) ([1dca9b3](https://github.com/MTES-MCT/camino-api/commit/1dca9b3cdda2c3c6a8504b094647beb7a46167c7))
* **api:** corrige le nom du retour pour les listes vides d'activités et entreprises ([#408](https://github.com/MTES-MCT/camino-api/issues/408)) ([de06f47](https://github.com/MTES-MCT/camino-api/commit/de06f4761a6696a8c637c164f2384ce5eec16bc0))
* **api:** corrige les listes de données sensibles en mode déconnecté ([#407](https://github.com/MTES-MCT/camino-api/issues/407)) ([391b2fc](https://github.com/MTES-MCT/camino-api/commit/391b2fc10b6e092d6b797de4a7c1b140f2ffa4e0))
* **business:** améliore les performances de la requête de titre(s) avant le changement d'id(s) ([#403](https://github.com/MTES-MCT/camino-api/issues/403)) ([32ed6d3](https://github.com/MTES-MCT/camino-api/commit/32ed6d3df25a347eaf0393f4b0d9a11daa086f03))
* **business:** corrige la mise à jour d'ids de titres ([#402](https://github.com/MTES-MCT/camino-api/issues/402)) ([aeef412](https://github.com/MTES-MCT/camino-api/commit/aeef412a5ca225feb5e21e8b06e9f949f1c5876b))
* **documents:** corrige la suppression et modification d'un document si le titre n'existe plus ([#404](https://github.com/MTES-MCT/camino-api/issues/404)) ([2fd8691](https://github.com/MTES-MCT/camino-api/commit/2fd86911d9d7064f9c1d8c24cf732a9a1fd62db8))
* **entreprises:** corrige la mise à jour des entreprises ([9f72973](https://github.com/MTES-MCT/camino-api/commit/9f72973b938b08f6582ca5cb5c467c2e28126e67))
* **etapes:** corrige le type de données pour les volumes et engagement ([#409](https://github.com/MTES-MCT/camino-api/issues/409)) ([8c6cf8e](https://github.com/MTES-MCT/camino-api/commit/8c6cf8ec165339f2fa062b4b0e8b042ea231b701))
* **rest:** corrige le graph de la requête de titres ([#401](https://github.com/MTES-MCT/camino-api/issues/401)) ([ae668f0](https://github.com/MTES-MCT/camino-api/commit/ae668f033f4d2cf7247eb8a306578c6e99ee4683))

### [0.24.38](https://github.com/MTES-MCT/camino-api/compare/v0.24.37...v0.24.38) (2020-05-18)

### [0.24.37](https://github.com/MTES-MCT/camino-api/compare/v0.24.34...v0.24.37) (2020-05-18)


### Features

* **activités:** gère les paramètres d'url ([#375](https://github.com/MTES-MCT/camino-api/issues/375)) ([dfc6adf](https://github.com/MTES-MCT/camino-api/commit/dfc6adf2eaee8d41981df1a4c33e66f983cf36ec))
* **api:** expose le téléchargement des données ([#387](https://github.com/MTES-MCT/camino-api/issues/387)) ([e922d08](https://github.com/MTES-MCT/camino-api/commit/e922d087c67eb9724239e64ae7f8d7ef0f48e1f0))
* **démarches:** filtre les démarches par nom de titres, titulaires, substances, etc. ([#385](https://github.com/MTES-MCT/camino-api/issues/385)) ([d24e553](https://github.com/MTES-MCT/camino-api/commit/d24e553659a2ab0cc2e323aa8494878751d4d6b4))
* **démarches:** limite les types d'étapes selon les utilisateurs ([#382](https://github.com/MTES-MCT/camino-api/issues/382)) ([017520d](https://github.com/MTES-MCT/camino-api/commit/017520df23734f603e06ef0bbe3b99c12a63f2f9))
* **documents:** masque temporairement aux entreprises les documents non publics ([#397](https://github.com/MTES-MCT/camino-api/issues/397)) ([12d2d3b](https://github.com/MTES-MCT/camino-api/commit/12d2d3b383cd084769b3d64c362424bb93eb594d))
* **utilisateurs:** gère les paramètres d'url ([#388](https://github.com/MTES-MCT/camino-api/issues/388)) ([8547460](https://github.com/MTES-MCT/camino-api/commit/85474607e7b3b28d64d106c20227c423b93505e1))
* **utilisateurs:** gère plusieurs emails dans les paramètres de filtrage ([#394](https://github.com/MTES-MCT/camino-api/issues/394)) ([8fbbeb1](https://github.com/MTES-MCT/camino-api/commit/8fbbeb16b7fdf5690cf4585a81de1ff063f68d75))


### Bug Fixes

* **activites:** affiche 0 résultat en mode déconnecté ([#384](https://github.com/MTES-MCT/camino-api/issues/384)) ([4961568](https://github.com/MTES-MCT/camino-api/commit/496156814c6525e83453689357875a1ed681691b))
* **activites:** corrige l'export avec des paramètres de types et d'années ([#391](https://github.com/MTES-MCT/camino-api/issues/391)) ([986eb4d](https://github.com/MTES-MCT/camino-api/commit/986eb4da9913cd7617965f19c98bbf534e1844ef))
* **activites:** corrige les paramètres d'édition ([ff9fc7b](https://github.com/MTES-MCT/camino-api/commit/ff9fc7b80ccdd658a52c45e9bcf32e606f21df5f))
* **api:** corrige la création d'étape pour les renonciations ([6a2bda1](https://github.com/MTES-MCT/camino-api/commit/6a2bda1830d91413388d268ae139a276d0e5b75c))
* **business:** prend en compte les démarches virtuelles pour le calcul de la publicité d'un titre ([925efdf](https://github.com/MTES-MCT/camino-api/commit/925efdf6a5adab16d341a12ff4cf41cb90ffb1c3))
* **demarches:** corrige le bug sur le tri ([#396](https://github.com/MTES-MCT/camino-api/issues/396)) ([f86fad8](https://github.com/MTES-MCT/camino-api/commit/f86fad8ef0567677cf9f5b3c18d2c5900af667e8))
* **demarches:** corrige le tri des démarches ([#392](https://github.com/MTES-MCT/camino-api/issues/392)) ([eca74be](https://github.com/MTES-MCT/camino-api/commit/eca74bebd45915e93e37f8393aae6faec6021584))
* **demarches:** corrige les requêtes avec plusieurs étapes exclues ([cd506e5](https://github.com/MTES-MCT/camino-api/commit/cd506e56f2d8304ce26f24e02c10859829f22231))
* **documents:** corrige l'enregistrement et la suppression de documents ([#395](https://github.com/MTES-MCT/camino-api/issues/395)) ([42bf1b3](https://github.com/MTES-MCT/camino-api/commit/42bf1b36cad789fe6ced89a2dc2b1d5d18ce7167))
* **export:** corrige les exports xls, ods, csv et geojson ([#390](https://github.com/MTES-MCT/camino-api/issues/390)) ([f6149c7](https://github.com/MTES-MCT/camino-api/commit/f6149c794c86a87ce696ffb73e291e9fa332bf80))
* **utilisateurs:** corrige le téléchargement xlsx ([#393](https://github.com/MTES-MCT/camino-api/issues/393)) ([9a39b64](https://github.com/MTES-MCT/camino-api/commit/9a39b649262b02a4d6e444157ef0e80dd7a5b502))

### [0.24.36](https://github.com/MTES-MCT/camino-api/compare/v0.24.35...v0.24.36) (2020-05-12)


### Features

* **api:** expose le téléchargement des données ([#387](https://github.com/MTES-MCT/camino-api/issues/387)) ([e922d08](https://github.com/MTES-MCT/camino-api/commit/e922d087c67eb9724239e64ae7f8d7ef0f48e1f0))
* **démarches:** filtre les démarches par nom de titres, titulaires, substances, etc. ([#385](https://github.com/MTES-MCT/camino-api/issues/385)) ([d24e553](https://github.com/MTES-MCT/camino-api/commit/d24e553659a2ab0cc2e323aa8494878751d4d6b4))


### Bug Fixes

* **activites:** corrige l'export avec des paramètres de types et d'années ([#391](https://github.com/MTES-MCT/camino-api/issues/391)) ([986eb4d](https://github.com/MTES-MCT/camino-api/commit/986eb4da9913cd7617965f19c98bbf534e1844ef))
* **demarches:** corrige le tri des démarches ([#392](https://github.com/MTES-MCT/camino-api/issues/392)) ([eca74be](https://github.com/MTES-MCT/camino-api/commit/eca74bebd45915e93e37f8393aae6faec6021584))
* **export:** corrige les exports xls, ods, csv et geojson ([#390](https://github.com/MTES-MCT/camino-api/issues/390)) ([f6149c7](https://github.com/MTES-MCT/camino-api/commit/f6149c794c86a87ce696ffb73e291e9fa332bf80))

### [0.24.35](https://github.com/MTES-MCT/camino-api/compare/v0.24.34...v0.24.35) (2020-05-05)


### Features

* **activités:** gère les paramètres d'url ([#375](https://github.com/MTES-MCT/camino-api/issues/375)) ([dfc6adf](https://github.com/MTES-MCT/camino-api/commit/dfc6adf2eaee8d41981df1a4c33e66f983cf36ec))
* **démarches:** limite les types d'étapes selon les utilisateurs ([#382](https://github.com/MTES-MCT/camino-api/issues/382)) ([017520d](https://github.com/MTES-MCT/camino-api/commit/017520df23734f603e06ef0bbe3b99c12a63f2f9))


### Bug Fixes

* **activites:** affiche 0 résultat en mode déconnecté ([#384](https://github.com/MTES-MCT/camino-api/issues/384)) ([4961568](https://github.com/MTES-MCT/camino-api/commit/496156814c6525e83453689357875a1ed681691b))
* **activites:** corrige les paramètres d'édition ([ff9fc7b](https://github.com/MTES-MCT/camino-api/commit/ff9fc7b80ccdd658a52c45e9bcf32e606f21df5f))
* **api:** corrige la création d'étape pour les renonciations ([6a2bda1](https://github.com/MTES-MCT/camino-api/commit/6a2bda1830d91413388d268ae139a276d0e5b75c))
* **business:** prend en compte les démarches virtuelles pour le calcul de la publicité d'un titre ([925efdf](https://github.com/MTES-MCT/camino-api/commit/925efdf6a5adab16d341a12ff4cf41cb90ffb1c3))
* **demarches:** corrige les requêtes avec plusieurs étapes exclues ([cd506e5](https://github.com/MTES-MCT/camino-api/commit/cd506e56f2d8304ce26f24e02c10859829f22231))

### [0.24.34](https://github.com/MTES-MCT/camino-api/compare/v0.24.33...v0.24.34) (2020-04-27)


### Bug Fixes

* corrige l'export ([faedfe8](https://github.com/MTES-MCT/camino-api/commit/faedfe875ca5e8dd000c3f68d5b2763571258a0a))

### [0.24.33](https://github.com/MTES-MCT/camino-api/compare/v0.24.32...v0.24.33) (2020-04-27)

### [0.24.32](https://github.com/MTES-MCT/camino-api/compare/v0.24.31...v0.24.32) (2020-04-27)


### Features

* **business:** calcule la publicité d'un titre pendant le daily ([#377](https://github.com/MTES-MCT/camino-api/issues/377)) ([b4007e0](https://github.com/MTES-MCT/camino-api/commit/b4007e0220e7c0530f21ca37426bee0e57f4d29e))
* **demarches:** calcule un statut de publicité ([#374](https://github.com/MTES-MCT/camino-api/issues/374)) ([c7747e9](https://github.com/MTES-MCT/camino-api/commit/c7747e9fa541e801422ecf04349a41e4e06e5037))
* **documents:** supprime les fichiers quand on supprime une étape, une démarche ou un titre ([#373](https://github.com/MTES-MCT/camino-api/issues/373)) ([9347f8e](https://github.com/MTES-MCT/camino-api/commit/9347f8e7f4dd149da4e7745e3cb7cffc93f7e2fd))


### Bug Fixes

* **activités:** corrige l'envoi d'email lors de la validation d'une activité ([#379](https://github.com/MTES-MCT/camino-api/issues/379)) ([0942a98](https://github.com/MTES-MCT/camino-api/commit/0942a9830ad00c98a18b4ded4e2b899a3fbed149))
* **business:** corrige le calcul du statut des démarches dans le cas des saisines du préfet ([#376](https://github.com/MTES-MCT/camino-api/issues/376)) ([9cf9280](https://github.com/MTES-MCT/camino-api/commit/9cf92800a6367b15a0777ff6fa0c1946c2e03c33))
* **business:** permet une notification au demandeur après une commission ([#378](https://github.com/MTES-MCT/camino-api/issues/378)) ([59b6685](https://github.com/MTES-MCT/camino-api/commit/59b668545e4e29dde53928643edcb6630cead10b))
* **business:** rend visible aux entreprises les démarches ayant une décision de l'administration ([#380](https://github.com/MTES-MCT/camino-api/issues/380)) ([449edf5](https://github.com/MTES-MCT/camino-api/commit/449edf52ac2d53a93d9e4a6161cf8ec21ae9cd0c))

### [0.24.31](https://github.com/MTES-MCT/camino-api/compare/v0.24.30...v0.24.31) (2020-04-20)


### Features

* **data:** migre les données du formulaire ([#365](https://github.com/MTES-MCT/camino-api/issues/365)) ([25a70f9](https://github.com/MTES-MCT/camino-api/commit/25a70f93a7891cfe8af43362896ec48e96ce47b2))
* **étapes:** renomme l'étape "retrait de la demande" en "désistement du demandeur" ([#370](https://github.com/MTES-MCT/camino-api/issues/370)) ([ed998f6](https://github.com/MTES-MCT/camino-api/commit/ed998f629ab4736c914e60ebaf1db11d345a189c))


### Bug Fixes

* **activites:** rouvre les rapports annuels de production d'or pour l'annee 2019 ([b67a124](https://github.com/MTES-MCT/camino-api/commit/b67a124e30e05994c7c69a7258a0161992e589d9))
* **activités:** restreint les types d'activités aux utilisateurs habilités ([#358](https://github.com/MTES-MCT/camino-api/issues/358)) ([2fbfeba](https://github.com/MTES-MCT/camino-api/commit/2fbfebab8e00245d94864702876e609fafa012c2))
* **api:** corrige les sections specifiques des étapes ([#355](https://github.com/MTES-MCT/camino-api/issues/355)) ([69eefcd](https://github.com/MTES-MCT/camino-api/commit/69eefcdaae552077ee0e645ec24c4ce9e82b95d7))
* **api:** filtre la liste des étapes en fonction du statut pendant l'édition ([#352](https://github.com/MTES-MCT/camino-api/issues/352)) ([acae4f4](https://github.com/MTES-MCT/camino-api/commit/acae4f460f5fec32f3f75be50eca919d14eee4aa))
* **api:** ordonne les administrations par nom croissant ([#367](https://github.com/MTES-MCT/camino-api/issues/367)) ([2d905f5](https://github.com/MTES-MCT/camino-api/commit/2d905f5d1051ca6fce948536b60f6a62d9e85a5b))
* **api:** restreint l'édition aux utilisateurs de la même administration ([#369](https://github.com/MTES-MCT/camino-api/issues/369)) ([ab37a42](https://github.com/MTES-MCT/camino-api/commit/ab37a4296259d022ff6718def244e3e190717ecd))
* **api:** restreint les permissions des admins à éditeur et en dessous ([#368](https://github.com/MTES-MCT/camino-api/issues/368)) ([b836684](https://github.com/MTES-MCT/camino-api/commit/b836684ffc59d044f5382b8d37ac44ebbe5604f5))
* **business:** corrige le calcul des contenus de titre ([#357](https://github.com/MTES-MCT/camino-api/issues/357)) ([f75a49f](https://github.com/MTES-MCT/camino-api/commit/f75a49f29b90747cd131ebfe15207c8361f2f244))
* **data:** corrige les ids de sous-éléments de titres ([#362](https://github.com/MTES-MCT/camino-api/issues/362)) ([ece78b7](https://github.com/MTES-MCT/camino-api/commit/ece78b77ab61f69b6524064aeaf0359e1c3728d7))
* **démarche:** complète et corrige le calcul du statut des démarches ([#371](https://github.com/MTES-MCT/camino-api/issues/371)) ([625a3fe](https://github.com/MTES-MCT/camino-api/commit/625a3fe793ead4fa53e1cb2927d28985a585d6dc))
* **demarches:** supprime la démarche de mécanisation ([#366](https://github.com/MTES-MCT/camino-api/issues/366)) ([baa98c2](https://github.com/MTES-MCT/camino-api/commit/baa98c24cc3b9dd70d88e91fd6276da256d613b9))
* **démarches:** publie les démarches aux statuts rejeté et classé sans suite pour les ARM et AXM ([#361](https://github.com/MTES-MCT/camino-api/issues/361)) ([fd0dc75](https://github.com/MTES-MCT/camino-api/commit/fd0dc75bd6a5cd09fea9267c9498a0fcf714cbee))
* corrige le build ([#359](https://github.com/MTES-MCT/camino-api/issues/359)) ([f96e443](https://github.com/MTES-MCT/camino-api/commit/f96e443a9382f255e8a3b19d189b4ae4ec2ab94c))
* **documents:** corrige l'enregistrement de documents ([#356](https://github.com/MTES-MCT/camino-api/issues/356)) ([0782990](https://github.com/MTES-MCT/camino-api/commit/0782990c10f47109dd9c739daecb8ac22d55ef7b))

### [0.24.30](https://github.com/MTES-MCT/camino-api/compare/v0.24.29...v0.24.30) (2020-04-09)


### Bug Fixes

* corrige l'export de la spreadsheet utilisateur ([81404e2](https://github.com/MTES-MCT/camino-api/commit/81404e2d7d003be3307d2ba129d53100f2d6f3f6))
* corrige la suppression d'une activité ([51a127d](https://github.com/MTES-MCT/camino-api/commit/51a127d7049e641bb3ec9dda6ccacb13b79f4849))

### [0.24.29](https://github.com/MTES-MCT/camino-api/compare/v0.24.28...v0.24.29) (2020-04-09)


### Bug Fixes

* corrige les permissions sur les utilisateurs ([806d563](https://github.com/MTES-MCT/camino-api/commit/806d563c565bdd86d2b8730818e97140749d95b1))
* **api:** corrige le filtrage des titres ([d174d80](https://github.com/MTES-MCT/camino-api/commit/d174d807e44b311fb6320c6b6e0ee54e35f9d2f8))
* **demarches:** masque les démarches non publiques ([#353](https://github.com/MTES-MCT/camino-api/issues/353)) ([b0826af](https://github.com/MTES-MCT/camino-api/commit/b0826af9c8f2c5121ee7de5663980fc5e59235b0))
* **entreprises:** corrige le calcul du nombre d'activité pour les titres des entreprises ([78c2415](https://github.com/MTES-MCT/camino-api/commit/78c2415e1c105adb3822693a92aba638bec9c373))
* corrige le renommage des titres lors de la création ([c5db155](https://github.com/MTES-MCT/camino-api/commit/c5db1554ae4accc9de029bf5e83902679291aa98))
* **utilisateurs:** corrige les permissions d'édition sur son propre compte ([1077aea](https://github.com/MTES-MCT/camino-api/commit/1077aeabad0fc6d153e5977e45c29f9bf2a23c41))
* corrige les permissions sur l'édition des étapes pour les admins ([4e551a9](https://github.com/MTES-MCT/camino-api/commit/4e551a960653d3426f1a13d02c3bc4b4c39f250a))
* **api:** corrige des bugs sur la liste des utilisateurs ([1dbd611](https://github.com/MTES-MCT/camino-api/commit/1dbd6118b051b82caf9b84aa672f4b6edd0a9b90))
* **document:** corrige la modification/suppression de document si aucun fichier n'existe sur le disque ([19ad653](https://github.com/MTES-MCT/camino-api/commit/19ad6531b8241f9ebd92887f238a0e20318d91c5))

### [0.24.28](https://github.com/MTES-MCT/camino-api/compare/v0.24.27...v0.24.28) (2020-03-30)


### Features

* **filtre:** caractérise les types de titres: exploitation ou exploration ([#342](https://github.com/MTES-MCT/camino-api/issues/342)) ([9c15da1](https://github.com/MTES-MCT/camino-api/commit/9c15da1b358445717e12583d127371301f7fca56))


### Bug Fixes

* **documents:** corrige des ids de documents et renomme les fichiers manquants ([#351](https://github.com/MTES-MCT/camino-api/issues/351)) ([630919c](https://github.com/MTES-MCT/camino-api/commit/630919cff7ebd79417522192879a579dd13dba74))

### [0.24.27](https://github.com/MTES-MCT/camino-api/compare/v0.24.26...v0.24.27) (2020-03-23)


### Bug Fixes

* corrige l'export des substances ([7ce8722](https://github.com/MTES-MCT/camino-api/commit/7ce8722f67df3be562b3e776ea77c621fb22d7e8))
* **etapes:** corrige les restrictions 'etape impossible apres' ([#349](https://github.com/MTES-MCT/camino-api/issues/349)) ([53fdc48](https://github.com/MTES-MCT/camino-api/commit/53fdc4872abb3d91a0c73f76855653553e19357a))

### [0.24.26](https://github.com/MTES-MCT/camino-api/compare/v0.24.25...v0.24.26) (2020-03-23)


### Bug Fixes

* corrige l'export de la spreadsheet entreprise ([9344cbc](https://github.com/MTES-MCT/camino-api/commit/9344cbce68b19380a79af2b857b9b7deb6d4b826))

### [0.24.25](https://github.com/MTES-MCT/camino-api/compare/v0.24.24...v0.24.25) (2020-03-23)


### Bug Fixes

* **database:** utilise le format 'text' de PostgreSQL pour les champs 'description' ([72f42cc](https://github.com/MTES-MCT/camino-api/commit/72f42ccbb80a41536898b6710d82ecac109ec5e6))

### [0.24.24](https://github.com/MTES-MCT/camino-api/compare/v0.24.23...v0.24.24) (2020-03-23)


### Features

* **etapes:** ajoute les restrictions d'étapes pour la démarche de mécanisation des ARM ([#344](https://github.com/MTES-MCT/camino-api/issues/344)) ([22d2463](https://github.com/MTES-MCT/camino-api/commit/22d24636a43e6647a217f6b2091dccdbccc60f4c))
* ajoute l'authentification Cerbère ([#345](https://github.com/MTES-MCT/camino-api/issues/345)) ([0e43543](https://github.com/MTES-MCT/camino-api/commit/0e435433e8e0500e7b7043dfbf15b6bd3cd20318))
* ajoute une méthode pour retourner l'url Cerbère ([#347](https://github.com/MTES-MCT/camino-api/issues/347)) ([d0f5239](https://github.com/MTES-MCT/camino-api/commit/d0f52396834dc0e723cb4a4830e238a50ddc4742))
* **etapes:** ajoute des restrictions d'étapes en fonction des démarches ([#343](https://github.com/MTES-MCT/camino-api/issues/343)) ([81beade](https://github.com/MTES-MCT/camino-api/commit/81beadea9de61e7047cdb6c51db7c09d9f0dab1d))


### Bug Fixes

* corrige le format des noms et adresses d'entreprises ([1ceab05](https://github.com/MTES-MCT/camino-api/commit/1ceab05b1624067f2229dfd291e7f1ce3cd396da))
* **import:** corrige le chemin d'import du fichier de reprise des activités ([05ee125](https://github.com/MTES-MCT/camino-api/commit/05ee1257563c6cc30020303c90331297fcfee84d))
* corrige une typo sur les types ([3c64039](https://github.com/MTES-MCT/camino-api/commit/3c6403914a3cdb53e60711b31d585f527d404017))
* enrichit les messages d'erreurs de configuration des titres démarches étapes ([b578eb6](https://github.com/MTES-MCT/camino-api/commit/b578eb6fe1344bb98591a18bd4a4a0e4c7f48adb))
* **api:** corrige la validation Cerbère ([#346](https://github.com/MTES-MCT/camino-api/issues/346)) ([95c31c6](https://github.com/MTES-MCT/camino-api/commit/95c31c642aea9bd5fc7fc1b6147a5cff977f07a9))
* **auth:** corrige l'enregistrement d'un nouvel utilisateur depuis Cerbere ([eb2c6e9](https://github.com/MTES-MCT/camino-api/commit/eb2c6e9fd204e7f817d5568a1eafd150159160f4))

### [0.24.23](https://github.com/MTES-MCT/camino-api/compare/v0.24.22...v0.24.23) (2020-03-12)


### Bug Fixes

* **etapes:** corrige le caractère cumulatif des restrictions ([4af9d8a](https://github.com/MTES-MCT/camino-api/commit/4af9d8ad428816a9eec79cecac6e125b643e1fb9))
* désactive sentry qui bug lors du build ([f5cafca](https://github.com/MTES-MCT/camino-api/commit/f5cafca5f9ddd98297be05b2fc06c7de49f48566))

### [0.24.22](https://github.com/MTES-MCT/camino-api/compare/v0.24.21...v0.24.22) (2020-03-12)


### Features

* **administration:** renomme la DEAL Guyane en DGTM ([#317](https://github.com/MTES-MCT/camino-api/issues/317)) ([536f7b8](https://github.com/MTES-MCT/camino-api/commit/536f7b8ae8f88dc13fbc95ee362f9edaa7167817))
* **api:** ajoute les restrictions pour les permis de recherche M ([#321](https://github.com/MTES-MCT/camino-api/issues/321)) ([019ff66](https://github.com/MTES-MCT/camino-api/commit/019ff6636e98264b129b7df65fd9c624ef6ec017))
* **api:** expose la pagination sur les démarches ([#333](https://github.com/MTES-MCT/camino-api/issues/333)) ([68dc44b](https://github.com/MTES-MCT/camino-api/commit/68dc44b6a2a66cacd9bc8f5e28f1e9ef6ff30585))
* **api:** remonte des données spécifiques à la racine du titre ([#318](https://github.com/MTES-MCT/camino-api/issues/318)) ([f55fe18](https://github.com/MTES-MCT/camino-api/commit/f55fe18dbfc4a7c61eace413df1d5b809ea46bd1))
* **business:** prends en compte les dup et dux dans les règles métier ([#331](https://github.com/MTES-MCT/camino-api/issues/331)) ([962f7e4](https://github.com/MTES-MCT/camino-api/commit/962f7e4d49d5ff72feb63de73efc9f2d8d413d5b))
* **data:** copie le dépôt de la demande vers une étape de demande si elle n'existe pas ([#327](https://github.com/MTES-MCT/camino-api/issues/327)) ([5653ddc](https://github.com/MTES-MCT/camino-api/commit/5653ddca2db27e678d7277e89f36d2e00615ae2a))
* **data:** migre les étapes de recevabilité des ARM vers la complétude de dossier ([#323](https://github.com/MTES-MCT/camino-api/issues/323)) ([1fd314d](https://github.com/MTES-MCT/camino-api/commit/1fd314df7aeb1f1e31d4380e87a02dacce254121))
* **data:** migre les étapes dpu et dex vers les étapes dup et dux ([#328](https://github.com/MTES-MCT/camino-api/issues/328)) ([5cff85d](https://github.com/MTES-MCT/camino-api/commit/5cff85dbf0f8269bc11b9ba8ec0c5112a725e0bb))
* **descriptions:** ajoute des descriptions pour le vocabulaire de Camino ([#319](https://github.com/MTES-MCT/camino-api/issues/319)) ([614bf24](https://github.com/MTES-MCT/camino-api/commit/614bf24b1768cdd44e6d07c69e3bda243e2e06ec))
* **etapes:** limite les types d'étapes disponibles pendant l'édition ([#322](https://github.com/MTES-MCT/camino-api/issues/322)) ([b88efb6](https://github.com/MTES-MCT/camino-api/commit/b88efb6a5450d438f9f82a670a9a0dd9542d7aed))
* **import:** ajoute une feuille de reprise pour les activités de titres ([#332](https://github.com/MTES-MCT/camino-api/issues/332)) ([ee4eb70](https://github.com/MTES-MCT/camino-api/commit/ee4eb70b546f34c675f34b17bc56132fa2081cd2))
* **rapports:** permet à un type d'activité de ne pas être lié à des pays ([#315](https://github.com/MTES-MCT/camino-api/issues/315)) ([e355679](https://github.com/MTES-MCT/camino-api/commit/e355679b8397153893c0f722a8105039e929b9c4))


### Bug Fixes

* corrige le calcule du statut des démarches de retrait ([#335](https://github.com/MTES-MCT/camino-api/issues/335)) ([4750642](https://github.com/MTES-MCT/camino-api/commit/475064255d187bb77234e68950c989b41bc02109))
* **api:** corrige la séparation des paramètres en tableaux contenant des guillemets ([#320](https://github.com/MTES-MCT/camino-api/issues/320)) ([9f52ec6](https://github.com/MTES-MCT/camino-api/commit/9f52ec650218124153ce5353a04cabeddac9d82c))
* **api:** enlève l'exception de filtrage des types d'étapes pour les super utilisateurs ([#334](https://github.com/MTES-MCT/camino-api/issues/334)) ([4f9f7d6](https://github.com/MTES-MCT/camino-api/commit/4f9f7d603a5e7ed9cf778f9609ef27c0b20c6e9c))
* **data:** corrige les noms de sections des migrations et supprime les contenus vides des étapes ([#326](https://github.com/MTES-MCT/camino-api/issues/326)) ([d911d40](https://github.com/MTES-MCT/camino-api/commit/d911d40d678f6d5c4722ec3dfd352ff1398c3c37))
* **etapes:** corrige l'affichage du contenu d'étapes avec sections spécifiques ([#316](https://github.com/MTES-MCT/camino-api/issues/316)) ([0dd6d35](https://github.com/MTES-MCT/camino-api/commit/0dd6d3580f095f4e4b7b878ea7b45edf86548b1b))
* **etapes:** corrige les restrictions d'ordre des étapes mécanisées ([57fd198](https://github.com/MTES-MCT/camino-api/commit/57fd1983763342252ea61ef5deecd5a44d21813f))
* **etapes:** mets à jour les restrictions d'ordre des étapes pour les ARM ([#330](https://github.com/MTES-MCT/camino-api/issues/330)) ([8e3f2e6](https://github.com/MTES-MCT/camino-api/commit/8e3f2e6b5e46476a2b1e360f5c535eaa9dcc6477))
* corrige l'export public ([514291d](https://github.com/MTES-MCT/camino-api/commit/514291d899eadf739fecbc932ff8e55e522f12ac))
* corrige une erreur TypeScript ([d3a8678](https://github.com/MTES-MCT/camino-api/commit/d3a86788c38ee62c4ae38c1ac151f5881c51f1ff))

### [0.24.21](https://github.com/MTES-MCT/camino-api/compare/v0.24.20...v0.24.21) (2020-02-27)


### Features

* **api:** ajoute les requêtes pour les filtres de démarches ([#312](https://github.com/MTES-MCT/camino-api/issues/312)) ([f0d7702](https://github.com/MTES-MCT/camino-api/commit/f0d770274a82ff0c83ab6801be5176fcf9558278))
* **api:** ajoute un filtre sur les dates des étapes pour la vue des démarches ([#313](https://github.com/MTES-MCT/camino-api/issues/313)) ([5fcb4d8](https://github.com/MTES-MCT/camino-api/commit/5fcb4d8e26666bf190a7e01a8b614e9e9994d334))
* affiche une liste de démarches ([#308](https://github.com/MTES-MCT/camino-api/issues/308)) ([d515b47](https://github.com/MTES-MCT/camino-api/commit/d515b47ac8a96b5fa1099e807d83b84902e39a97))
* **api:** autorise l'édition sur tous les types de titres ([#306](https://github.com/MTES-MCT/camino-api/issues/306)) ([66070c2](https://github.com/MTES-MCT/camino-api/commit/66070c29f03bab8fc4cda64c2abda33a68563e49))


### Bug Fixes

* ne renomme pas les fichiers si leur nom est identique ([563f491](https://github.com/MTES-MCT/camino-api/commit/563f491fd65662728c7dab0bf822305edb7353e7))
* **api:** corrige le bouton d'édition des étapes ([69c5b20](https://github.com/MTES-MCT/camino-api/commit/69c5b2030be19724f42a4ea7f49af6b0379451b9))
* **api:** restreint la liste des types qu'une administration gestionnaire peut créer ([0290ed7](https://github.com/MTES-MCT/camino-api/commit/0290ed7be5eeb79c561601c602d3c56bd714ef5c))
* **business:** corrige la calcul des étapes de publications des PRM ([#309](https://github.com/MTES-MCT/camino-api/issues/309)) ([02f2336](https://github.com/MTES-MCT/camino-api/commit/02f2336f2995e9aac06591e93ce957e466ce4e65))
* corrige les noms des autorisations dans les imports et les migrations ([#311](https://github.com/MTES-MCT/camino-api/issues/311)) ([34d9288](https://github.com/MTES-MCT/camino-api/commit/34d9288b226b07e9899bb040b7050f64aaa16706))
* corrige une erreur typescript ([1016b5d](https://github.com/MTES-MCT/camino-api/commit/1016b5d2b957bc6f3ce7540bc71d6d1b31a56a35))
* supprime les infos personnelles lors de la suppression d'un utilisateur ([f950e82](https://github.com/MTES-MCT/camino-api/commit/f950e828add16082d6ef06ba895df98bd821bd8f))
* **dump-public:** vérifie que la variable d'environnement est bien définie ([3d32cc6](https://github.com/MTES-MCT/camino-api/commit/3d32cc6dd2e44398a03ce4ddf95512b0ddd9ef30))

### [0.24.20](https://github.com/MTES-MCT/camino-api/compare/v0.24.19...v0.24.20) (2020-02-20)


### Features

* **api:** limite les changements de permissions aux utilisateurs d'une administration ([#303](https://github.com/MTES-MCT/camino-api/issues/303)) ([7823561](https://github.com/MTES-MCT/camino-api/commit/782356108d2bbedef7299cdf12ba104fc5ddb0f9))


### Bug Fixes

* ne formatte pas un utilisateur qui vient d'être crée ([f9a6142](https://github.com/MTES-MCT/camino-api/commit/f9a614283e5db04311b30c7db7da16b1fddaeeb7))
* **api:** corrige la création de démarches sur les titres ([65b72c6](https://github.com/MTES-MCT/camino-api/commit/65b72c60f17158c7dd8f5e68345f2aaddd983969))
* **api:** corrige les restriction des types de titre pour les administrations ([8c2030c](https://github.com/MTES-MCT/camino-api/commit/8c2030cf0e55a44ef1c4f2e6622c93e2ad744784))
* **api:** corrige les restrictions pour les types d'étapes pour les administrations ([92adb33](https://github.com/MTES-MCT/camino-api/commit/92adb33516db703910df7561c7f81020b93883c6))
* corrige les définitions de types qui peuvent être null ([#304](https://github.com/MTES-MCT/camino-api/issues/304)) ([18f37de](https://github.com/MTES-MCT/camino-api/commit/18f37de658b5a02e14751e6676cd7ab2c392c935))
* **data:** crée une étape de demande pour les ARM classées ([#300](https://github.com/MTES-MCT/camino-api/issues/300)) ([8f75425](https://github.com/MTES-MCT/camino-api/commit/8f75425822da32903885c09d7ee31e061bb54f30))
* **migrate:** corrige une erreur de config dûe à une montée de version de knex ([9624437](https://github.com/MTES-MCT/camino-api/commit/9624437f8d6d4e6def6e0d3754e0a4908bd0d9a8))
* ajoute une liaison `cascade` sur les administrations ([375e6f5](https://github.com/MTES-MCT/camino-api/commit/375e6f585c4ca97d5f86cde53def4020a3a2ad5f))

### [0.24.19](https://github.com/MTES-MCT/camino-api/compare/v0.24.18...v0.24.19) (2020-02-11)


### Features

* ajoute des sections aux titres-demarches-etapes ([#288](https://github.com/MTES-MCT/camino-api/issues/288)) ([e3b3bdf](https://github.com/MTES-MCT/camino-api/commit/e3b3bdf95b29fd695dac0231c9052c09ea14ee1d))
* ajoute des types de type de titres ([#285](https://github.com/MTES-MCT/camino-api/issues/285)) ([d373142](https://github.com/MTES-MCT/camino-api/commit/d3731423700ac899d0056819415da9eed0113840))
* modifie l'id des titres pour contenir le type sur 2 lettres ([4ebefc6](https://github.com/MTES-MCT/camino-api/commit/4ebefc6e5eee95fe87a6010b92c3e941e6645762))
* retire 'ptmg-' des références de titres ([#293](https://github.com/MTES-MCT/camino-api/issues/293)) ([fb6107c](https://github.com/MTES-MCT/camino-api/commit/fb6107c57cc8dc6fefb0985291c8cb7811df7e3c))


### Bug Fixes

* compte le nombre d'activités selon le profil utilisateur ([#287](https://github.com/MTES-MCT/camino-api/issues/287)) ([c94a159](https://github.com/MTES-MCT/camino-api/commit/c94a159545f82cd72cecaf04c21b77fab21a8c14))
* corrige l'affichage des sections d'étapes ([b198c8f](https://github.com/MTES-MCT/camino-api/commit/b198c8f32370ea154ef8df95af7fb4c401ea6cdb))
* corrige l'appel à l'api administration ([6b338a1](https://github.com/MTES-MCT/camino-api/commit/6b338a110f50f08cf6b0154205e06c65f4bf2aec))
* corrige l'upload de fichiers ([c8c8cf5](https://github.com/MTES-MCT/camino-api/commit/c8c8cf51818b7a56222d2378f46dabbd9700a0a2))
* corrige la concaténation des sections d'étapes ([702be68](https://github.com/MTES-MCT/camino-api/commit/702be68388ba404916f844cc504492c81835603b))
* corrige la création d'un utilisateur ([#289](https://github.com/MTES-MCT/camino-api/issues/289)) ([f15a141](https://github.com/MTES-MCT/camino-api/commit/f15a14136e3b0d7bd21dc47ab032af35db83a577))
* corrige le calcul des propriétés d'un titre ([fd12687](https://github.com/MTES-MCT/camino-api/commit/fd1268764d89bd5e7d64ada128137122f1e08156))
* corrige les restrictions sur les titres publics ([a4c0f33](https://github.com/MTES-MCT/camino-api/commit/a4c0f3394f36c60784e7c6ecfe2d77546fc5fdd7))
* **export:** corrige l'export d'une colonne en double ([097e0c6](https://github.com/MTES-MCT/camino-api/commit/097e0c604b2fe0ff06c93ff8bc83a5dc7f84ae61))

### [0.24.18](https://github.com/MTES-MCT/camino-api/compare/v0.24.17...v0.24.18) (2020-01-31)


### Features

* **activités:** ajoute une date de début pour calculer les activités ([#274](https://github.com/MTES-MCT/camino-api/issues/274)) ([1d54984](https://github.com/MTES-MCT/camino-api/commit/1d54984ec7a3181f3ea5ba1ff80a3b097210cbd0))
* **api:** autorise les utilisateurs administration et entreprise à voir la page Utilisateurs dans le menu ([16d61b2](https://github.com/MTES-MCT/camino-api/commit/16d61b24e57c3c27a090c9d55039f01057358c17))
* **api:** ouvre les droits d'édition sur les AEX aux admin DEAL Guyane ([#267](https://github.com/MTES-MCT/camino-api/issues/267)) ([05bbc3a](https://github.com/MTES-MCT/camino-api/commit/05bbc3a099fbc1ee7884de9fb8f080344fabe03f))
* **data:** ajoute un script de suppression d'entreprises ([#263](https://github.com/MTES-MCT/camino-api/issues/263)) ([0b1c451](https://github.com/MTES-MCT/camino-api/commit/0b1c451411843d96f962684e0f813b67ee9fa373))
* **droits:** permet aux administrations de voir tous les utilisateurs ([#264](https://github.com/MTES-MCT/camino-api/issues/264)) ([f2bed22](https://github.com/MTES-MCT/camino-api/commit/f2bed222999028ee043b00ab764953a632b98ea9))
* trace les titres en doublons ([#261](https://github.com/MTES-MCT/camino-api/issues/261)) ([3d54ada](https://github.com/MTES-MCT/camino-api/commit/3d54adab519cf6c908a2c1f9ad3def609c1009bc))


### Bug Fixes

* **étapes:** corrige l'édition ([3fac969](https://github.com/MTES-MCT/camino-api/commit/3fac9699e9b2ca18595f4463c329b55eae7455b1))
* ajoute geojson-rewind ([11b3ac2](https://github.com/MTES-MCT/camino-api/commit/11b3ac2ed3530a9fa397871af5c93f4e134c7f05))
* corrige l'ordre du seed ([c7809c1](https://github.com/MTES-MCT/camino-api/commit/c7809c121a9990bffb869548b56cfdd1d86adf8a))
* corrige la création de titre ([#279](https://github.com/MTES-MCT/camino-api/issues/279)) ([effe8c4](https://github.com/MTES-MCT/camino-api/commit/effe8c404a36ae96e3e2242ba47f8fed59e00725))
* corrige le commit précédent ([883c147](https://github.com/MTES-MCT/camino-api/commit/883c1472615ac8c4f1f49d9e72f97f2540c58125))
* corrige une erreur lors de la modification d'un fichier ([397f942](https://github.com/MTES-MCT/camino-api/commit/397f9429c495baf538808d4b92f7c1ef23a543c9))
* **activites:** ne ferme pas l'activité si elle a le statut 'déposé' ([#277](https://github.com/MTES-MCT/camino-api/issues/277)) ([55a44a8](https://github.com/MTES-MCT/camino-api/commit/55a44a83853a6760d40169af48815518038097e8))
* **activités:** corrige le calcul de la date de fin ([#276](https://github.com/MTES-MCT/camino-api/issues/276)) ([2f6f301](https://github.com/MTES-MCT/camino-api/commit/2f6f30196bfd2e677f9bbc7c4296370d077eccf1))
* **api:** affichage l'édition des documents en fonction des droits ([#265](https://github.com/MTES-MCT/camino-api/issues/265)) ([8068444](https://github.com/MTES-MCT/camino-api/commit/80684446978db9766f0fb62081e3cc7e80954634))
* **api:** ajoute les sections a un utilisateur identifié ([#275](https://github.com/MTES-MCT/camino-api/issues/275)) ([a16e220](https://github.com/MTES-MCT/camino-api/commit/a16e220b78b0c1321e74887de20c4a18283f1841))
* **api:** corrige les droits sur les titres pour les utilisateurs lecteurs ([#266](https://github.com/MTES-MCT/camino-api/issues/266)) ([8b29bf1](https://github.com/MTES-MCT/camino-api/commit/8b29bf1f8a3fa3eee9b2ddd7f9987bca2720d277))
* **api:** corrige une erreur pendant la création d'un titre ([#278](https://github.com/MTES-MCT/camino-api/issues/278)) ([b7fad20](https://github.com/MTES-MCT/camino-api/commit/b7fad20418835236ae3fef77a5187faf6336d8d2))
* **api:** requête le contenu d'une activité ([7140e25](https://github.com/MTES-MCT/camino-api/commit/7140e255d55590ec3496f4b31faad44df7c4792e))
* **business:** corrige le nom du processus de mise à jour des activités ([bd24421](https://github.com/MTES-MCT/camino-api/commit/bd244216cf119a38235827e8c2a2db29d47c64b1))
* **business:** corrige un problème de mémoire pendant la mise à jour des ids de titres ([#269](https://github.com/MTES-MCT/camino-api/issues/269)) ([40ae034](https://github.com/MTES-MCT/camino-api/commit/40ae034155e11cd965d03be0aa133a2b83b01275))
* **business:** enlève les restrictions de l'étape 'cas par cas' ([#268](https://github.com/MTES-MCT/camino-api/issues/268)) ([d330d74](https://github.com/MTES-MCT/camino-api/commit/d330d74d99f8bc66b92bbb044f2712231c78d441))
* **seed:** corrige la migration ([8bb12a5](https://github.com/MTES-MCT/camino-api/commit/8bb12a52272b74ecfbc22ea6d7a1a9bff21c29fd))
* vérifie que l'initialisation du serveur a eu lieu ([#262](https://github.com/MTES-MCT/camino-api/issues/262)) ([266ad48](https://github.com/MTES-MCT/camino-api/commit/266ad4806fa5b6aa166d99497d4c9b3e2a062eaf))

### [0.24.17](https://github.com/MTES-MCT/camino-api/compare/v0.24.16...v0.24.17) (2020-01-20)


### Features

* **activités:** calclule les permissions selon l'utilisateur ([#260](https://github.com/MTES-MCT/camino-api/issues/260)) ([ee844d3](https://github.com/MTES-MCT/camino-api/commit/ee844d3b3a908983a8528281115f203ba28f35b7))


### Bug Fixes

* corrige l'enregistrement d'une activité ([1b978a3](https://github.com/MTES-MCT/camino-api/commit/1b978a352ee41a555e3e5e35f1dfb67ec81d9824))
* corrige la modification d'un id de titre ([4c1a7d2](https://github.com/MTES-MCT/camino-api/commit/4c1a7d29a6615a0ca7794d0b2f092835103459be))
* corrige les permissions sur les titres d'entreprise ([cf0d8f1](https://github.com/MTES-MCT/camino-api/commit/cf0d8f1900fcce2208be4269a747fe3c1242c345))
* **activites:** renomme le champ orBrut en orExtrait ([#254](https://github.com/MTES-MCT/camino-api/issues/254)) ([72a6e6b](https://github.com/MTES-MCT/camino-api/commit/72a6e6bed543c3ff100dbf29a1b3c8a040e98306))
* **activités:** corrige les permissions pour les administrations ([2bdc56d](https://github.com/MTES-MCT/camino-api/commit/2bdc56d26c0d0505b91f58dc51089283be0054bf))
* **api:** corrige la récupérations des unités ([0e32455](https://github.com/MTES-MCT/camino-api/commit/0e324555361f6e94df172b16bf5984698d563031))
* **api:** corrige une erreur de typo ([381167d](https://github.com/MTES-MCT/camino-api/commit/381167d090204d7c6f11040aeb70d208054b52b1))
* **database:** ajoute la colonne ordre dans le modèle des tables ([#258](https://github.com/MTES-MCT/camino-api/issues/258)) ([64b6341](https://github.com/MTES-MCT/camino-api/commit/64b6341b6b57993c025c5b280a3b3e20f2ecb071))
* corrige le script de migration des activités pré-2018 ([#257](https://github.com/MTES-MCT/camino-api/issues/257)) ([661aaa7](https://github.com/MTES-MCT/camino-api/commit/661aaa73bf8f6b35a5dd0bdac9b28bdd2a39b6f4))
* **api:** ordonne les activités par fréquence ([#256](https://github.com/MTES-MCT/camino-api/issues/256)) ([a074141](https://github.com/MTES-MCT/camino-api/commit/a07414182f54f7ba55bfb935d2525ada0027f528))
* **business:** calcule une date de demande pour les demandes classées ([#249](https://github.com/MTES-MCT/camino-api/issues/249)) ([02cd8b1](https://github.com/MTES-MCT/camino-api/commit/02cd8b10d84437a9b68be0c3dfc3ec06cafb01a2))
* **business:** dynamise les champs requis sur une activité ([#252](https://github.com/MTES-MCT/camino-api/issues/252)) ([95b8432](https://github.com/MTES-MCT/camino-api/commit/95b8432ebee2ee83f959ba55559438fc5afb1aeb))
* **edition d'étape:** corrige l'erreur Unexpected error value: "EPSG:4624" ([#250](https://github.com/MTES-MCT/camino-api/issues/250)) ([92e8309](https://github.com/MTES-MCT/camino-api/commit/92e83096ad2c6d97ee8c57eb1cccc81c5620d8f6))
* **entreprises:** remplit le legal_siren manquant de certaines entreprises ([#251](https://github.com/MTES-MCT/camino-api/issues/251)) ([b891b83](https://github.com/MTES-MCT/camino-api/commit/b891b83fa284853ae6f60caef0b5b057b1105488))
* **knex:** efface le contenu des tables avant d'en insérer à nouveau ([971cbf9](https://github.com/MTES-MCT/camino-api/commit/971cbf9aefd1e76be3e041ee7a45e13be3751e9f))
* charge les systèmes géo depuis la base de données ([#253](https://github.com/MTES-MCT/camino-api/issues/253)) ([aac5473](https://github.com/MTES-MCT/camino-api/commit/aac5473ba8fd746fe4d8aad8e21b96a636279052))
* corrige une erreur typescript lors du build ([2f802e3](https://github.com/MTES-MCT/camino-api/commit/2f802e31575802eedad321df6ad4b07123a07419))

### [0.24.16](https://github.com/MTES-MCT/camino-api/compare/v0.24.15...v0.24.16) (2019-12-20)


### Features

* crée des activités annuelles pour l'or net ([#248](https://github.com/MTES-MCT/camino-api/issues/248)) ([3721367](https://github.com/MTES-MCT/camino-api/commit/3721367a391aa4b1d6f2cea97b6b42a64cbd6018))
* **api-insee:** enregistre tous les établissements ([#244](https://github.com/MTES-MCT/camino-api/issues/244)) ([fee9f50](https://github.com/MTES-MCT/camino-api/commit/fee9f5076be5db32fadf4ae2f3bf4fba0801232c))


### Bug Fixes

* **api:** corrige les restrictions de création/modification d'étape ([11e816f](https://github.com/MTES-MCT/camino-api/commit/11e816fbf8d2a39de725084bc59a549738dcdd8a))
* **api:** expose les 'années' dans le champs 'fréquence' ([76ffc9b](https://github.com/MTES-MCT/camino-api/commit/76ffc9b5249147dc78ce72517708923c4667ee07))
* **api:** ordonne les métas ([#246](https://github.com/MTES-MCT/camino-api/issues/246)) ([61ff8eb](https://github.com/MTES-MCT/camino-api/commit/61ff8eb4c31947da6e3f08ad8b702a781e28ef68))
* **api-administrations:** corrige l'id de la préfecture de Paris ([6d15a21](https://github.com/MTES-MCT/camino-api/commit/6d15a21e84eab308dec995f8ce8032b3d6d24860))
* **api-administrations:** corrige l'import et l'export des administrations ([#247](https://github.com/MTES-MCT/camino-api/issues/247)) ([19afc4a](https://github.com/MTES-MCT/camino-api/commit/19afc4ad5cb83fc480db47f037c75baf6bc64fe8))

### [0.24.15](https://github.com/MTES-MCT/camino-api/compare/v0.24.14...v0.24.15) (2019-12-19)

### [0.24.14](https://github.com/MTES-MCT/camino-api/compare/v0.24.13...v0.24.14) (2019-12-19)


### Features

* **data:** ajoute des règles pour le déplacement de contenu des étapes ([#242](https://github.com/MTES-MCT/camino-api/issues/242)) ([f74995a](https://github.com/MTES-MCT/camino-api/commit/f74995a07f3f9c676ca80e1e6afcfc8d7a0fe9c0))
* **data:** déplace des contenus d'étapes ARM ([#232](https://github.com/MTES-MCT/camino-api/issues/232)) ([8be65bb](https://github.com/MTES-MCT/camino-api/commit/8be65bb5a5bbadc56a9c3164120c006ea17966b9))


### Bug Fixes

* ajoute des contraintes dans la base de données ([#243](https://github.com/MTES-MCT/camino-api/issues/243)) ([f529017](https://github.com/MTES-MCT/camino-api/commit/f529017cdaa52ee9f0a935315f7fd96ee0f70aaf))
* corrige les paramètres de mise à jour ([6ed6020](https://github.com/MTES-MCT/camino-api/commit/6ed6020bab734eaaddb183cf0f7d268ae97e2863))
* **business:** corrige l'enregistrement des établissements d'entreprise ([#238](https://github.com/MTES-MCT/camino-api/issues/238)) ([de5ab5c](https://github.com/MTES-MCT/camino-api/commit/de5ab5ccf29a025b8abb149b24813e6ac26792a3))

### [0.24.13](https://github.com/MTES-MCT/camino-api/compare/v0.24.12...v0.24.13) (2019-12-10)


### Features

* **api:** expose les activités ([#236](https://github.com/MTES-MCT/camino-api/issues/236)) ([000bade](https://github.com/MTES-MCT/camino-api/commit/000badeb25817f3054f1aa23de86898425e1df6e))
* **communes:** ajoute de la surface couverte sur la commune par le titre ([#235](https://github.com/MTES-MCT/camino-api/issues/235)) ([573b9f3](https://github.com/MTES-MCT/camino-api/commit/573b9f32bd425eeb0915df29a93c0ecd8ffeec01))


### Bug Fixes

* corrige l'affichage d'une page entreprise ([b6f41ba](https://github.com/MTES-MCT/camino-api/commit/b6f41ba9407235db7fbcce003bcb3044834dd361))
* corrige l'insertion des communes en base de données ([c9a28ed](https://github.com/MTES-MCT/camino-api/commit/c9a28eded5da7baf3575dec2a12f690859eb65b6))
* corrige la page stats qui ne s'affiche plus ([34dcfe6](https://github.com/MTES-MCT/camino-api/commit/34dcfe63a72a82f3fada8f23fe47bf47744b6077))
* corrige une erreur pendant le daily ([ba98360](https://github.com/MTES-MCT/camino-api/commit/ba983606636feee95008a50479409f707b3abf06))
* dynamise le graph sur la requête activités ([2a550c6](https://github.com/MTES-MCT/camino-api/commit/2a550c674a8d43518bd0f81f86f04027cc2394ee))

### [0.24.12](https://github.com/MTES-MCT/camino-api/compare/v0.24.10...v0.24.12) (2019-12-06)


### Features

* **activités:** autorise la préfecture de Guyane à voir les activités en mode éditeur ([ca8cde0](https://github.com/MTES-MCT/camino-api/commit/ca8cde0667ecc9f8bdcf5a363b91698bad5e63d6))
* **api:** charge contextuellement les metas lors de l'édition ([#229](https://github.com/MTES-MCT/camino-api/issues/229)) ([e672e2e](https://github.com/MTES-MCT/camino-api/commit/e672e2e278a6bdce02b191cb65769a30a4eea22c))
* **api:** restreint les domaines et types de titre en fonction des permissions ([#228](https://github.com/MTES-MCT/camino-api/issues/228)) ([ceda8b4](https://github.com/MTES-MCT/camino-api/commit/ceda8b4c1ae51daf22d8d6e690ea69d89d3a51a5))
* autorise les superadmins à changer les mots de passe ([#227](https://github.com/MTES-MCT/camino-api/issues/227)) ([e135c60](https://github.com/MTES-MCT/camino-api/commit/e135c60b4744d2f38a793f4021d334978f1853d5))
* **api:** expose des propriétés pour éditer selon les droits utilisateur ([#225](https://github.com/MTES-MCT/camino-api/issues/225)) ([454bebb](https://github.com/MTES-MCT/camino-api/commit/454bebb0b32e985025183cba45550e37917df8dd))


### Bug Fixes

* rend les activités accessible à la préfecture de guyane ([2d0130d](https://github.com/MTES-MCT/camino-api/commit/2d0130dc5d7dcc31e64307909832d24fe62366c2))
* **api:** corrige l'édition d'un titre pour l'utilisateur super admin ([d0347c0](https://github.com/MTES-MCT/camino-api/commit/d0347c07973db9a897999b2cb76125233f0b0a67))
* **api:** corrige la validation des étapes ([#230](https://github.com/MTES-MCT/camino-api/issues/230)) ([8fb34c9](https://github.com/MTES-MCT/camino-api/commit/8fb34c9f418185d1046228a19fc3029512e10a11))
* **api:** corrige la vérification des permissions pour le paramètre editable ([7c01225](https://github.com/MTES-MCT/camino-api/commit/7c0122513fa76ae23598ef922a38b1c8d0e0f173))
* **api:** corrige le chargement des domaines ([89efe10](https://github.com/MTES-MCT/camino-api/commit/89efe10d2094519eb4c46fcb2641795ac0191107))
* **api:** corrige le formatage de la liste des utilisateurs ([00e7d16](https://github.com/MTES-MCT/camino-api/commit/00e7d1649373a54f2a7447214a7b9167b9ea8e0c))
* **api:** rend visible les activités pour les titulaires ([#231](https://github.com/MTES-MCT/camino-api/issues/231)) ([6554859](https://github.com/MTES-MCT/camino-api/commit/655485905b558e06bc06a5812959dae7793394ad))
* **api:** supprime "documents.nom should be string" lors de l'enregistrement d'une étape ([8bf9fa3](https://github.com/MTES-MCT/camino-api/commit/8bf9fa3408e866839bcba39f58a84cddf5311a27))
* **business:** ajout de règles de validation d'ordre des étapes ([#226](https://github.com/MTES-MCT/camino-api/issues/226)) ([0463b91](https://github.com/MTES-MCT/camino-api/commit/0463b91270921cc641fe19134de238e41968f9ef))
* **business:** corrige les tests de calcul de statut de démarche ([eddb921](https://github.com/MTES-MCT/camino-api/commit/eddb9217caedb84a48eb6f479ee2df55e8245881))
* **business:** supprime la vérification de date dans le futur pour le statut en instruction des démarches ([92f060b](https://github.com/MTES-MCT/camino-api/commit/92f060b8d8a28ca20f85883a6a6bdbc4038a22b1))

### [0.24.11](https://github.com/MTES-MCT/camino-api/compare/v0.24.10...v0.24.11) (2019-11-27)


### Features

* **api:** restreint les domaines et types de titre en fonction des permissions ([#228](https://github.com/MTES-MCT/camino-api/issues/228)) ([ceda8b4](https://github.com/MTES-MCT/camino-api/commit/ceda8b4c1ae51daf22d8d6e690ea69d89d3a51a5))
* autorise les superadmins à changer les mots de passe ([#227](https://github.com/MTES-MCT/camino-api/issues/227)) ([e135c60](https://github.com/MTES-MCT/camino-api/commit/e135c60b4744d2f38a793f4021d334978f1853d5))
* **api:** expose des propriétés pour éditer selon les droits utilisateur ([#225](https://github.com/MTES-MCT/camino-api/issues/225)) ([454bebb](https://github.com/MTES-MCT/camino-api/commit/454bebb0b32e985025183cba45550e37917df8dd))


### Bug Fixes

* **api:** corrige l'édition d'un titre pour l'utilisateur super admin ([d0347c0](https://github.com/MTES-MCT/camino-api/commit/d0347c07973db9a897999b2cb76125233f0b0a67))
* **api:** corrige la validation des étapes ([#230](https://github.com/MTES-MCT/camino-api/issues/230)) ([8fb34c9](https://github.com/MTES-MCT/camino-api/commit/8fb34c9f418185d1046228a19fc3029512e10a11))
* **api:** corrige la vérification des permissions pour le paramètre editable ([7c01225](https://github.com/MTES-MCT/camino-api/commit/7c0122513fa76ae23598ef922a38b1c8d0e0f173))
* **api:** rend visible les activités pour les titulaires ([#231](https://github.com/MTES-MCT/camino-api/issues/231)) ([6554859](https://github.com/MTES-MCT/camino-api/commit/655485905b558e06bc06a5812959dae7793394ad))
* **business:** ajout de règles de validation d'ordre des étapes ([#226](https://github.com/MTES-MCT/camino-api/issues/226)) ([0463b91](https://github.com/MTES-MCT/camino-api/commit/0463b91270921cc641fe19134de238e41968f9ef))
* **business:** corrige les tests de calcul de statut de démarche ([eddb921](https://github.com/MTES-MCT/camino-api/commit/eddb9217caedb84a48eb6f479ee2df55e8245881))
* **business:** supprime la vérification de date dans le futur pour le statut en instruction des démarches ([92f060b](https://github.com/MTES-MCT/camino-api/commit/92f060b8d8a28ca20f85883a6a6bdbc4038a22b1))

### [0.24.10](https://github.com/MTES-MCT/camino-api/compare/v0.24.9...v0.24.10) (2019-11-21)


### Bug Fixes

* **business:** corrige l'ordre des étapes en cas de dates similaires ([#221](https://github.com/MTES-MCT/camino-api/issues/221)) ([62b9bb6](https://github.com/MTES-MCT/camino-api/commit/62b9bb6))
* **business:** corrige la mise à jour d'un titre (perte d'administrations) ([cfed9a0](https://github.com/MTES-MCT/camino-api/commit/cfed9a0))
* **business:** corrige le statut des titres pour les démarches en construction ([2fac4f1](https://github.com/MTES-MCT/camino-api/commit/2fac4f1))
* **business:** n'associe les administrations centrales qu'à la mise à jour d'un titre ([2eec1f2](https://github.com/MTES-MCT/camino-api/commit/2eec1f2))
* **export:** corrige l'export des références ([0564443](https://github.com/MTES-MCT/camino-api/commit/0564443))
* corrige la nouvelle structure des références ; refactor: sépare les métas dans l'api ([#219](https://github.com/MTES-MCT/camino-api/issues/219)) ([7d67949](https://github.com/MTES-MCT/camino-api/commit/7d67949))
* **business:** prends en compte l'ordre si les étapes ont la même date et type ([#222](https://github.com/MTES-MCT/camino-api/issues/222)) ([91020f5](https://github.com/MTES-MCT/camino-api/commit/91020f5))


### Features

* **api:** limite la liste des types de références métier ([#185](https://github.com/MTES-MCT/camino-api/issues/185)) ([5299064](https://github.com/MTES-MCT/camino-api/commit/5299064))
* **api:** restreint l'édition des titres selon les permissions ([#223](https://github.com/MTES-MCT/camino-api/issues/223)) ([2d9fa01](https://github.com/MTES-MCT/camino-api/commit/2d9fa01))
* **api:** valide l'ordre des étapes ARM ([#205](https://github.com/MTES-MCT/camino-api/issues/205)) ([39317c1](https://github.com/MTES-MCT/camino-api/commit/39317c1))

### [0.24.9](https://github.com/MTES-MCT/camino-api/compare/v0.24.8...v0.24.9) (2019-11-13)


### Bug Fixes

* **api-insee:** corrige le nom des entreprises n'ayant que le nom du(de la) dirigeant(e) ([d600ba8](https://github.com/MTES-MCT/camino-api/commit/d600ba8))
* corrige l'enregistrement d'une étape ([88c7da3](https://github.com/MTES-MCT/camino-api/commit/88c7da3))
* encode l'adresse email pour la passer dans l'url ([61ff2b9](https://github.com/MTES-MCT/camino-api/commit/61ff2b9))
* **ajout de documents:** rend le "nom" facultatif, limite la taille du fichier à 10mo ([#208](https://github.com/MTES-MCT/camino-api/issues/208)) ([4d10e8a](https://github.com/MTES-MCT/camino-api/commit/4d10e8a))
* **api:** formate les entreprises et les administrations des titres ([#209](https://github.com/MTES-MCT/camino-api/issues/209)) ([b34278d](https://github.com/MTES-MCT/camino-api/commit/b34278d))
* **api-insee:** corrige la gestion du cache ([#214](https://github.com/MTES-MCT/camino-api/issues/214)) ([639a514](https://github.com/MTES-MCT/camino-api/commit/639a514))
* **api-insee:** corrige le message d'erreur en cas de token invalide ([#217](https://github.com/MTES-MCT/camino-api/issues/217)) ([69b36ef](https://github.com/MTES-MCT/camino-api/commit/69b36ef))
* **api-insee:** corrige si l'entreprise n'est pas trouvée avec un siren ([#215](https://github.com/MTES-MCT/camino-api/issues/215)) ([e48656c](https://github.com/MTES-MCT/camino-api/commit/e48656c))
* **api-insee:** initialise le token lors de la création d'une entreprise ([2bc55a9](https://github.com/MTES-MCT/camino-api/commit/2bc55a9))
* **business:** corrige la création des activités ([#216](https://github.com/MTES-MCT/camino-api/issues/216)) ([358c0bd](https://github.com/MTES-MCT/camino-api/commit/358c0bd))
* **business:** corrige la requête de titres pour la création des activités ([18acf50](https://github.com/MTES-MCT/camino-api/commit/18acf50))
* **business:** corrige le calcul des dates des activités ([9bd370c](https://github.com/MTES-MCT/camino-api/commit/9bd370c))
* corrige une erreur d'appel d'une fonction ([df26257](https://github.com/MTES-MCT/camino-api/commit/df26257))
* supprime les entreprises ou administrations liées ([#213](https://github.com/MTES-MCT/camino-api/issues/213)) ([f5adc1b](https://github.com/MTES-MCT/camino-api/commit/f5adc1b))


### Features

* **business:** restreint la visualisation des titres et étapes ([#197](https://github.com/MTES-MCT/camino-api/issues/197)) ([c3b2749](https://github.com/MTES-MCT/camino-api/commit/c3b2749))
* **édition:** ajoute une entreprise ([#200](https://github.com/MTES-MCT/camino-api/issues/200)) ([c5e078f](https://github.com/MTES-MCT/camino-api/commit/c5e078f))
* contraint les liens entre utilisateurs et administration / entreprise ([#212](https://github.com/MTES-MCT/camino-api/issues/212)) ([6000dc3](https://github.com/MTES-MCT/camino-api/commit/6000dc3))

### [0.24.8](https://github.com/MTES-MCT/camino-api/compare/v0.24.7...v0.24.8) (2019-10-28)


### Bug Fixes

* **api:** corrige l'édition d'un titre avec des activités dont la date de saisie est vide ([#206](https://github.com/MTES-MCT/camino-api/issues/206)) ([f67a942](https://github.com/MTES-MCT/camino-api/commit/f67a942))
* **api:** corrige le calcul des administrations pendant l'édition des étapes ([785dc19](https://github.com/MTES-MCT/camino-api/commit/785dc19))
* **api:** corrige les permissions pour la création et modification de titres ([45f0653](https://github.com/MTES-MCT/camino-api/commit/45f0653))
* **api:** supprime le filtre des types d'étapes uniques ([2e5ef49](https://github.com/MTES-MCT/camino-api/commit/2e5ef49))
* **api:** supprime les liens d'un utilisateur lors de la suppression du compte ([b009cd3](https://github.com/MTES-MCT/camino-api/commit/b009cd3))
* **business:** corrige l'affichage du résultat du calcul des phases ([849a502](https://github.com/MTES-MCT/camino-api/commit/849a502))
* **business:** corrige le calcul du statut d'un titre n'ayant que des démarches avec le statut indéfini ([41caf6c](https://github.com/MTES-MCT/camino-api/commit/41caf6c))
* **business:** corrige le calcul du statut des titres n'ayant pas de démarche ([b038c13](https://github.com/MTES-MCT/camino-api/commit/b038c13))
* **business:** prend en compte les étapes d'avenant au contrat (aco) ([7f2d1ff](https://github.com/MTES-MCT/camino-api/commit/7f2d1ff))
* **édition:** corrige une erreur lors de la mise à jour d'une étape ([#202](https://github.com/MTES-MCT/camino-api/issues/202)) ([cf1be91](https://github.com/MTES-MCT/camino-api/commit/cf1be91))
* **édition:** corrige une erreur lors de la validation des activités ([8c52e4c](https://github.com/MTES-MCT/camino-api/commit/8c52e4c))
* **migration:** corrige une erreur knex due au volume de données ([32a3a7e](https://github.com/MTES-MCT/camino-api/commit/32a3a7e))
* corrige une faute de grammaire ([f264b2d](https://github.com/MTES-MCT/camino-api/commit/f264b2d))


### Features

* ajoute l'ONF et la DEAL Guyane aux administrations centrales ([#207](https://github.com/MTES-MCT/camino-api/issues/207)) ([a81f3c0](https://github.com/MTES-MCT/camino-api/commit/a81f3c0))
* **api:** ajoute l'option d'administration "subsidiaire" ([#204](https://github.com/MTES-MCT/camino-api/issues/204)) ([dc8adbf](https://github.com/MTES-MCT/camino-api/commit/dc8adbf))
* **api:** ajoute les colonnes de permissions de visualisation des étapes pour le public et les titulaires/amodiataires ([28f850d](https://github.com/MTES-MCT/camino-api/commit/28f850d))
* **api:** prend en compte les étapes uniques ([a5451d7](https://github.com/MTES-MCT/camino-api/commit/a5451d7))
* **édition:** empêche les durées négatives sur les activtés ([#203](https://github.com/MTES-MCT/camino-api/issues/203)) ([aae1aad](https://github.com/MTES-MCT/camino-api/commit/aae1aad))
* **édition de documents:** rend le nom facultatif ([919b53c](https://github.com/MTES-MCT/camino-api/commit/919b53c))

### [0.24.7](https://github.com/MTES-MCT/camino-api/compare/v0.24.6...v0.24.7) (2019-10-23)


### Bug Fixes

* convertit les coordonnées en grades ([#196](https://github.com/MTES-MCT/camino-api/issues/196)) ([5f3ce18](https://github.com/MTES-MCT/camino-api/commit/5f3ce18))
* **api:** identifie l'utilisateur après un changement de mot de passe ([#194](https://github.com/MTES-MCT/camino-api/issues/194)) ([e30880d](https://github.com/MTES-MCT/camino-api/commit/e30880d))
* **api:** met à jour l'export utilisateurs lors de la suppression ([#192](https://github.com/MTES-MCT/camino-api/issues/192)) ([a49ae1a](https://github.com/MTES-MCT/camino-api/commit/a49ae1a))


### Features

* **édition des étapes:** refuse les valeurs négatives sur les champs "number" ([#198](https://github.com/MTES-MCT/camino-api/issues/198)) ([abba6ea](https://github.com/MTES-MCT/camino-api/commit/abba6ea))
* téléverse des fichiers ([#195](https://github.com/MTES-MCT/camino-api/issues/195)) ([f25f423](https://github.com/MTES-MCT/camino-api/commit/f25f423))
* **api:** ajoute les administrations aux utilisateurs ([#191](https://github.com/MTES-MCT/camino-api/issues/191)) ([b56e28a](https://github.com/MTES-MCT/camino-api/commit/b56e28a))

### [0.24.6](https://github.com/MTES-MCT/camino-api/compare/v0.24.5...v0.24.6) (2019-10-16)


### Bug Fixes

* **business:** corrige l'ordre des étapes et démarches lors du calcul des propriétés ([#182](https://github.com/MTES-MCT/camino-api/issues/182)) ([ed1a892](https://github.com/MTES-MCT/camino-api/commit/ed1a892))
* **business:** corrige l'unité de la création des références de points ([#175](https://github.com/MTES-MCT/camino-api/issues/175)) ([6744ccd](https://github.com/MTES-MCT/camino-api/commit/6744ccd))
* **business:** corrige le calcul de la date de fin d'un titre ([#190](https://github.com/MTES-MCT/camino-api/issues/190)) ([652c32c](https://github.com/MTES-MCT/camino-api/commit/652c32c))
* **business:** corrige le renommage des propriétés d'étapes de titres ([#188](https://github.com/MTES-MCT/camino-api/issues/188)) ([ba8b86d](https://github.com/MTES-MCT/camino-api/commit/ba8b86d))
* **business:** corrige les mises à jour de volumes de données importants ([#177](https://github.com/MTES-MCT/camino-api/issues/177)) ([d4b2f88](https://github.com/MTES-MCT/camino-api/commit/d4b2f88))
* **business:** corrige les paramètres de requêtes de démarches et étapes ([#183](https://github.com/MTES-MCT/camino-api/issues/183)) ([352475d](https://github.com/MTES-MCT/camino-api/commit/352475d))
* **business:** corrige une erreur pendant la mise à jour si l'objet n'existe plus ([#189](https://github.com/MTES-MCT/camino-api/issues/189)) ([9736b96](https://github.com/MTES-MCT/camino-api/commit/9736b96))
* **export:** corrige les unités et la devise d'engagement des titres ([a535b8b](https://github.com/MTES-MCT/camino-api/commit/a535b8b))
* affiche les dates correctement quelque soit le fuseau horaire ([da2f806](https://github.com/MTES-MCT/camino-api/commit/da2f806))
* corrige le renommage d'un titre ([f7a03de](https://github.com/MTES-MCT/camino-api/commit/f7a03de))
* corrige une erreur typo ([7be2af1](https://github.com/MTES-MCT/camino-api/commit/7be2af1))
* **export:** corrige l'export des entreprises et l'adresse de l'établissement ([#181](https://github.com/MTES-MCT/camino-api/issues/181)) ([600c80c](https://github.com/MTES-MCT/camino-api/commit/600c80c))
* corrige une typo sur l'ordre des substances ([#179](https://github.com/MTES-MCT/camino-api/issues/179)) ([6ef8178](https://github.com/MTES-MCT/camino-api/commit/6ef8178))
* ordonne la liste des substances ([#173](https://github.com/MTES-MCT/camino-api/issues/173)) ([4b6ab81](https://github.com/MTES-MCT/camino-api/commit/4b6ab81))
* **import:** corrige l'import des fichiers volumineux ([#174](https://github.com/MTES-MCT/camino-api/issues/174)) ([ddc8397](https://github.com/MTES-MCT/camino-api/commit/ddc8397))


### Features

* **export:** exporte les communes, départements, régions et pays ([7301ae8](https://github.com/MTES-MCT/camino-api/commit/7301ae8))
* **permissions:** autorise l'ONF à voir titres échus et demandes classées ([#187](https://github.com/MTES-MCT/camino-api/issues/187)) ([913b524](https://github.com/MTES-MCT/camino-api/commit/913b524))
* affecte une unité à un système géographique ([#184](https://github.com/MTES-MCT/camino-api/issues/184)) ([ea23119](https://github.com/MTES-MCT/camino-api/commit/ea23119))

### [0.24.5](https://github.com/MTES-MCT/camino-api/compare/v0.24.4...v0.24.5) (2019-10-02)


### Bug Fixes

* **api:** remplace des anciens ids utilisateurs par un hash ([#167](https://github.com/MTES-MCT/camino-api/issues/167)) ([56ffbc7](https://github.com/MTES-MCT/camino-api/commit/56ffbc7))
* **api-communes:** limite la connexion à l'API externe ([bf6c034](https://github.com/MTES-MCT/camino-api/commit/bf6c034))
* **api-insee:** limite les appels en parallèle ([8a44a29](https://github.com/MTES-MCT/camino-api/commit/8a44a29))
* **auth:** corrige une erreur si un utilisateur est logué mais n'existe plus en base ([#163](https://github.com/MTES-MCT/camino-api/issues/163)) ([691a5e2](https://github.com/MTES-MCT/camino-api/commit/691a5e2))
* **business:** calcule la date de fin de phase pour les mutations ([#94](https://github.com/MTES-MCT/camino-api/issues/94)) ([7cb8574](https://github.com/MTES-MCT/camino-api/commit/7cb8574))
* **business:** corrige la mise à jour d'un titre ([f4201e3](https://github.com/MTES-MCT/camino-api/commit/f4201e3))
* **business:** corrige les phases des mutations partielles ([#166](https://github.com/MTES-MCT/camino-api/issues/166)) ([e595cd1](https://github.com/MTES-MCT/camino-api/commit/e595cd1))
* **business:** effectue un test de connexion à l'API administration ([#164](https://github.com/MTES-MCT/camino-api/issues/164)) ([2d52368](https://github.com/MTES-MCT/camino-api/commit/2d52368))
* **business:** gère les périmètres des titres en modification en instance ([#150](https://github.com/MTES-MCT/camino-api/issues/150)) ([154b042](https://github.com/MTES-MCT/camino-api/commit/154b042))
* **business:** n'écrase pas un titre existant si un autre titre à la même id ([#162](https://github.com/MTES-MCT/camino-api/issues/162)) ([d2ab28e](https://github.com/MTES-MCT/camino-api/commit/d2ab28e))
* **export:** corrige le champs des unités des références ([bcdefb6](https://github.com/MTES-MCT/camino-api/commit/bcdefb6))
* **insee:** corrige la génération du token ([#165](https://github.com/MTES-MCT/camino-api/issues/165)) ([cd73050](https://github.com/MTES-MCT/camino-api/commit/cd73050))


### Features

* **api:** ordonne les points par ordre ascendant ([#171](https://github.com/MTES-MCT/camino-api/issues/171)) ([788097f](https://github.com/MTES-MCT/camino-api/commit/788097f))
* rend le champs nom d'un point facultatif ([dd56a6d](https://github.com/MTES-MCT/camino-api/commit/dd56a6d))
* supprime le champs visas ([#169](https://github.com/MTES-MCT/camino-api/issues/169)) ([772bdb7](https://github.com/MTES-MCT/camino-api/commit/772bdb7))

### [0.24.4](https://github.com/MTES-MCT/camino-api/compare/v0.24.2...v0.24.4) (2019-09-23)


### Bug Fixes

* **api:** corrige le formatage de la requête en base ([#157](https://github.com/MTES-MCT/camino-api/issues/157)) ([1171a65](https://github.com/MTES-MCT/camino-api/commit/1171a65))
* **api:** ordonne les activités, démarches, étapes, etc ([f0a8ff4](https://github.com/MTES-MCT/camino-api/commit/f0a8ff4))
* **business:** ajout des étapes de `def` et `sco` pour le calcul des administrations ([870edb8](https://github.com/MTES-MCT/camino-api/commit/870edb8))
* **business:** ajoute la règle d'instruction pour l'étape de 'meo' ([2e1ee0f](https://github.com/MTES-MCT/camino-api/commit/2e1ee0f))
* **business:** ajoute la règle d'instruction pour les étapes de def et aca ajournées/programmées ([2ecd5c3](https://github.com/MTES-MCT/camino-api/commit/2ecd5c3))
* **business:** ajoute les règles métier ARM; factorise les étapes de publication ([#147](https://github.com/MTES-MCT/camino-api/issues/147)) ([22aef8f](https://github.com/MTES-MCT/camino-api/commit/22aef8f))
* **business:** corrige l'export des activités lors du changement d'id de titre ([#158](https://github.com/MTES-MCT/camino-api/issues/158)) ([fa7f43e](https://github.com/MTES-MCT/camino-api/commit/fa7f43e))
* **database:** définit le type des coordonnnées de références en nombres ([e1a0c5a](https://github.com/MTES-MCT/camino-api/commit/e1a0c5a))
* **export:** ajoute la colonne 'subsidiaire' dans l'export des points ([0b4c8d1](https://github.com/MTES-MCT/camino-api/commit/0b4c8d1))
* ajoute la colonne 'opposable' dans l'export ([66e70b0](https://github.com/MTES-MCT/camino-api/commit/66e70b0))
* crée le dossier `sources` s'il n'existe pas lors de l'import [#149](https://github.com/MTES-MCT/camino-api/issues/149) ([f0982bf](https://github.com/MTES-MCT/camino-api/commit/f0982bf))


### Features

* **api:** rend les fiches entreprises visibles au public ([#156](https://github.com/MTES-MCT/camino-api/issues/156)) ([af2186d](https://github.com/MTES-MCT/camino-api/commit/af2186d))
* **export:** exporte les spreadsheets d'activités ([#155](https://github.com/MTES-MCT/camino-api/issues/155)) ([88834a2](https://github.com/MTES-MCT/camino-api/commit/88834a2))

### [0.24.3](https://github.com/MTES-MCT/camino-api/compare/v0.24.2...v0.24.3) (2019-09-12)


### Bug Fixes

* **business:** ajout des étapes de `def` et `sco` pour le calcul des administrations ([870edb8](https://github.com/MTES-MCT/camino-api/commit/870edb8))
* **business:** ajoute la règle d'instruction pour l'étape de 'meo' ([2e1ee0f](https://github.com/MTES-MCT/camino-api/commit/2e1ee0f))
* **business:** ajoute la règle d'instruction pour les étapes de def et aca ajournées/programmées ([2ecd5c3](https://github.com/MTES-MCT/camino-api/commit/2ecd5c3))
* **export:** ajoute la colonne 'subsidiaire' dans l'export des points ([0b4c8d1](https://github.com/MTES-MCT/camino-api/commit/0b4c8d1))
* ajoute la colonne 'opposable' dans l'export ([66e70b0](https://github.com/MTES-MCT/camino-api/commit/66e70b0))
* **business:** ajoute les règles métier ARM; factorise les étapes de publication ([#147](https://github.com/MTES-MCT/camino-api/issues/147)) ([22aef8f](https://github.com/MTES-MCT/camino-api/commit/22aef8f))
* crée le dossier `sources` s'il n'existe pas lors de l'import [#149](https://github.com/MTES-MCT/camino-api/issues/149) ([f0982bf](https://github.com/MTES-MCT/camino-api/commit/f0982bf))

### [0.24.2](https://github.com/MTES-MCT/camino-api/compare/v0.24.1...v0.24.2) (2019-08-15)


### Bug Fixes

* corrige l'export ([609df3c](https://github.com/MTES-MCT/camino-api/commit/609df3c))
* corrige le commit précédent ([813769e](https://github.com/MTES-MCT/camino-api/commit/813769e))
* met à jour knex ([b1cce3d](https://github.com/MTES-MCT/camino-api/commit/b1cce3d))
* passe le nom du nœud racine à la fonction de eager ([8b52965](https://github.com/MTES-MCT/camino-api/commit/8b52965))
* **export:** trouve l'id de la ligne de l'activité dans la spreadsheet ([#146](https://github.com/MTES-MCT/camino-api/issues/146)) ([bc53b98](https://github.com/MTES-MCT/camino-api/commit/bc53b98))


### Features

* converti les coordonnées géo lors de l'éditiom ([728d159](https://github.com/MTES-MCT/camino-api/commit/728d159))
* **business:** ajoute une référence sur les points géo qui n'en n'ont pas ([9eb6ad5](https://github.com/MTES-MCT/camino-api/commit/9eb6ad5))
* formate le eager sur titres au sein d'une entreprise ([24aaa16](https://github.com/MTES-MCT/camino-api/commit/24aaa16))
* supprime les champs pré-définis dans l'API ([e143336](https://github.com/MTES-MCT/camino-api/commit/e143336))

### [0.24.1](https://github.com/MTES-MCT/camino-api/compare/v0.24.0...v0.24.1) (2019-07-31)


### Bug Fixes

* **api:** supprime la référence à l'étape sur un point ([4c648e7](https://github.com/MTES-MCT/camino-api/commit/4c648e7))
* ajoute les références dans les propriétés geojson des points ([#123](https://github.com/MTES-MCT/camino-api/issues/123)) ([583aecf](https://github.com/MTES-MCT/camino-api/commit/583aecf))
* ajoute un type manquant ([415b1dd](https://github.com/MTES-MCT/camino-api/commit/415b1dd))
* corrige import-check s'il n'y a pas de reprise de données ([#137](https://github.com/MTES-MCT/camino-api/issues/137)) ([65019f3](https://github.com/MTES-MCT/camino-api/commit/65019f3))
* corrige l'affichage des demandes rejetées ([#143](https://github.com/MTES-MCT/camino-api/issues/143)) ([9a0c3d9](https://github.com/MTES-MCT/camino-api/commit/9a0c3d9))
* corrige l'appel de la fonction de mise à jour des ids de titre ([#135](https://github.com/MTES-MCT/camino-api/issues/135)) ([f27f662](https://github.com/MTES-MCT/camino-api/commit/f27f662))
* corrige l'édition d'étapes des titres AEX, PRX, ARM ([#145](https://github.com/MTES-MCT/camino-api/issues/145)) ([66e6926](https://github.com/MTES-MCT/camino-api/commit/66e6926))
* corrige la comparaison de propriétés des phases ([#138](https://github.com/MTES-MCT/camino-api/issues/138)) ([d6101bb](https://github.com/MTES-MCT/camino-api/commit/d6101bb))
* corrige une erreur typescript ([0f70d68](https://github.com/MTES-MCT/camino-api/commit/0f70d68))
* exporte les activités lorsque l'id d'un titre est modifiée ([#129](https://github.com/MTES-MCT/camino-api/issues/129)) ([7ecf44b](https://github.com/MTES-MCT/camino-api/commit/7ecf44b))
* génère automatiquement les ids ([#142](https://github.com/MTES-MCT/camino-api/issues/142)) ([1920e74](https://github.com/MTES-MCT/camino-api/commit/1920e74))
* retourne null si un point n'a pas de références ([58c7d8b](https://github.com/MTES-MCT/camino-api/commit/58c7d8b))
* supprime les sections sur les étapes ([689955b](https://github.com/MTES-MCT/camino-api/commit/689955b))
* **business:** corrige la mise à jour des administrations et ids de titres ([#136](https://github.com/MTES-MCT/camino-api/issues/136)) ([a5a7f7b](https://github.com/MTES-MCT/camino-api/commit/a5a7f7b))
* met à jour les propriétés du titre lors d'un changement d'id ([#128](https://github.com/MTES-MCT/camino-api/issues/128)) ([554ded8](https://github.com/MTES-MCT/camino-api/commit/554ded8))


### Features

* ajoute des règles sur les étapes d'annulations de démarche ([#140](https://github.com/MTES-MCT/camino-api/issues/140)) ([9892282](https://github.com/MTES-MCT/camino-api/commit/9892282))
* ajoute du contenu dynamique sur une étape ([#139](https://github.com/MTES-MCT/camino-api/issues/139)) ([2c8cd25](https://github.com/MTES-MCT/camino-api/commit/2c8cd25))
* ajoute la démarche virtuelle de demande de titre d'exploitation ([#134](https://github.com/MTES-MCT/camino-api/issues/134)) ([b689bde](https://github.com/MTES-MCT/camino-api/commit/b689bde))
* **api:** export utilisateur lors de modification ([#130](https://github.com/MTES-MCT/camino-api/issues/130)) ([4451fb7](https://github.com/MTES-MCT/camino-api/commit/4451fb7))
* **api:** expose des fonctions de création d'un titre, d'une démarche, ou d'une étape ([#132](https://github.com/MTES-MCT/camino-api/issues/132)) ([cfa6639](https://github.com/MTES-MCT/camino-api/commit/cfa6639))
* autorise les chaines de caractères dans les coordonnées des références de point ([bd4f12a](https://github.com/MTES-MCT/camino-api/commit/bd4f12a))
* gère les exceptions d'affiliation des administrations pour les ARM et AXM ([#126](https://github.com/MTES-MCT/camino-api/issues/126)) ([f7e4301](https://github.com/MTES-MCT/camino-api/commit/f7e4301))

## [0.24.0](https://github.com/MTES-MCT/camino-api/compare/v0.23.0...v0.24.0) (2019-07-04)


### Bug Fixes

* masque les activités sur la liste de titres ([1921e28](https://github.com/MTES-MCT/camino-api/commit/1921e28))
* **import:** corrige l'erreur en cas de feuille manquante ou vide ([#109](https://github.com/MTES-MCT/camino-api/issues/109)) ([7119616](https://github.com/MTES-MCT/camino-api/commit/7119616))
* **import:** corrige l'import des spreadsheets ([#113](https://github.com/MTES-MCT/camino-api/issues/113)) ([83e757f](https://github.com/MTES-MCT/camino-api/commit/83e757f))
* **tasks:** utilise une file d'attente pour les requêtes à l'API communes ([#108](https://github.com/MTES-MCT/camino-api/issues/108)) ([09b0b24](https://github.com/MTES-MCT/camino-api/commit/09b0b24))
* corrige l'export d'un rapport d'activité ([#106](https://github.com/MTES-MCT/camino-api/issues/106)) ([8001d61](https://github.com/MTES-MCT/camino-api/commit/8001d61))
* **tasks:** supprime le renommage des fichiers lors du changement d'id de titre ([#104](https://github.com/MTES-MCT/camino-api/issues/104)) ([2778df0](https://github.com/MTES-MCT/camino-api/commit/2778df0))
* corrige le docker-compose de preprod ([#105](https://github.com/MTES-MCT/camino-api/issues/105)) ([ddf1412](https://github.com/MTES-MCT/camino-api/commit/ddf1412))
* supprime le dossier docs et ajoute le au .gitignore ([fe4550d](https://github.com/MTES-MCT/camino-api/commit/fe4550d))
* **export:** exporte et importe les phases et les administrations ([#103](https://github.com/MTES-MCT/camino-api/issues/103)) ([1c6cd53](https://github.com/MTES-MCT/camino-api/commit/1c6cd53))
* **import:** corrige l'import des sections dans etapes_types ([#102](https://github.com/MTES-MCT/camino-api/issues/102)) ([33f8a89](https://github.com/MTES-MCT/camino-api/commit/33f8a89))


### Build System

* met à jour les dépendances ([76c2f43](https://github.com/MTES-MCT/camino-api/commit/76c2f43))
* met à jour les dépendances ([1ad492c](https://github.com/MTES-MCT/camino-api/commit/1ad492c))


### Features

* **export:** ajout d'un filtre par ids sur les titres ([#116](https://github.com/MTES-MCT/camino-api/issues/116)) ([8560584](https://github.com/MTES-MCT/camino-api/commit/8560584))
* **statistiques:** ajoute seulement les activités de 2018 dans le calcul du ratio ([#114](https://github.com/MTES-MCT/camino-api/issues/114)) ([1ae341e](https://github.com/MTES-MCT/camino-api/commit/1ae341e))
* filtre le champs visas ([521934f](https://github.com/MTES-MCT/camino-api/commit/521934f))
* **import:** ajoute une feuille pour la reprise de données ([#112](https://github.com/MTES-MCT/camino-api/issues/112)) ([ca9da81](https://github.com/MTES-MCT/camino-api/commit/ca9da81))
* ajoute le docker-compose de preprod ([586f9a2](https://github.com/MTES-MCT/camino-api/commit/586f9a2))



## [0.23.0](https://github.com/MTES-MCT/camino-api/compare/v0.22.0...v0.23.0) (2019-06-17)


### Bug Fixes

* corrige la requête sur une liste d'utilisateurs ([#100](https://github.com/MTES-MCT/camino-api/issues/100)) ([7eda24c](https://github.com/MTES-MCT/camino-api/commit/7eda24c))
* corrige les permissions sur les arms ([6a9d3ed](https://github.com/MTES-MCT/camino-api/commit/6a9d3ed))
* exporte la table utilisateurs-entreprises ([8ae8c00](https://github.com/MTES-MCT/camino-api/commit/8ae8c00))
* restreint la visibilité des arms aux utilisateurs 'super' et 'onf' ([#99](https://github.com/MTES-MCT/camino-api/issues/99)) ([4384816](https://github.com/MTES-MCT/camino-api/commit/4384816))
* **api:** déplace le code de test de droit ONF, supprime le type d'étape "aca" ([#97](https://github.com/MTES-MCT/camino-api/issues/97)) ([eb7e4e9](https://github.com/MTES-MCT/camino-api/commit/eb7e4e9))
* **api:** passe une id pour charger une substance ou une entreprise ([5e41d35](https://github.com/MTES-MCT/camino-api/commit/5e41d35))
* **export:** corrige l'export de la base de données vers les spreadsheets ([#92](https://github.com/MTES-MCT/camino-api/issues/92)) ([80f3fb2](https://github.com/MTES-MCT/camino-api/commit/80f3fb2))


### Build System

* met à jour les dépendances ([ede952e](https://github.com/MTES-MCT/camino-api/commit/ede952e))


### Features

* **tasks:** converti les durées d'années en mois ([#101](https://github.com/MTES-MCT/camino-api/issues/101)) ([a146e70](https://github.com/MTES-MCT/camino-api/commit/a146e70))
* ajoute le masque et les données supplémentaires aux étapes ([#98](https://github.com/MTES-MCT/camino-api/issues/98)) ([eecd1ef](https://github.com/MTES-MCT/camino-api/commit/eecd1ef))
* **api:** ajoute un droit onf avec accès sur les titres ARM ([#95](https://github.com/MTES-MCT/camino-api/issues/95)) ([24d3b85](https://github.com/MTES-MCT/camino-api/commit/24d3b85))
* autorise plusieurs entreprises par utilisateur ([#93](https://github.com/MTES-MCT/camino-api/issues/93)) ([107f43a](https://github.com/MTES-MCT/camino-api/commit/107f43a))



## [0.22.0](https://github.com/MTES-MCT/camino-api/compare/v0.21.0...v0.22.0) (2019-06-12)


### Bug Fixes

* **utilisateur:** efface les données lors de la suppression de compte et converti l'email en bas de casse ([#91](https://github.com/MTES-MCT/camino-api/issues/91)) ([f51f9bb](https://github.com/MTES-MCT/camino-api/commit/f51f9bb))


### Features

* **rules:** prend en compte la DEX lors de la renonciation d'un AXM ([#90](https://github.com/MTES-MCT/camino-api/issues/90)) ([3b11678](https://github.com/MTES-MCT/camino-api/commit/3b11678))



## [0.21.0](https://github.com/MTES-MCT/camino-api/compare/v0.20.0...v0.21.0) (2019-06-11)


### Bug Fixes

* corrige l'importation de p-queue qui a changé ([e947ba7](https://github.com/MTES-MCT/camino-api/commit/e947ba7))
* **migrate:** corrige l'insertion de plus de 10 000 éléments ([#85](https://github.com/MTES-MCT/camino-api/issues/85)) ([ff287b4](https://github.com/MTES-MCT/camino-api/commit/ff287b4))


### Build System

* ajoute la coloration pour le plugin vscode/peacock ([266b376](https://github.com/MTES-MCT/camino-api/commit/266b376))
* met à jour les dépendances ([4555862](https://github.com/MTES-MCT/camino-api/commit/4555862))


### Features

* **import:** ajout du script pour valider l'import ([#89](https://github.com/MTES-MCT/camino-api/issues/89)) ([9d80da7](https://github.com/MTES-MCT/camino-api/commit/9d80da7))
* calcule et expose la date de demande initiale ([#88](https://github.com/MTES-MCT/camino-api/issues/88)) ([5ca265d](https://github.com/MTES-MCT/camino-api/commit/5ca265d))
* calcule les dates de début et de fin d'un titre ([#87](https://github.com/MTES-MCT/camino-api/issues/87)) ([eaaec19](https://github.com/MTES-MCT/camino-api/commit/eaaec19))
* **permissions:** oblige l'authentification pour voir les titres de type ARM ([#86](https://github.com/MTES-MCT/camino-api/issues/86)) ([61cfdf0](https://github.com/MTES-MCT/camino-api/commit/61cfdf0))
* mise à jour des dépendances ([9c37fe6](https://github.com/MTES-MCT/camino-api/commit/9c37fe6))



## [0.20.0](https://github.com/MTES-MCT/camino-api/compare/v0.19.0...v0.20.0) (2019-06-04)


### Bug Fixes

* **import:** explicite l'erreur lors du formatage JSON ([#82](https://github.com/MTES-MCT/camino-api/issues/82)) ([d66ff14](https://github.com/MTES-MCT/camino-api/commit/d66ff14))
* **insee:** privilégie le nom de l'unité légale face au nom usuel ([#81](https://github.com/MTES-MCT/camino-api/issues/81)) ([19fa632](https://github.com/MTES-MCT/camino-api/commit/19fa632))
* **migrate:** corrige la longueur des messages d'erreurs du seed lors de la migration ([#83](https://github.com/MTES-MCT/camino-api/issues/83)) ([202a720](https://github.com/MTES-MCT/camino-api/commit/202a720))
* **migrate:** corrige un commentaire ([#84](https://github.com/MTES-MCT/camino-api/issues/84)) ([a944eed](https://github.com/MTES-MCT/camino-api/commit/a944eed))
* vérifie la validité des amodiataires pour les propriétés de titres ([#64](https://github.com/MTES-MCT/camino-api/issues/64)) ([2d1e273](https://github.com/MTES-MCT/camino-api/commit/2d1e273))
* **tasks:** corrige le calcul de la date d'octroi ([#77](https://github.com/MTES-MCT/camino-api/issues/77)) ([a352ecd](https://github.com/MTES-MCT/camino-api/commit/a352ecd))


### Build System

* met à jour les dépendances ([e7f53c4](https://github.com/MTES-MCT/camino-api/commit/e7f53c4))
* supprime une dépendance inutile ([f6b6aaa](https://github.com/MTES-MCT/camino-api/commit/f6b6aaa))


### Features

* **tools:** vérifie que les documents sont présents en base [#80](https://github.com/MTES-MCT/camino-api/issues/80) ([e3e3107](https://github.com/MTES-MCT/camino-api/commit/e3e3107))



## [0.19.0](https://github.com/MTES-MCT/camino-api/compare/v0.18.0...v0.19.0) (2019-05-23)


### Bug Fixes

* renomme une occurence de 'stats' qui avait été oubliée ([04fd244](https://github.com/MTES-MCT/camino-api/commit/04fd244))
* **tasks:** corrige le calcul des administrations ([#74](https://github.com/MTES-MCT/camino-api/issues/74)) ([7b743fe](https://github.com/MTES-MCT/camino-api/commit/7b743fe))
* corrige la mise à jour des titres contenant des administrations ([#73](https://github.com/MTES-MCT/camino-api/issues/73)) ([329a218](https://github.com/MTES-MCT/camino-api/commit/329a218))
* **administrations:** lie les administrations régionales ([#72](https://github.com/MTES-MCT/camino-api/issues/72)) ([dbd83a3](https://github.com/MTES-MCT/camino-api/commit/dbd83a3))
* **incertitudes:** uniformise la liste des champs "incertitudes" entre la bdd et l'api ([#63](https://github.com/MTES-MCT/camino-api/issues/63)) ([0d3f0f6](https://github.com/MTES-MCT/camino-api/commit/0d3f0f6))
* **insee:** corrige la génération du token en mode dev ([#67](https://github.com/MTES-MCT/camino-api/issues/67)) ([178ae15](https://github.com/MTES-MCT/camino-api/commit/178ae15))
* **tasks:** corrige la mise à jour d'une étape ([f452a02](https://github.com/MTES-MCT/camino-api/commit/f452a02))
* **tasks:** corrige la mise à jour des ids de démarches ([#56](https://github.com/MTES-MCT/camino-api/issues/56)) ([104a3a6](https://github.com/MTES-MCT/camino-api/commit/104a3a6))
* **tasks:** corrige la mise à jour des ids de titre ([#68](https://github.com/MTES-MCT/camino-api/issues/68)) ([25944cb](https://github.com/MTES-MCT/camino-api/commit/25944cb))
* **tasks:** corrige les changements d'ids pour les titres avec activités ([#70](https://github.com/MTES-MCT/camino-api/issues/70)) ([2a6eaa2](https://github.com/MTES-MCT/camino-api/commit/2a6eaa2))
* **tasks:** corrige les éditions et suppression de titres/démarches/étapes ([#69](https://github.com/MTES-MCT/camino-api/issues/69)) ([89b41d0](https://github.com/MTES-MCT/camino-api/commit/89b41d0))
* corrige temporairement l'édition des titres/démarches/étapes ([#61](https://github.com/MTES-MCT/camino-api/issues/61)) ([d06f455](https://github.com/MTES-MCT/camino-api/commit/d06f455))


### Build System

* met à jour les dépendances ([58c6d47](https://github.com/MTES-MCT/camino-api/commit/58c6d47))
* met à jour les dépendances ([8988c0f](https://github.com/MTES-MCT/camino-api/commit/8988c0f))
* met à jour les dépendances ([2f9c010](https://github.com/MTES-MCT/camino-api/commit/2f9c010))


### Features

* **tools:** ajoute un script de vérification d'intégrité des données ([#75](https://github.com/MTES-MCT/camino-api/issues/75)) ([b4e7bed](https://github.com/MTES-MCT/camino-api/commit/b4e7bed))
* expose les statistiques ([#66](https://github.com/MTES-MCT/camino-api/issues/66)) ([378a3c6](https://github.com/MTES-MCT/camino-api/commit/378a3c6))
* expose un champs "incertitudes" sur les étapes ([#62](https://github.com/MTES-MCT/camino-api/issues/62)) ([4e6608d](https://github.com/MTES-MCT/camino-api/commit/4e6608d))
* lie les administrations centrales aux titres ([#71](https://github.com/MTES-MCT/camino-api/issues/71)) ([9b1a7c2](https://github.com/MTES-MCT/camino-api/commit/9b1a7c2))
* **activités:** ajoute une date de création à un champs des activités ([#60](https://github.com/MTES-MCT/camino-api/issues/60)) ([b640d8b](https://github.com/MTES-MCT/camino-api/commit/b640d8b))
* **fichiers:** gère le téléchargement des fichiers ([#58](https://github.com/MTES-MCT/camino-api/issues/58)) ([1c554d2](https://github.com/MTES-MCT/camino-api/commit/1c554d2))
* **fichiers:** masque les fichiers qui ne sont pas publics ([b96adfa](https://github.com/MTES-MCT/camino-api/commit/b96adfa))
* **tasks:** mets à jour l'id lors de la mise à jour d'un titre ([#57](https://github.com/MTES-MCT/camino-api/issues/57)) ([a8c0646](https://github.com/MTES-MCT/camino-api/commit/a8c0646))



## [0.18.0](https://github.com/MTES-MCT/camino-api/compare/v0.17.0...v0.18.0) (2019-05-07)


### Bug Fixes

* ajout d'une étape ([a265647](https://github.com/MTES-MCT/camino-api/commit/a265647))


### Build System

* ignore le répertoire files ([3d90f57](https://github.com/MTES-MCT/camino-api/commit/3d90f57))
* met à jour les dépendances ([0b0c7a4](https://github.com/MTES-MCT/camino-api/commit/0b0c7a4))
* met à jour les dépendances ([9714cff](https://github.com/MTES-MCT/camino-api/commit/9714cff))


### Features

* **api:** expose les types de titres par domaines ([bf11cf5](https://github.com/MTES-MCT/camino-api/commit/bf11cf5))
* ajoute un titre ([fdbb6e5](https://github.com/MTES-MCT/camino-api/commit/fdbb6e5))


### Tests

* supprime un test qui n'a plus lieu d'être ([529c26f](https://github.com/MTES-MCT/camino-api/commit/529c26f))



# [0.17.0](https://github.com/MTES-MCT/camino-api/compare/v0.16.0...v0.17.0) (2019-04-30)


### Bug Fixes

* édition des titres ([29fd675](https://github.com/MTES-MCT/camino-api/commit/29fd675))
* **api:** supprime le paramètre statut lors de la mise à jour d'une démarche ([ebae82c](https://github.com/MTES-MCT/camino-api/commit/ebae82c))
* pousse les modification sur la remote git "upstream" après une release ([1b1a851](https://github.com/MTES-MCT/camino-api/commit/1b1a851))
* **api-communes:** loggue les erreurs ([16c2424](https://github.com/MTES-MCT/camino-api/commit/16c2424))


### Features

* **activités:** autorise un utilisateur admin à modifier une activité validée ([182bd6f](https://github.com/MTES-MCT/camino-api/commit/182bd6f))
* **api:** expose la fonction de modification d'un titre ([#55](https://github.com/MTES-MCT/camino-api/issues/55)) ([642aaa6](https://github.com/MTES-MCT/camino-api/commit/642aaa6))
* initialise le statut des titres et démarches à 'ind' par défaut ([0b87ae5](https://github.com/MTES-MCT/camino-api/commit/0b87ae5))
* mets à jour l'id de la démarche lors de la mise à jour d'une étape ([b8a92ab](https://github.com/MTES-MCT/camino-api/commit/b8a92ab))
* **api:** expose les fonctions d'édition des titres ([#51](https://github.com/MTES-MCT/camino-api/issues/51)) ([8e491fd](https://github.com/MTES-MCT/camino-api/commit/8e491fd))
* **tasks:** met à jour les ids de démarches ([179b9f8](https://github.com/MTES-MCT/camino-api/commit/179b9f8))



# [0.16.0](https://github.com/MTES-MCT/camino-api/compare/v0.14.0...v0.16.0) (2019-04-19)


### Bug Fixes

* corrige la date de fin de phase pour les titres avec une démarche de renonciation ([53e946c](https://github.com/MTES-MCT/camino-api/commit/53e946c))
* corrige une dépréciation dans express-graphql ([68281c9](https://github.com/MTES-MCT/camino-api/commit/68281c9))
* **api:** prend des ids au lieu de tableaux d'objet sur les éléments liées ([#36](https://github.com/MTES-MCT/camino-api/issues/36)) ([9434363](https://github.com/MTES-MCT/camino-api/commit/9434363))
* **api:** retourne null si on appelle un titre dont l'id n'existe pas ([91a38f5](https://github.com/MTES-MCT/camino-api/commit/91a38f5))
* **export:** corrige le test de formatage des colonnes ([d443f3e](https://github.com/MTES-MCT/camino-api/commit/d443f3e))
* **migrate:** corrige l'insertion en base des administrations ([52a6b15](https://github.com/MTES-MCT/camino-api/commit/52a6b15))
* **sentry:** désactive sentry qui est buggué ([e0b34ec](https://github.com/MTES-MCT/camino-api/commit/e0b34ec))
* **sentry:** met à jour sentry ([f66eeb0](https://github.com/MTES-MCT/camino-api/commit/f66eeb0))
* **tasks:** corrige les statuts des démarches en fonction d'étapes décisives ([feecd69](https://github.com/MTES-MCT/camino-api/commit/feecd69))
* corrige une requête sur les titres avec le filtre entreprises ([2d86449](https://github.com/MTES-MCT/camino-api/commit/2d86449))
* n'expose pas titreId sur une activité ([72cf3bc](https://github.com/MTES-MCT/camino-api/commit/72cf3bc))
* permet la validation d'une nouvelle étape ([9f0a254](https://github.com/MTES-MCT/camino-api/commit/9f0a254))
* **tasks:** correction du process titres-etapes ([fa338fa](https://github.com/MTES-MCT/camino-api/commit/fa338fa))
* **titres:** évite de formater un titre si la base ne renvoit rien ([be30140](https://github.com/MTES-MCT/camino-api/commit/be30140))


### Features

* **activités:** affiche les activités pour le role éditeur ([7c7a50a](https://github.com/MTES-MCT/camino-api/commit/7c7a50a))
* **activités:** création des rapports du 1er trimestre 2019 ([8eb2623](https://github.com/MTES-MCT/camino-api/commit/8eb2623))
* **api:** prend en compte la démarche virtuelle de mutation partielle et le type arm ([a91c3ba](https://github.com/MTES-MCT/camino-api/commit/a91c3ba))
* **filtres:** combine les mots recherchés dans le champs territoires ([a32a033](https://github.com/MTES-MCT/camino-api/commit/a32a033))
* **tasks:** ajoute la prise en compte d'une recevabilité de la demande au statut non-défavorable ([e0b243e](https://github.com/MTES-MCT/camino-api/commit/e0b243e))
* **tasks:** prend en compte la démarche "déplacement du périmètre" pour le calcul de statut ([01ccbe0](https://github.com/MTES-MCT/camino-api/commit/01ccbe0))
* **tasks:** prend en compte toutes les étapes des demandes initiales pour les propriétés de titre ([4808bfa](https://github.com/MTES-MCT/camino-api/commit/4808bfa))
* **tasks:** valide les étapes (type, statut, date) avant modification ([12086e5](https://github.com/MTES-MCT/camino-api/commit/12086e5))
* ajoute une timezone par pays ([eadfbb8](https://github.com/MTES-MCT/camino-api/commit/eadfbb8))
* liste les établissements d'une entreprise en fonction de leur date de début ([c13e2b1](https://github.com/MTES-MCT/camino-api/commit/c13e2b1))
* met à jour les étapes ([9d04d79](https://github.com/MTES-MCT/camino-api/commit/9d04d79))
* récupère les informations sur les administrations ([e40a152](https://github.com/MTES-MCT/camino-api/commit/e40a152))
* trouve les titres qui ont étés créés après avril 2018 ([641322a](https://github.com/MTES-MCT/camino-api/commit/641322a))


### Reverts

* corrige une erreur de typage lors de la mise à jour de express-graphql ([2ff707b](https://github.com/MTES-MCT/camino-api/commit/2ff707b))



# [0.15.0](https://github.com/MTES-MCT/camino-api/compare/v0.14.0...v0.15.0) (2019-04-17)


### Bug Fixes

* corrige une dépréciation dans express-graphql ([68281c9](https://github.com/MTES-MCT/camino-api/commit/68281c9))
* **api:** prend des ids au lieu de tableaux d'objet sur les éléments liées ([#36](https://github.com/MTES-MCT/camino-api/issues/36)) ([9434363](https://github.com/MTES-MCT/camino-api/commit/9434363))
* **api:** retourne null si on appelle un titre dont l'id n'existe pas ([91a38f5](https://github.com/MTES-MCT/camino-api/commit/91a38f5))
* **export:** corrige le test de formatage des colonnes ([d443f3e](https://github.com/MTES-MCT/camino-api/commit/d443f3e))
* **migrate:** corrige l'insertion en base des administrations ([52a6b15](https://github.com/MTES-MCT/camino-api/commit/52a6b15))
* **sentry:** désactive sentry qui est buggué ([e0b34ec](https://github.com/MTES-MCT/camino-api/commit/e0b34ec))
* **sentry:** met à jour sentry ([f66eeb0](https://github.com/MTES-MCT/camino-api/commit/f66eeb0))
* **tasks:** corrige les statuts des démarches en fonction d'étapes décisives ([feecd69](https://github.com/MTES-MCT/camino-api/commit/feecd69))
* corrige une requête sur les titres avec le filtre entreprises ([2d86449](https://github.com/MTES-MCT/camino-api/commit/2d86449))
* n'expose pas titreId sur une activité ([72cf3bc](https://github.com/MTES-MCT/camino-api/commit/72cf3bc))
* permet la validation d'une nouvelle étape ([9f0a254](https://github.com/MTES-MCT/camino-api/commit/9f0a254))
* **tasks:** correction du process titres-etapes ([fa338fa](https://github.com/MTES-MCT/camino-api/commit/fa338fa))
* **titres:** évite de formater un titre si la base ne renvoit rien ([be30140](https://github.com/MTES-MCT/camino-api/commit/be30140))


### Features

* **activités:** affiche les activités pour le role éditeur ([7c7a50a](https://github.com/MTES-MCT/camino-api/commit/7c7a50a))
* **activités:** création des rapports du 1er trimestre 2019 ([8eb2623](https://github.com/MTES-MCT/camino-api/commit/8eb2623))
* **api:** prend en compte la démarche virtuelle de mutation partielle et le type arm ([a91c3ba](https://github.com/MTES-MCT/camino-api/commit/a91c3ba))
* **filtres:** combine les mots recherchés dans le champs territoires ([a32a033](https://github.com/MTES-MCT/camino-api/commit/a32a033))
* **tasks:** ajoute la prise en compte d'une recevabilité de la demande au statut non-défavorable ([e0b243e](https://github.com/MTES-MCT/camino-api/commit/e0b243e))
* **tasks:** valide les étapes (type, statut, date) avant modification ([12086e5](https://github.com/MTES-MCT/camino-api/commit/12086e5))
* ajoute une timezone par pays ([eadfbb8](https://github.com/MTES-MCT/camino-api/commit/eadfbb8))
* liste les établissements d'une entreprise en fonction de leur date de début ([c13e2b1](https://github.com/MTES-MCT/camino-api/commit/c13e2b1))
* met à jour les étapes ([9d04d79](https://github.com/MTES-MCT/camino-api/commit/9d04d79))
* récupère les informations sur les administrations ([e40a152](https://github.com/MTES-MCT/camino-api/commit/e40a152))
* trouve les titres qui ont étés créés après avril 2018 ([641322a](https://github.com/MTES-MCT/camino-api/commit/641322a))


### Reverts

* corrige une erreur de typage lors de la mise à jour de express-graphql ([775da46](https://github.com/MTES-MCT/camino-api/commit/775da46))



# [0.14.0](https://github.com/MTES-MCT/camino-api/compare/v0.13.0...v0.14.0) (2019-03-22)


### Bug Fixes

* **activités:** formatage de l'email de confirmation ([a486698](https://github.com/MTES-MCT/camino-api/commit/a486698))
* **activités:** n'expose pas les activités aux utilisateurs non autorisés ([a92d7c2](https://github.com/MTES-MCT/camino-api/commit/a92d7c2))
* **activités:** n'expose pas les activités aux utilisateurs qui n'ont pas les permissions ([cb373ab](https://github.com/MTES-MCT/camino-api/commit/cb373ab))
* **api:** expose les établissements d'une entreprise dans une requête utilisateur ([20f2584](https://github.com/MTES-MCT/camino-api/commit/20f2584))
* **entreprises:** créé le dossier de cache si nécessaire ([04e1c6f](https://github.com/MTES-MCT/camino-api/commit/04e1c6f))
* **entreprises:** importe les dictionnaires de l'API insee ([e82a93f](https://github.com/MTES-MCT/camino-api/commit/e82a93f))
* rend obligatoire le nom d'un établissement d'entreprise ([ec4b798](https://github.com/MTES-MCT/camino-api/commit/ec4b798))
* **tasks:** créé des activités sur les titres dont le statut est modification en instance ([ec3b5f2](https://github.com/MTES-MCT/camino-api/commit/ec3b5f2))
* simplifie la connexion à l'API Google ([ec830e3](https://github.com/MTES-MCT/camino-api/commit/ec830e3))


### Features

* **activités:** ajoute les champs dans la base de données ([749d780](https://github.com/MTES-MCT/camino-api/commit/749d780))
* **activités:** crée une requête pour insérer une nouvelle activité ([f15608d](https://github.com/MTES-MCT/camino-api/commit/f15608d))
* **activités:** enregistre une activité ([fda7ad0](https://github.com/MTES-MCT/camino-api/commit/fda7ad0))
* **activités:** expose les activités via l'API ([11f2946](https://github.com/MTES-MCT/camino-api/commit/11f2946))
* **activités:** formate l'email de confirmation d'enregistrement d'activité ([65f47ca](https://github.com/MTES-MCT/camino-api/commit/65f47ca))
* **activités:** prend en compte si l'élément d'une activité est archivé ([292e02a](https://github.com/MTES-MCT/camino-api/commit/292e02a))
* **api:** expose les demarche liées ([d3e8cf8](https://github.com/MTES-MCT/camino-api/commit/d3e8cf8))
* **entreprises:** concatène le champs adresse ([83cdc66](https://github.com/MTES-MCT/camino-api/commit/83cdc66))
* **entreprises:** prend en compte les établissements ([72d37a2](https://github.com/MTES-MCT/camino-api/commit/72d37a2))
* **entreprises:** récupère les infos sur les entreprises ([823a55d](https://github.com/MTES-MCT/camino-api/commit/823a55d))
* **tasks:** génère les rapports d'activité manquants automatiquement ([381e8d2](https://github.com/MTES-MCT/camino-api/commit/381e8d2))


### Performance Improvements

* utilise la librairie officielle de Google pour l'export des spreadsheets ([562b88e](https://github.com/MTES-MCT/camino-api/commit/562b88e))
* **tools:** utilise la librairie officielle de Google pour l'import des spreadsheets ([cb03e3a](https://github.com/MTES-MCT/camino-api/commit/cb03e3a))



# [0.13.0](https://github.com/MTES-MCT/camino-api/compare/v0.12.1...v0.13.0) (2019-02-28)


### Bug Fixes

* **geojson:** ferme un tracé en dupliquant le premier point d'un contour ([2109169](https://github.com/MTES-MCT/camino-api/commit/2109169))
* **geojson:** vérifie la conformité des geojsons ([b81c76d](https://github.com/MTES-MCT/camino-api/commit/b81c76d))


### Features

* ajoutes des liens entre les démarches ([2bbb97c](https://github.com/MTES-MCT/camino-api/commit/2bbb97c))
* expose l'engagement financier à la racine du titre ([2cd1c12](https://github.com/MTES-MCT/camino-api/commit/2cd1c12))



## [0.12.1](https://github.com/MTES-MCT/camino-api/compare/v0.12.0...v0.12.1) (2019-02-20)



<a name="0.11.0"></a>
## 0.11.0 (2019-02-13)

* feat: ajoute un script de création d'un utilisateur admin ([4dfb0e8](https://github.com/MTES-MCT/camino-api/commit/4dfb0e8))
* feat: filtre la liste de titre en fonction du territoire ([337b8db](https://github.com/MTES-MCT/camino-api/commit/337b8db))
* feat: teste la liste des communes par titres ([9748401](https://github.com/MTES-MCT/camino-api/commit/9748401))
* feat(export): ajoute un utilisateur de l'API google pour l'export ([b1dea3a](https://github.com/MTES-MCT/camino-api/commit/b1dea3a))
* feat(rapports): enregistre l'id de l'utilisateur ([cc71c89](https://github.com/MTES-MCT/camino-api/commit/cc71c89))
* build: ajoute .env-public au gitignore ([62a2d46](https://github.com/MTES-MCT/camino-api/commit/62a2d46))
* build: met à jour les dépendances ([32e09f0](https://github.com/MTES-MCT/camino-api/commit/32e09f0))
* refactor: simplifie la requête sur les territoires ([86fe4fa](https://github.com/MTES-MCT/camino-api/commit/86fe4fa))
* docs: ajoute l'instruction de build ([1441f64](https://github.com/MTES-MCT/camino-api/commit/1441f64))
* docs: met à jour le schéma de base de données avec les communes-departement-region-pays ([4f1f87c](https://github.com/MTES-MCT/camino-api/commit/4f1f87c))
* fix: style l'erreur de l'API commune ([3f93950](https://github.com/MTES-MCT/camino-api/commit/3f93950))
* fix(tools): gère les erreurs lors de l'appel à l'API ([ddd8a1d](https://github.com/MTES-MCT/camino-api/commit/ddd8a1d))
* fix(tools): gestion des erreurs renvoyées par l'API communes ([96576ee](https://github.com/MTES-MCT/camino-api/commit/96576ee))



<a name="0.10.0"></a>
## 0.10.0 (2019-02-11)

* fix: ajoute des logs ([c98caad](https://github.com/MTES-MCT/camino-api/commit/c98caad))
* fix: construit les geojson à partir d'une liste de groupes-contours-points dont l'index est 1 ([8b182e1](https://github.com/MTES-MCT/camino-api/commit/8b182e1))
* fix: supprime le dossier `build` du Dockerfile ([e9c4d2a](https://github.com/MTES-MCT/camino-api/commit/e9c4d2a))
* fix(geojson): respecte la specification geoJson (right-hand-rule) ([562b043](https://github.com/MTES-MCT/camino-api/commit/562b043))
* fix(rapports): affiche l'or brut dans l'email récap ([6bb945e](https://github.com/MTES-MCT/camino-api/commit/6bb945e))
* fix(tasks): évite d'insérer une commune en double dans la base de données ([ca2d57f](https://github.com/MTES-MCT/camino-api/commit/ca2d57f))
* docs: corrige le readme ([b501355](https://github.com/MTES-MCT/camino-api/commit/b501355))
* docs: met à jour le readme ([4735bfc](https://github.com/MTES-MCT/camino-api/commit/4735bfc))
* docs: sort la doc docker du readme ([478edb2](https://github.com/MTES-MCT/camino-api/commit/478edb2))
* feat: trie les régions, départements, communes par ordre alphabétique ([3e18d9e](https://github.com/MTES-MCT/camino-api/commit/3e18d9e))
* feat: trouve les communes en fonction du périmètre géo ([ccd9e7e](https://github.com/MTES-MCT/camino-api/commit/ccd9e7e))
* feat(api): expose les pays, régions, départements, communes via l'API ([c4c081d](https://github.com/MTES-MCT/camino-api/commit/c4c081d))
* build: met à jour les dépendances ([0284ee1](https://github.com/MTES-MCT/camino-api/commit/0284ee1))
* build: met à jour les dépendances ([e3353fa](https://github.com/MTES-MCT/camino-api/commit/e3353fa))
* build: met à jour les dépendances ([941c499](https://github.com/MTES-MCT/camino-api/commit/941c499))
* build: supprime une dépendance inutile ([c23f922](https://github.com/MTES-MCT/camino-api/commit/c23f922))
* build: supprime webpack ([097f720](https://github.com/MTES-MCT/camino-api/commit/097f720))
* build(eslint): ajoute un typescript-parser pour corriger certaines erreurs eslint ([d4d8e9a](https://github.com/MTES-MCT/camino-api/commit/d4d8e9a))



<a name="0.9.0"></a>
## 0.9.0 (2019-02-04)

* build: compile avec typescript ([cc560d8](https://github.com/MTES-MCT/camino-api/commit/cc560d8))
* build: compile l'application avec webpack ([cce41c5](https://github.com/MTES-MCT/camino-api/commit/cce41c5))
* build: corrige le nom du plugin eslint-jsdoc ([df8aa06](https://github.com/MTES-MCT/camino-api/commit/df8aa06))
* build: met à jour les dépendances ([c666cad](https://github.com/MTES-MCT/camino-api/commit/c666cad))
* build(docs): supprime le fichier docs avant de générer la nouvelle doc ([7f58c40](https://github.com/MTES-MCT/camino-api/commit/7f58c40))
* build(tests): ajoute un rapport de couverture de tests ([8d55ba0](https://github.com/MTES-MCT/camino-api/commit/8d55ba0))
* build(tests): installe ts-jest pour faire réparer les tests ([4834b8a](https://github.com/MTES-MCT/camino-api/commit/4834b8a))
* build(webpack): change le nom du bundle de dev en index.js ([ddc4d9d](https://github.com/MTES-MCT/camino-api/commit/ddc4d9d))
* feat: affiche les titres échu à un utilisateur titulaire ou amodiataire ([688306b](https://github.com/MTES-MCT/camino-api/commit/688306b))
* feat(rapports): donne la permission d'éditer un rapport à l'amodiataire si il existe ([24041bd](https://github.com/MTES-MCT/camino-api/commit/24041bd))
* feat(tasks): ajoute les décisions implicite comme type d'étape qui valide une proprieté ([aa1ecad](https://github.com/MTES-MCT/camino-api/commit/aa1ecad))
* docs: génère la doc ([e5d28b4](https://github.com/MTES-MCT/camino-api/commit/e5d28b4))
* docs: génère la doc ([b6fb4d9](https://github.com/MTES-MCT/camino-api/commit/b6fb4d9))
* docs: génère la documentation ([30d3fa6](https://github.com/MTES-MCT/camino-api/commit/30d3fa6))
* refactor: converti l'import des modules en es6 ([4a3a532](https://github.com/MTES-MCT/camino-api/commit/4a3a532))
* refactor: remplace les require commonjs par des imports es6 ([ae8634a](https://github.com/MTES-MCT/camino-api/commit/ae8634a))
* refactor: supprime un fichier inutile ([0f4efed](https://github.com/MTES-MCT/camino-api/commit/0f4efed))
* fix: pour une entreprise, tous tes titres s'affichent quelque soit le filtrage ([434e0c4](https://github.com/MTES-MCT/camino-api/commit/434e0c4))
* fix: pour une entreprise, tous tes titres s'affichent quelque soit le filtrage appliqué ([7d4c695](https://github.com/MTES-MCT/camino-api/commit/7d4c695))
* fix: retourne le token quand l'utilisateur est déjà connecté ([14a1ffe](https://github.com/MTES-MCT/camino-api/commit/14a1ffe))
* fix(docker): ajoute la config typescript ([27efdde](https://github.com/MTES-MCT/camino-api/commit/27efdde))
* fix(rapports): corrige une erreur d'importation ([7d07f11](https://github.com/MTES-MCT/camino-api/commit/7d07f11))



<a name="0.8.0"></a>
# [0.8.0](https://github.com/MTES-MCT/camino-api/compare/v0.7.0...v0.8.0) (2019-01-29)


### Bug Fixes

* **tasks:** erreur lors de la mise à jour d'une étape de titre ([39ced41](https://github.com/MTES-MCT/camino-api/commit/39ced41))


### Features

* affiche les titres C publiquement ([ff55d9f](https://github.com/MTES-MCT/camino-api/commit/ff55d9f))
* modifie l'id d'une étape si son type change ([9894948](https://github.com/MTES-MCT/camino-api/commit/9894948))
* **api:** expose les statuts des étapes pour chaque type d'étape ([ffa0723](https://github.com/MTES-MCT/camino-api/commit/ffa0723))
* **api:** expose les types de démarches ([3267b7e](https://github.com/MTES-MCT/camino-api/commit/3267b7e))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/MTES-MCT/camino-api/compare/v0.6.0...v0.7.0) (2019-01-18)


### Bug Fixes

* **rapports:** erreur lors de la création de rapports ([2cb310a](https://github.com/MTES-MCT/camino-api/commit/2cb310a))


### Features

* **api:** filtre la liste de titres par référence métier ([a42628a](https://github.com/MTES-MCT/camino-api/commit/a42628a))
* **api:** filtre la liste de titres par référence métier ([03f314d](https://github.com/MTES-MCT/camino-api/commit/03f314d))
* **rapports:** permet la modification d'un rapport de travaux ([9ff84f0](https://github.com/MTES-MCT/camino-api/commit/9ff84f0))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/MTES-MCT/camino-api/compare/v0.5.0...v0.6.0) (2019-01-11)


### Features

* **api:** ajout d'une mutation pour vérifier une adresse email avant la création de compte ([3a09bd3](https://github.com/MTES-MCT/camino-api/commit/3a09bd3))
* **rapports:** envoie un email à tous les utilisateurs de l'entreprise titulaire ([f1e15f5](https://github.com/MTES-MCT/camino-api/commit/f1e15f5))
* **tasks:** prends en compte les étapes 'mfr' pour les demandes initiales ([#9](https://github.com/MTES-MCT/camino-api/issues/9)) ([459fa2a](https://github.com/MTES-MCT/camino-api/commit/459fa2a))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/MTES-MCT/camino-api/compare/v0.4.0...v0.5.0) (2019-01-09)


### Features

* envoi l'email de l'utilisateur dans l'url lors de l'init du mot de passe ([561c302](https://github.com/MTES-MCT/camino-api/commit/561c302))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/MTES-MCT/camino-api/compare/v0.3.1...v0.4.0) (2018-12-14)


### Bug Fixes

* **tasks:** calcul de la durée/date de fin d'une démarche ([ec23718](https://github.com/MTES-MCT/camino-api/commit/ec23718))
* **tasks:** corrige la recherche de durée ([22485a0](https://github.com/MTES-MCT/camino-api/commit/22485a0))


### Features

* **api:** créé un hash pour l'id des nouveaux utilisateurs ([2bdec02](https://github.com/MTES-MCT/camino-api/commit/2bdec02))
* **tasks:** ajoute une colonne annulationDemarcheId pour faire le lien avec une démarche d'annulati ([dfb8fad](https://github.com/MTES-MCT/camino-api/commit/dfb8fad))
* **tasks:** calcule la date de fin d'une phase si la démarche est annulée ([25a8de1](https://github.com/MTES-MCT/camino-api/commit/25a8de1))
* **tasks:** calcule la date de fin des titres pxr et de leurs phases ([54d6e73](https://github.com/MTES-MCT/camino-api/commit/54d6e73))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/MTES-MCT/camino-api/compare/v0.3.0...v0.3.1) (2018-12-12)


### Reverts

* bug avec la mise à jour de knex ([50e6f2b](https://github.com/MTES-MCT/camino-api/commit/50e6f2b))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/MTES-MCT/camino-api/compare/v0.2.1...v0.3.0) (2018-12-11)


### Features

* filtre les titres en fonction de l'entreprise titulaire ([ed485f0](https://github.com/MTES-MCT/camino-api/commit/ed485f0))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/MTES-MCT/camino-api/compare/v0.2.0...v0.2.1) (2018-12-10)



<a name="0.2.0"></a>
# [0.2.0](https://github.com/MTES-MCT/camino-api/compare/v0.1.0...v0.2.0) (2018-12-10)


### Features

* **api:** expose le numéro de version via l'API ([b122d75](https://github.com/MTES-MCT/camino-api/commit/b122d75))



<a name="0.1.0"></a>

# 0.1.0 (2018-12-10)
