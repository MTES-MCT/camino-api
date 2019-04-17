# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
