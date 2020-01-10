import { Model, Modifiers } from 'objection'

import DemarchesTypes from './demarches-types'

export default class Types extends Model {
  public static tableName = 'types'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' }
    }
  }

  public static relationMappings = {
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

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }

  public id!: string
  public nom!: string
  public demarchesTypes?: DemarchesTypes[]
}
