import { IFields, IUtilisateur } from '../../../types'

// import * as sqlFormatter from 'sql-formatter'
// import fileCreate from '../../../tools/file-create'

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
  administrationsTitresTypesModifier,
  titreAdministrationQuery
} from './administrations'

const titresModificationQueryBuild = (
  administrationsIds: string[],
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
          administrationsTitresTypesModifier,
          administrationsIds,
          'titresModification',
          { isGestionnaire: true }
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
    a => a.typeId === 'min'
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
        // titres dont l'administration de l'utilisateur est
        // - administrationsGestionnaire
        // - ou administrationsLocale
        // - ou administration associée
        const administrationsIds = user.administrations.map(a => a.id)

        b.orWhereExists(
          titreAdministrationQuery(administrationsIds, 'titres', {
            isGestionnaire: true,
            isAssociee: true
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

    const titresModificationQuery = titresModificationQueryBuild(
      administrationsIds,
      'titres'
    ).whereRaw('?? = ??', ['titresModification.id', 'titres.id'])

    const demarchesCreationQuery = titresModificationQueryBuild(
      administrationsIds,
      'demarches'
    ).whereRaw('?? = ??', ['titresModification.id', 'titres.id'])

    q.select(titresModificationQuery.as('modification'))
    q.select(raw('false').as('suppression'))
    q.select(demarchesCreationQuery.as('demarchesCreation'))
    q.select(raw('false').as('travauxCreation'))
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

  titreActivitesCalc(q, fields, user)

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

  return q
}

export { titrePermissionQueryBuild, titresModificationQueryBuild }
