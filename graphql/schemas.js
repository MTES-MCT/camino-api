var { buildSchema } = require('graphql')
const fileImport = require('./_file-import.js')

const index = fileImport(__dirname, 'schemas/index.gql')
const metas = fileImport(__dirname, 'schemas/metas.gql')
const titres = fileImport(__dirname, 'schemas/titres.gql')
const substances = fileImport(__dirname, 'schemas/substances.gql')
const geojson = fileImport(__dirname, 'schemas/geojsons.gql')
const utilisateurs = fileImport(__dirname, 'schemas/utilisateurs.gql')

const schemas = buildSchema(`
  ${index}

  ${metas}

  ${titres}

  ${substances}

  ${geojson}

  ${utilisateurs}
`)

module.exports = schemas
