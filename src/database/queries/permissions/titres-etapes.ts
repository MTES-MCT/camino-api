import { raw, QueryBuilder } from 'objection'

import { IUtilisateur } from '../../../types'

import { permissionCheck } from '../../../tools/permission'

import Documents from '../../models/documents'
import TitresEtapes from '../../models/titres-etapes'
import Entreprises from '../../models/entreprises'

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
import Journaux from '../../models/journaux'
import { journauxQueryModify } from './journaux'

const titreEtapeModificationQueryBuild = (
  user: IUtilisateur | null | undefined
) => {
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

const specifiquesAdd = (
  q: QueryBuilder<TitresEtapes, TitresEtapes | TitresEtapes[]>
) => {
  // sections spécifiques
  q.leftJoin('titresTypes__demarchesTypes__etapesTypes as tde', b => {
    b.andOn('tde.titreTypeId', 'demarche:titre.typeId')
    b.andOn('tde.demarcheTypeId', 'demarche.typeId')
    b.andOn('tde.etapeTypeId', 'type.id')
  })
  q.select(raw('tde.sections').as('sectionsSpecifiques'))
  q.groupBy('tde.sections')

  // documents spécifiques
  q.leftJoin(
    'titresTypes__demarchesTypes__etapesTypes__documentsTypes as tded',
    b => {
      b.andOn('tded.titreTypeId', 'demarche:titre.typeId')
      b.andOn('tded.demarcheTypeId', 'demarche.typeId')
      b.andOn('tded.etapeTypeId', 'type.id')
    }
  )
  q.leftJoin('documentsTypes as dt1', 'dt1.id', 'tded.documentTypeId')
  q.select(
    raw(
      "COALESCE(json_agg(json_build_object('id', dt1.id,'nom', dt1.nom, 'optionnel', tded.optionnel, 'description', tded.description)) FILTER (WHERE dt1.id IS NOT NULL), '[]')"
    ).as('documentsTypesSpecifiques')
  )
  // justificatifs spécifiques
  q.leftJoin(
    'titresTypes__demarchesTypes__etapesTypes__justificatifsT as tdef',
    b => {
      b.andOn('tdef.titreTypeId', 'demarche:titre.typeId')
      b.andOn('tdef.demarcheTypeId', 'demarche.typeId')
      b.andOn('tdef.etapeTypeId', 'type.id')
    }
  )
  q.leftJoin('documentsTypes as dt2', 'dt2.id', 'tdef.documentTypeId')
  q.select(
    raw(
      "COALESCE(json_agg(json_build_object('id', dt2.id,'nom', dt2.nom, 'optionnel', tdef.optionnel, 'description', tdef.description)) FILTER (WHERE dt2.id IS NOT NULL), '[]')"
    ).as('justificatifsTypesSpecifiques')
  )
  q.groupBy('titresEtapes.id')

  return q
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
  user: IUtilisateur | null | undefined
) => {
  q.select('titresEtapes.*').leftJoinRelated('[demarche.titre, type]')

  q = specifiquesAdd(q)

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

  q.modifyGraph('journaux', b => {
    journauxQueryModify(
      b as QueryBuilder<Journaux, Journaux | Journaux[]>,
      user
    )
  })

  return q
}

export { titresEtapesQueryModify }
