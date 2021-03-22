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

const titreTravauxModificationQuery = (
  travauxAlias: string,
  titreAlias: string,
  type: 'travaux' | 'etapes',
  user: IUtilisateur | null
) => {
  if (permissionCheck(user?.permissionId, ['super'])) {
    if (type === 'travaux') {
      return raw('not exists(?)', [titreTravauxEtapesQuery(travauxAlias)])
    }

    return raw('true')
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur']) &&
    user?.administrations?.length
  ) {
    const administrationsIds = user.administrations.map(a => a.id) || []

    const administrationTitreModification = administrationsTitresQuery(
      administrationsIds,
      titreAlias,
      {
        isGestionnaire: true,
        isLocale: true
      }
    )

    if (type === 'travaux') {
      administrationTitreModification.whereNotExists(
        titreTravauxEtapesQuery(travauxAlias)
      )
    }

    return administrationTitreModification.select(raw('true'))
  }

  return raw('false')
}

const titreTravauxEtapesQuery = (travauxAlias: string) =>
  TitresTravauxEtapes.query()
    .alias('titresTravauxEtapes')
    .whereRaw('?? = ??', [
      'titresTravauxEtapes.titreTravauxId',
      `${travauxAlias}.id`
    ])

const titresTravauxQueryModify = (
  q: QueryBuilder<TitresTravaux, TitresTravaux | TitresTravaux[]>,
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  q.select('titresTravaux.*').leftJoinRelated('titre')

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

    q.whereExists(administrationTitre)
  } else if (
    permissionCheck(user?.permissionId, ['entreprise']) &&
    user?.entreprises?.length
  ) {
    const entreprisesIds = user.entreprises.map(e => e.id)

    q.whereExists(
      entreprisesTitresQuery(entreprisesIds, 'titre', {
        isTitulaire: true,
        isAmodiataire: true
      })
    )
  } else if (!permissionCheck(user?.permissionId, ['super'])) {
    q.where(false)
  }

  q.select(
    raw(permissionCheck(user?.permissionId, ['super']) ? 'true' : 'false').as(
      'suppression'
    )
  )

  q.select(
    titreTravauxModificationQuery('titresTravaux', 'titre', 'travaux', user).as(
      'modification'
    )
  )

  q.select(
    titreTravauxModificationQuery('titresTravaux', 'titre', 'etapes', user).as(
      'etapesCreation'
    )
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
      { fields },
      user
    )
  )

  return q
}

export { titresTravauxQueryModify, titreTravauxModificationQuery }
