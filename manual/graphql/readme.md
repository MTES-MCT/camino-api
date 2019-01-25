# Api GraphQL

## Requêtes avec _GraphiQL_

_GraphiQL_ est une application qui permet de tester l'API dans un navigateur. Pour Camino, elle est accessible à l'url racine de l'API: https://api.camino.beta.gouv.fr/.

_GraphiQL_ expose une documentation de l'API qui est accessible en cliquant sur le bouton `Docs` (en haut à droite).

Des exemples de requêtes se trouvent dans [ce dossier](https://github.com/MTES-MCT/camino-api/blob/master/docs/graphql/queries/).

### Requêtes simples

Par exemple, pour obtenir la liste des substances:

- copier une requête dans le champs principal de l'interface de _GraphiQL_: [substances.graphql](https://github.com/MTES-MCT/camino-api/blob/master/docs/graphql/queries/substances.graphql)
- valider en cliquant sur le bouton "play"

### Requêtes avec des variables

Certaines requêtes nécessitent le passage de variables. Par exemple, pour obtenir la liste des titres:

- copier la requête dans le champs principal de l'interface de _GraphiQL_: [titres.graphql](https://github.com/MTES-MCT/camino-api/blob/master/docs/graphql/queries/titres.graphql)
- copier les variables dans le champs `query variables` (en bas à gauche de l'écran): [titres-variables.json](https://github.com/MTES-MCT/camino-api/blob/master/docs/graphql/queries/titres-variables.json)
- valider en cliquant sur le bouton "play"

### Requêtes nécessitant une authentification

Certaines requêtes sont protégées et nécessitent une authentification par token (jwt). Pour les tester, il faut passer le token dans le header http de la requête. Cela n'est pas possible avec l'interface _GraphiQL_. C'est possible avec [GraphQL Playground](https://github.com/prisma/graphql-playground), [GraphiQL App](https://github.com/skevy/graphiql-app) ou une applications pour faire des requêtes http ([exemple](https://github.com/MTES-MCT/camino-api/blob/master/docs/graphql/test.http)).
