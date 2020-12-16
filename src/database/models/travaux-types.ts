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
    etapesTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'etapes-types'),
      join: {
        from: 'travauxTypes.id',
        through: {
          from: 'travauxTypes__etapesTypes.travauxTypeId',
          to: 'travauxTypes__etapesTypes.etapeTypeId',
          // permet de donner un alias spécial aux champs extra { alias: field }
          extra: ['ordre', 'sections']
        },
        to: 'etapesTypes.id'
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
