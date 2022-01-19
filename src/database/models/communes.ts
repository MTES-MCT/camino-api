import { Model } from 'objection'

import { ICommune } from '../../types'
import Departements from './departements'

interface Communes extends ICommune {}

class Communes extends Model {
  public static tableName = 'communes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 8 },
      nom: { type: 'string' }
    }
  }

  static relationMappings = () => ({
    departement: {
      relation: Model.BelongsToOneRelation,
      modelClass: Departements,
      join: {
        from: 'communes.departementId',
        to: 'departements.id'
      }
    }
  })
}

export default Communes
