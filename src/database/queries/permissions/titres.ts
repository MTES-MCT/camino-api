import { IAdministration, IFields, IUtilisateur } from '../../../types'

import { QueryBuilder, raw } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Titres from '../../models/titres'
import TitresDemarches from '../../models/titres-demarches'
import TitresTravaux from '../../models/titres-travaux'
import TitresActivites from '../../models/titres-activites'

import Administrations from '../../models/administrations'
import Entreprises from '../../models/entreprises'

import {
  titreActivitePermissionQueryBuild,
  titreActiviteQueryPropsBuild,
  titreActivitesCalc
} from './titres-activites'
import { titreDemarchePermissionQueryBuild } from './titres-demarches'
import { titreTravauxPermissionQueryBuild } from './titres-travaux'
import {
  administrationsTitresTypesTitresStatutsModifier,
  administrationsGestionnairesModifier
} from './administrations'

const titresModificationQueryBuild = (
  administrations: IAdministration[],
  type: 'titres' | 'demarches' | 'etapes'
) =>
  Titres.query()
    .alias('titresModification')
    .select(raw('true'))
    .whereExists(
      Administrations.query()
        .modify(
          administrationsTitresTypesTitresStatutsModifier,
          type,
          'titresModification'
        )
        .modify(
          administrationsGestionnairesModifier,
          administrations,
          'titresModification'
        )
        .whereNotNull('a_tt.administrationId')
    )

const titrePermissionQueryBuild = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  fields?: IFields,
  user?: IUtilisateur
) => {
  q.select('titres.*')

  const administrationMinistereCheck = user?.administrations?.some(
    a => a.type?.id === 'min'
  )

  // si
  // - l'utilisateur n'est pas connecté
  // - ou l'utilisateur appartient à une entreprise
  // - ou l'utilisateur appartient à une administration (autre qu'un ministère)
  // alors il ne voit que les titres publics et ceux auxquels son entité est reliée
  if (
    !user ||
    permissionCheck(user?.permissionId, ['entreprise', 'defaut']) ||
    (permissionCheck(user?.permissionId, ['admin', 'editeur', 'lecteur']) &&
      !administrationMinistereCheck)
  ) {
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

          c.where(d => {
            d.whereExists(
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

      // si l'utilisateur est `administration`
      else if (
        permissionCheck(user?.permissionId, ['admin', 'editeur', 'lecteur']) &&
        user?.administrations?.length
      ) {
        // titres dont il est administrationsGestionnaire ou administrationsLocale
        const administrationsIds = user.administrations.map(a => a.id)

        b.orWhere(c => {
          c.whereExists(
            (Titres.relatedQuery(
              'administrationsGestionnaires'
            ) as QueryBuilder<
              Administrations,
              Administrations | Administrations[]
            >).whereIn('administrationsGestionnaires.id', administrationsIds)
          )
          c.orWhereExists(
            (Titres.relatedQuery('administrationsLocales') as QueryBuilder<
              Administrations,
              Administrations | Administrations[]
            >).whereIn('administrationsLocales.id', administrationsIds)
          )
        })
      }
    })
  }

  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('suppression'))
    q.select(raw('true').as('travauxCreation'))
  } else if (
    permissionCheck(user?.permissionId, ['admin']) &&
    user?.administrations?.length
  ) {
    const titresModificationQuery = titresModificationQueryBuild(
      user.administrations,
      'titres'
    ).whereRaw('?? = ??', ['titresModification.id', 'titres.id'])

    q.select(titresModificationQuery.as('modification'))
    q.select(raw('false').as('suppression'))
    q.select(raw('false').as('travauxCreation'))
  } else {
    q.select(raw('false').as('modification'))
    q.select(raw('false').as('suppression'))
    q.select(raw('false').as('travauxCreation'))
  }

  titreActivitesCalc(q, fields, user)

  // visibilité des étapes
  q.modifyGraph('demarches', b => {
    titreDemarchePermissionQueryBuild(
      b as QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
      fields,
      user
    )
  })

  // visibilité des travaux
  q.modifyGraph('travaux', b => {
    titreTravauxPermissionQueryBuild(
      b as QueryBuilder<TitresTravaux, TitresTravaux | TitresTravaux[]>,
      fields,
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

  return q
}

export { titrePermissionQueryBuild, titresModificationQueryBuild }
