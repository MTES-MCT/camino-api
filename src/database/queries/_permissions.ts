import { IUtilisateur, IPermissionId } from '../../types'

import fileCreate from '../../tools/file-create'
import * as sqlFormatter from 'sql-formatter'

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
  RestrictionsTitresTypesTitresStatutsAdministrations,
  RestrictionsTitresTypesEtapesTypesAdministrations
} from '../models/autorisations'
import Entreprises from '../models/entreprises'
import Administrations from '../models/administrations'
import Utilisateurs from '../models/utilisateurs'

const permissionsCheck = (
  user: IUtilisateur | undefined,
  permissions: IPermissionId[]
) => !!(user && permissions.includes(user?.permissionId))

const utilisateursPermissionQueryBuild = (
  q: QueryBuilder<Utilisateurs, Utilisateurs | Utilisateurs[]>,
  user?: IUtilisateur
) => {
  q.select('utilisateurs.*')

  if (permissionsCheck(user, ['super', 'admin'])) {
    q.select(raw('true as ??', ['editable']))
    q.select(raw('true as ??', ['supprimable']))
    q.select(raw('true as ??', ['permissionEditable']))
  } else if (
    permissionsCheck(user, ['editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    // un utilisateur administration editeur ou lecteur
    // ne voit que les utilisateurs de son administration
    const administrationsIds = user.administrations.map(e => e.id)

    q.whereExists(
      (Utilisateurs.relatedQuery('administrations') as QueryBuilder<
        Administrations,
        Administrations | Administrations[]
      >).whereIn('administrations.id', administrationsIds)
    )

    q.select(raw('false as ??', ['editable']))
    q.select(raw('false as ??', ['supprimable']))
    q.select(raw('false as ??', ['permissionEditable']))
  } else {
    if (permissionsCheck(user, ['entreprise']) && user?.entreprises?.length) {
      // un utilisateur entreprise
      // ne voit que les utilisateurs de son entreprise
      const entreprisesIds = user.entreprises.map(e => e.id)

      q.whereExists(
        (Utilisateurs.relatedQuery('entreprises') as QueryBuilder<
          Entreprises,
          Entreprises | Entreprises[]
        >).whereIn('entreprises.id', entreprisesIds)
      )
    } else if (user && permissionsCheck(user, ['defaut'])) {
      // un utilisateur "defaut" ne voit que son propre profil
      q.where('id', user.id)
    } else {
      // un utilisateur non-authentifié ne voit aucun utilisateur
      q.limit(0)
    }

    q.select(raw('false as ??', ['editable']))
    q.select(raw('false as ??', ['supprimable']))
    q.select(raw('false as ??', ['permissionEditable']))
  }

  // console.log(q.toKnexQuery().toString())

  return q
}

const entreprisePermissionQueryBuild = (
  q: QueryBuilder<Entreprises, Entreprises | Entreprises[]>,
  user?: IUtilisateur
) => {
  q.select('entreprises.*')

  if (permissionsCheck(user, ['super', 'admin', 'editeur'])) {
    q.select(raw('true as ??', ['editable']))
  } else {
    q.select(raw('false as ??', ['editable']))

    if (!user || permissionsCheck(user, ['entreprise', 'defaut'])) {
      // visibilité des titres de l'entreprise titulaire
      q.modifyGraph('titresTitulaires', a =>
        titrePermissionQueryBuild(
          a as QueryBuilder<Titres, Titres | Titres[]>,
          user
        )
      )

      // visibilité des titres de l'entreprise amodiataire
      q.modifyGraph('titresAmodiataires', a =>
        titrePermissionQueryBuild(
          a as QueryBuilder<Titres, Titres | Titres[]>,
          user
        )
      )
    }
  }

  if (
    !user ||
    permissionsCheck(user, ['editeur', 'lecteur', 'entreprise', 'defaut'])
  ) {
    // visibilité des utilisateurs de l'entreprise
    q.modifyGraph('utilisateurs', u =>
      utilisateursPermissionQueryBuild(
        u as QueryBuilder<Utilisateurs, Utilisateurs | Utilisateurs[]>,
        user
      )
    )
  }

  // console.log(q.toKnexQuery().toString())

  return q
}

const administrationsPermissionQueryBuild = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  user?: IUtilisateur
) => {
  q.select('administrations.*')

  if (permissionsCheck(user, ['super'])) {
    q.select(raw('true as ??', ['editable']))
    q.select(raw('true as ??', ['supprimable']))
  } else if (
    permissionsCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    // propriété 'membre'

    const administrationsIds = user.administrations.map(a => a.id) || []
    const administrationsIdsReplace = administrationsIds.map(() => '?')

    q.select(
      raw(
        `(case when ?? in (${administrationsIdsReplace}) then true else false end) as ??`,
        ['administrations.id', ...administrationsIds, 'membre']
      )
    )
  } else {
    // visibilité des titres des administrations gestionnaires
    q.modifyGraph('titresAdministrationsGestionnaires', a =>
      titrePermissionQueryBuild(
        a as QueryBuilder<Titres, Titres | Titres[]>,
        user
      )
    )

    // visibilité des titres des administrations locales
    q.modifyGraph('titresAdministrationsLocales', a =>
      titrePermissionQueryBuild(
        a as QueryBuilder<Titres, Titres | Titres[]>,
        user
      )
    )
  }

  if (
    !user ||
    permissionsCheck(user, ['editeur', 'lecteur', 'entreprise', 'defaut'])
  ) {
    // visibilité des utilisateurs de l'entreprise
    q.modifyGraph('utilisateurs', u =>
      utilisateursPermissionQueryBuild(
        u as QueryBuilder<Utilisateurs, Utilisateurs | Utilisateurs[]>,
        user
      )
    )
  }

  return q
}

const titreDocumentsPermissionQueryBuild = (
  q: QueryBuilder<TitresDocuments, TitresDocuments | TitresDocuments[]>,
  user?: IUtilisateur
) => {
  q.select('titresDocuments.*')

  if (permissionsCheck(user, ['super', 'admin', 'editeur', 'lecteur'])) {
    q.select(raw('true as ??', ['editable']))
    q.select(raw('true as ??', ['supprimable']))
  } else {
    if (user?.entreprises?.length && permissionsCheck(user, ['entreprise'])) {
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
    } else {
      q.where('public', true)
    }

    q.select(raw('false as ??', ['editable']))
    q.select(raw('false as ??', ['supprimable']))
  }
}

const titreEtapesPermissionQueryBuild = (
  q: QueryBuilder<TitresEtapes, TitresEtapes | TitresEtapes[]>,
  user?: IUtilisateur
) => {
  q.select('titresEtapes.*')

  if (permissionsCheck(user, ['super'])) {
    q.select(raw('true as ??', ['editable']))
    q.select(raw('true as ??', ['supprimable']))
  } else if (
    permissionsCheck(user, ['admin', 'editeur', 'lecteur']) &&
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

      q.select(raw('false as ??', ['editable']))
      q.select(raw('false as ??', ['supprimable']))
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

      // édition du titre
      q.select(
        raw('(case when ?? is not null then true else false end) as ??', [
          'titresEditable.id',
          'editable'
        ])
      )

      const titresEditableQuery = TitresEtapes.query()
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
        .whereNotExists(
          RestrictionsTitresTypesTitresStatutsAdministrations.query()
            .whereIn(
              'r__titresTypes__titresStatuts__administrations.administrationId',
              administrationsIds
            )
            .andWhereRaw(`?? = ??`, [
              'r__titresTypes__titresStatuts__administrations.titreTypeId',
              'demarche:titre.typeId'
            ])
            .andWhereRaw(`?? = ??`, [
              'r__titresTypes__titresStatuts__administrations.titreStatutId',
              'demarche:titre.statutId'
            ])
            .andWhere(
              'r__titresTypes__titresStatuts__administrations.etapesModificationInterdit',
              true
            )
        )
        .whereNotExists(
          RestrictionsTitresTypesEtapesTypesAdministrations.query()
            .whereIn(
              'r__titresTypes__etapesTypes__administrations.administrationId',
              administrationsIds
            )
            .andWhereRaw(`?? = ??`, [
              'r__titresTypes__etapesTypes__administrations.titreTypeId',
              'demarche:titre.typeId'
            ])
            .andWhereRaw(`?? = ??`, [
              'r__titresTypes__etapesTypes__administrations.etapeTypeId',
              'titresEtapes.typeId'
            ])
            .andWhere(
              'r__titresTypes__etapesTypes__administrations.modificationInterdit',
              true
            )
        )

      q.leftJoin(
        titresEditableQuery.as('titresEditable'),
        raw('?? = ??', ['titresEditable.id', 'demarche.titreId'])
      )

      q.groupBy('titresEtapes.id', 'titresEditable.id')
    }
  } else {
    if (!user || permissionsCheck(user, ['defaut', 'entreprise'])) {
      q.leftJoinRelated('type.autorisations')

      if (!user || permissionsCheck(user, ['defaut'])) {
        // visibilité des etapes publiques
        q.where('type:autorisations.publicLecture', true)
      } else {
        // visibilité des etapes en tant que titulaire ou amodiataire
        q.where('type:autorisations.entreprisesLecture', true)
      }
    }

    q.select(raw('false as ??', ['editable']))
    q.select(raw('false as ??', ['supprimable']))
  }

  q.modifyGraph('documents', td => {
    titreDocumentsPermissionQueryBuild(
      td as QueryBuilder<TitresDocuments, TitresDocuments | TitresDocuments[]>,
      user
    )
  })

  return q
}

