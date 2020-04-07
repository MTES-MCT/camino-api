import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import { AutorisationsTitresTypesAdministrations } from '../../models/autorisations'
import Administrations from '../../models/administrations'
import Titres from '../../models/titres'
import TitresEtapes from '../../models/titres-etapes'
import TitresDemarches from '../../models/titres-demarches'

import { titreEtapesPermissionQueryBuild } from './titres-etapes'
import { titrePermissionQueryBuild } from './titres'

const titreDemarchePermissionQueryBuild = (
  q: QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
  user?: IUtilisateur
) => {
  q.select('titresDemarches.*')

  console.log('modifying les demarches')

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
    // propriété 'modification'
    q.select(
      raw('(case when ?? is not null then true else false end)', [
        'titresModification.id'
      ]).as('modification')
    )

    const administrationsIds = user.administrations.map(a => a.id) || []

    const titresModificationQuery = Titres.query()
      .alias('titresModification')
      .select('titresModification.id')
      // l'utilisateur fait partie d'une administrations
      // qui a les droits sur le type de titre
      .whereExists(
        AutorisationsTitresTypesAdministrations.query()
          .whereIn(
            'a__titresTypes__administrations.administrationId',
            administrationsIds
          )
          .andWhereRaw(`?? = ??`, [
            'a__titresTypes__administrations.titreTypeId',
            'titresModification.typeId'
          ])
      )
      // l'utilisateur est dans au moins une administration
      // qui n'a pas de restriction 'demarchesModificationInterdit' sur ce type / statut de titre
      .whereExists(
        Administrations.query()
          .leftJoin(
            'r__titresTypes__titresStatuts__administrations',
            raw('?? = ?? and ?? = ?? and ?? = ?? and ?? is true', [
              'r__titresTypes__titresStatuts__administrations.administrationId',
              'administrations.id',
              'r__titresTypes__titresStatuts__administrations.titreTypeId',
              'titresModification.typeId',
              'r__titresTypes__titresStatuts__administrations.titreStatutId',
              'titresModification.statutId',
              'r__titresTypes__titresStatuts__administrations.demarchesModificationInterdit'
            ])
          )
          .whereIn('administrations.id', administrationsIds)
          .whereNull(
            'r__titresTypes__titresStatuts__administrations.administrationId'
          )
      )

    q.leftJoin(
      titresModificationQuery.as('titresModification'),
      raw('?? = ??', ['titresModification.id', 'titresDemarches.titreId'])
    )

    // TODO: conditionner aux fields
    // propriété 'etapesCreation'
    q.select(
      raw('(case when ?? is not null then true else false end)', [
        'etapesCreation.id'
      ]).as('etapesCreation')
    )

    // propriété 'etapesCreation'
    const etapesCreationQuery = TitresDemarches.query()
      .joinRelated('[titre, type]')
      .join(
        'titresTypes__demarchesTypes__etapesTypes as tde',
        raw('?? = ?? and ?? = ??', [
          'tde.titreTypeId',
          'titre.typeId',
          'tde.demarcheTypeId',
          'titresDemarches.typeId'
        ])
      )
      .select('titresDemarches.id')
      // l'utilisateur fait partie d'une administrations
      // qui a les droits sur le type de titre
      .whereExists(
        AutorisationsTitresTypesAdministrations.query()
          .whereIn(
            'a__titresTypes__administrations.administrationId',
            administrationsIds
          )
          .andWhereRaw(`?? = ??`, [
            'a__titresTypes__administrations.titreTypeId',
            'titre.typeId'
          ])
      )
      // l'utilisateur est dans au moins une administration
      // qui n'a pas de restriction 'etapesModificationInterdit' sur ce type / statut de titre
      .whereExists(
        Administrations.query()
          .leftJoin(
            'r__titresTypes__titresStatuts__administrations',
            raw('?? = ?? and ?? = ?? and ?? = ?? and ?? is true', [
              'r__titresTypes__titresStatuts__administrations.administrationId',
              'administrations.id',
              'r__titresTypes__titresStatuts__administrations.titreTypeId',
              'titre.typeId',
              'r__titresTypes__titresStatuts__administrations.titreStatutId',
              'titre.statutId',
              'r__titresTypes__titresStatuts__administrations.demarchesModificationInterdit'
            ])
          )
          .whereIn('administrations.id', administrationsIds)
          .whereNull(
            'r__titresTypes__titresStatuts__administrations.administrationId'
          )
      )
      // l'utilisateur est dans au moins une administration
      // qui n'a pas de restriction 'creationInterdit' sur ce type d'étape / type de titre
      .whereExists(
        Administrations.query()
          .leftJoin(
            'r__titresTypes__etapesTypes__administrations',
            raw('?? = ?? and ?? = ?? and ?? = ?? and ?? = true', [
              'r__titresTypes__etapesTypes__administrations.administrationId',
              'administrations.id',
              'r__titresTypes__etapesTypes__administrations.titreTypeId',
              'titre.typeId',
              'r__titresTypes__etapesTypes__administrations.etapeTypeId',
              'tde.etapeTypeId',
              'r__titresTypes__etapesTypes__administrations.creationInterdit'
            ])
          )
          .whereIn('administrations.id', administrationsIds)
          .whereNull(
            'r__titresTypes__etapesTypes__administrations.administrationId'
          )
      )
      .groupBy('titresDemarches.id')

    q.leftJoin(
      etapesCreationQuery.as('etapesCreation'),
      raw('?? = ??', ['etapesCreation.id', 'titresDemarches.id'])
    )
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

  // q.modifyGraph('type', (te, ...args) => {
  //   console.log({ args })

  //   demarchesTypesPermissionQueryBuild(
  //     te as QueryBuilder<DemarchesTypes, DemarchesTypes | DemarchesTypes[]>,
  //     user
  //   )
  // })

  // fileCreate(
  //   'tmp/titres-demarches.sql',
  //   sqlFormatter.format(q.toKnexQuery().toString())
  // )

  return q
}

export { titreDemarchePermissionQueryBuild }
