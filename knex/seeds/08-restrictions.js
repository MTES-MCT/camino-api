const seeding = require('../seeding')

// eslint-disable-next-line camelcase
const restrictions__domaines = require('../../sources/restrictions--domaines.json')
// eslint-disable-next-line camelcase
const restriction__types__administrations = require('../../sources/restrictions--types--administrations.json')
// eslint-disable-next-line camelcase
const restrictions_types_statuts = require('../../sources/restrictions--types--statuts.json')
// eslint-disable-next-line camelcase
const restrictions_types_statuts_administrations = require('../../sources/restrictions--types--statuts--administrations.json')
// eslint-disable-next-line camelcase
const restrictions__EtapesTypes = require('../../sources/restrictions--etapes-types.json')
// eslint-disable-next-line camelcase
const restrictions__EtapesTypes__administrations = require('../../sources/restrictions--etapes-types--administrations.json')

exports.seed = seeding(async ({ insert }) => {
  await Promise.all([
    insert('restrictions__domaines', restrictions__domaines),
    insert(
      'restrictions__types__administrations',
      restriction__types__administrations
    ),
    insert('restrictions__types__statuts', restrictions_types_statuts),
    insert(
      'restrictions__types__statuts__administrations',
      restrictions_types_statuts_administrations
    ),
    insert('restrictions__etapesTypes', restrictions__EtapesTypes),
    insert(
      'restrictions__etapesTypes__administrations',
      restrictions__EtapesTypes__administrations
    )
  ])
})
