import { IFields, IUtilisateur } from '../../../types'
// import { format } from 'sql-formatter'
// import fileCreate from '../../../tools/file-create'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Titres from '../../models/titres'
import TitresEtapes from '../../models/titres-etapes'
import TitresDemarches from '../../models/titres-demarches'

import { titresEtapesQueryModify } from './titres-etapes'
import {
  titresQueryModify,
  titresAdministrationsModificationQuery
} from './titres'
import { administrationsEtapesTypesPropsQuery } from './metas'
import { administrationsTitresQuery } from './administrations'
import { entreprisesTitresQuery } from './entreprises'

const titresDemarchesQueryModify = (
  q: QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
  fields?: IFields,
  user?: IUtilisateur
) => {
  q.select('titresDemarches.*').leftJoinRelated('titre')

  if (!user || !permissionCheck(user.permissionId, ['super'])) {
    q.whereExists(
      titresQueryModify(
        (TitresDemarches.relatedQuery('titre') as QueryBuilder<
          Titres,
          Titres | Titres[]
        >).alias('titres'),
        fields,
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

  q.select(
    raw(permissionCheck(user?.permissionId, ['super']) ? 'true' : 'false').as(
      'suppression'
    )
  )

  q.select(
    titreDemarcheModificationQuery('titresDemarches', user).as('modification')
  )

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
    titresQueryModify(
      a as QueryBuilder<Titres, Titres | Titres[]>,
      fields,
      user
    )
  )

  // fileCreate('sql.sql', format(q.toKnexQuery().toString()))

  return q
}

const titreDemarcheModificationQuery = (
  demarcheAlias: string,
  user?: IUtilisateur
) => {
  if (permissionCheck(user?.permissionId, ['super'])) {
    return raw('not exists(?)', [titreDemarcheEtapesQuery(demarcheAlias)])
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur']) &&
    user?.administrations?.length
  ) {
    const administrationsIds = user.administrations.map(a => a.id) || []

    return titresAdministrationsModificationQuery(
      administrationsIds,
      'demarches'
    )
      .whereRaw('?? = ??', ['titresModification.id', 'titresDemarches.titreId'])
      .whereNotExists(titreDemarcheEtapesQuery(demarcheAlias))
  }

  return raw('false')
}

const titreDemarcheEtapesQuery = (demarcheAlias: string) =>
  TitresEtapes.query()
    .alias('titresDemarchesEtapes')
    .whereRaw('?? = ??', [
      'titresDemarchesEtapes.titreDemarcheId',
      `${demarcheAlias}.id`
    ])

const titreEtapesCreationQuery = (
  demarcheAlias: string,
  user?: IUtilisateur
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
