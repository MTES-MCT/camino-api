const { buildSchema } = require('graphql')

const fileImport = require('./_file-import.js')

const index = require('./schemas/index.js')
const metas = require('./schemas/metas.js')
const titres = require('./schemas/titres.js')
const substances = require('./schemas/substances.js')
const geojson = require('./schemas/geojsons.js')
const utilisateurs = require('./schemas/utilisateurs.js')
const administrations = require('./schemas/administrations.js')
const entreprises = require('./schemas/entreprises.js')
const titresTravaux = require('./schemas/titres-travaux.js')

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
