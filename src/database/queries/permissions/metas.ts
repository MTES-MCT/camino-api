import { IUtilisateur, IAdministration } from '../../../types'
// import fileCreate from '../../../tools/file-create'
// import { format } from 'sql-formatter'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import AdministrationsTitresTypes from '../../models/administrations-titres-types'
import Domaines from '../../models/domaines'
import TitresTypes from '../../models/titres-types'
import DemarchesTypes from '../../models/demarches-types'
import TravauxTypes from '../../models/travaux-types'
import EtapesTypes from '../../models/etapes-types'
import Titres from '../../models/titres'
import TitresDemarches from '../../models/titres-demarches'
import TitresEtapes from '../../models/titres-etapes'
import TitresTypesDemarchesTypesEtapesTypes from '../../models/titres-types--demarches-types-etapes-types'
import TitresActivites from '../../models/titres-activites'
import ActivitesTypes from '../../models/activites-types'
import Permissions from '../../models/permissions'
import TitresTravaux from '../../models/titres-travaux'

import {
  titresModificationQueryBuild,
  titresRestrictionsAdministrationQueryBuild
} from './titres'

// récupère les types d'étapes qui ont
// - les autorisations sur le titre
// - pas de restrictions sur le type d'étape
// -> retourne un booléen pour chaque ligne contenant :
// - 'titresModification.id': id du titre sur lequel l'utilisateur a des droits
// - 'demarchesModification.id': id de la démarche
// - 't_d_e.etapeTypeId': id du type d'étape'
const etapesTypesModificationQueryBuild = (
  administrations: IAdministration[],
  modification: boolean
) =>
  TitresTypesDemarchesTypesEtapesTypes.query()
    .alias('t_d_e')
    .select(raw('true'))
    .leftJoin(
      'titres as titresModification',
      raw('?? = ??', ['t_d_e.titreTypeId', 'titresModification.typeId'])
    )
    .leftJoin(
      'titresDemarches as demarchesModification',
      raw('?? = ?? and ?? = ??', [
        'demarchesModification.typeId',
        't_d_e.demarcheTypeId',
        'demarchesModification.titreId',
        'titresModification.id'
      ])
    )
    .whereExists(
      titresRestrictionsAdministrationQueryBuild(administrations, 'etapes')
        // l'utilisateur est dans au moins une administration
        // qui n'a pas de restriction 'creationInterdit' sur ce type d'étape / type de titre
        .leftJoin(
          'administrations__titresTypes__etapesTypes as a_tt_et',
          raw('?? = ?? and ?? = ?? and ?? = ?? and ?? = true', [
            'a_tt_et.administrationId',
            'administrations.id',
            'a_tt_et.titreTypeId',
            't_d_e.titreTypeId',
            'a_tt_et.etapeTypeId',
            't_d_e.etapeTypeId',
            `a_tt_et.${modification ? 'modification' : 'creation'}Interdit`
          ])
        )
        .whereNull('a_tt_et.administrationId')
    )

const titresTypesPermissionsQueryBuild = (
  q: QueryBuilder<TitresTypes, TitresTypes | TitresTypes[]>,
  user?: IUtilisateur
) => {
  q.select('titresTypes.*')

  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('titresCreation'))
  } else if (
    permissionCheck(user?.permissionId, ['admin']) &&
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
        AdministrationsTitresTypes.query()
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

  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('titresCreation'))
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur', 'lecteur']) &&
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
        AdministrationsTitresTypes.query()
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
    // - l'étape n'est pas unique
    // - ou si
    //   - il n'y a aucune étape du même type au sein de la démarche
    //   - l'id de l'étape est différente de l'étape éditée
    // -> affiche le type d'étape
    q.where(b => {
      b.whereRaw('?? is not true', ['etapesTypes.unique'])
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

  if (!user || permissionCheck(user?.permissionId, ['defaut', 'entreprise'])) {
    // types d'étapes visibles pour les entreprises et utilisateurs déconnectés ou défaut

    q.where(b => {
      // visibilité des types d'étapes en tant que titulaire ou amodiataire
      if (permissionCheck(user?.permissionId, ['entreprise'])) {
        b.orWhere('entreprisesLecture', true)
      }

      // visibilité des types d'étapes publiques
      b.orWhere('publicLecture', true)
    })
  }

  // propriété 'etapesCreation' en fonction du profil de l'utilisateur
  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('etapesCreation'))
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    if (titreDemarcheId) {
      const etapesCreationQuery = etapesTypesModificationQueryBuild(
        user.administrations,
        !!titreEtapeId
      )
        .where('demarchesModification.id', titreDemarcheId)
        .whereRaw('?? = ??', ['t_d_e.etapeTypeId', 'etapesTypes.id'])

      // TODO: conditionner aux fields
      q.select(etapesCreationQuery.as('etapesCreation'))
    } else {
      q.select(raw('false').as('etapesCreation'))
    }
  } else {
    q.select(raw('false').as('etapesCreation'))
  }

  // fileCreate('dev/tmp/etapes-types.sql', format(q.toKnexQuery().toString()))
}

