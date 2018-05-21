const domainesTypes = require('../../sources/titres-domaines-types.json')
const domaines = require('../../sources/titres-domaines.json')
const types = require('../../sources/titres-types.json')
const typesPhases = require('../../sources/titres-types-phases.json')

exports.seed = (knex, Promise) => {
  return Promise.all([
    knex('titresDomainesTypes').del(),
    knex('titresDomaines').del(),
    knex('titresTypes').del(),
    knex('titresTypesPhases').del()
  ])
    .then(() => {
      return Promise.all([
        knex('titresDomaines').insert(domaines),
        knex('titresTypes').insert(types)
      ])
    })
    .then(() => {
      return Promise.all([
        knex('titresTypesPhases').insert(typesPhases),
        knex('titresDomainesTypes').insert(domainesTypes)
      ])
    })
}
