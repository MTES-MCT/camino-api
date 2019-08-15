# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
