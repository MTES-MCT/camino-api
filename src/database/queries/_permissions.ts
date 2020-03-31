import { IUtilisateur } from '../../types'

import { raw, QueryBuilder } from 'objection'

import Titres from '../models/titres'
import TitresDemarches from '../models/titres-demarches'
import TitresEtapes from '../models/titres-etapes'
import TitresActivites from '../models/titres-activites'
import {
  AutorisationsTitresTypesAdministrations,
  RestrictionsTitresTypesTitresStatutsAdministrations,
  RestrictionsTitresTypesEtapesTypesAdministrations
} from '../models/autorisations'

const titreEtapesPermissionQueryBuild = (
  q: QueryBuilder<TitresEtapes, TitresEtapes | TitresEtapes[]>,
  user?: IUtilisateur
) => {
  q.select('titresEtapes.*')

  if (user?.permissionId === 'super') {
    q.select(raw('true as ??', ['editable']))
    q.select(raw('true as ??', ['supprimable']))

    return q
  }

  if (!user || ['defaut', 'entreprise'].includes(user.permissionId)) {
    q.leftJoinRelated('type.autorisations')

    if (!user || user.permissionId === 'defaut') {
      // visibilité des etapes publiques
      q.where('type:autorisations.publicLecture', true)
    } else {
      // visibilité des etapes en tant que titulaire ou amodiataire
      q.where('type:autorisations.entreprisesLecture', true)
    }
  } else if (['admin', 'editeur', 'lecteur'].includes(user?.permissionId)) {
    const administrationsIds = user.administrations?.map(a => a.id) || []

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

      const administrationsIdsReplace = administrationsIds
        .map(() => '?')
        .join(',')

      const titresEditableQuery = TitresEtapes.query()
        .joinRelated('demarche.titre')
        .select('demarche:titre.id')
        // l'utilisateur fait partie d'une administrations
        // qui a les droits sur le type de titre
        .whereExists(
          AutorisationsTitresTypesAdministrations.query()
            .whereRaw(`?? in (${administrationsIdsReplace})`, [
              'a__titresTypes__administrations.administrationId',
              ...administrationsIds
            ])
            .andWhereRaw(`?? = ??`, [
              'a__titresTypes__administrations.titreTypeId',
              'demarche:titre.typeId'
            ])
        )
        .whereNotExists(
          RestrictionsTitresTypesTitresStatutsAdministrations.query()
            .whereRaw(`?? in (${administrationsIdsReplace})`, [
              'r__titresTypes__titresStatuts__administrations.administrationId',
              ...administrationsIds
            ])
            .andWhereRaw(`?? = ??`, [
              'r__titresTypes__titresStatuts__administrations.titreTypeId',
              'demarche:titre.typeId'
            ])
            .andWhereRaw(`?? = ??`, [
              'r__titresTypes__titresStatuts__administrations.titreStatutId',
              'demarche:titre.statutId'
            ])
            .andWhereRaw(`?? = ?`, [
              'r__titresTypes__titresStatuts__administrations.etapesModificationInterdit',
              true
            ])
        )
        .whereNotExists(
          RestrictionsTitresTypesEtapesTypesAdministrations.query()
            .whereRaw(`?? in (${administrationsIdsReplace})`, [
              'r__titresTypes__etapesTypes__administrations.administrationId',
              ...administrationsIds
            ])
            .andWhereRaw(`?? = ??`, [
              'r__titresTypes__etapesTypes__administrations.titreTypeId',
              'demarche:titre.typeId'
            ])
            .andWhereRaw(`?? = ??`, [
              'r__titresTypes__etapesTypes__administrations.etapeTypeId',
              'titresEtapes.typeId'
            ])
            .andWhereRaw(`?? = ?`, [
              'r__titresTypes__etapesTypes__administrations.modificationInterdit',
              true
            ])
        )

      q.leftJoin(
        titresEditableQuery.as('titresEditable'),
        raw('?? = ??', ['titresEditable.id', 'demarche.titreId'])
      )

      // q.groupBy('titresEditable.id')
    }
  }

  return q
}

