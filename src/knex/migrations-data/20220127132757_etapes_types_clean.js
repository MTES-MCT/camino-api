import {
  titreEtapeDelete,
  titresEtapesGet
} from '../../database/queries/titres-etapes'
import { userSuper } from '../../database/user-super'

exports.up = async knex => {
  // Supprime l’étape DSL « Demande de l’accord du propriétaire du sol »
  await knex('titres_types__demarches_types__etapes_types')
    .where('etape_type_id', 'dsl')
    .delete()

  const etapesDsl = await titresEtapesGet(
    { etapesTypesIds: ['dsl'] },
    { fields: { demarche: {} } },
    userSuper
  )
  for (const etapeDsl of etapesDsl) {
    await titreEtapeDelete(etapeDsl.id, userSuper, etapeDsl.demarche.titreId)
  }

  await knex('administrations__titres_types__etapes_types')
    .where('etape_type_id', 'dsl')
    .delete()

  await knex('etapes_types__etapes_statuts')
    .where('etape_type_id', 'dsl')
    .delete()

  await knex('etapes_types').where('id', 'dsl').delete()

  // supprime l’eof « Expertise de l’ONF » des AXM et son cycle d’informations
  await knex('titres_types__demarches_types__etapes_types')
    .whereIn('etape_type_id', ['eof', 'rio', 'mio'])
    .where('demarche_type_id', 'oct')
    .where('titre_type_id', 'axm')
    .delete()
}
exports.down = () => ({})
