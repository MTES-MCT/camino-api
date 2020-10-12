const seeding = require('../seeding')

const travauxTypes = require('../../sources/travaux-types.json')
// eslint-disable-next-line camelcase
const travauxTypes__demarchesStatuts = require('../../sources/travaux-types--demarches-statuts.json')
// eslint-disable-next-line camelcase
const travauxTypes__etapesTypes = require('../../sources/travaux-types--etapes-types.json')

const seed = seeding(async ({ insert }) => {
  await insert('travauxTypes', travauxTypes)
  await insert('travauxTypes__demarchesStatuts', travauxTypes__demarchesStatuts)
  await insert('travauxTypes__etapesTypes', travauxTypes__etapesTypes)
})

module.exports = seed

module.exports.seed = seed
