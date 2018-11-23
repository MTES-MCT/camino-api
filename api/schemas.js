const { buildSchema } = require('graphql')

const fileImport = require('./_file-import.js')

const index = fileImport(__dirname, 'schemas/index.gql')
const metas = fileImport(__dirname, 'schemas/metas.gql')
const titres = fileImport(__dirname, 'schemas/titres.gql')
const substances = fileImport(__dirname, 'schemas/substances.gql')
const geojson = fileImport(__dirname, 'schemas/geojsons.gql')
const utilisateurs = fileImport(__dirname, 'schemas/utilisateurs.gql')
const administrations = fileImport(__dirname, 'schemas/administrations.gql')
const entreprises = fileImport(__dirname, 'schemas/entreprises.gql')
const titresTravaux = fileImport(__dirname, 'schemas/titres-travaux.gql')

module.exports = buildSchema(`
  ${index}

  ${metas}

  ${titres}

  ${substances}

  ${geojson}

  ${utilisateurs}

  ${administrations}

  ${entreprises}

  ${titresTravaux}
`)
