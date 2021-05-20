import { raw, QueryBuilder } from 'objection'

import { IUtilisateur } from '../../../types'

import { permissionCheck } from '../../../tools/permission'

import Documents from '../../models/documents'
import TitresEtapes from '../../models/titres-etapes'
import Entreprises from '../../models/entreprises'
import EtapesTypesDocumentsTypes from '../../models/etapes-types--documents-types'

import { documentsQueryModify } from './documents'
import {
  administrationsEtapesTypesPropsQuery,
  entreprisesEtapesTypesPropsQuery
} from './metas'
import {
  administrationsTitresTypesEtapesTypesModify,
  administrationsTitresQuery
} from './administrations'
import { entreprisesQueryModify, entreprisesTitresQuery } from './entreprises'
import { titresDemarchesQueryModify } from './titres-demarches'
import TitresDemarches from '../../models/titres-demarches'
import EtapesTypesJustificatifsTypes from '../../models/etapes-types--justificatifs-types'

const titreEtapeModificationQueryBuild = (user: IUtilisateur | null) => {
  if (permissionCheck(user?.permissionId, ['super'])) {
    return raw('true')
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur']) &&
    user?.administrations?.length
  ) {
    const administrationsIds = user.administrations.map(a => a.id) || []

    return administrationsEtapesTypesPropsQuery(
      administrationsIds,
      'modification'
    )
      .whereRaw('?? = ??', [
        'demarchesModification.id',
        'titresEtapes.titreDemarcheId'
      ])
      .whereRaw('?? = ??', ['t_d_e.etapeTypeId', 'titresEtapes.typeId'])
  } else if (
    permissionCheck(user?.permissionId, ['entreprise']) &&
    user?.entreprises?.length
  ) {
    return entreprisesEtapesTypesPropsQuery(
      user.entreprises.map(({ id }) => id)
    ).whereRaw('?? = ??', ['titresEtapes.id', 'e_te.id'])
  }

  return raw('false')
}

const titreEtapeCreationDocumentsModify = (
  q: QueryBuilder<any, any | any[]>,
  typeIdAlias: string
) => {
  // si il existe un type de document pour le type d’étape
  const query = EtapesTypesDocumentsTypes.query()
    .where(raw('?? = ??', [typeIdAlias, 'etapeTypeId']))
    .first()

  q.select(raw('EXISTS(?)', [query]).as('documentsCreation'))
}

const titreEtapeCreationJustificatifsModify = (
  q: QueryBuilder<any, any | any[]>,
  typeIdAlias: string,
  user: IUtilisateur | null
) => {
  //

  // si il existe un type de justificatif pour le type d’étape
  const query = EtapesTypesJustificatifsTypes.query()
    .where(raw('?? = ??', [typeIdAlias, 'etapeTypeId']))
    .first()

  q.select(
    raw('EXISTS(?) AND (?)', [
      query,
      titreEtapeModificationQueryBuild(user)
    ]).as('justificatifsAssociation')
  )
}

/**
 * Modifie la requête d'étape(s) pour prendre en compte les permissions de l'utilisateur connecté
 *
 * @params q - requête d'étape(s)
 * @params user - utilisateur connecté
 * @returns une requête d'étape(s)
 */
const titresEtapesQueryModify = (
  q: QueryBuilder<TitresEtapes, TitresEtapes | TitresEtapes[]>,
  user: IUtilisateur | null
) => {
  q.select('titresEtapes.*').leftJoinRelated('[demarche.titre, type]')

  if (!user || !permissionCheck(user.permissionId, ['super'])) {
    q.where(b => {
      b.orWhere('type.publicLecture', true)

      // étapes visibles pour les admins
      if (
        user?.administrations?.length &&
        permissionCheck(user.permissionId, ['admin', 'editeur', 'lecteur'])
      ) {
        const administrationsIds = user.administrations.map(a => a.id) || []

        b.orWhereExists(
          administrationsTitresQuery(administrationsIds, 'demarche:titre', {
            isGestionnaire: true,
            isAssociee: true,
            isLocale: true
          }).modify(
            administrationsTitresTypesEtapesTypesModify,
            'lecture',
            'demarche:titre.typeId',
            'titresEtapes.typeId'
          )
        )
      } else if (
        user?.entreprises?.length &&
        permissionCheck(user?.permissionId, ['entreprise'])
      ) {
        const entreprisesIds = user.entreprises.map(a => a.id)

        b.orWhere(c => {
          c.where('type.entreprisesLecture', true)

          c.whereExists(
            entreprisesTitresQuery(entreprisesIds, 'demarche:titre', {
              isTitulaire: true,
              isAmodiataire: true
            })
          )
        })
      }
    })
  }

  titreEtapeCreationJustificatifsModify(q, 'type.id', user)

  // si il existe un type de document pour le type d’étape
  titreEtapeCreationDocumentsModify(q, 'type.id')

  q.select(
    raw(permissionCheck(user?.permissionId, ['super']) ? 'true' : 'false').as(
      'suppression'
    )
  )

  q.select(titreEtapeModificationQueryBuild(user).as('modification'))

  q.modifyGraph('demarche', b => {
    titresDemarchesQueryModify(
      b as QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
      user
    )
  })

  q.modifyGraph('documents', b => {
    documentsQueryModify(
      b as QueryBuilder<Documents, Documents | Documents[]>,
      user
    )
  })

  q.modifyGraph('justificatifs', b => {
    documentsQueryModify(
      b as QueryBuilder<Documents, Documents | Documents[]>,
      user
    )
  })

  q.modifyGraph('titulaires', b => {
    entreprisesQueryModify(
      b as QueryBuilder<Entreprises, Entreprises | Entreprises[]>,
      user
    ).select('titresTitulaires.operateur')
  })

  q.modifyGraph('amodiataires', b => {
    entreprisesQueryModify(
      b as QueryBuilder<Entreprises, Entreprises | Entreprises[]>,
      user
    ).select('titresAmodiataires.operateur')
  })

  return q
}

export { titresEtapesQueryModify }
