import { IUtilisateur } from '../../../types'

import fileCreate from '../../../tools/file-create'
import * as sqlFormatter from 'sql-formatter'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Administrations from '../../models/administrations'
import EtapesTypes from '../../models/etapes-types'
import TitresDemarches from '../../models/titres-demarches'
import TitresEtapes from '../../models/titres-etapes'

import { AutorisationsTitresTypesAdministrations } from '../../models/autorisations'

const etapesTypesPermissionQueryBuild = (
  q: QueryBuilder<EtapesTypes, EtapesTypes | EtapesTypes[]>,
  user?: IUtilisateur,
  {
    titreDemarcheId,
    titreEtapeId
  }: { titreDemarcheId?: string; titreEtapeId?: string } = {}
) => {
  q.select('etapesTypes.*')

  console.log('modifying les types de etapes')

  q.debug()

  // récupère tous les types d'étapes
  // si titreId:
  // -> restreint aux types d'étapes du type de titre
  // si le type de l'étape est unique et qu'elle n'existe pas dans le titre mais titreDemarcheId
  // -> affiche le type de l'étape

  // ajouter une propriété 'modification' en fonction du profil de l'utilisateur
  // r_titresTypes__titresStatuts__administrations
  //
  // q.join('titres', 'id', titreId)

  // TODO: ajouter et gérer la propriété unique

  // si DemarcheId existe
  // -> filtre les types d'étapes correspondants au type de la démarche
  // -> filtre en fonction de la propriété 'unique'
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
    // -> s'affiche
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

  // ajoute la propriété 'modification'
  if (permissionCheck(user, ['super'])) {
    q.select(raw('true').as('modification'))
  } else if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    if (titreDemarcheId) {
      q.select(
        raw('(case when ?? is not null then true else false end)', [
          'etapeTypeModification.etapeTypeId'
        ]).as('modification')
      )

      const administrationsIds = user.administrations.map(a => a.id) || []

      const etapeTypeModificationQuery = TitresDemarches.query()
        .findById(titreDemarcheId)
        .select('tde.etapeTypeId')
        .joinRelated('titre')
        .join(
          'titresTypes__demarchesTypes__etapesTypes as tde',
          raw('?? = ?? and ?? = ??', [
            'tde.titreTypeId',
            'titre.typeId',
            'tde.demarcheTypeId',
            'titresDemarches.typeId'
          ])
        )
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
              'r__titresTypes__titresStatuts__administrations as rtsa',
              raw('?? = ?? and ?? = ?? and ?? = ?? and ?? is true', [
                'rtsa.administrationId',
                'administrations.id',
                'rtsa.titreTypeId',
                'titre.typeId',
                'rtsa.titreStatutId',
                'titre.statutId',
                'rtsa.etapesModificationInterdit'
              ])
            )
            .whereIn('administrations.id', administrationsIds)
            .whereNull('rtsa.administrationId')
        )
        // l'utilisateur est dans au moins une administration
        // qui n'a pas de restriction 'creationInterdit' sur ce type d'étape / type de titre
        .whereExists(
          Administrations.query()
            .leftJoin(
              'r__titresTypes__etapesTypes__administrations as rtea',
              raw('?? = ?? and ?? = ?? and ?? = ?? and ?? = true', [
                'rtea.administrationId',
                'administrations.id',
                'rtea.titreTypeId',
                'titre.typeId',
                'rtea.etapeTypeId',
                'tde.etapeTypeId',
                `rtea.${titreEtapeId ? 'modification' : 'creation'}Interdit`
              ])
            )
            .whereIn('administrations.id', administrationsIds)
            .whereNull('rtea.administrationId')
        )

      q.leftJoin(
        etapeTypeModificationQuery.as('etapeTypeModification'),
        raw('?? = ??', ['etapeTypeModification.etapeTypeId', 'etapesTypes.id'])
      )
    }
  } else {
    q.select(raw('false').as('modification'))
  }

  console.log(q.toKnexQuery().toString())

  fileCreate(
    'tmp/etapes-types.sql',
    sqlFormatter.format(q.toKnexQuery().toString())
  )
}

export { etapesTypesPermissionQueryBuild }
