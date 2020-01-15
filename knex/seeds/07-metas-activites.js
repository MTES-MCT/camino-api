const seeding = require('../seeding')

const activitesStatuts = require('../../sources/activites-statuts.json')
const activitesTypes = require('../../sources/activites-types.json')
// eslint-disable-next-line camelcase
const activitesTypes_types = require('../../sources/activites-types--types.json')
// eslint-disable-next-line camelcase
const activitesTypes_pays = require('../../sources/activites-types--pays.json')
// eslint-disable-next-line camelcase
const activitesTypes_administrations = require('../../sources/activites-types--administrations.json')

exports.seed = seeding(async ({ del, insert }) => {
  await insert('activitesStatuts', activitesStatuts)
  await insert('activitesTypes', activitesTypes)
  await insert('activitesTypes__types', activitesTypes_types)
  await insert('activitesTypes__pays', activitesTypes_pays)
  await insert(
    'activitesTypes__administrations',
    activitesTypes_administrations
  )
})
