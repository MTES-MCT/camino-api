import { Model, Modifiers } from 'objection'
import { join } from 'path'
import { ITitresReferences } from '../../types'

interface TitresReferences extends ITitresReferences {}

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

  public static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'references-types'),
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
}

export default TitresReferences
