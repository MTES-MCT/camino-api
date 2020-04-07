import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Titres from '../../models/titres'
import TitresEtapes from '../../models/titres-etapes'
import TitresDemarches from '../../models/titres-demarches'

import { titreEtapesPermissionQueryBuild } from './titres-etapes'
import { titrePermissionQueryBuild } from './titres'
import { etapesCreationQueryBuild, titresModificationQueryBuild } from './metas'

const titreDemarchePermissionQueryBuild = (
  q: QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
  user?: IUtilisateur
) => {
  q.select('titresDemarches.*')

  if (!user || permissionCheck(user, ['entreprise', 'defaut'])) {
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
      // sinon, les démarches visibles au public
      // ont le statut `acc` ou `ter`
      b.whereIn('titresDemarches.statutId', ['acc', 'ter'])

      // sauf pour les AXM et ARM
      // dont les démarches `rej` sont aussi visibles
      b.orWhere(c => {
        c.where('titresDemarches.statutId', 'rej')
        c.whereExists(
          (TitresDemarches.relatedQuery('titre') as QueryBuilder<
            Titres,
            Titres | Titres[]
          >).whereIn('titre.typeId', ['axm', 'arm'])
        )
      })

      // les entreprises peuvent voir toutes les démarches
      // des titres pour lesquelles elles sont titulaires ou amodiataires
      if (permissionCheck(user, ['entreprise']) && user?.entreprises?.length) {
        const entreprisesIds = user.entreprises.map(e => e.id)

        b.orWhere(c => {
          c.whereExists(
            Titres.query()
              .alias('titresTitulaires')
              .joinRelated('titulaires')
              .whereRaw('?? = ??', [
                'titresTitulaires.id',
                'titresDemarches.titreId'
              ])
              .whereIn('titulaires.id', entreprisesIds)
          )
          c.orWhereExists(
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
      }
    })
  }

  if (permissionCheck(user, ['super'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('suppression'))
    q.select(raw('true').as('etapesCreation'))
  } else if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    // TODO: conditionner aux fields

    // propriété 'titresModification'
    const titresModificationQuery = titresModificationQueryBuild(
      user.administrations,
      'demarches'
    ).whereRaw('?? = ??', ['titresModification.id', 'titresDemarches.titreId'])

    q.select(titresModificationQuery.as('titresModification'))

    // propriété 'etapesCreation'
    const etapesCreationQuery = etapesCreationQueryBuild(user.administrations)

    // propriété 'etapesCreation'
    q.select(etapesCreationQuery.as('etapesCreation'))
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
