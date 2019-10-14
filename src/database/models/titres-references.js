import { Model } from 'objection'
import ReferencesType from './references-types'

export default class TitresReferences extends Model {
  static tableName = 'titresReferences'

  static jsonSchema = {
    type: 'object',
    required: ['titreId', 'typeId', 'nom'],

    properties: {
      titreId: { type: 'string', maxLength: 128 },
      typeId: { type: 'string', maxLength: 3 },
      nom: { type: 'string', maxLength: 128 }
    }
  }

  static idColumn = ['titreId', 'typeId', 'nom']

  static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: ReferencesType,
      join: {
        from: 'titresReferences.typeId',
        to: 'referencesTypes.id'
      }
    }
  }

  static modifiers = {
    orderAsc: builder => {
      builder.orderBy([{ column: 'typeId' }, { column: 'nom' }])
    }
  }
}