const titreDemarchePermissionQueryBuild = (
  q: QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
  user?: IUtilisateur
) => {
  q.select('titresDemarches.*')

  if (user?.permissionId === 'super') {
    q.select(raw('true as ??', ['editable']))
    q.select(raw('true as ??', ['supprimable']))

    return q
  }

  q.whereExists(
    titrePermissionQueryBuild(
      (TitresDemarches.relatedQuery('titre') as QueryBuilder<
        Titres,
        Titres | Titres[]
      >).alias('titres'),
      user
    )
  )

  q.modifyGraph('etapes', te => {
    titreEtapesPermissionQueryBuild(
      te as QueryBuilder<TitresEtapes, TitresEtapes | TitresEtapes[]>,
      user
    )
  })

  // édition du titre
  if (user?.administrations?.length) {
    q.select(
      raw('(case when ?? is not null then true else false end) as ??', [
        'titresEditable.id',
        'editable'
      ])
    )

    const administrationsIds = user.administrations.map(a => a.id) || []
    const administrationsIdsReplace = administrationsIds
      .map(() => '?')
      .join(',')

    const titresEditableQuery = Titres.query()
      .alias('titresEditable')
      .select('titresEditable.id')
      // l'utilisateur fait partie d'une administrations
      // qui a les droits sur le type de titre
      .whereExists(
        AutorisationsTitresTypesAdministrations.query()
          .whereRaw(`?? in (${administrationsIdsReplace})`, [
            'a__titresTypes__administrations.administrationId',
            ...administrationsIds
          ])
          .andWhereRaw(`?? = ??`, [
            'a__titresTypes__administrations.titreTypeId',
            'titresEditable.typeId'
          ])
      )
      .whereNotExists(
        RestrictionsTitresTypesTitresStatutsAdministrations.query()
          .whereRaw(`?? in (${administrationsIdsReplace})`, [
            'r__titresTypes__titresStatuts__administrations.administrationId',
            ...administrationsIds
          ])
          .andWhereRaw(`?? = ??`, [
            'r__titresTypes__titresStatuts__administrations.titreTypeId',
            'titresEditable.typeId'
          ])
          .andWhereRaw(`?? = ??`, [
            'r__titresTypes__titresStatuts__administrations.titreStatutId',
            'titresEditable.statutId'
          ])
          .andWhereRaw(`?? = ?`, [
            'r__titresTypes__titresStatuts__administrations.demarchesModificationInterdit',
            true
          ])
      )

    q.leftJoin(
      titresEditableQuery.as('titresEditable'),
      raw('?? = ??', ['titresEditable.id', 'titresDemarches.titreId'])
    )

    // q.groupBy('titresEditable.id')
  } else {
    q.select(raw('false as ??', ['editable']))
    q.select(raw('false as ??', ['supprimable']))
  }

  return q
}

// droits d'édition d'une activité
const titreActivitePermissionQueryBuild = (
  q: QueryBuilder<TitresActivites, TitresActivites | TitresActivites[]>,
  user?: IUtilisateur
) => {
  q.select('titresActivites.*')

  q.debug()

  if (!user) {
    // les utilisateurs non identifiés ne peuvent voir aucune activité
    q.limit(0)

    return q
  }

  if (user.permissionId === 'super') {
    q.select(raw('? as ??', [true, 'isSuper']))

    return q
  }

  q.select(
    raw('(case when ?? is not null then true else false end) as ??', [
      'utilisateurs.id',
      'editable'
    ])
  )

  const titreQuery = TitresActivites.relatedQuery('titre') as QueryBuilder<
    Titres,
    Titres | Titres[]
  >

  // vérifie que l'utilisateur a les permissions sur les titres
  q.whereExists(titreActivitesTitrePermissionQueryBuild(titreQuery, user))

  // vérifie que l'utiliateur a les droits d'édition sur l'activité
  q.leftJoin('utilisateurs', raw('?? = ?', ['utilisateurs.id', user.id]))
  q.andWhere(b => {
    b.whereIn('permissionId', ['admin', 'editeur', 'lecteur'])
    b.orWhere(c => {
      c.where('permissionId', 'entreprise')
      c.andWhereRaw('?? <> ?', ['titresActivites.statutId', 'dep'])
    })
  })

  // console.log(q.toKnexQuery().toString())

  return q
}

