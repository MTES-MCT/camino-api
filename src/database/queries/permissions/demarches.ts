import { IUtilisateur } from '../../../types'

import fileCreate from '../../../tools/file-create'
import * as sqlFormatter from 'sql-formatter'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Administrations from '../../models/administrations'
import DemarchesTypes from '../../models/demarches-types'
import Titres from '../../models/titres'

import { AutorisationsTitresTypesAdministrations } from '../../models/autorisations'

const demarchesTypesPermissionQueryBuild = (
  q: QueryBuilder<DemarchesTypes, DemarchesTypes | DemarchesTypes[]>,
  user?: IUtilisateur,
  {
    titreId,
    titreDemarcheId
  }: { titreId?: string; titreDemarcheId?: string } = {}
) => {
  q.select('demarchesTypes.*')

  console.log('modifying les types de demarches')

  q.debug()

  // récupère tous les types de démarches
  // si titreId:
  // -> restreint aux types de démarches du type de titre
  // si le type démarche est unique et qu'elle n'existe pas dans le titre mais titreDemarcheId
  // -> affiche le type de la démarche

  // ajouter une propriété 'modification' en fonction du profil de l'utilisateur
  // r_titresTypes__titresStatuts__administrations
  //
  // q.join('titres', 'id', titreId)

  // TODO: ajouter et gérer la propriété unique

  if (titreId) {
    q.whereExists(
      Titres.query()
        .findById(titreId)
        .joinRelated('type.demarchesTypes')
        .whereRaw('?? = ??', ['type:demarchesTypes.id', 'demarchesTypes.id'])
    )
  }

  if (permissionCheck(user, ['super'])) {
    q.select(raw('true').as('modification'))
  } else if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    if (titreId) {
      // propriété 'modification'
      q.select(
        raw('(case when ?? is not null then true else false end)', [
          'demarcheTypeModification.id'
        ]).as('modification')
      )

      const administrationsIds = user.administrations.map(a => a.id) || []

      const demarcheTypeModificationQuery = Titres.query()
        .findById(titreId)
        .alias('demarcheTypeModification')
        .select('type:demarchesTypes.id')
        .joinRelated('type.demarchesTypes')
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
              'demarcheTypeModification.typeId'
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
                'demarcheTypeModification.typeId',
                'r__titresTypes__titresStatuts__administrations.titreStatutId',
                'demarcheTypeModification.statutId',
                'r__titresTypes__titresStatuts__administrations.demarchesModificationInterdit'
              ])
            )
            .whereIn('administrations.id', administrationsIds)
            .whereNull(
              'r__titresTypes__titresStatuts__administrations.administrationId'
            )
        )

      q.leftJoin(
        demarcheTypeModificationQuery.as('demarcheTypeModification'),
        raw('?? = ??', ['demarcheTypeModification.id', 'demarchesTypes.id'])
      )
    }
  } else {
    q.select(raw('false').as('modification'))
  }

  console.log(q.toKnexQuery().toString())

  fileCreate(
    'tmp/demarches-types.sql',
    sqlFormatter.format(q.toKnexQuery().toString())
  )
}

export { demarchesTypesPermissionQueryBuild }
