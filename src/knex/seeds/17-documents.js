const seeding = require('../seeding')

const documents = require('../../../sources/documents.json')
const titresEtapesJustificatifs = require('../../../sources/titres-etapes-justificatifs.json')

const seed = seeding(async ({ insert }) => {
  await insert('documents', documents)
  await insert('titresEtapesJustificatifs', titresEtapesJustificatifs)
})

module.exports = seed

module.exports.seed = seed
