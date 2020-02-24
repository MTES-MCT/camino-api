const seeding = require('../seeding')

// eslint-disable-next-line camelcase
const autorisations__domaines = require('../../sources/autorisations--domaines.json')
// eslint-disable-next-line camelcase
const autorisations_titresTypes_titresStatuts = require('../../sources/autorisations--titres-types--titres-statuts.json')
// eslint-disable-next-line camelcase
const autorisations__etapesTypes = require('../../sources/autorisations--etapes-types.json')

// eslint-disable-next-line camelcase
const administrations__titresTypes = require('../../sources/a--titres-types--administrations.json')
// eslint-disable-next-line camelcase
const administrations__titresTypes__titresStatuts = require('../../sources/r--titres-types--titres-statuts--administrations.json')
// eslint-disable-next-line camelcase
const administrations__titresTypes__etapesTypes = require('../../sources/r--titres-types--etapes-types--administrations.json')

exports.seed = seeding(async ({ insert }) => {
  await Promise.all([
    insert('autorisations__domaines', autorisations__domaines),
    insert(
      'autorisations__titresTypes__titresStatuts',
      autorisations_titresTypes_titresStatuts
    ),
    insert('autorisations__etapesTypes', autorisations__etapesTypes),

    insert(
      'autorisations__titresTypes__administrations',
      administrations__titresTypes
    ),
    insert(
      'restrictions__titresTypes__titresStatuts__administrations',
      administrations__titresTypes__titresStatuts
    ),
    insert(
      'restrictions__titresTypes__etapesTypes__administrations',
      administrations__titresTypes__etapesTypes
    )
  ])
})
