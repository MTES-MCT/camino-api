import { IUtilisateur } from '../../types'

import { raw, QueryBuilder } from 'objection'

import Titres from '../models/titres'
import TitresDemarches from '../models/titres-demarches'
import TitresEtapes from '../models/titres-etapes'
import TitresActivites from '../models/titres-activites'

const titreEtapesPermissionQueryBuild = (
  q: QueryBuilder<TitresEtapes, TitresEtapes | TitresEtapes[]>,
  user?: IUtilisateur
) => {
  q.select('titresEtapes.*')

  if (user?.permissionId === 'super') {
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
    return q
  }

  q.whereExists(
    titrePermissionQueryBuild(TitresDemarches.relatedQuery('titre'), user)
  )

  q.modifyGraph('etapes', te => {
    titreEtapesPermissionQueryBuild(
      te as QueryBuilder<TitresEtapes, TitresEtapes | TitresEtapes[]>,
      user
    )
  })

  return q
}

const titreActivitePermissionQueryBuild = (
  q: QueryBuilder<TitresActivites, TitresActivites | TitresActivites[]>,
  user: IUtilisateur
) => {
  q.select('titresActivites.*')

  if (user.permissionId === 'super') {
    q.select(raw('? as ??', [true, 'isSuper']))

    console.log('activites query:', q.toKnexQuery().toString())

    return q
  }

  q.whereExists(
    titrePermissionQueryBuild(TitresDemarches.relatedQuery('titre'), user)
  )

  // administrations gestionnaires et locales
  q.leftJoinRelated(
    'titre.[administrationsGestionnaires, administrationsLocales]'
  )

  // l'utilisateur fait partie d'une administrations qui a les droits sur le titre
  q.andWhere(b => {
    const administrationsIds = user.administrations?.map(a => a.id) || []
    const administrationsIdsReplace = administrationsIds
      .map(() => '?')
      .join(',')

    b.orWhereRaw(`?? in (${administrationsIdsReplace})`, [
      'titre:administrationsGestionnaires.administrationId',
      ...administrationsIds
    ]).orWhereRaw(`?? in (${administrationsIdsReplace})`, [
      'titre:administrationsLocales.administrationId',
      ...administrationsIds
    ])
  })

  return q
}

const titrePermissionQueryBuild = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  user?: IUtilisateur
) => {
  q.select('titres.*')

  if (user?.permissionId === 'super') {
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

  return q
}

export {
  titrePermissionQueryBuild,
  titreDemarchePermissionQueryBuild,
  titreActivitePermissionQueryBuild,
  titreEtapesPermissionQueryBuild
}
