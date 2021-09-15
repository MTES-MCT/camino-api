const seeding = require('../seeding')

// eslint-disable-next-line camelcase
const administrations_activitesTypes = require('../../../sources/administrations--activites-types.json')
// eslint-disable-next-line camelcase
const administrations__titresTypes = require('../../../sources/administrations--titres-types.json')
// eslint-disable-next-line camelcase
const administrations__titresTypes__titresStatuts = require('../../../sources/administrations--titres-types--titres-statuts.json')
// eslint-disable-next-line camelcase
const administrations__titresTypes__etapesTypes = require('../../../sources/administrations--titres-types--etapes-types.json')

const seed = seeding(async ({ insert }) => {
  await Promise.all([
    insert('administrations__titresTypes', administrations__titresTypes),
    insert(
      'administrations__titresTypes__titresStatuts',
      administrations__titresTypes__titresStatuts
    ),
    insert(
      'administrations__titresTypes__etapesTypes',
      administrations__titresTypes__etapesTypes
    ),
    insert('administrations__activitesTypes', administrations_activitesTypes)
  ])
})

module.exports = seed

module.exports.seed = seed
