const domaines = ['c', 'f', 'g', 'h', 'm', 'm973', 'r', 's', 'w']

const entreprises = domaines.reduce(
  (acc, domaine) =>
    acc.concat(require(`../../sources/entreprises-titres-${domaine}`)),
  []
)

const entreprisesEtablissements = domaines.reduce(
  (acc, domaine) =>
    acc.concat(
      require(`../../sources/entreprises-titres-${domaine}-etablissements`)
    ),
  []
)

const administrations = require('../../sources/administrations.json')
const administrationsTypes = require('../../sources/administrations-types.json')
const administrationsDomaines = require('../../sources/administrations--domaines.json')

const findDuplicates = (array, key1) =>
  array.reduce((res, el) => {
    if (el[key1][0] === 'F') console.log('majuscule', el)

    if (res.find(e => e[key1] === el[key1])) {
      console.log(
        'entreprise en doublon (à supprimer dans la source): ',
        el[key1],
        el
      )
      return res
    } else {
      return [...res, el]
    }
  }, [])

const findMissing = (elements, relations, field1, field2) =>
  relations.forEach(r => {
    if (!elements.find(e => r[field2] === e[field1])) {
      throw new Error(`Missing: ${field1} <-> ${field2} = "${r[field2]}"`)
    }
  })

const entr = findDuplicates(entreprises, 'id')

findMissing(entreprises, entreprisesEtablissements, 'id', 'entreprise_id')
findMissing(administrationsTypes, administrations, 'id', 'type_id')

exports.seed = (knex, Promise) =>
  Promise.all([
    knex('entreprisesEtablissements').del(),
    knex('administrations').del()
  ])
    .then(() => knex('entreprises').del())
    .then(() =>
      Promise.all([
        knex('entreprises').insert(entr),
        knex('administrations_types').insert(administrationsTypes)
      ])
    )
    .then(() => knex('administrations').insert(administrations))
    .then(() =>
      knex('administrations__domaines').insert(administrationsDomaines)
    )
    .then(() =>
      knex('entreprisesEtablissements').insert(entreprisesEtablissements)
    )
