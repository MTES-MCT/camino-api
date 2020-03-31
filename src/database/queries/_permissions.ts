import { IUtilisateur } from '../../types'

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

const titreDocumentsPermissionQueryBuild = (
  q: QueryBuilder<TitresDocuments, TitresDocuments | TitresDocuments[]>,
  user?: IUtilisateur
) => {
  q.select('titresDocuments.*')

  if (
    user &&
    ['super', 'admin', 'editeur', 'lecteur'].includes(user.permissionId)
  ) {
    q.select(raw('true as ??', ['editable']))
    q.select(raw('true as ??', ['supprimable']))
  } else {
    if (user && user.permissionId === 'entreprise') {
      // faire les join related ou pas
      q.leftJoinRelated('etape.demarche.titre.[titulaires, amodiataires]')

      q.where(b => {
        // si l'utilisateur est `entreprise`,
        // titres dont il est titulaire ou amodiataire
        const entreprisesIds = user.entreprises?.map(e => e.id)

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

  if (user?.permissionId === 'super') {
    q.select(raw('true as ??', ['editable']))
    q.select(raw('true as ??', ['supprimable']))
  } else if (
    user &&
    ['admin', 'editeur', 'lecteur'].includes(user.permissionId)
  ) {
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

      q.groupBy('titresEtapes.id')
      q.groupBy('titresEditable.id')
    }
  } else {
    if (!user || ['defaut', 'entreprise'].includes(user.permissionId)) {
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

  if (user?.permissionId === 'super') {
    q.select(raw('true as ??', ['editable']))
    q.select(raw('true as ??', ['supprimable']))
  } else if (
    user &&
    ['admin', 'editeur', 'lecteur'].includes(user.permissionId)
  ) {
    // édition du titre
    if (user.administrations?.length) {
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
    !['super', 'admin', 'editeur', 'lecteur', 'entreprise'].includes(
      user.permissionId
    )
  ) {
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
  } else if (
    ['admin', 'editeur', 'lecteur'].includes(user.permissionId) &&
    user.administrations?.length
  ) {
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
  } else if (user.permissionId === 'entreprise') {
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

  if (user?.permissionId === 'super') {
    q.select(raw('true as ??', ['editable']))
    q.select(raw('true as ??', ['supprimable']))
  } else if (
    user &&
    ['super', 'admin', 'editeur', 'lecteur'].includes(user.permissionId)
  ) {
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
