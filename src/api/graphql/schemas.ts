import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { join } from 'path'
import path from 'node:path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const schema = loadSchemaSync(join(__dirname, './schemas/index.graphql'), {
  loaders: [new GraphQLFileLoader()]
})

export default schema