const titreActivitesTitrePermissionQueryBuild = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  user: IUtilisateur
) => {
  q.select('titre.*')

  if (user.permissionId === 'super') {
    q.select(raw('? as ??', [true, 'editable']))
    q.select(raw('? as ??', [true, 'supprimable']))

    return q
  }

  if (['defaut', 'entreprise'].includes(user.permissionId)) {
    if (user.permissionId === 'entreprise') {
      // titulaires et amodiataires
      q.leftJoinRelated('[titulaires, amodiataires]')
    }

    q.where(b => {
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
  } else if (user.administrations?.length) {
    // administrations gestionnaires et locales
    q.leftJoinRelated('[administrationsGestionnaires, administrationsLocales]')

    // l'utilisateur fait partie d'une administrations qui a les droits sur le titre
    q.andWhere(b => {
      const administrationsIds = user.administrations?.map(a => a.id) || []
      const administrationsIdsReplace = administrationsIds
        .map(() => '?')
        .join(',')

      b.orWhereRaw(`?? in (${administrationsIdsReplace})`, [
        'administrationsGestionnaires.id',
        ...administrationsIds
      ]).orWhereRaw(`?? in (${administrationsIdsReplace})`, [
        'administrationsLocales.id',
        ...administrationsIds
      ])
    })
  }

  return q
}

const titrePermissionQueryBuild = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  user?: IUtilisateur
) => {
  q.select('titres.*')

  if (user?.permissionId === 'super') {
    q.select(raw('true as ??', ['editable']))
    q.select(raw('true as ??', ['supprimable']))

    // console.log(q.toKnexQuery().toString())

    return q
  }

  if (!user || ['defaut', 'entreprise'].includes(user.permissionId)) {
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
  }

  // visibilité des étapes
  q.modifyGraph('demarches.etapes', b => {
    titreEtapesPermissionQueryBuild(
      b as QueryBuilder<TitresEtapes, TitresEtapes | TitresEtapes[]>,
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

  // édition du titre
  if (user?.administrations?.length) {
    q.select(
      raw('(case when ?? is not null then true else false end) as ??', [
        'titresEditable.id',
        'editable'
      ])
    )

    const administrationsIds = user.administrations.map(a => a.id) || []
    const administrationsIdsReplace = administrationsIds
      .map(() => '?')
      .join(',')

    const titresEditableQuery = Titres.query()
      .alias('titresEditable')
      .select('titresEditable.id')
      // l'utilisateur fait partie d'une administrations
      // qui a les droits sur le type de titre
      .whereExists(
        AutorisationsTitresTypesAdministrations.query()
          .whereRaw(`?? in (${administrationsIdsReplace})`, [
            'a__titresTypes__administrations.administrationId',
            ...administrationsIds
          ])
          .andWhereRaw(`?? = ??`, [
            'a__titresTypes__administrations.titreTypeId',
            'titresEditable.typeId'
          ])
      )
      .whereNotExists(
        RestrictionsTitresTypesTitresStatutsAdministrations.query()
          .whereRaw(`?? in (${administrationsIdsReplace})`, [
            'r__titresTypes__titresStatuts__administrations.administrationId',
            ...administrationsIds
          ])
          .andWhereRaw(`?? = ??`, [
            'r__titresTypes__titresStatuts__administrations.titreTypeId',
            'titresEditable.typeId'
          ])
          .andWhereRaw(`?? = ??`, [
            'r__titresTypes__titresStatuts__administrations.titreStatutId',
            'titresEditable.statutId'
          ])
          .andWhereRaw(`?? = ?`, [
            'r__titresTypes__titresStatuts__administrations.titresModificationInterdit',
            true
          ])
      )

    q.leftJoin(
      titresEditableQuery.as('titresEditable'),
      raw('?? = ??', ['titresEditable.id', 'titres.id'])
    )

    // q.groupBy('titresEditable.id')
  } else {
    q.select(raw('false as ??', ['editable']))
    q.select(raw('false as ??', ['supprimable']))
  }

  // console.log(q.toKnexQuery().toString())

  return q
}

export {
  titrePermissionQueryBuild,
  titreDemarchePermissionQueryBuild,
  titreActivitePermissionQueryBuild,
  titreEtapesPermissionQueryBuild
}
