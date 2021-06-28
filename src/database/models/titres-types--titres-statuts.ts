import { Model, Modifiers } from 'objection'
import { join } from 'path'

import { ITitreTypeTitreStatut } from '../../types'

interface TitresTypesTitresStatuts extends ITitreTypeTitreStatut {}

class TitresTypesTitresStatuts extends Model {
  public static tableName = 'titresTypes__titresStatuts'

  public static jsonSchema = {
    type: 'object',
    required: ['titreTypeId', 'titreStatutId'],

    properties: {
      titreTypeId: { type: 'string', maxLength: 3 },
      titreStatutId: { type: 'string', maxLength: 3 },
      publicLecture: { type: 'boolean' }
    }
  }

  public static idColumn = ['titreTypeId', 'titreStatutId']

  public static relationMappings = {
    titreType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres-types'),
      join: {
        from: 'titresTypes__titresStatuts.titreTypeId',
        to: 'titresTypes.id'
      }
    },
    titreStatut: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres-statuts'),
      join: {
        from: 'titresTypes__titresStatuts.titreStatutId',
        to: 'titresStatuts.id'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy([{ column: 'titreTypeId' }, { column: 'titreStatutId' }])
    }
  }
}

export default TitresTypesTitresStatuts
