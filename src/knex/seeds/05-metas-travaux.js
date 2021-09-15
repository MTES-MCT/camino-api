const seeding = require('../seeding')

const travauxTypes = require('../../../sources/travaux-types.json')
const travauxEtapesTypes = require('../../../sources/travaux-etapes-types.json')
// eslint-disable-next-line camelcase
const travauxTypes__travauxEtapesTypes = require('../../../sources/travaux-types--travaux-etapes-types.json')
// eslint-disable-next-line camelcase
const travauxEtapesTypes__etapesStatuts = require('../../../sources/travaux-etapes-types--etapes-statuts.json')
// eslint-disable-next-line camelcase
const travauxEtapesTypes__documentsTypes = require('../../../sources/travaux-etapes-types--documents-types.json')

const seed = seeding(async ({ insert }) => {
  await insert('travauxTypes', travauxTypes)
  await insert('travauxEtapesTypes', travauxEtapesTypes)
  await insert(
    'travauxTypes__travauxEtapesTypes',
    travauxTypes__travauxEtapesTypes
  )
  await insert(
    'travauxEtapesTypes__etapesStatuts',
    travauxEtapesTypes__etapesStatuts
  )
  await insert(
    'travauxEtapesTypes__documentsTypes',
    travauxEtapesTypes__documentsTypes
  )
})

module.exports = seed

module.exports.seed = seed
