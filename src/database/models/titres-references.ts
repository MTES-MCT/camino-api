import { Model, Modifiers } from 'objection'
import ReferencesType from './references-types'

export default class TitresReferences extends Model {
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

  public static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: ReferencesType,
      join: {
        from: 'titresReferences.typeId',
        to: 'referencesTypes.id'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy([{ column: 'typeId' }, { column: 'nom' }])
    }
  }

  public titreId!: string
  public typeId!: string
  public nom!: string
  public type!: ReferencesType
}
