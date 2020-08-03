import { IFields, IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Titres from '../../models/titres'
import TitresTravauxEtapes from '../../models/titres-travaux-etapes'
import TitresTravaux from '../../models/titres-travaux'

import { titreTravauxEtapesPermissionQueryBuild } from './titres-travaux-etapes'
import { titrePermissionQueryBuild } from './titres'

const titreTravauxPermissionQueryBuild = (
  q: QueryBuilder<TitresTravaux, TitresTravaux | TitresTravaux[]>,
  fields?: IFields,
  user?: IUtilisateur
) => {
  q.select('titresTravaux.*')

  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('suppression'))
    q.select(raw('true').as('etapesCreation'))
  } else {
    q.select(raw('false').as('modification'))
    q.select(raw('false').as('suppression'))
    q.select(raw('false').as('etapesCreation'))
  }

  q.modifyGraph('etapes', te => {
    titreTravauxEtapesPermissionQueryBuild(
      te as QueryBuilder<
        TitresTravauxEtapes,
        TitresTravauxEtapes | TitresTravauxEtapes[]
      >,
      user
    )
  })

  q.modifyGraph('titre', a =>
    titrePermissionQueryBuild(
      a as QueryBuilder<Titres, Titres | Titres[]>,
      fields,
      user
    )
      // on group by titreId au cas où il y a une aggrégation
      // dans la requête de titre (ex : calc activités)
      .groupBy('titres.id')
  )

  return q
}

export { titreTravauxPermissionQueryBuild }
