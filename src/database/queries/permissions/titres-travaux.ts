import { IFields, IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Titres from '../../models/titres'
import TitresTravauxEtapes from '../../models/titres-travaux-etapes'
import TitresTravaux from '../../models/titres-travaux'

import { titresTravauxEtapesQueryModify } from './titres-travaux-etapes'
import { titresQueryModify } from './titres'
import { administrationsTitresQuery } from './administrations'
import { entreprisesTitresQuery } from './entreprises'

const titresTravauxQueryModify = (
  q: QueryBuilder<TitresTravaux, TitresTravaux | TitresTravaux[]>,
  fields?: IFields,
  user?: IUtilisateur
) => {
  q.select('titresTravaux.*').leftJoinRelated('titre')

  if (!user || !permissionCheck(user.permissionId, ['super'])) {
    q.whereExists(
      titresQueryModify(
        (TitresTravaux.relatedQuery('titre') as QueryBuilder<
          Titres,
          Titres | Titres[]
        >).alias('titres'),
        fields,
        user
      )
    )

    q.where(b => {
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
      }

      // les entreprises peuvent voir les démarches
      // des titres dont elles sont titulaires ou amodiataires
      // si elles sont visibles aux entreprises
      else if (
        permissionCheck(user?.permissionId, ['entreprise']) &&
        user?.entreprises?.length
      ) {
        const entreprisesIds = user.entreprises.map(e => e.id)

        b.whereExists(
          entreprisesTitresQuery(entreprisesIds, 'titre', {
            isTitulaire: true,
            isAmodiataire: true
          })
        )
      }
    })
  }

  q.select(
    raw(permissionCheck(user?.permissionId, ['super']) ? 'true' : 'false').as(
      'suppression'
    )
  )

  q.select(
    raw(
      permissionCheck(user?.permissionId, ['super', 'admin', 'editeur'])
        ? 'true'
        : 'false'
    ).as('modification')
  )

  q.select(
    raw(
      permissionCheck(user?.permissionId, ['super', 'admin', 'editeur'])
        ? 'true'
        : 'false'
    ).as('etapesCreation')
  )

  q.modifyGraph('etapes', b => {
    titresTravauxEtapesQueryModify(
      b as QueryBuilder<
        TitresTravauxEtapes,
        TitresTravauxEtapes | TitresTravauxEtapes[]
      >,
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

  return q
}

export { titresTravauxQueryModify }