const titreDemarchePermissionQueryBuild = (
  q: QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
  user?: IUtilisateur
) => {
  q.select('titresDemarches.*')

  if (permissionsCheck(user, ['super'])) {
    q.select(raw('true as ??', ['editable']))
    q.select(raw('true as ??', ['supprimable']))
  } else if (
    permissionsCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    // propriété 'editable'
    q.select(
      raw('(case when ?? is not null then true else false end) as ??', [
        'titresEditable.id',
        'editable'
      ])
    )

    const administrationsIds = user.administrations.map(a => a.id) || []

    const titresEditableQuery = Titres.query()
      .alias('titresEditable')
      .select('titresEditable.id')
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
            'titresEditable.typeId'
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
            'titresEditable.typeId'
          ])
          .andWhereRaw(`?? = ??`, [
            'r__titresTypes__titresStatuts__administrations.titreStatutId',
            'titresEditable.statutId'
          ])
          .andWhere(
            'r__titresTypes__titresStatuts__administrations.demarchesModificationInterdit',
            true
          )
      )

    q.leftJoin(
      titresEditableQuery.as('titresEditable'),
      raw('?? = ??', ['titresEditable.id', 'titresDemarches.titreId'])
    )
  } else {
    // visibilité du titre de la démarche
    q.whereExists(
      titreDemarcheTitrePermissionQueryBuild(
        (TitresDemarches.relatedQuery('titre') as QueryBuilder<
          Titres,
          Titres | Titres[]
        >).alias('titres'),
        user
      )
    )

    q.select(raw('false as ??', ['editable']))
    q.select(raw('false as ??', ['supprimable']))
  }

  q.modifyGraph('etapes', te => {
    titreEtapesPermissionQueryBuild(
      te as QueryBuilder<TitresEtapes, TitresEtapes | TitresEtapes[]>,
      user
    )
  })

  return q
}

