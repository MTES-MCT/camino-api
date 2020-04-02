import { IUtilisateur, IPermissionId } from '../../types'

// import fileCreate from '../../tools/file-create'
// import * as sqlFormatter from 'sql-formatter'

import { raw, QueryBuilder } from 'objection'

import Titres from '../models/titres'
import TitresDemarches from '../models/titres-demarches'
import TitresEtapes from '../models/titres-etapes'
import TitresActivites from '../models/titres-activites'
import TitresDocuments from '../models/titres-documents'

import {
  AutorisationsDomaines,
  AutorisationsTitresTypesTitresStatuts,
  AutorisationsTitresTypesAdministrations,
  RestrictionsTitresTypesTitresStatutsAdministrations
} from '../models/autorisations'
import Entreprises from '../models/entreprises'
import Administrations from '../models/administrations'
import Utilisateurs from '../models/utilisateurs'

const permissionCheck = (
  user: IUtilisateur | undefined,
  permissions: IPermissionId[]
) => !!(user && permissions.includes(user?.permissionId))

const utilisateursPermissionQueryBuild = (
  q: QueryBuilder<Utilisateurs, Utilisateurs | Utilisateurs[]>,
  user?: IUtilisateur
) => {
  console.log('utilisateursPermissionQueryBuild')

  q.select('utilisateurs.*')

  if (
    permissionCheck(user, ['editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    // un utilisateur 'editeur' ou 'lecteur'
    // ne voit que les utilisateurs de son administration
    const administrationsIds = user.administrations.map(e => e.id)

    q.whereExists(
      (Utilisateurs.relatedQuery('administrations') as QueryBuilder<
        Administrations,
        Administrations | Administrations[]
      >).whereIn('administrations.id', administrationsIds)
    )
  } else if (
    permissionCheck(user, ['entreprise']) &&
    user?.entreprises?.length
  ) {
    // un utilisateur entreprise
    // ne voit que les utilisateurs de son entreprise
    const entreprisesIds = user.entreprises.map(e => e.id)

    q.whereExists(
      (Utilisateurs.relatedQuery('entreprises') as QueryBuilder<
        Entreprises,
        Entreprises | Entreprises[]
      >).whereIn('entreprises.id', entreprisesIds)
    )
  } else if (user && permissionCheck(user, ['defaut'])) {
    // un utilisateur "defaut" ne voit que son propre profil
    q.where('id', user.id)
  } else if (!user) {
    // un utilisateur non-authentifié ne voit aucun utilisateur
    q.limit(0)
  }

  if (permissionCheck(user, ['super', 'admin'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('suppression'))
    q.select(raw('true').as('permissionModification'))
  } else if (user) {
    q.select(
      raw('(case utilisateurs.id = ? then true else false end)', [user.id]).as(
        'modification'
      )
    )
    q.select(raw('false').as('suppression'))
    q.select(raw('false').as('permissionModification'))
  } else {
    q.select(raw('false').as('modification'))
    q.select(raw('false').as('suppression'))
    q.select(raw('false').as('permissionModification'))
  }

  // console.log(q.toKnexQuery().toString())

  return q
}

const entreprisePermissionQueryBuild = (
  q: QueryBuilder<Entreprises, Entreprises | Entreprises[]>,
  user?: IUtilisateur
) => {
  console.log('entreprisePermissionQueryBuild')

  q.select('entreprises.*')

  if (permissionCheck(user, ['super', 'admin', 'editeur'])) {
    q.select(raw('true').as('modification'))
  } else {
    q.select(raw('false').as('modification'))
  }

  q.modifyGraph('titresTitulaire', a =>
    titrePermissionQueryBuild(
      a as QueryBuilder<Titres, Titres | Titres[]>,
      user
    )
  )

  q.modifyGraph('titresAmodiataire', a =>
    titrePermissionQueryBuild(
      a as QueryBuilder<Titres, Titres | Titres[]>,
      user
    )
  )

  q.modifyGraph('utilisateurs', u =>
    utilisateursPermissionQueryBuild(
      u as QueryBuilder<Utilisateurs, Utilisateurs | Utilisateurs[]>,
      user
    )
  )

  // console.log(q.toKnexQuery().toString())

  return q
}

const administrationsPermissionQueryBuild = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  user?: IUtilisateur
) => {
  console.log('administrationPermissionQueryBuild')

  q.select('administrations.*')

  if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    // propriété 'membre'

    const administrationsIds = user.administrations.map(a => a.id) || []
    const administrationsIdsReplace = administrationsIds.map(() => '?')

    q.select(
      raw(
        `(case when ?? in (${administrationsIdsReplace}) then true else false end)`,
        ['administrations.id', ...administrationsIds]
      ).as('membre')
    )
  }

  q.modifyGraph('titresAdministrationGestionnaire', a =>
    titrePermissionQueryBuild(
      a as QueryBuilder<Titres, Titres | Titres[]>,
      user
    )
  )

  q.modifyGraph('titresAdministrationLocale', a =>
    titrePermissionQueryBuild(
      a as QueryBuilder<Titres, Titres | Titres[]>,
      user
    )
  )

  q.modifyGraph('utilisateurs', u =>
    utilisateursPermissionQueryBuild(
      u as QueryBuilder<Utilisateurs, Utilisateurs | Utilisateurs[]>,
      user
    )
  )

  return q
}

const titreDocumentsPermissionQueryBuild = (
  q: QueryBuilder<TitresDocuments, TitresDocuments | TitresDocuments[]>,
  user?: IUtilisateur
) => {
  console.log('titreDocumentPermissionQueryBuild')

  q.select('titresDocuments.*')

  if (permissionCheck(user, ['entreprise']) && user?.entreprises?.length) {
    // faire les join related ou pas
    q.leftJoinRelated('etape.demarche.titre.[titulaires, amodiataires]')

    q.where(b => {
      // si l'utilisateur est `entreprise`,
      // titres dont il est titulaire ou amodiataire
      const entreprisesIds = user.entreprises?.map(e => e.id)

      if (entreprisesIds) {
        b.orWhereIn('etape:demarche:titre:titulaires.id', entreprisesIds)
        b.orWhereIn('etape:demarche:titre:amodiataires.id', entreprisesIds)
      }
    })
  } else if (!user || permissionCheck(user, ['defaut'])) {
    q.where('public', true)
  }

  if (permissionCheck(user, ['super', 'admin', 'editeur', 'lecteur'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('suppression'))
  } else {
    q.select(raw('false').as('modification'))
    q.select(raw('false').as('suppression'))
  }
}

const titreEtapesPermissionQueryBuild = (
  q: QueryBuilder<TitresEtapes, TitresEtapes | TitresEtapes[]>,
  user?: IUtilisateur
) => {
  console.log('titreEtapePermissionQueryBuild')

  q.select('titresEtapes.*')

  if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    const administrationsIds = user.administrations.map(a => a.id) || []

    q.leftJoinRelated('[demarche.titre, type]')

    // si l'utilisateur admin n'appartient à aucune administration
    // alors il ne peut pas voir les étapes faisant l'objet de restriction
    // peu importe l'administration
    if (administrationsIds.length === 0) {
      q.leftJoinRelated('type.restrictionsAdministrations')

      q.whereNot({
        'type:restrictionsAdministrations.lectureInterdit': true
      }).andWhereRaw('?? = ??', [
        'type:restrictionsAdministrations.titreTypeId',
        'demarche:titre.typeId'
      ])
    } else {
      // il faut le faire avant le join du graph
      // pour avoir autant de lignes que d'administrations de l'utilisateur
      q.leftJoin(
        'administrations',
        raw(`?? in (${administrationsIds.map(() => '?').join(',')})`, [
          'administrations.id',
          ...administrationsIds
        ])
      )

      q.leftJoin(
        'r__titresTypes__etapesTypes__administrations as type:restrictionsAdministrations',
        raw('?? = ?? AND ?? = ?? AND ?? = ??', [
          'type:restrictionsAdministrations.etapeTypeId',
          'titresEtapes.typeId',
          'type:restrictionsAdministrations.administrationId',
          'administrations.id',
          'type:restrictionsAdministrations.titreTypeId',
          'demarche:titre.typeId'
        ])
      )

      q.whereRaw('?? is not true', [
        'type:restrictionsAdministrations.lectureInterdit'
      ])

      q.groupBy('titresEtapes.id')
    }
  } else {
    if (!user || permissionCheck(user, ['defaut', 'entreprise'])) {
      q.leftJoinRelated('type.autorisations')

      if (permissionCheck(user, ['entreprise'])) {
        // visibilité des étapes en tant que titulaire ou amodiataire
        q.where('type:autorisations.entreprisesLecture', true)
      } else {
        // visibilité des étapes publiques
        q.where('type:autorisations.publicLecture', true)
      }
    }
  }

  if (permissionCheck(user, ['super'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('suppression'))
  } else if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    const administrationsIds = user.administrations.map(a => a.id) || []

    // si l'utilisateur admin n'appartient à aucune administration
    // il ne peut pas modifier / supprimer les étapes
    if (administrationsIds.length === 0) {
      q.select(raw('false').as('modification'))
      q.select(raw('false').as('suppression'))
    } else {
      // édition du titre
      q.select(
        raw('(case when ?? is not null then true else false end)', [
          'titresModification.id'
        ]).as('modification')
      )

      const titresModificationQuery = TitresEtapes.query()
        .joinRelated('demarche.titre')
        .select('demarche:titre.id')
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
              'demarche:titre.typeId'
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
                'demarche:titre.typeId',
                'r__titresTypes__titresStatuts__administrations.titreStatutId',
                'demarche:titre.statutId',
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
                'demarche:titre.typeId',
                'r__titresTypes__etapesTypes__administrations.etapeTypeId',
                'titresEtapes.id',
                'r__titresTypes__etapesTypes__administrations.creationInterdit'
              ])
            )
            .whereIn('administrations.id', administrationsIds)
            .whereNull(
              'r__titresTypes__etapesTypes__administrations.administrationId'
            )
        )

      q.leftJoin(
        titresModificationQuery.as('titresModification'),
        raw('?? = ??', ['titresModification.id', 'demarche.titreId'])
      )

      q.groupBy('titresModification.id')
    }
  } else {
    q.select(raw('false').as('modification'))
    q.select(raw('false').as('suppression'))
  }

  q.modifyGraph('documents', td => {
    titreDocumentsPermissionQueryBuild(
      td as QueryBuilder<TitresDocuments, TitresDocuments | TitresDocuments[]>,
      user
    )
  })

  // fileCreate(
  //   'tmp/titres-etapes.sql',
  //   sqlFormatter.format(q.toKnexQuery().toString())
  // )

  return q
}

