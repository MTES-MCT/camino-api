import { Model } from 'objection'

import DemarchesTypes from './demarches-types'

export default class Types extends Model {
  static tableName = 'types'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' }
    }
  }

  static relationMappings = {
    demarchesTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: DemarchesTypes,
      join: {
        from: 'types.id',
        through: {
          from: 'demarchesTypes__types.typeId',
          to: 'demarchesTypes__types.demarcheTypeId',
          extra: [
            'dureeMax',
            'acceptationImplicite',
            'delaiImplicite',
            'delaiRecours',
            'legalRef',
            'legalLien',
            'dateDebut',
            'dateFin'
          ]
        },
        to: 'demarchesTypes.id'
      }
    }
  }
}