const titreDemarcheTitrePermissionQueryBuild = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  user?: IUtilisateur
) => {
  q.select('titres.*')

  if (permissionsCheck(user, ['super'])) {
    q.select(raw('true as ??', ['editable']))
    q.select(raw('true as ??', ['supprimable']))
  } else if (
    permissionsCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    q.select(
      raw('(case when ?? is not null then true else false end) as ??', [
        'titresEditable.id',
        'editable'
      ])
    )

    const administrationsIds = user.administrations.map(a => a.id) || []

    const titresEditableQuery = Titres.query()
      .alias('titresEditable')
      .select('titresEditable.id')
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
            'titresEditable.typeId'
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
            'titresEditable.typeId'
          ])
          .andWhereRaw(`?? = ??`, [
            'r__titresTypes__titresStatuts__administrations.titreStatutId',
            'titresEditable.statutId'
          ])
          .andWhere(
            'r__titresTypes__titresStatuts__administrations.titresModificationInterdit',
            true
          )
      )

    q.leftJoin(
      titresEditableQuery.as('titresEditable'),
      raw('?? = ??', ['titresEditable.id', 'titres.id'])
    )
  } else {
    q.leftJoinRelated('[type.autorisationsTitresStatuts, domaine.autorisation]')

    q.where(b => {
      // titres publics
      b.where({
        'domaine:autorisation.publicLecture': true,
        'type:autorisationsTitresStatuts.publicLecture': true
      }).andWhereRaw('?? = ??', [
        'type:autorisationsTitresStatuts.titreStatutId',
        'titres.statutId'
      ])

      if (permissionsCheck(user, ['entreprise']) && user?.entreprises?.length) {
        // si l'utilisateur est `entreprise`,
        // titres dont il est titulaire ou amodiataire
        const entreprisesIds = user!.entreprises?.map(e => e.id)

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

    q.select(raw('false as ??', ['editable']))
    q.select(raw('false as ??', ['supprimable']))
  }

  return q
}

// édition d'une activité
const titreActivitePermissionQueryBuild = (
  q: QueryBuilder<TitresActivites, TitresActivites | TitresActivites[]>,
  user?: IUtilisateur
) => {
  q.select('titresActivites.*')

  if (
    !user ||
    !permissionsCheck(user, [
      'super',
      'admin',
      'editeur',
      'lecteur',
      'entreprise'
    ])
  ) {
    // les utilisateurs non identifiés ne peuvent voir aucune activité
    q.limit(0)

    return q
  }

  if (permissionsCheck(user, ['super'])) {
    q.select(raw('true as ??', ['editable']))
  } else if (
    permissionsCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    if (!permissionsCheck(user, ['lecteur'])) {
      q.select(raw('true as ??', ['editable']))
    } else {
      q.select(raw('false as ??', ['editable']))
    }

    // administrations gestionnaires et locales
    q.leftJoin(
      'activitesTypes__administrations as type:administrations',
      'type:administrations.activiteTypeId',
      'titresActivites.typeId'
    )

    // l'utilisateur fait partie d'une administrations qui a les droits sur l'activité
    q.andWhere(b => {
      const administrationsIds = user!.administrations?.map(a => a.id) || []

      b.whereIn('type:administrations.administrationId', administrationsIds)
    })
  } else {
    // vérifie que l'utilisateur a les droits d'édition sur l'activité
    // l'activité doit avoir un statut `absente ou `en cours`
    q.select(
      raw('(case when ?? in (?, ?) then true else false end) as ??', [
        'titresActivites.statutId',
        'abs',
        'enc',
        'editable'
      ])
    )

    const titreQuery = TitresActivites.relatedQuery('titre') as QueryBuilder<
      Titres,
      Titres | Titres[]
    >

    // vérifie que l'utilisateur a les permissions sur les titres
    q.whereExists(titreActivitesTitrePermissionQueryBuild(titreQuery, user))
  }

  // console.log(q.toKnexQuery().toString())

  return q
}

const titreActivitesTitrePermissionQueryBuild = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  user: IUtilisateur
) => {
  q.select('titre.*')

  if (permissionsCheck(user, ['entreprise']) && user.entreprises?.length) {
    // titulaires et amodiataires
    q.leftJoinRelated('[titulaires, amodiataires]')

    q.where(b => {
      // si l'utilisateur est `entreprise`,
      // titres dont il est titulaire ou amodiataire
      const entreprisesIds = user.entreprises!.map(e => e.id)

      b.orWhereIn('titulaires.id', entreprisesIds)
      b.orWhereIn('amodiataires.id', entreprisesIds)
    })
  }

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
  // console.log('titreActivitesCalcing')

  // les utilisateurs non-authentifiés ou défaut ne peuvent voir aucune activité
  if (!user || permissionsCheck(user, ['defaut'])) {
    activiteStatuts.forEach(({ name }) => {
      q.select(raw('0 as ??', [name]))
    })

    return q
  }

  const titresActivitesCountQuery = TitresActivites.query()
    .alias('activitesCount')
    .select('activitesCount.titreId')

  activiteStatuts.forEach(({ id, name }) => {
    q.select(`activitesCountJoin.${name}`)

    titresActivitesCountQuery.select(
      raw('count(??) FILTER (WHERE ?? = ?) as ??', [
        'activitesCount.statutId',
        'activitesCount.statutId',
        id,
        name
      ])
    )
  })

  if (
    permissionsCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    const administrationsIds = user.administrations.map(e => e.id)

    titresActivitesCountQuery
      .leftJoinRelated('type.administrations')
      .whereIn('type:administrations.id', administrationsIds)
  } else if (
    permissionsCheck(user, ['entreprise']) &&
    user!.entreprises?.length
  ) {
    const entreprisesIds = user.entreprises.map(e => e.id)

    titresActivitesCountQuery
      .leftJoinRelated('titre.[titulaires, amodiataires]')
      .whereIn('titre:amodiataires.id', entreprisesIds)
      .orWhereIn('titre:titulaires.id', entreprisesIds)
      .groupBy('activitesCount.titreId')
  } else if (!permissionsCheck(user, ['super'])) {
    titresActivitesCountQuery.limit(0)
  }

  titresActivitesCountQuery.groupBy('activitesCount.titreId')

  q.leftJoin(
    titresActivitesCountQuery.as('activitesCountJoin'),
    raw('?? = ??', ['activitesCountJoin.titreId', 'titres.id'])
  )

  // console.log(titresActivitesCountQuery.toKnexQuery().toString())

  // console.log(q.toKnexQuery().toString())

  return q
}

const titrePermissionQueryBuild = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  user?: IUtilisateur
) => {
  q.select('titres.*')

  if (permissionsCheck(user, ['super'])) {
    q.select(raw('true as ??', ['editable']))
    q.select(raw('true as ??', ['supprimable']))
  } else if (
    permissionsCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    q.select(
      raw('(case when ?? is not null then true else false end) as ??', [
        'titresEditable.id',
        'editable'
      ])
    )

    const administrationsIds = user.administrations.map(a => a.id) || []

    const titresEditableQuery = Titres.query()
      .alias('titresEditable')
      .select('titresEditable.id')
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
            'titresEditable.typeId'
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
            'titresEditable.typeId'
          ])
          .andWhereRaw(`?? = ??`, [
            'r__titresTypes__titresStatuts__administrations.titreStatutId',
            'titresEditable.statutId'
          ])
          .andWhere(
            'r__titresTypes__titresStatuts__administrations.titresModificationInterdit',
            true
          )
      )

    q.leftJoin(
      titresEditableQuery.as('titresEditable'),
      raw('?? = ??', ['titresEditable.id', 'titres.id'])
    )
  } else {
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

      if (permissionsCheck(user, ['entreprise']) && user?.entreprises?.length) {
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

    q.select(raw('false as ??', ['editable']))
    q.select(raw('false as ??', ['supprimable']))
  }

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

  fileCreate('tmp.sql', sqlFormatter.format(q.toKnexQuery().toString()))

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
