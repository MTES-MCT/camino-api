import { IFields } from '../../../types'
import graphqlFields from 'graphql-fields'
import { GraphQLResolveInfo } from 'graphql'

// in: info: objet contenant les propriétés de la requête graphQl
// out: ast avec les champs requis par le client GraphQl
const fieldsBuild = (info: GraphQLResolveInfo) =>
  graphqlFields(info, {}, { excludedFields: ['__typename'] }) as IFields

export { fieldsBuild }
