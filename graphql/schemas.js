var { buildSchema } = require('graphql')
const fileImport = require('./_file-import.js')

const index = fileImport(__dirname, 'schemas/index.gql')
const titres = fileImport(__dirname, 'schemas/titres.gql')
const substances = fileImport(__dirname, 'schemas/substances.gql')
const geojson = fileImport(__dirname, 'schemas/geojsons.gql')

const schemas = buildSchema(`
  ${index}

  ${titres}

  ${substances}

  ${geojson}
`)

module.exports = schemas
