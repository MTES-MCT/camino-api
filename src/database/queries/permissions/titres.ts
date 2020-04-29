import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Titres from '../../models/titres'
import TitresDemarches from '../../models/titres-demarches'
import TitresActivites from '../../models/titres-activites'

import Entreprises from '../../models/entreprises'

import {
  titreActivitesCalc,
  titreActivitePermissionQueryBuild,
  titreActiviteQueryPropsBuild
} from './titres-activites'
import { titreDemarchePermissionQueryBuild } from './titres-demarches'
import { titresModificationQueryBuild } from './metas'

const titrePermissionQueryBuild = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  user?: IUtilisateur
) => {
  q.select('titres.*')

  // titres publics
  if (!user || permissionCheck(user, ['entreprise', 'defaut'])) {
    q.where(b => {
      b.where('titres.publicLecture', true)

      // titre de l'entreprise
      if (permissionCheck(user, ['entreprise']) && user?.entreprises?.length) {
        // si l'utilisateur est `entreprise`,
        // titres dont il est titulaire ou amodiataire
        const entreprisesIds = user.entreprises.map(e => e.id)

        b.orWhere(c => {
          c.where('titres.entreprisesLecture', true)

          c.where(d => {
            d.orWhereExists(
              (Titres.relatedQuery('titulaires') as QueryBuilder<
                Entreprises,
                Entreprises | Entreprises[]
              >).whereIn('titulaires.id', entreprisesIds)
            )
            d.orWhereExists(
              (Titres.relatedQuery('amodiataires') as QueryBuilder<
                Entreprises,
                Entreprises | Entreprises[]
              >).whereIn('amodiataires.id', entreprisesIds)
            )
          })
        })
      }
    })
  }

  if (permissionCheck(user, ['super'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('suppression'))
  } else if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    const titresModificationQuery = titresModificationQueryBuild(
      user.administrations,
      'titres'
    ).whereRaw('?? = ??', ['titresModification.id', 'titres.id'])

    q.select(titresModificationQuery.as('modification'))
  } else {
    q.select(raw('false').as('modification'))
    q.select(raw('false').as('suppression'))
  }

  titreActivitesCalc(q, user)

  // visibilité des étapes
  q.modifyGraph('demarches', b => {
    titreDemarchePermissionQueryBuild(
      b as QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
      user
    )
  })

  // visibilité des activités
  q.modifyGraph('activites', b => {
    titreActivitePermissionQueryBuild(
      b as QueryBuilder<TitresActivites, TitresActivites | TitresActivites[]>,
      user
    )
    titreActiviteQueryPropsBuild(
      b as QueryBuilder<TitresActivites, TitresActivites | TitresActivites[]>,
      user
    )

  })

  if (
    !user ||
    !permissionCheck(user, ['super', 'admin', 'editeur', 'lecteur'])
  ) {
    q.modifyGraph('administrationsGestionnaires', b => {
      b.whereRaw('?? is not true', ['associee'])
    })

    q.modifyGraph('administrationsLocales', b => {
      b.whereRaw('?? is not true', ['associee'])
    })
  }

  return q
}

export { titrePermissionQueryBuild }
