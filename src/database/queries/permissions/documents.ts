import { IUtilisateur } from '../../../types'

import { QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Documents from '../../models/documents'

const documentsPermissionQueryBuild = (
  q: QueryBuilder<Documents, Documents | Documents[]>,
  user?: IUtilisateur
) => {
  q.select('documents.*')

  q.joinRelated('type')

  if (permissionCheck(user, ['entreprise']) && user?.entreprises?.length) {
    // repertoire = etapes
    q.leftJoinRelated('etape.demarche.titre.[titulaires, amodiataires]')

    // repertoire = activites
    q.leftJoinRelated('activite.titre.[titulaires, amodiataires]')

    // repertoire = entreprises
    q.leftJoinRelated('entreprise')
  }

  if (
    !user ||
    permissionCheck(user, ['defaut']) ||
    permissionCheck(user, ['entreprise'])
  ) {
    q.where(b => {
      b.orWhere('documents.publicLecture', true)

      if (permissionCheck(user, ['entreprise']) && user?.entreprises?.length) {
        b.orWhere(c => {
          c.where('documents.entreprisesLecture', true)

          // si l'utilisateur est `entreprise`,
          // titres dont il est titulaire ou amodiataire
          const entreprisesIds = user.entreprises!.map(e => e.id)

          c.where(d => {
            d.orWhere(e => {
              e.where('type.repertoire', 'etapes')
              e.where(f => {
                f.orWhereIn(
                  'etape:demarche:titre:titulaires.id',
                  entreprisesIds
                )
                f.orWhereIn(
                  'etape:demarche:titre:amodiataires.id',
                  entreprisesIds
                )
              })
            })

            d.orWhere(e => {
              e.where('type.repertoire', 'activites')
              e.where(f => {
                f.orWhereIn('activite:titre:titulaires.id', entreprisesIds)
                f.orWhereIn('activite:titre:amodiataires.id', entreprisesIds)
              })
            })

            d.orWhere(e => {
              e.where('type.repertoire', 'entreprises')
              e.whereIn('entreprise.id', entreprisesIds)
            })
          })
        })
      }
    })
  }
}

export { documentsPermissionQueryBuild }
