import { IUtilisateur, IAdministration } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import {
  AutorisationsDomaines,
  AutorisationsTitresTypesAdministrations
} from '../../models/autorisations'
import Domaines from '../../models/domaines'
import TitresTypes from '../../models/titres-types'
import DemarchesTypes from '../../models/demarches-types'
import EtapesTypes from '../../models/etapes-types'
import Titres from '../../models/titres'
import TitresDemarches from '../../models/titres-demarches'
import TitresEtapes from '../../models/titres-etapes'
import Administrations from '../../models/administrations'

const restrictionsAdministrationsQueryBuild = (
  administrations: IAdministration[],
  type: 'titres' | 'demarches' | 'etapes'
) => {
  const administrationsIds = administrations.map(a => a.id) || []
  const administrationsIdsReplace = administrationsIds.map(() => '?')

  const restrictionsQuery = Administrations.query()
    // l'utilisateur fait partie d'une administrations
    // qui a les droits sur le type de titre
    .join(
      'a__titresTypes__administrations as a_t_a',
      raw(`?? = ?? and ?? = ?? and ?? in (${administrationsIdsReplace})`, [
        'a_t_a.administrationId',
        'administrations.id',
        'a_t_a.titreTypeId',
        'titresModification.typeId',
        'administrations.id',
        ...administrationsIds
      ])
    )
    // l'utilisateur est dans au moins une administration
    // qui n'a pas de restriction '${type}ModificationInterdit' sur ce type / statut de titre
    .leftJoin(
      'r__titresTypes__titresStatuts__administrations as r_t_s_a',
      raw('?? = ?? and ?? = ?? and ?? = ?? and ?? is true', [
        'r_t_s_a.administrationId',
        'administrations.id',
        'r_t_s_a.titreTypeId',
        'titresModification.typeId',
        'r_t_s_a.titreStatutId',
        'titresModification.statutId',
        `r_t_s_a.${type}ModificationInterdit`
      ])
    )
    .whereNull('r_t_s_a.administrationId')

  return restrictionsQuery
}

const etapesTypesModificationQueryBuild = (
  administrations: IAdministration[],
  modification: boolean
) =>
  Titres.query()
    .alias('titresModification')
    .select(raw('true'))
    .join(
      'titresDemarches as demarchesModification',
      raw('?? = ??', ['demarchesModification.titreId', 'titresModification.id'])
    )
    .join(
      'titresEtapes as etapesModification',
      raw('?? = ??', [
        'etapesModification.titreDemarcheId',
        'demarchesModification.id'
      ])
    )
    .join(
      'titresTypes__demarchesTypes__etapesTypes as t_d_e',
      raw('?? = ?? and ?? = ?? and ?? = ??', [
        't_d_e.titreTypeId',
        'titresModification.typeId',
        't_d_e.demarcheTypeId',
        'demarchesModification.typeId',
        't_d_e.etapeTypeId',
        'etapesModification.typeId'
      ])
    )
    .whereExists(
      restrictionsAdministrationsQueryBuild(administrations, 'etapes')
        // l'utilisateur est dans au moins une administration
        // qui n'a pas de restriction 'creationInterdit' sur ce type d'étape / type de titre
        .leftJoin(
          'r__titresTypes__etapesTypes__administrations as r_t_e_a',
          raw('?? = ?? and ?? = ?? and ?? = ?? and ?? = true', [
            'r_t_e_a.administrationId',
            'administrations.id',
            'r_t_e_a.titreTypeId',
            'etapesModification.typeId',
            'r_t_e_a.etapeTypeId',
            't_d_e.etapeTypeId',
            `r_t_e_a.${modification ? 'modification' : 'creation'}Interdit`
          ])
        )
        .whereNull('r_t_e_a.administrationId')
    )

