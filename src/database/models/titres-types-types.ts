import { Model, Modifiers } from 'objection'

import { ITitreTypeType } from '../../types'
import TitresTypes from './titres-types'

interface TitresTypesTypes extends ITitreTypeType {}

class TitresTypesTypes extends Model {
  public static tableName = 'titresTypesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'ordre'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      ordre: { type: 'integer' }
    }
  }

  static relationMappings = () => ({
    types: {
      relation: Model.HasManyRelation,
      modelClass: TitresTypes,
      join: {
        from: 'titresTypesTypes.id',
        to: 'titresTypes.typeId'
      }
    }
  })

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }
}

export default TitresTypesTypes
