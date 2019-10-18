import { buildSchema } from 'graphql'
import { importSchema } from 'graphql-import'
import { join } from 'path'

const index = importSchema(join(__dirname, 'schemas/index.graphql'))

const schema = buildSchema(index)

export default schema
