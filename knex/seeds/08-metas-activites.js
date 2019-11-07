const seeding = require('../seeding')

const activitesStatuts = require('../../sources/activites-statuts.json')
const activitesTypes = require('../../sources/activites-types.json')
// eslint-disable-next-line camelcase
const activitesTypes_types = require('../../sources/activites-types--types.json')
// eslint-disable-next-line camelcase
const activitesTypes_pays = require('../../sources/activites-types--pays.json')

exports.seed = seeding(async ({ del, insert }) => {
  await del('activitesTypes__pays')
  await del('activitesTypes__types')
  await del('activitesTypes')
  await del('activitesStatuts')

  await insert('activitesStatuts', activitesStatuts)
  await insert('activitesTypes', activitesTypes)
  await insert('activitesTypes__types', activitesTypes_types)
  await insert('activitesTypes__pays', activitesTypes_pays)
})
