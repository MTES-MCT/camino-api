import 'dotenv/config'
import '../../../database/index'
import Administrations from '../../../database/models/administrations'

import { administrationsGet } from '../../../database/queries/administrations'

const Knex = require('knex')
const config = require('../../../../knex/config-api')
const knex = Knex(config.knex)

async function main() {
  const administrations = await administrationsGet()

  var conversion = {}

  administrations.forEach(administration => {
    const newId = administration.id.replace(
      administration.id.substring(0, administration.id.indexOf('-')),
      administration.typeId
    )
    if (newId !== administration.id) {
      conversion[administration.id] = newId
      administration.id = conversion[administration.id]

      // insert des administrations avec le newId
      // Promise.resolve(Administrations.query().insert(administration))

      // update des administrations avec le newId
      Promise.resolve(Administrations.query().update(administration))
    }
  })

  Object.keys(conversion).forEach(administrationId => {
    Promise.resolve(
      knex('administrations__domaines')
        .update('administration_id', conversion[administrationId])
        .where('administration_id', '=', administrationId)
    )
    Promise.resolve(
      knex('restrictions__etapes_types__administrations')
        .update('administration_id', conversion[administrationId])
        .where('administration_id', '=', administrationId)
    )
    Promise.resolve(
      knex('restrictions__types__administrations')
        .update('administration_id', conversion[administrationId])
        .where('administration_id', '=', administrationId)
    )
    Promise.resolve(
      knex('restrictions__types__statuts__administrations')
        .update('administration_id', conversion[administrationId])
        .where('administration_id', '=', administrationId)
    )
    Promise.resolve(
      knex('titres_administrations_gestionnaires')
        .update('administration_id', conversion[administrationId])
        .where('administration_id', '=', administrationId)
    )
    Promise.resolve(
      knex('titres_administrations_locales')
        .update('administration_id', conversion[administrationId])
        .where('administration_id', '=', administrationId)
    )
    Promise.resolve(
      knex('utilisateurs__administrations')
        .update('administration_id', conversion[administrationId])
        .where('administration_id', '=', administrationId)
    )
  })
}

main()
