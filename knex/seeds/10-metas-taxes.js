const seeding = require('../seeding')

const taxesStatuts = require('../../sources/taxes-statuts.json')
const taxesTypes = require('../../sources/taxes-types.json')
// eslint-disable-next-line camelcase
const taxesTypes_types = require('../../sources/taxes-types--types.json')
// eslint-disable-next-line camelcase
const taxesTypes_pays = require('../../sources/taxes-types--pays.json')

exports.seed = seeding(async ({ del, insert }) => {
  await del('taxesTypes__pays')
  await del('taxesTypes__types')
  await del('taxesTypes')
  await del('taxesStatuts')

  await insert('taxesStatuts', taxesStatuts)
  await insert('taxesTypes', taxesTypes)
  await insert('taxesTypes__types', taxesTypes_types)
  await insert('taxesTypes__pays', taxesTypes_pays)
})
