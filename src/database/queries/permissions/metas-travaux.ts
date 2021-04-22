import { raw, QueryBuilder } from 'objection'

import { IUtilisateur } from '../../../types'
// import fileCreate from '../../../tools/file-create'
// import { format } from 'sql-formatter'

import { permissionCheck } from '../../../tools/permission'

import TravauxTypes from '../../models/travaux-types'
import TravauxEtapesTypes from '../../models/travaux-etapes-types'
import TitresTravaux from '../../models/titres-travaux'

const travauxEtapesTypesQueryModify = (
  q: QueryBuilder<
    TravauxEtapesTypes,
    TravauxEtapesTypes | TravauxEtapesTypes[]
  >,
  user: IUtilisateur | null,
  { titreTravauxId }: { titreTravauxId?: string } = {}
) => {
  q.select('travauxEtapesTypes.*')

  // si titreDemarcheId
  // -> restreint aux types d'étapes du type de la démarche

  if (titreTravauxId) {
    q.whereExists(
      TitresTravaux.query()
        .findById(titreTravauxId)
        .joinRelated('titre')
        .join(
          'travauxTypes__travauxEtapesTypes as tt_tet',
          raw('?? = ?? and ?? = ??', [
            'tt_tet.travauxEtapeTypeId',
            'travauxEtapesTypes.id',
            'tt_tet.travauxTypeId',
            'titresTravaux.typeId'
          ])
        )
    )
  }

  // propriété 'etapesCreation' en fonction du profil de l'utilisateur

  q.select(
    raw(
      permissionCheck(user?.permissionId, ['super', 'admin', 'editeur'])
        ? 'true'
        : 'false'
    ).as('etapesCreation')
  )
}

const travauxTypesQueryModify = (
  q: QueryBuilder<TravauxTypes, TravauxTypes | TravauxTypes[]>,
  user: IUtilisateur | null
) => {
  q.select('travauxTypes.*')

  // propriété 'travauxCreation' selon le profil de l'utilisateur
  if (permissionCheck(user?.permissionId, ['super', 'admin', 'editeur'])) {
    q.select(raw('true').as('travauxCreation'))
  } else {
    q.select(raw('false').as('travauxCreation'))
  }
}

export { travauxTypesQueryModify, travauxEtapesTypesQueryModify }