const titreDemarchePermissionQueryBuild = (
  q: QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
  user?: IUtilisateur
) => {
  q.select('titresDemarches.*')

  console.log('titreDemarchePermissionQueryBuild')

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

  // fileCreate(
  //   'tmp/titres-demarches.sql',
  //   sqlFormatter.format(q.toKnexQuery().toString())
  // )

  return q
}

// édition d'une activité
const titreActivitePermissionQueryBuild = (
  q: QueryBuilder<TitresActivites, TitresActivites | TitresActivites[]>,
  user?: IUtilisateur
) => {
  q.select('titresActivites.*')

  if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    const administrationsIds = user.administrations!.map(a => a.id) || []

    // l'utilisateur fait partie d'une administrations qui a les droits sur l'activité
    q.whereExists(
      TitresActivites.query()
        .alias('titresActivitesAdministrations')
        .joinRelated('type.administrations')
        .whereRaw('?? = ??', [
          'titresActivitesAdministrations.id',
          'titresActivites.id'
        ])
        .whereIn('type:administrations.id', administrationsIds)
    )
  } else if (
    permissionCheck(user, ['entreprise']) &&
    user?.entreprises?.length
  ) {
    // vérifie que l'utilisateur a les permissions sur les titres
    const entreprisesIds = user.entreprises.map(e => e.id)

    q.where(b => {
      b.whereExists(
        TitresActivites.query()
          .alias('titresActivitesTitulaires')
          .joinRelated('titre.titulaires')
          .whereRaw('?? = ??', [
            'titresActivitesTitulaires.id',
            'titresActivites.id'
          ])
          .whereIn('titre:titulaires.id', entreprisesIds)
      )
      b.orWhereExists(
        TitresActivites.query()
          .alias('titresActivitesAmodiataires')
          .joinRelated('titre.amodiataires')
          .whereRaw('?? = ??', [
            'titresActivitesAmodiataires.id',
            'titresActivites.id'
          ])
          .whereIn('titre:amodiataires.id', entreprisesIds)
      )
    })
  }

  if (permissionCheck(user, ['super'])) {
    q.select(raw('true').as('modification'))
  } else if (permissionCheck(user, ['admin', 'editeur', 'lecteur'])) {
    if (permissionCheck(user, ['admin', 'editeur'])) {
      q.select(raw('true').as('modification'))
    } else {
      q.select(raw('false').as('modification'))
    }
  } else if (permissionCheck(user, ['entreprise'])) {
    // vérifie que l'utilisateur a les droits d'édition sur l'activité
    // l'activité doit avoir un statut `absente ou `en cours`
    q.select(
      raw('(case when ?? in (?, ?) then true else false end)', [
        'titresActivites.statutId',
        'abs',
        'enc'
      ]).as('modification')
    )
  }

  // fileCreate(
  //   'tmp/titres-activites.sql',
  //   sqlFormatter.format(q.toKnexQuery().toString())
  // )

  return q
}

