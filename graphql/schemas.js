var { buildSchema } = require('graphql')
const fileImport = require('./_file-import.js')

const index = fileImport(__dirname, 'schemas/index.gql')
const titres = fileImport(__dirname, 'schemas/titres.gql')
const substances = fileImport(__dirname, 'schemas/substances.gql')
// const geojsonSchema = fileImport(__dirname, 'schemas/geojson.gql')

const schemas = buildSchema(`
  ${index}

  ${titres}

  ${substances}
`)

module.exports = schemas
