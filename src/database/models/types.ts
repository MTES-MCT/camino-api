import { Model, Modifiers } from 'objection'
import { join } from 'path'
import { ITypes } from '../../types'

interface Types extends ITypes {}

class Types extends Model {
  public static tableName = 'types'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      ordre: { type: 'integer' }
    }
  }

  public static relationMappings = {
    demarchesTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'demarches-types'),
      join: {
        from: 'types.id',
        through: {
          from: 'demarchesTypes__types.typeId',
          to: 'demarchesTypes__types.demarcheTypeId',
          extra: [
            'dureeMax',
            'acceptationImplicite',
            'delaiImplicite',
            'delaiRecours',
            'legalRef',
            'legalLien',
            'dateDebut',
            'dateFin'
          ]
        },
        to: 'demarchesTypes.id'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }
}

export default Types
