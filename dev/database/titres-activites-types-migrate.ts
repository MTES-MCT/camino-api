import 'dotenv/config'
import knex from '../../src/init'
import {
  activitesTypesGet,
  activiteTypeCreate,
  titreTypeActiviteTypeDelete
} from '../../src/database/queries/metas-activites'
import {
  titresActivitesUpsert,
  titresActivitesGet,
  titreActiviteDelete
} from '../../src/database/queries/titres-activites'

const main = async () => {
  await knex.schema.alterTable('activitesTypes__documentsTypes', table => {
    table.boolean('optionnel')
  })

  const activitesTypes = await activitesTypesGet({}, 'super')
  const activiteTypeNew = activitesTypes.find(at => at.id === 'gra')!
  activiteTypeNew.id = 'grx'
  activiteTypeNew.nom =
    "rapport annuel de production d'or en Guyane (autorisation d'exploitation)"
  activiteTypeNew.titresTypes = activiteTypeNew.titresTypes.filter(
    tt => tt.id === 'axm'
  )

  activiteTypeNew.documentsTypes[0].optionnel = true

  await activiteTypeCreate(activiteTypeNew)

  console.info(`type d'activité ajoutée: ${activiteTypeNew.nom}`)
  await titreTypeActiviteTypeDelete({
    titreTypeId: 'axm',
    activiteTypeId: 'gra'
  })

  const titresActivites = await titresActivitesGet(
    { typesIds: ['gra'], titresTypesIds: ['ax'] },
    {},
    'super'
  )

  const oldIds = []
  const newTitreActivites = []

  for (const ta of titresActivites) {
    oldIds.push(ta.id)
    ta.id = ta.id.replace('-gra-', '-grx-')
    delete ta.type

    ta.typeId = 'grx'

    newTitreActivites.push(ta)
  }

  await titresActivitesUpsert(newTitreActivites)

  for (const id of oldIds) {
    await titreActiviteDelete(id, {})
  }

  console.info(`${newTitreActivites.length} activités insérees`)
  console.info(`${oldIds.length} activités supprimées`)

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