const travauxEtapesTypesPermissionQueryBuild = (
  q: QueryBuilder<EtapesTypes, EtapesTypes | EtapesTypes[]>,
  user?: IUtilisateur,
  {
    titreTravauxId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    titreTravauxEtapeId
  }: { titreTravauxId?: string; titreTravauxEtapeId?: string } = {}
) => {
  q.select('etapesTypes.*')

  // si titreDemarcheId
  // -> restreint aux types d'étapes du type de la démarche

  if (titreTravauxId) {
    q.whereExists(
      TitresTravaux.query()
        .findById(titreTravauxId)
        .joinRelated('titre')
        .join(
          'travauxTypes__etapesTypes as te',
          raw('?? = ?? and ?? = ??', [
            'te.etapeTypeId',
            'etapesTypes.id',
            'te.travauxTypeId',
            'titresTravaux.typeId'
          ])
        )
    )
  }

  // propriété 'etapesCreation' en fonction du profil de l'utilisateur
  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('etapesCreation'))
  } else {
    q.select(raw('false').as('etapesCreation'))
  }
}

const activitesTypesPermissionQueryBuild = (
  q: QueryBuilder<ActivitesTypes, ActivitesTypes | ActivitesTypes[]>,
  user?: IUtilisateur
) => {
  if (
    permissionCheck(user?.permissionId, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    const administrationsIds = user.administrations.map(e => e.id)

    q.joinRelated('administrations')
    q.whereIn('administrations.id', administrationsIds)
  } else if (
    permissionCheck(user?.permissionId, ['entreprise']) &&
    user?.entreprises?.length
  ) {
    const entreprisesIds = user.entreprises.map(e => e.id)

    q.where(b => {
      b.whereExists(
        TitresActivites.query()
          .alias('titresActivitesTitulaires')
          .joinRelated('titre.titulaires')
          .whereRaw('?? = ??', [
            'titresActivitesTitulaires.typeId',
            'activitesTypes.id'
          ])
          .whereIn('titre:titulaires.id', entreprisesIds)
      )
      b.orWhereExists(
        TitresActivites.query()
          .alias('titresActivitesAmodiataires')
          .joinRelated('titre.amodiataires')
          .whereRaw('?? = ??', [
            'titresActivitesAmodiataires.typeId',
            'activitesTypes.id'
          ])
          .whereIn('titre:amodiataires.id', entreprisesIds)
      )
    })
  } else if (!permissionCheck(user?.permissionId, ['super'])) {
    q.where(false)
  }
}

const demarchesTypesPermissionQueryBuild = (
  q: QueryBuilder<DemarchesTypes, DemarchesTypes | DemarchesTypes[]>,
  user?: IUtilisateur,
  {
    titreId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    titreDemarcheId
  }: { titreId?: string; titreDemarcheId?: string } = {}
) => {
  q.select('demarchesTypes.*')

  // si titreId
  // -> restreint aux types de démarches du type du titre
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
  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('demarchesCreation'))
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur', 'lecteur']) &&
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

const travauxTypesPermissionQueryBuild = (
  q: QueryBuilder<TravauxTypes, TravauxTypes | TravauxTypes[]>,
  user?: IUtilisateur,
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    titreId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    titreTravauxId
  }: { titreId?: string; titreTravauxId?: string } = {}
) => {
  q.select('travauxTypes.*')

  // propriété 'travauxCreation' selon le profil de l'utilisateur
  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('travauxCreation'))
  } else {
    q.select(raw('false').as('travauxCreation'))
  }
}

const permissionsPermissionQueryBuild = (
  q: QueryBuilder<Permissions, Permissions | Permissions[]>,
  user?: IUtilisateur
) => {
  // le super peut voir toutes les permissions sans restriction
  if (permissionCheck(user?.permissionId, ['super'])) {
    return q
  }

  // on retourne les permissions à partir de l'ordre suivant (éditeur)
  if (permissionCheck(user?.permissionId, ['admin'])) {
    return q.where('ordre', '>=', user!.permission.ordre + 1)
  }

  // un utilisateur ni super ni admin nepeut voir aucune permission
  return q.where(false)
}

export {
  activitesTypesPermissionQueryBuild,
  demarchesTypesPermissionQueryBuild,
  domainesPermissionQueryBuild,
  etapesTypesModificationQueryBuild,
  etapesTypesPermissionQueryBuild,
  permissionsPermissionQueryBuild,
  titresTypesPermissionsQueryBuild,
  travauxTypesPermissionQueryBuild,
  travauxEtapesTypesPermissionQueryBuild
}
