import { IUtilisateur, IPermissionId } from '../../types'

import { raw, QueryBuilder } from 'objection'

import Titres from '../models/titres'
import TitresDemarches from '../models/titres-demarches'
import TitresEtapes from '../models/titres-etapes'
import TitresActivites from '../models/titres-activites'
import TitresDocuments from '../models/titres-documents'

import {
  AutorisationsTitresTypesAdministrations,
  RestrictionsTitresTypesTitresStatutsAdministrations,
  RestrictionsTitresTypesEtapesTypesAdministrations
} from '../models/autorisations'

const permissionsCheck = (
  user: IUtilisateur | undefined,
  permissions: IPermissionId[]
) => !!(user && permissions.includes(user?.permissionId))

const titreDocumentsPermissionQueryBuild = (
  q: QueryBuilder<TitresDocuments, TitresDocuments | TitresDocuments[]>,
  user?: IUtilisateur
) => {
  q.select('titresDocuments.*')

  if (permissionsCheck(user, ['super', 'admin', 'editeur', 'lecteur'])) {
    q.select(raw('true as ??', ['editable']))
    q.select(raw('true as ??', ['supprimable']))
  } else {
    if (permissionsCheck(user, ['entreprise'])) {
      // faire les join related ou pas
      q.leftJoinRelated('etape.demarche.titre.[titulaires, amodiataires]')

      q.where(b => {
        // si l'utilisateur est `entreprise`,
        // titres dont il est titulaire ou amodiataire
        const entreprisesIds = user!.entreprises?.map(e => e.id)

        console.log({ entreprisesIds })

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
  } else if (permissionsCheck(user, ['admin', 'editeur', 'lecteur'])) {
    const administrationsIds = user!.administrations?.map(a => a.id) || []

    q.leftJoinRelated('[demarche.titre, type]')

    // si l'utilisateur admin n'appartient à aucune administration
    // alors il ne peut pas voir les étapes faisant l'objet de restriction
    // peut importe l'administration
    if (administrationsIds.length === 0) {
      q.leftJoinRelated('[type.restrictionsAdministrations]')

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

      q.groupBy('titresEtapes.id')
      q.groupBy('titresEditable.id')
    }
  } else {
    if (!user || permissionsCheck(user, ['defaut', 'entreprise'])) {
      q.leftJoinRelated('type.autorisations')

      if (!user || user.permissionId === 'defaut') {
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
  } else if (permissionsCheck(user, ['admin', 'editeur', 'lecteur'])) {
    // édition du titre
    if (user!.administrations?.length) {
      q.select(
        raw('(case when ?? is not null then true else false end) as ??', [
          'titresEditable.id',
          'editable'
        ])
      )

      const administrationsIds = user!.administrations.map(a => a.id) || []

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

      // q.groupBy('titresEditable.id')
    }
  } else {
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

// droits d'édition d'une activité
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
    user!.administrations?.length
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
      'type.id'
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

  return q
}

const titreActivitesTitrePermissionQueryBuild = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  user: IUtilisateur
) => {
  q.select('titre.*')

  if (permissionsCheck(user, ['entreprise'])) {
    // titulaires et amodiataires
    q.leftJoinRelated('[titulaires, amodiataires]')

    q.where(b => {
      // si l'utilisateur est `entreprise`,
      // titres dont il est titulaire ou amodiataire
      const entreprisesIds = user.entreprises?.map(e => e.id)

      if (entreprisesIds) {
        b.orWhereIn('titulaires.id', entreprisesIds)
        b.orWhereIn('amodiataires.id', entreprisesIds)
      }
    })
  }

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
  } else if (user && permissionsCheck(user, ['admin', 'editeur', 'lecteur'])) {
    q.select(
      raw('(case when ?? is not null then true else false end) as ??', [
        'titresEditable.id',
        'editable'
      ])
    )

    const administrationsIds = user.administrations?.map(a => a.id) || []

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

    // q.groupBy('titresEditable.id')
  } else {
    q.leftJoinRelated('[type.autorisationsTitresStatuts, domaine.autorisation]')

    if (user?.permissionId === 'entreprise') {
      // titulaires et amodiataires
      q.leftJoinRelated('[titulaires, amodiataires]')
    }

    q.where(b => {
      // titres publics
      b.where({
        'domaine:autorisation.publicLecture': true,
        'type:autorisationsTitresStatuts.publicLecture': true
      }).andWhereRaw('?? = ??', [
        'type:autorisationsTitresStatuts.titreStatutId',
        'statutId'
      ])

      // si l'utilisateur est `entreprise`,
      // titres dont il est titulaire ou amodiataire
      if (user?.permissionId === 'entreprise') {
        const entreprisesIds = user.entreprises?.map(e => e.id)

        if (entreprisesIds) {
          b.orWhereIn('titulaires.id', entreprisesIds)
          b.orWhereIn('amodiataires.id', entreprisesIds)
        }
      }
    })

    if (user?.permissionId === 'entreprise') {
      q.groupBy('titres.id')
    }

    q.select(raw('false as ??', ['editable']))
    q.select(raw('false as ??', ['supprimable']))
  }

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

  // console.log(q.toKnexQuery().toString())

  return q
}

export {
  titrePermissionQueryBuild,
  titreDemarchePermissionQueryBuild,
  titreActivitePermissionQueryBuild,
  titreEtapesPermissionQueryBuild
}