const etapesCreationQueryBuild = (administrations: IAdministration[]) =>
  Titres.query()
    .alias('titresModification')
    .select(raw('true'))
    .join(
      'titresDemarches as demarchesModification',
      raw('?? = ??', ['demarchesModification.id', 'titresDemarches.id'])
    )
    .join(
      'titresTypes__demarchesTypes__etapesTypes as t_d_e',
      raw('?? = ?? and ?? = ??', [
        't_d_e.titreTypeId',
        'titresModification.typeId',
        't_d_e.demarcheTypeId',
        'titresDemarches.typeId'
      ])
    )
    .whereExists(
      restrictionsAdministrationsQueryBuild(administrations, 'etapes')
        // l'utilisateur est dans au moins une administration
        // qui n'a pas de restriction 'creationInterdit' sur ce type d'étape / type de titre
        .leftJoin(
          'r__titresTypes__etapesTypes__administrations as r_t_e_a',
          raw('?? = ?? and ?? = ?? and ?? = ?? and ?? = true', [
            'r_t_e_a.administrationId',
            'administrations.id',
            'r_t_e_a.titreTypeId',
            'titresModification.typeId',
            'r_t_e_a.etapeTypeId',
            't_d_e.etapeTypeId',
            'r_t_e_a.creationInterdit'
          ])
        )
        .whereNull('r_t_e_a.administrationId')
    )
    .whereRaw('?? = ??', ['titresModification.id', 'titresDemarches.titreId'])
    .groupBy('demarchesModification.id')

const titresModificationQueryBuild = (
  administrations: IAdministration[],
  type: 'titres' | 'demarches'
) =>
  Titres.query()
    .alias('titresModification')
    .select(raw('true'))
    .whereExists(restrictionsAdministrationsQueryBuild(administrations, type))

const titresTypesPermissionsQueryBuild = (
  q: QueryBuilder<TitresTypes, TitresTypes | TitresTypes[]>,
  user?: IUtilisateur
) => {
  q.select('titresTypes.*')

  if (permissionCheck(user, ['super'])) {
    q.select(raw('true').as('titresCreation'))
  } else if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    q.select(
      raw('(case when ?? is not null then true else false end)', [
        'titresCreation.id'
      ]).as('titresCreation')
    )

    const administrationsIds = user.administrations.map(e => e.id)

    const titresCreationQuery = TitresTypes.query()
      .select('titresTypes.id')
      // l'utilisateur fait partie d'une administrations
      // qui a les droits sur le type de titre
      .whereExists(
        AutorisationsTitresTypesAdministrations.query()
          .alias('tta')
          .whereRaw('?? = ??', ['tta.titreTypeId', 'titresTypes.id'])
          .whereIn('tta.administrationId', administrationsIds)
          .where('tta.gestionnaire', true)
      )

    q.leftJoin(
      titresCreationQuery.as('titresCreation'),
      'titresCreation.id',
      'titresTypes.id'
    )
  } else {
    q.select(raw('false').as('titresCreation'))
  }
}

const domainesPermissionQueryBuild = (
  q: QueryBuilder<Domaines, Domaines | Domaines[]>,
  user?: IUtilisateur
) => {
  q.select('domaines.*')

  if (!user || permissionCheck(user, ['entreprise', 'defaut'])) {
    q.whereExists(
      (Domaines.relatedQuery('autorisation') as QueryBuilder<
        AutorisationsDomaines,
        AutorisationsDomaines | AutorisationsDomaines[]
      >).where({
        publicLecture: true
      })
    )
  }

  if (permissionCheck(user, ['super'])) {
    q.select(raw('true').as('titresCreation'))
  } else if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    q.select(
      raw('(case when ?? is not null then true else false end)', [
        'domainesModification.domaineId'
      ]).as('titresCreation')
    )

    const administrationsIds = user.administrations.map(e => e.id)

    const titresCreationQuery = TitresTypes.query()
      .select('titresTypes.domaineId')
      // l'utilisateur fait partie d'une administrations
      // qui a les droits sur le type de titre
      .whereExists(
        AutorisationsTitresTypesAdministrations.query()
          .alias('tta')
          .whereRaw('?? = ??', ['tta.titreTypeId', 'titresTypes.id'])
          .whereIn('tta.administrationId', administrationsIds)
          .where('tta.gestionnaire', true)
      )
      .groupBy('titresTypes.domaineId')

    q.leftJoin(
      titresCreationQuery.as('domainesModification'),
      'domainesModification.domaineId',
      'domaines.id'
    )
  } else {
    q.select(raw('false').as('titresCreation'))
  }

  q.modifyGraph('titresTypes', b => {
    titresTypesPermissionsQueryBuild(
      b as QueryBuilder<TitresTypes, TitresTypes | TitresTypes[]>,
      user
    )
  })
}