const activiteStatuts = [
  {
    id: 'abs',
    name: 'activitesAbsentes'
  },
  {
    id: 'enc',
    name: 'activitesEnConstruction'
  },
  {
    id: 'dep',
    name: 'activitesDeposees'
  }
]

const titreActivitesCalc = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  user?: IUtilisateur
) => {
  if (
    permissionCheck(user, [
      'super',
      'admin',
      'editeur',
      'lecteur',
      'entreprise'
    ])
  ) {
    const titresActivitesCountQuery = TitresActivites.query()
      .alias('activitesCount')
      .select('activitesCount.titreId')

    activiteStatuts.forEach(({ id, name }) => {
      q.select(`activitesCountJoin.${name}`)

      titresActivitesCountQuery.select(
        raw('count(??) FILTER (WHERE ?? = ?)', [
          'activitesCount.statutId',
          'activitesCount.statutId',
          id
        ]).as(name)
      )
    })

    if (
      permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
      user?.administrations?.length
    ) {
      const administrationsIds = user.administrations.map(e => e.id)

      // l'utilisateur fait partie d'une administrations qui a les droits sur l'activité
      titresActivitesCountQuery.whereExists(
        TitresActivites.query()
          .alias('titresActivitesAdministrations')
          .joinRelated('type.administrations')
          .whereRaw('?? = ??', [
            'titresActivitesAdministrations.id',
            'activitesCount.id'
          ])
          .whereIn('type:administrations.id', administrationsIds)
      )
    } else if (
      permissionCheck(user, ['entreprise']) &&
      user?.entreprises?.length
    ) {
      const entreprisesIds = user.entreprises.map(e => e.id)

      titresActivitesCountQuery.where(b => {
        b.whereExists(
          TitresActivites.query()
            .alias('titresActivitesTitulaires')
            .joinRelated('titre.titulaires')
            .whereRaw('?? = ??', [
              'titresActivitesTitulaires.id',
              'activitesCount.id'
            ])
            .whereIn('titre:titulaires.id', entreprisesIds)
        )
        b.orWhereExists(
          TitresActivites.query()
            .alias('titresActivitesAmodiataires')
            .joinRelated('titre.amodiataires')
            .whereRaw('?? = ??', [
              'titresActivitesAmodiataires.id',
              'activitesCount.id'
            ])
            .whereIn('titre:amodiataires.id', entreprisesIds)
        )
      })
    } else {
      titresActivitesCountQuery.limit(0)
    }

    titresActivitesCountQuery.groupBy('activitesCount.titreId')

    q.leftJoin(
      titresActivitesCountQuery.as('activitesCountJoin'),
      raw('?? = ??', ['activitesCountJoin.titreId', 'titres.id'])
    )
  } else if (!user || permissionCheck(user, ['defaut'])) {
    // les utilisateurs non-authentifiés ou défaut ne peuvent voir aucune activité
    activiteStatuts.forEach(({ name }) => {
      q.select(raw('0').as(name))
    })
  }

  // fileCreate(
  //   'tmp/titres-activites-titre.sql',
  //   sqlFormatter.format(q.toKnexQuery().toString())
  // )

  return q
}

