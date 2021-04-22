import { Model, Modifiers } from 'objection'
import { join } from 'path'

import { IDomaine } from '../../types'

interface Domaines extends IDomaine {}

class Domaines extends Model {
  public static tableName = 'domaines'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 1 },
      nom: { type: 'string' },
      ordre: { type: 'integer' }
    }
  }

  public static relationMappings = {
    titresTypes: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'titres-types'),
      join: {
        from: 'domaines.id',
        to: 'titresTypes.domaineId'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }
}

export default Domaines
