const seeding = require('../seeding')

const activitesStatuts = require('../../sources/activites-statuts.json')
const activitesTypes = require('../../sources/activites-types.json')
// eslint-disable-next-line camelcase
const titresTypes__activitesTypes = require('../../sources/titres-types--activites-types.json')
// eslint-disable-next-line camelcase
const activitesTypes_pays = require('../../sources/activites-types--pays.json')
// eslint-disable-next-line camelcase
const activitesTypes_documentsTypes = require('../../sources/activites-types--documents-types.json')

const seed = seeding(async ({ insert }) => {
  await insert('activitesStatuts', activitesStatuts)
  await insert('activitesTypes', activitesTypes)
  await insert('titresTypes__activitesTypes', titresTypes__activitesTypes)
  await insert('activitesTypes__pays', activitesTypes_pays)
  await insert('activitesTypes__documentsTypes', activitesTypes_documentsTypes)
})

module.exports = seed

module.exports.seed = seed
