import { Model } from 'objection'
import { join } from 'path'

import { ICommunes } from '../../types'

interface Communes extends ICommunes {}

class Communes extends Model {
  public static tableName = 'communes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 8 },
      nom: { type: 'string' },
      surface: { type: 'integer' }
    }
  }

  public static relationMappings = {
    departement: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'departements'),
      join: {
        from: 'communes.departementId',
        to: 'departements.id'
      }
    }
  }
}

export default Communes
