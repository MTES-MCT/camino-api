import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Titres from '../../models/titres'
import TitresEtapes from '../../models/titres-etapes'
import TitresDemarches from '../../models/titres-demarches'

import { titreEtapesPermissionQueryBuild } from './titres-etapes'
import { titrePermissionQueryBuild } from './titres'
import {
  titresModificationQueryBuild,
  etapesTypesModificationQueryBuild
} from './metas'

const titreDemarchePermissionQueryBuild = (
  q: QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
  user?: IUtilisateur
) => {
  q.select('titresDemarches.*')

  // démarches publiques
  if (!user || permissionCheck(user?.permissionId, ['entreprise', 'defaut'])) {
    // visibilité du titre de la démarche
    q.whereExists(
      titrePermissionQueryBuild(
        (TitresDemarches.relatedQuery('titre') as QueryBuilder<
          Titres,
          Titres | Titres[]
        >).alias('titres'),
        user
      )
    )

    // visibilité de la démarche en fonction de son statut et du type de titre
    q.where(b => {
      // les démarches ayant le statut `acc` ou `ter` sont visibles au public
      b.where('titresDemarches.publicLecture', true)

      // les entreprises peuvent voir toutes les démarches
      // des titres pour lesquelles elles sont titulaires ou amodiataires
      // si elles sont visibles aux entreprisees
      if (
        permissionCheck(user?.permissionId, ['entreprise']) &&
        user?.entreprises?.length
      ) {
        const entreprisesIds = user.entreprises.map(e => e.id)

        b.orWhere(c => {
          c.where('titresDemarches.entreprisesLecture', true)

          c.where(d => {
            d.whereExists(
              Titres.query()
                .alias('titresTitulaires')
                .joinRelated('titulaires')
                .whereRaw('?? = ??', [
                  'titresTitulaires.id',
                  'titresDemarches.titreId'
                ])
                .whereIn('titulaires.id', entreprisesIds)
            )
            d.orWhereExists(
              Titres.query()
                .alias('titresAmodiataires')
                .joinRelated('amodiataires')
                .whereRaw('?? = ??', [
                  'titresAmodiataires.id',
                  'titresDemarches.titreId'
                ])
                .whereIn('amodiataires.id', entreprisesIds)
            )
          })
        })
      }
    })
  }

  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('suppression'))
    q.select(raw('true').as('etapesCreation'))
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    // TODO: conditionner aux fields

    // propriété 'titresModification'
    const titresModificationQuery = titresModificationQueryBuild(
      user.administrations,
      'demarches'
    ).whereRaw('?? = ??', ['titresModification.id', 'titresDemarches.titreId'])

    q.select(titresModificationQuery.as('modification'))

    // propriété 'modification'
    // récupère les types d'étape autorisés
    // pour tous les titres et démarches sur lesquels l'utilisateur a des droits
    const etapesCreationQuery = etapesTypesModificationQueryBuild(
      user.administrations,
      false
    )
      // filtre selon la démarche
      .whereRaw('?? = ??', ['demarchesModification.id', 'titresDemarches.id'])
      .groupBy('demarchesModification.id')

    // propriété 'etapesCreation'
    q.select(etapesCreationQuery.as('etapesCreation'))
    q.select(raw('false').as('suppression'))
  } else {
    q.select(raw('false').as('modification'))
    q.select(raw('false').as('suppression'))
    q.select(raw('false').as('etapesCreation'))
  }

  q.modifyGraph('etapes', te => {
    titreEtapesPermissionQueryBuild(
      te as QueryBuilder<TitresEtapes, TitresEtapes | TitresEtapes[]>,
      user
    )
  })

  return q
}

export { titreDemarchePermissionQueryBuild }
