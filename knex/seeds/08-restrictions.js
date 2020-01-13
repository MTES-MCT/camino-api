const seeding = require('../seeding')

const restrictionsDomaines = require('../../sources/restrictions--domaines.json')
const restrictionsTypesAdministrations = require('../../sources/restrictions--types--administrations.json')
const restrictionsTypesStatuts = require('../../sources/restrictions--types--statuts.json')
const restrictionsTypesStatutsAdministrations = require('../../sources/restrictions--types--statuts--administrations.json')
const restrictionsEtapesTypes = require('../../sources/restrictions--etapes-types.json')
const restrictionsEtapesTypesAdministrations = require('../../sources/restrictions--etapes-types--administrations.json')

exports.seed = seeding(async ({ del, insert }) => {
  await Promise.all([
    insert('restrictions__domaines', restrictionsDomaines),
    insert(
      'restrictions__types__administrations',
      restrictionsTypesAdministrations
    ),
    insert('restrictions__types__statuts', restrictionsTypesStatuts),
    insert(
      'restrictions__types__statuts__administrations',
      restrictionsTypesStatutsAdministrations
    ),
    insert('restrictions__etapesTypes', restrictionsEtapesTypes),
    insert(
      'restrictions__etapesTypes__administrations',
      restrictionsEtapesTypesAdministrations
    )
  ])
})
