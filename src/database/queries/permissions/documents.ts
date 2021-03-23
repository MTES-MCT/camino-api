import { IUtilisateur } from '../../../types'

import { QueryBuilder, raw } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Documents from '../../models/documents'
import TitresEtapesJustificatifs from '../../models/titres-etapes-justificatifs'

const documentsQueryModify = (
  q: QueryBuilder<Documents, Documents | Documents[]>,
  user?: IUtilisateur
) => {
  q.select('documents.*')

  q.joinRelated('type')

  if (
    permissionCheck(user?.permissionId, ['entreprise']) &&
    user?.entreprises?.length
  ) {
    // repertoire = etapes
    q.leftJoinRelated('etape.demarche.titre.[titulaires, amodiataires]')

    // repertoire = activites
    q.leftJoinRelated('activite.titre.[titulaires, amodiataires]')

    // repertoire = activites
    q.leftJoinRelated('travauxEtape.travaux.titre.[titulaires, amodiataires]')
  }

  if (
    !user ||
    permissionCheck(user?.permissionId, ['defaut']) ||
    permissionCheck(user?.permissionId, ['entreprise'])
  ) {
    q.where(b => {
      b.orWhere('documents.publicLecture', true)

      if (
        permissionCheck(user?.permissionId, ['entreprise']) &&
        user?.entreprises?.length
      ) {
        b.orWhere(c => {
          c.where('documents.entreprisesLecture', true)

          // si l'utilisateur est `entreprise`,
          // titres dont il est titulaire ou amodiataire
          const entreprisesIds = user.entreprises!.map(e => e.id)

          c.where(d => {
            d.orWhere(e => {
              e.where('type.repertoire', 'demarches')
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
              e.where('type.repertoire', 'travaux')
              e.where(f => {
                f.orWhereIn(
                  'travauxEtape:travaux:titre:titulaires.id',
                  entreprisesIds
                )
                f.orWhereIn(
                  'travauxEtape:travaux:titre:amodiataires.id',
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
              e.whereIn('documents.entrepriseId', entreprisesIds)
            })
          })
        })
      }
    })
  }

  q.select(
    raw('(not exists(?))', [titreEtapeJustificatifsQuery]).as('modification')
  )
  q.select(
    raw('(not exists(?))', [titreEtapeJustificatifsQuery]).as('suppression')
  )
}

const titreEtapeJustificatifsQuery = TitresEtapesJustificatifs.query()
  .alias('documentsModification')
  .whereRaw('?? = ??', ['documentsModification.documentId', 'documents.id'])

export { documentsQueryModify }