const titrePermissionQueryBuild = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  user?: IUtilisateur
) => {
  console.log('titrePermissionQueryBuild')

  q.select('titres.*')

  if (!user || permissionCheck(user, ['entreprise', 'defaut'])) {
    q.where(b => {
      b.orWhere(c => {
        // titres publics
        c.whereExists(
          AutorisationsDomaines.query().whereRaw('?? = ?? and ?? = ?', [
            'a__domaines.domaineId',
            'titres.domaineId',
            'a__domaines.publicLecture',
            true
          ])
        )

        c.whereExists(
          AutorisationsTitresTypesTitresStatuts.query().whereRaw(
            '?? = ?? and ?? = ?? and ?? = ?',
            [
              'a__titresTypes__titresStatuts.titreTypeId',
              'titres.typeId',
              'a__titresTypes__titresStatuts.titreStatutId',
              'titres.statutId',
              'a__titresTypes__titresStatuts.publicLecture',
              true
            ]
          )
        )
      })

      if (permissionCheck(user, ['entreprise']) && user?.entreprises?.length) {
        // si l'utilisateur est `entreprise`,
        // titres dont il est titulaire ou amodiataire
        const entreprisesIds = user.entreprises.map(e => e.id)

        b.orWhere(c => {
          c.orWhereExists(
            (Titres.relatedQuery('titulaires') as QueryBuilder<
              Entreprises,
              Entreprises | Entreprises[]
            >).whereIn('titulaires.id', entreprisesIds)
          )
          c.orWhereExists(
            (Titres.relatedQuery('amodiataires') as QueryBuilder<
              Entreprises,
              Entreprises | Entreprises[]
            >).whereIn('amodiataires.id', entreprisesIds)
          )
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
      .whereNotExists(
        RestrictionsTitresTypesTitresStatutsAdministrations.query()
          .whereIn(
            'r__titresTypes__titresStatuts__administrations.administrationId',
            administrationsIds
          )
          .andWhereRaw(`?? = ??`, [
            'r__titresTypes__titresStatuts__administrations.titreTypeId',
            'titresModification.typeId'
          ])
          .andWhereRaw(`?? = ??`, [
            'r__titresTypes__titresStatuts__administrations.titreStatutId',
            'titresModification.statutId'
          ])
          .andWhere(
            'r__titresTypes__titresStatuts__administrations.titresModificationInterdit',
            true
          )
      )

    q.leftJoin(
      titresModificationQuery.as('titresModification'),
      raw('?? = ??', ['titresModification.id', 'titres.id'])
    )
  } else {
    q.select(raw('false').as('modification'))
    q.select(raw('false').as('suppression'))
  }

  // TODO: conditionner aux fields
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
  })

  q.modifyGraph('administrationsGestionnaires', b => {
    b.whereRaw('?? is not true', ['associee'])
  })

  q.modifyGraph('administrationsLocales', b => {
    b.whereRaw('?? is not true', ['associee'])
  })

  // fileCreate('tmp/titres.sql', sqlFormatter.format(q.toKnexQuery().toString()))

  return q
}

export {
  titrePermissionQueryBuild,
  titreDemarchePermissionQueryBuild,
  titreActivitePermissionQueryBuild,
  titreEtapesPermissionQueryBuild,
  administrationsPermissionQueryBuild,
  entreprisePermissionQueryBuild,
  utilisateursPermissionQueryBuild
}
