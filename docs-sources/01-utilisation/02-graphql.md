# Api GraphQL de Camino

L'API GraphQl de Camino est accessible à cette url: [api.camino.beta.gouv.fr/](https://api.camino.beta.gouv.fr/).

La documentation de cette API est consultable dans l'onglets `Docs` (en haut à droite) de l'application _GraphiQL_.

## _GraphiQL_

_GraphiQL_ est une application qui permet de consulter la documentation et de tester une API GraphQL dans un navigateur. Concernant l'API Camino, cette application est accessible à l'url racine de l'API: [api.camino.beta.gouv.fr/](https://api.camino.beta.gouv.fr/).

Des exemples de requêtes se trouvent dans [ce dossier](https://github.com/MTES-MCT/camino-api/blob/master/tests/queries/).

### Requêtes simples

Par exemple, pour obtenir la liste des substances:

- copier une requête dans le champs principal de l'interface de _GraphiQL_: [substances.graphql](https://github.com/MTES-MCT/camino-api/blob/master/tests/queries/substances.graphql)
- valider en cliquant sur le bouton `▶`.

### Requêtes avec des variables

Certaines requêtes nécessitent le passage de variables. Par exemple, pour obtenir la liste des titres:

- copier la requête dans le champs principal de l'interface de _GraphiQL_: [titres.graphql](https://github.com/MTES-MCT/camino-api/blob/master/tests/queries/titres.graphql)
- copier les variables dans le champs `query variables` (en bas à gauche de l'écran): [titres-variables.json](https://github.com/MTES-MCT/camino-api/blob/master/tests/queries/titres-variables.json)
- valider en cliquant sur le bouton `▶`.

### Requêtes nécessitant une authentification

Certaines requêtes sont protégées et nécessitent une authentification par token (jwt). Pour les tester, il faut passer le token dans le header http de la requête. Cela n'est pas possible avec _GraphiQL_. C'est possible avec [GraphQL Playground](https://github.com/prisma/graphql-playground), [GraphiQL App](https://github.com/skevy/graphiql-app).

### Liens

- [Documentation offcielle de GraphQL](https://graphql.org/)
