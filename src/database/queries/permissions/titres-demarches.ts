import { IFields, IUtilisateur } from '../../../types'
// import { format } from 'sql-formatter'
// import fileCreate from '../../../tools/file-create'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Titres from '../../models/titres'
import TitresEtapes from '../../models/titres-etapes'
import TitresDemarches from '../../models/titres-demarches'

import { titreEtapesPermissionQueryBuild } from './titres-etapes'
import {
  titrePermissionQueryBuild,
  titresModificationQueryBuild
} from './titres'
import { etapesTypesModificationQueryBuild } from './metas'

const titreDemarchePermissionQueryBuild = (
  q: QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
  fields?: IFields,
  user?: IUtilisateur
) => {
  q.select('titresDemarches.*')

  // seuls les super-admins peuvent voir toutes les démarches
  if (!permissionCheck(user?.permissionId, ['super'])) {
    // l'utilisateur peut voir le titre
    q.whereExists(
      titrePermissionQueryBuild(
        (TitresDemarches.relatedQuery('titre') as QueryBuilder<
          Titres,
          Titres | Titres[]
        >).alias('titres'),
        fields,
        user
      )
    )

    q.where(b => {
      // la démarche est publique
      b.where('titresDemarches.publicLecture', true)

      // les administrations peuvent voir toutes les démarches
      // des titres pour dont elles sont gestionnaires ou locales
      if (
        permissionCheck(user?.permissionId, ['admin', 'editeur', 'lecteur']) &&
        user?.administrations?.length
      ) {
        const administrationsIds = user.administrations.map(e => e.id)

        b.orWhere(c => {
          c.where(d => {
            d.whereExists(
              Titres.query()
                .alias('administrationsGestionnairesTitres')
                .joinRelated('administrationsGestionnaires')
                .whereRaw('?? = ??', [
                  'administrationsGestionnairesTitres.id',
                  'titresDemarches.titreId'
                ])
                .whereIn('administrationsGestionnaires.id', administrationsIds)
            )
            d.orWhereExists(
              Titres.query()
                .alias('administrationsLocalesTitres')
                .joinRelated('administrationsLocales')
                .whereRaw('?? = ??', [
                  'administrationsLocalesTitres.id',
                  'titresDemarches.titreId'
                ])
                .whereIn('administrationsLocales.id', administrationsIds)
            )
          })
        })
      }

      // les entreprises peuvent voir les démarches
      // des titres dont elles sont titulaires ou amodiataires
      // si elles sont visibles aux entreprises
      else if (
        permissionCheck(user?.permissionId, ['entreprise']) &&
        user?.entreprises?.length
      ) {
        const entreprisesIds = user.entreprises.map(e => e.id)

        b.orWhere(c => {
          c.where('titresDemarches.entreprisesLecture', true)

          c.where(d => {
            d.whereExists(
              Titres.query()
                .alias('titulaireTitres')
                .joinRelated('titulaires')
                .whereRaw('?? = ??', [
                  'titulaireTitres.id',
                  'titresDemarches.titreId'
                ])
                .whereIn('titulaires.id', entreprisesIds)
            )
            d.orWhereExists(
              Titres.query()
                .alias('amodiataireTitres')
                .joinRelated('amodiataires')
                .whereRaw('?? = ??', [
                  'amodiataireTitres.id',
                  'titresDemarches.titreId'
                ])
                .whereIn('amodiataires.id', entreprisesIds)
            )

            // On devrait pouvoir faire le lien directement sur la related query
            // comme dans titrePermissionQueryBuild
            // mais objection.js s'embrouille dans les alias
            // à creuser
            //
            // d.whereExists(
            //   (Titres.relatedQuery('titulaires') as QueryBuilder<
            //     Entreprises,
            //     Entreprises | Entreprises[]
            //   >)
            //     .as('toto')
            //     .whereIn('toto.id', entreprisesIds)
            //     .for('titresDemarches.titreId')
            // )
            // d.orWhereExists(
            //   (Titres.relatedQuery('amodiataires') as QueryBuilder<
            //     Entreprises,
            //     Entreprises | Entreprises[]
            //   >)
            //     .as('titi')
            //     .whereIn('titi.id', entreprisesIds)
            //     .for('titresDemarches.titreId')
            // )
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

  // fileCreate('test-3.sql', format(q.toKnexQuery().toString()))

  return q
}

export { titreDemarchePermissionQueryBuild }
