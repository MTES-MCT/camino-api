import * as graphqlFields from 'graphql-fields'
import { GraphQLResolveInfo } from 'graphql'

// in: info: objet contenant les propriétés de la requête graphQl
// out: ast avec les champs requis par le client GraphQl
const graphFieldsBuild = (info: GraphQLResolveInfo) =>
  graphqlFields(info, {}, { excludedFields: ['__typename'] })

export default graphFieldsBuild
