import { Model, Modifiers } from 'objection'
import { join } from 'path'

import { ITravauxType } from '../../types'

interface TravauxTypes extends ITravauxType {}

class TravauxTypes extends Model {
  public static tableName = 'travauxTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      ordre: { type: ['integer', 'null'] }
    }
  }

  public static relationMappings = {
    travauxEtapesTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'travaux-etapes-types'),
      join: {
        from: 'travauxTypes.id',
        through: {
          from: 'travauxTypes__travauxEtapesTypes.travauxTypeId',
          to: 'travauxTypes__travauxEtapesTypes.travauxEtapeTypeId',
          extra: ['ordre']
        },
        to: 'travauxEtapesTypes.id'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }
}

export default TravauxTypes
