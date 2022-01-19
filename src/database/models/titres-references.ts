import { Model, Modifiers } from 'objection'

import { ITitreReference } from '../../types'
import ReferencesTypes from './references-types'

interface TitresReferences extends ITitreReference {}

class TitresReferences extends Model {
  public static tableName = 'titresReferences'

  public static jsonSchema = {
    type: 'object',
    required: ['titreId', 'typeId', 'nom'],

    properties: {
      titreId: { type: 'string', maxLength: 128 },
      typeId: { type: 'string', maxLength: 3 },
      nom: { type: 'string', maxLength: 128 }
    }
  }

  public static idColumn = ['titreId', 'typeId', 'nom']

  static relationMappings = () => ({
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: ReferencesTypes,
      join: {
        from: 'titresReferences.typeId',
        to: 'referencesTypes.id'
      }
    }
  })

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy([{ column: 'typeId' }, { column: 'nom' }])
    }
  }
}

export default TitresReferences
