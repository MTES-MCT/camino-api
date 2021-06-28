import { Model } from 'objection'
import { join } from 'path'

import { ITravauxTypeTravauxEtapeType } from '../../types'

interface TravauxTypesTravauxEtapesTypes extends ITravauxTypeTravauxEtapeType {}

class TravauxTypesTravauxEtapesTypes extends Model {
  public static tableName = 'travauxTypes__travauxEtapesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['travauxTypeId', 'travauxEtapeTypeId'],

    properties: {
      travauxTypeId: { type: 'string', maxLength: 3 },
      travauxEtapeTypeId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' }
    }
  }

  public static idColumn = ['travauxTypeId', 'travauxEtapeTypeId']

  public static relationMappings = {
    travauxType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'travaux-types'),
      join: {
        from: 'travauxTypes__travauxEtapesTypes.travauxTypeId',
        to: 'travauxTypes.id'
      }
    },
    travauxEtapeType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'travaux-etapes-types'),
      join: {
        from: 'travauxTypes__travauxEtapesTypes.travauxEtapeTypeId',
        to: 'travauxEtapesTypes.id'
      }
    }
  }
}

export default TravauxTypesTravauxEtapesTypes