const etapesTypesPermissionQueryBuild = (
  q: QueryBuilder<EtapesTypes, EtapesTypes | EtapesTypes[]>,
  user?: IUtilisateur,
  {
    titreDemarcheId,
    titreEtapeId
  }: { titreDemarcheId?: string; titreEtapeId?: string } = {}
) => {
  q.select('etapesTypes.*')

  // si titreDemarcheId
  // -> restreint aux types d'étapes du type de la démarche

  if (titreDemarcheId) {
    q.whereExists(
      TitresDemarches.query()
        .findById(titreDemarcheId)
        .joinRelated('titre')
        .join(
          'titresTypes__demarchesTypes__etapesTypes as tde',
          raw('?? = ?? and ?? = ?? and ?? = ??', [
            'tde.etapeTypeId',
            'etapesTypes.id',
            'tde.demarcheTypeId',
            'titresDemarches.typeId',
            'tde.titreTypeId',
            'titre.typeId'
          ])
        )
    )

    // si
    // - l'étape a la propriété 'unique'
    // - ou si
    //   - il n'y a aucune étape du même type au sein de la démarche
    //   - l'id de l'étape est différente de l'étape éditée
    // -> affiche le type d'étape
    q.where(b => {
      b.where('unique', false)
      b.orWhere(c => {
        const d = TitresEtapes.query()
          .where({ titreDemarcheId })
          .whereRaw('?? = ??', ['typeId', 'etapesTypes.id'])

        if (titreEtapeId) {
          d.whereNot('id', titreEtapeId)
        }

        c.whereNotExists(d)
      })
    })
  }

  // propriété 'etapesCreation' en fonction du profil de l'utilisateur
  if (permissionCheck(user, ['super'])) {
    q.select(raw('true').as('etapesCreation'))
  } else if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    if (titreDemarcheId) {
      const etapesCreationQuery = etapesTypesModificationQueryBuild(
        user.administrations,
        !!titreEtapeId
      )
        .where('etapesModification.titreDemarcheId', titreDemarcheId)
        .whereRaw('?? = ??', ['etapesModification.typeId', 'etapesTypes.id'])

      // TODO: conditionner aux fields
      q.select(etapesCreationQuery.as('etapesCreation'))
    } else {
      q.select(raw('false').as('etapesCreation'))
    }
  } else {
    q.select(raw('false').as('etapesCreation'))
  }
}

const demarchesTypesPermissionQueryBuild = (
  q: QueryBuilder<DemarchesTypes, DemarchesTypes | DemarchesTypes[]>,
  user?: IUtilisateur,
  {
    titreId,
    titreDemarcheId
  }: { titreId?: string; titreDemarcheId?: string } = {}
) => {
  q.select('demarchesTypes.*')

  // si titreId
  // -> restreint aux types de démraches du type du titre
  if (titreId) {
    q.whereExists(
      Titres.query()
        .findById(titreId)
        .joinRelated('type.demarchesTypes')
        .whereRaw('?? = ??', ['type:demarchesTypes.id', 'demarchesTypes.id'])
    )

    // TODO: ajouter et gérer la propriété unique
    // si
    // - la démarche a la propriété 'unique'
    // - ou si
    //   - il n'y a aucune démarche du même type au sein du titre
    //   - l'id de la démarche est différente de la démarche éditée
    // -> affiche le type de démarche
  }

  // propriété 'demarchesCreation' selon le profil de l'utilisateur
  if (permissionCheck(user, ['super'])) {
    q.select(raw('true').as('demarchesCreation'))
  } else if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    if (titreId) {
      const titresModificationQuery = titresModificationQueryBuild(
        user.administrations,
        'demarches'
      ).where('titresModification.id', titreId)

      q.select(titresModificationQuery.as('demarchesCreation'))
    }
  } else {
    q.select(raw('false').as('demarchesCreation'))
  }
}

export {
  domainesPermissionQueryBuild,
  titresTypesPermissionsQueryBuild,
  etapesTypesPermissionQueryBuild,
  etapesTypesModificationQueryBuild,
  etapesCreationQueryBuild,
  titresModificationQueryBuild,
  demarchesTypesPermissionQueryBuild
}
