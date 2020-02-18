import { Model, Modifiers } from 'objection'
import { join } from 'path'
import { ITitreTypeType } from '../../types'

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

  public static relationMappings = {
    types: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'titres-types'),
      join: {
        from: 'titresTypesTypes.id',
        to: 'titresTypes.typeId'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }
}

export default TitresTypesTypes
