import 'dotenv/config'
import '../../src/init'
import {
  activitesTypesGet,
  activiteTypeCreate,
  activiteTypeDelete
} from '../../src/database/queries/metas-activites'
import {
  titresActivitesUpsert,
  titresActivitesGet,
  titreActiviteDelete
} from '../../src/database/queries/titres-activites'

const main = async () => {
  const activitesTypes = await activitesTypesGet({}, 'super')
  const activiteTypeNew = activitesTypes.find(at => at.id === 'gra')!
  activiteTypeNew.id = 'grx'
  activiteTypeNew.titresTypes = activiteTypeNew.titresTypes.filter(
    tt => tt.id === 'axm'
  )

  activiteTypeNew.documents[]

  await activiteTypeCreate(activiteTypeNew)
  const titresActivites = await titresActivitesGet(
    { typesIds: ['gra'] },
    {},
    'super'
  )

  const oldIds = []
  const newTitreActivites = []

  for (const ta of titresActivites) {
    oldIds.push(ta.id)
    ta.id = ta.id.replace('-gra-', '-grx-')
    ta.typeId = 'grx'

    newTitreActivites.push(ta)
  }

  await titresActivitesUpsert(newTitreActivites)

  for (const id of oldIds) {
    await titreActiviteDelete(id, {})
  }

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
