import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { join } from 'path'

const schema = loadSchemaSync(join(__dirname, './schemas/index.graphql'), {
  loaders: [new GraphQLFileLoader()],
})

export default schema
