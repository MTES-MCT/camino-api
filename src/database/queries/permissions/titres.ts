import { QueryBuilder, raw } from 'objection'

import { IUtilisateur } from '../../../types'

// import sqlFormatter from 'sql-formatter'
// import fileCreate from '../../../tools/file-create'

import { permissionCheck } from '../../../tools/permission'

import Titres from '../../models/titres'
import TitresDemarches from '../../models/titres-demarches'
import TitresTravaux from '../../models/titres-travaux'
import TitresActivites from '../../models/titres-activites'

import {
  titresActivitesQueryModify,
  titresActivitesPropsQueryModify,
  titreActivitesCount
} from './titres-activites'
import { titresDemarchesQueryModify } from './titres-demarches'
import { titresTravauxQueryModify } from './titres-travaux'
import {
  administrationsTitresTypesTitresStatutsModify,
  administrationsTitresQuery
} from './administrations'
import { entreprisesTitresQuery } from './entreprises'

const titresAdministrationsModificationQuery = (
  administrationsIds: string[],
  type: 'titres' | 'demarches'
) =>
  Titres.query()
    .alias('titresModification')
    .select(raw('true'))
    .whereExists(
      administrationsTitresQuery(administrationsIds, 'titresModification', {
        isGestionnaire: true
      }).modify(
        administrationsTitresTypesTitresStatutsModify,
        type,
        'titresModification'
      )
    )

const titresQueryModify = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  user: IUtilisateur | null
) => {
  q.select('titres.*')

  // si
  // - l'utilisateur n'est pas connecté
  // - ou l'utilisateur n'est pas super
  // alors il ne voit que les titres publics et ceux auxquels son entité est reliée

  if (!user || !permissionCheck(user?.permissionId, ['super'])) {
    q.where(b => {
      b.where('titres.publicLecture', true)

      // si l'utilisateur est `entreprise`
      if (
        permissionCheck(user?.permissionId, ['entreprise']) &&
        user?.entreprises?.length
      ) {
        // titres dont il est titulaire ou amodiataire
        const entreprisesIds = user.entreprises.map(e => e.id)

        b.orWhere(c => {
          c.where('titres.entreprisesLecture', true)

          c.whereExists(
            entreprisesTitresQuery(entreprisesIds, 'titres', {
              isTitulaire: true,
              isAmodiataire: true
            })
          )
        })
      }

      // si l'utilisateur est `administration`
      else if (
        permissionCheck(user?.permissionId, ['admin', 'editeur', 'lecteur']) &&
        user?.administrations?.length
      ) {
        // titres dont l'administration de l'utilisateur est
        // - administrationsGestionnaire
        // - ou administrationsLocale
        // - ou administration associée
        const administrationsIds = user.administrations.map(a => a.id)

        b.orWhereExists(
          administrationsTitresQuery(administrationsIds, 'titres', {
            isGestionnaire: true,
            isAssociee: true,
            isLocale: true
          })
        )
      }
    })

    // fileCreate('test.sql', sqlFormatter.format(q.toKnexQuery().toString()))
  }

  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('suppression'))
    q.select(raw('true').as('demarchesCreation'))
    q.select(raw('true').as('travauxCreation'))
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur']) &&
    user?.administrations?.length
  ) {
    const administrationsIds = user.administrations.map(a => a.id) || []

    q.select(
      administrationsTitresQuery(administrationsIds, 'titres', {
        isGestionnaire: true
      })
        .modify(
          administrationsTitresTypesTitresStatutsModify,
          'titres',
          'titres'
        )
        .select(raw('true'))
        .as('modification')
    )
    q.select(raw('false').as('suppression'))
    q.select(
      administrationsTitresQuery(administrationsIds, 'titres', {
        isGestionnaire: true
      })
        .modify(
          administrationsTitresTypesTitresStatutsModify,
          'demarches',
          'titres'
        )
        .select(raw('true'))
        .as('demarchesCreation')
    )
    q.select(
      administrationsTitresQuery(administrationsIds, 'titres', {
        isGestionnaire: true,
        isLocale: true
      })
        .select(raw('true'))
        .as('travauxCreation')
    )
  } else {
    q.select(raw('false').as('modification'))
    q.select(raw('false').as('suppression'))
    q.select(raw('false').as('demarchesCreation'))
    q.select(raw('false').as('travauxCreation'))
  }

  // masque les administrations associées
  if (
    !user ||
    !permissionCheck(user?.permissionId, [
      'super',
      'admin',
      'editeur',
      'lecteur'
    ])
  ) {
    q.modifyGraph('administrationsGestionnaires', b => {
      b.whereRaw('?? is not true', ['associee'])
    })

    q.modifyGraph('administrationsLocales', b => {
      b.whereRaw('?? is not true', ['associee'])
    })
  }

  // visibilité des étapes
  q.modifyGraph('demarches', b => {
    titresDemarchesQueryModify(
      b as QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
      user
    )
  })

  // visibilité des travaux
  q.modifyGraph('travaux', b => {
    titresTravauxQueryModify(
      b as QueryBuilder<TitresTravaux, TitresTravaux | TitresTravaux[]>,
      user
    )
  })

  titreActivitesCount(q, user)

  // visibilité des activités
  q.modifyGraph('activites', b => {
    titresActivitesQueryModify(
      b as QueryBuilder<TitresActivites, TitresActivites | TitresActivites[]>,
      user
    )
    titresActivitesPropsQueryModify(
      b as QueryBuilder<TitresActivites, TitresActivites | TitresActivites[]>,
      user
    )
  })

  return q
}

export { titresQueryModify, titresAdministrationsModificationQuery }
