import '../../../init'
import { administrationsGet } from '../administrations'
import { administrationsEtapesTypesPropsQuery } from './metas'
import { entreprisesQueryBuild } from '../entreprises'
import { titreActivitesCount } from './titres-activites'

import { writeFileSync } from 'fs'
import { IFields, IUtilisateur } from '../../../types'
import Titres from '../../models/titres'
import options from '../_options'

const main = async () => {
  const user = {
    id: '109f95',
    permissionId: 'super',
    permission: { id: 'super', nom: '', ordre: 0 }
  } as IUtilisateur

  // === Administrations ===
  const administrations = await administrationsGet({}, {}, user)

  const qAdministrations = administrationsEtapesTypesPropsQuery(
    administrations.filter(a => a.typeId === 'ope').map(a => a.id),
    'modification'
  )

  writeFileSync(
    'src/database/queries/permissions/_test_administrations.sql',
    qAdministrations.toKnexQuery().toString()
  )

  // === Entreprises ===
  const qEntreprises = entreprisesQueryBuild(
    {},
    {},
    {
      id: '3553d2',
      permissionId: 'entreprise',
      permission: { id: 'entreprise', nom: '', ordre: 0 },
      entreprises: [
        {
          id: 'fr-440095750',
          nom: 'CIE MINIERE JOTA'
        },
        {
          id: 'fr-827791120',
          nom: 'CIE MINIERE PHOENIX'
        },
        {
          id: 'fr-315014035',
          nom: "DEPARTEMENT D'OUTRE MER IMPORT EXPORT (DOMIEX)"
        },
        {
          id: 'fr-840649602',
          nom: 'PLACER APPROUAGUE GUYANE (PAG)'
        }
      ]
    }
  )

  writeFileSync(
    'src/database/queries/permissions/_test_entreprises.sql',
    qEntreprises.toKnexQuery().toString()
  )

  // === Titres-Activites ===
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

  writeFileSync(
    'src/database/queries/permissions/_test_titresActivites.sql',
    qTitresActivites.toKnexQuery().toString()
  )

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
