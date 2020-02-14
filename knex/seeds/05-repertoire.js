const seeding = require('../seeding')

const entreprises = require(`../../sources/entreprises`)
const entreprisesEtablissements = require(`../../sources/entreprises-etablissements`)

const administrations = require('../../sources/administrations.json')
const administrationsTypes = require('../../sources/administrations-types.json')
const administrationsDomaines = require('../../sources/administrations--domaines.json')

const findMissing = (elements, relations, field1, field2) =>
  relations.forEach(r => {
    if (!elements.find(e => r[field2] === e[field1])) {
      throw new Error(`Missing: ${field1} <-> ${field2} = "${r[field2]}"`)
    }
  })

findMissing(entreprises, entreprisesEtablissements, 'id', 'entreprise_id')
findMissing(administrationsTypes, administrations, 'id', 'type_id')

exports.seed = seeding(async ({ insert }) => {
  await Promise.all([
    insert('entreprises', entreprises),
    insert('administrationsTypes', administrationsTypes)
  ])
  await insert('administrations', administrations)
  await insert('administrations__domaines', administrationsDomaines)
  await insert('entreprisesEtablissements', entreprisesEtablissements)
})
