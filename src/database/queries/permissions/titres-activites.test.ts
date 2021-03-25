import '../../../init'
import { dbManager } from '../../../../tests/init-db-manager'
import { IFields, IUtilisateur } from '../../../types'
import Titres from '../../models/titres'
import options from '../_options'
import { titreActivitesCount } from './titres-activites'

beforeAll(async () => {
  await dbManager.populateDb()
})

afterAll(async () => {
  await dbManager.truncateDb()
  await dbManager.closeKnex()
})

describe('titreActivitesCount', () => {
  const user = {
    id: '109f95',
    permissionId: 'super',
    permission: { id: 'super', nom: '', ordre: 0 }
  } as IUtilisateur

  test('la jointure est correctement écrite', async () => {
    const graph = options.titres.graph
    const qTitres = Titres.query().withGraphFetched(graph)
    const fieldsTitresActivites = {
      activitesAbsentes: {},
      activitesEnConstruction: {},
      activitesDeposees: {}
    } as IFields

    const qTitresActivites = titreActivitesCount(
      qTitres,
      { fields: fieldsTitresActivites },
      user
    )

    console.log('qTitresActivites :>> ', qTitresActivites)

    expect(qTitresActivites.toKnexQuery().toString()).toEqual(
      `select "activites_count_join"."activites_absentes", "activites_count_join"."activites_en_construction", "activites_count_join"."activites_deposees", "titres"."type_id", "titres"."domaine_id", "titres"."statut_id", "titres"."props_titre_etapes_ids", "titres"."id" from "titres" left join (select "activites_count"."titre_id", count("activites_count"."statut_id") FILTER (WHERE "activites_count"."statut_id" = 'abs') as "activites_absentes", count("activites_count"."statut_id") FILTER (WHERE "activites_count"."statut_id" = 'enc') as "activites_en_construction", count("activites_count"."statut_id") FILTER (WHERE "activites_count"."statut_id" = 'dep') as "activites_deposees" from "titres_activites" as "activites_count" left join "titres" as "titre" on "titre"."id" = "activites_count"."titre_id" group by "activites_count"."titre_id") as "activites_count_join" on "activites_count_join"."titre_id" = "titres"."id" group by "titres"."id", "activites_absentes", "activites_en_construction", "activites_deposees"`
    )
  })
})
