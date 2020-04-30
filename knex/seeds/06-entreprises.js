const seeding = require('../seeding')

const entreprises = require(`../../sources/entreprises.json`)
const entreprisesEtablissements = require(`../../sources/entreprises-etablissements.json`)

const findMissing = (elements, relations, field1, field2) =>
  relations.forEach(r => {
    if (!elements.find(e => r[field2] === e[field1])) {
      throw new Error(`Missing: ${field1} <-> ${field2} = "${r[field2]}"`)
    }
  })

findMissing(entreprises, entreprisesEtablissements, 'id', 'entreprise_id')

exports.seed = seeding(async ({ insert }) => {
  await insert('entreprises', entreprises)
  await insert('entreprisesEtablissements', entreprisesEtablissements)
})
