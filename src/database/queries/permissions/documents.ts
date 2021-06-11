import { QueryBuilder, raw } from 'objection'

import { IUtilisateur } from '../../../types'

import { permissionCheck } from '../../../tools/permission'

import Documents from '../../models/documents'
import TitresEtapesJustificatifs from '../../models/titres-etapes-justificatifs'
import EtapesTypesDocumentsTypes from '../../models/etapes-types--documents-types'
import ActivitesTypesDocumentsTypes from '../../models/activites-types--documents-types'

const documentsQueryModify = (
  q: QueryBuilder<Documents, Documents | Documents[]>,
  user: IUtilisateur | null
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

    // repertoire = travaux
    q.leftJoinRelated('travauxEtape.travaux.titre.[titulaires, amodiataires]')
  }

  if (
    !user ||
    permissionCheck(user?.permissionId, ['defaut']) ||
    permissionCheck(user?.permissionId, ['entreprise'])
  ) {
    q.where(b => {
      b.orWhere('documents.publicLecture', true)

      // autorise à voir les docs temporaires
      b.orWhere(c => {
        c.whereNull('documents.entrepriseId')
        c.whereNull('documents.titreEtapeId')
        c.whereNull('documents.titreActiviteId')
        c.whereNull('documents.titreTravauxEtapeId')
      })

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
              e.orWhereIn('etape:demarche:titre:titulaires.id', entreprisesIds)
              e.orWhereIn(
                'etape:demarche:titre:amodiataires.id',
                entreprisesIds
              )
            })

            d.orWhere(e => {
              e.orWhereIn(
                'travauxEtape:travaux:titre:titulaires.id',
                entreprisesIds
              )
              e.orWhereIn(
                'travauxEtape:travaux:titre:amodiataires.id',
                entreprisesIds
              )
            })

            d.orWhere(e => {
              e.orWhereIn('activite:titre:titulaires.id', entreprisesIds)
              e.orWhereIn('activite:titre:amodiataires.id', entreprisesIds)
            })

            d.orWhereIn('documents.entrepriseId', entreprisesIds)
          })
        })
      }
    })
  }

  q.select(
    raw('(not exists(?))', [titreEtapeJustificatifsQuery]).as('modification')
  )
  q.select(
    raw('(not exists(?) and not exists(?) and not exists(?))', [
      titreEtapeJustificatifsQuery,
      documentTypeActiviteTypeQuery(
        'documents.typeId',
        'documents.titreActiviteId'
      ),
      documentTypeEtapeTypeQuery('documents.typeId', 'documents.titreEtapeId')
    ]).as('suppression')
  )
}

const titreEtapeJustificatifsQuery = TitresEtapesJustificatifs.query()
  .alias('documentsModification')
  .whereRaw('?? = ??', ['documentsModification.documentId', 'documents.id'])

const documentTypeActiviteTypeQuery = (
  typeIdAlias: string,
  activiteIdAlias: string
) =>
  ActivitesTypesDocumentsTypes.query()
    .leftJoin('titresActivites', 'titresActivites.id', activiteIdAlias)
    .whereRaw('?? = ??', ['activiteTypeId', 'titresActivites.typeId'])
    .andWhereRaw('?? = ??', ['documentTypeId', typeIdAlias])
    .andWhereRaw('?? is not true', ['optionnel'])
    .andWhereRaw('?? not in (?, ?)', ['titresActivites.statutId', 'abs', 'enc'])

const documentTypeEtapeTypeQuery = (
  typeIdAlias: string,
  etapeIdAlias: string
) =>
  EtapesTypesDocumentsTypes.query()
    .leftJoin('titresEtapes', 'titresEtapes.id', etapeIdAlias)
    .whereRaw('?? = ??', ['etapeTypeId', 'titresEtapes.typeId'])
    .andWhereRaw('?? = ??', ['documentTypeId', typeIdAlias])
    .andWhereRaw('?? is not true', ['optionnel'])
    .andWhereRaw('?? != ?', ['titresEtapes.statutId', 'aco'])

const etapeTypeDocumentTypeUsedCheck = async (
  etapeTypeId: string,
  documentTypeId: string
) => {
  const res = await Documents.query()
    .joinRelated('etape')
    .where('etape.typeId', etapeTypeId)
    .andWhere('documents.typeId', documentTypeId)
    .count()

  return (res[0] as any).count !== '0'
}

const etapeTypeJustificatifTypeUsedCheck = async (
  etapeTypeId: string,
  documentTypeId: string
) => {
  const res = await TitresEtapesJustificatifs.query()
    .joinRelated('etape')
    .joinRelated('document')
    .where('etape.typeId', etapeTypeId)
    .andWhere('document.typeId', documentTypeId)
    .count()

  return (res[0] as any).count !== '0'
}

export {
  documentsQueryModify,
  etapeTypeDocumentTypeUsedCheck,
  etapeTypeJustificatifTypeUsedCheck
}
