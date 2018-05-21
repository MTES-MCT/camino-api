const domainesTypes = require('../../sources/titres-domaines-types.json')
const domaines = require('../../sources/titres-domaines.json')
const types = require('../../sources/titres-types.json')
const typesPhases = require('../../sources/titres-types-phases.json')

exports.seed = (knex, Promise) => {
  return Promise.all([
    knex('titres_domaines_types').del(),
    knex('titres_domaines').del(),
    knex('titres_types').del(),
    knex('titres_types_phases').del()
  ])
    .then(() => {
      return Promise.all([
        knex('titres_domaines').insert(domaines),
        knex('titres_types').insert(types)
      ])
    })
    .then(() => {
      return Promise.all([
        knex('titres_types_phases').insert(typesPhases),
        knex('titres_domaines_types').insert(domainesTypes)
      ])
    })
}
