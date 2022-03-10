import { raw, QueryBuilder } from 'objection'

import { IUtilisateur } from '../../../types'

import { permissionCheck } from '../../../business/permission'

import Titres from '../../models/titres'
import TitresEtapes from '../../models/titres-etapes'
import TitresDemarches from '../../models/titres-demarches'

import { titresEtapesQueryModify } from './titres-etapes'
import {
  titresQueryModify,
  titresDemarchesAdministrationsModificationQuery
} from './titres'
import { administrationsEtapesTypesPropsQuery } from './metas'
import { administrationsTitresQuery } from './administrations'
import { entreprisesTitresQuery } from './entreprises'

const titresDemarchesQueryModify = (
  q: QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
  user: IUtilisateur | null | undefined
) => {
  q.select('titresDemarches.*')
    .where('titresDemarches.archive', false)
    .leftJoinRelated('[titre, type]')

  if (!user || !permissionCheck(user.permissionId, ['super'])) {
    q.whereExists(
      titresQueryModify(
        (
          TitresDemarches.relatedQuery('titre') as QueryBuilder<
            Titres,
            Titres | Titres[]
          >
        ).alias('titres'),
        user
      )
    )

    q.where(b => {
      b.orWhere('titresDemarches.publicLecture', true)

      if (
        permissionCheck(user?.permissionId, ['admin', 'editeur', 'lecteur']) &&
        user?.administrations?.length
      ) {
        const administrationsIds = user.administrations.map(e => e.id)
        const administrationTitre = administrationsTitresQuery(
          administrationsIds,
          'titre',
          {
            isGestionnaire: true,
            isAssociee: true,
            isLocale: true
          }
        )

        b.orWhereExists(administrationTitre)
      } else if (
        permissionCheck(user?.permissionId, ['entreprise']) &&
        user?.entreprises?.length
      ) {
        const entreprisesIds = user.entreprises.map(e => e.id)

        b.orWhere(c => {
          c.where('titresDemarches.entreprisesLecture', true)

          c.whereExists(
            entreprisesTitresQuery(entreprisesIds, 'titre', {
              isTitulaire: true,
              isAmodiataire: true
            })
          )
        })
      }
    })
  }

  q.modify(titreDemarcheModificationQuery, 'titresDemarches', user)

  q.select(
    titreEtapesCreationQuery('titresDemarches', user).as('etapesCreation')
  )

  q.modifyGraph('etapes', b => {
    titresEtapesQueryModify(
      b as QueryBuilder<TitresEtapes, TitresEtapes | TitresEtapes[]>,
      user
    )
  })

  q.modifyGraph('titre', a =>
    titresQueryModify(a as QueryBuilder<Titres, Titres | Titres[]>, user)
  )

  // fileCreate('sql.sql', format(q.toKnexQuery().toString()))

  return q
}

const titreDemarcheModificationQuery = (
  q: QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
  demarcheAlias: string,
  user: IUtilisateur | null | undefined
): void => {
  let modificationQuery = raw('false')
  if (permissionCheck(user?.permissionId, ['super'])) {
    modificationQuery = raw('true')
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur']) &&
    user?.administrations?.length
  ) {
    modificationQuery = titresDemarchesAdministrationsModificationQuery(
      user.administrations,
      'type'
    ).whereRaw('?? = ??', ['titresModification.id', 'titresDemarches.titreId'])

    q.groupBy(`${demarcheAlias}.id`, 'type.travaux')
  }

  q.select(modificationQuery.as('modification'))
}

const titreEtapesCreationQuery = (
  demarcheAlias: string,
  user: IUtilisateur | null | undefined
) => {
  if (permissionCheck(user?.permissionId, ['super'])) {
    return raw('true')
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur']) &&
    user?.administrations?.length
  ) {
    const administrationsIds = user.administrations.map(e => e.id)

    return (
      administrationsEtapesTypesPropsQuery(administrationsIds, 'creation')
        // filtre selon la démarche
        .whereRaw('?? = ??', [
          'demarchesModification.id',
          `${demarcheAlias}.id`
        ])
        .groupBy('demarchesModification.id')
    )
  } else {
    return raw('false')
  }
}

export { titresDemarchesQueryModify }
