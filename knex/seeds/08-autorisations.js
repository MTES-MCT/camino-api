const seeding = require('../seeding')

// eslint-disable-next-line camelcase
const a__domaines = require('../../sources/a--domaines.json')
// eslint-disable-next-line camelcase
const a_titresTypes_titresStatuts = require('../../sources/a--titres-types--titres-statuts.json')
// eslint-disable-next-line camelcase
const a__etapesTypes = require('../../sources/a--etapes-types.json')

// eslint-disable-next-line camelcase
const a__titresTypes__administrations = require('../../sources/a--titres-types--administrations.json')
// eslint-disable-next-line camelcase
const r__titresTypes__titresStatuts__administrations = require('../../sources/r--titres-types--titres-statuts--administrations.json')
// eslint-disable-next-line camelcase
const r__titresTypes__etapesTypes__administrations = require('../../sources/r--titres-types--etapes-types--administrations.json')

exports.seed = seeding(async ({ insert }) => {
  await Promise.all([
    insert('a__domaines', a__domaines),
    insert('a__titresTypes__titresStatuts', a_titresTypes_titresStatuts),
    insert('a__etapesTypes', a__etapesTypes),

    insert('a__titresTypes__administrations', a__titresTypes__administrations),
    insert(
      'r__titresTypes__titresStatuts__administrations',
      r__titresTypes__titresStatuts__administrations
    ),
    insert(
      'r__titresTypes__etapesTypes__administrations',
      r__titresTypes__etapesTypes__administrations
    )
  ])
})
