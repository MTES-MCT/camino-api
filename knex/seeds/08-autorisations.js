const seeding = require('../seeding')

// eslint-disable-next-line camelcase
const autorisations__domaines = require('../../sources/autorisations--domaines.json')
// eslint-disable-next-line camelcase
const autorisations_titresTypes_titresStatuts = require('../../sources/autorisations--titres-types--titres-statuts.json')
// eslint-disable-next-line camelcase
const autorisations__etapesTypes = require('../../sources/autorisations--etapes-types.json')

// eslint-disable-next-line camelcase
const administrations__titresTypes = require('../../sources/administrations--titres-types.json')
// eslint-disable-next-line camelcase
const administrations__titresTypes__titresStatuts = require('../../sources/administrations--titres-types--titres-statuts.json')
// eslint-disable-next-line camelcase
const administrations__titresTypes__etapesTypes = require('../../sources/administrations--titres-types--etapes-types.json')

exports.seed = seeding(async ({ insert }) => {
  await Promise.all([
    insert('autorisations__domaines', autorisations__domaines),
    insert(
      'autorisations__titresTypes__titresStatuts',
      autorisations_titresTypes_titresStatuts
    ),
    insert('autorisations__etapesTypes', autorisations__etapesTypes),

    insert('administrations__titresTypes', administrations__titresTypes),
    insert(
      'administrations__titresTypes__titresStatuts',
      administrations__titresTypes__titresStatuts
    ),
    insert(
      'administrations__titresTypes__etapesTypes',
      administrations__titresTypes__etapesTypes
    )
  ])
})
