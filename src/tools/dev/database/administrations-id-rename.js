import 'dotenv/config'
import '../../../database/index'
import Administrations from '../../../database/models/administrations'

import { administrationsGet } from '../../../database/queries/administrations'

const Knex = require('knex')
const config = require('../../../../knex/config-api')
const knex = Knex(config.knex)

async function main() {
  // création d'une table de conversion {old_id:new_id}
  var conversion = {}

  // array des tables de relation concernées
  const relationTable = [
    'administrations__domaines',
    'restrictions__etapes_types__administrations',
    'restrictions__types__administrations',
    'restrictions__types__statuts__administrations',
    'titres_administrations_gestionnaires',
    'titres_administrations_locales',
    'utilisateurs__administrations'
  ]

  const administrations = await administrationsGet()

  administrations.forEach(administration => {
    // calcul du nouvel id d'une administration suivant son type
    //       id              |  type_id
    // 'dea-bfc-01'          | 'dre'      --> 'dre-bfc-01'
    // 'prefecture-01053-01' | 'pre'      --> 'pre-01053-01'
    // 'ope-onf-973-01'      | 'ope'      --> inchangé
    const newId = administration.id.replace(
      administration.id.substring(0, administration.id.indexOf('-')),
      administration.typeId
    )
    if (newId !== administration.id) {
      // alimente la table de conversion
      conversion[administration.id] = newId

      // patch l'id s'il a changé
      Promise.resolve(
        Administrations.query()
          .findById(administration.id)
          .patch({ id: newId })
      )
    }
  })

  // parcourt chaque nouvel id et chaque table concernée, patch le nouvel id
  Object.keys(conversion).forEach(administrationId => {
    relationTable.forEach(table => {
      Promise.resolve(
        knex(table)
          .update('administration_id', conversion[administrationId])
          .where('administration_id', '=', administrationId)
      )
    })
  })
}

main()
