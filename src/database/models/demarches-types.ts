import { Model, Modifiers } from 'objection'
import { join } from 'path'

import { IDemarchesTypes } from '../../types'

interface DemarchesTypes extends IDemarchesTypes {}

class DemarchesTypes extends Model {
  public static tableName = 'demarchesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      ordre: { type: ['integer', 'null'] },
      duree: { type: ['boolean', 'null'] },
      points: { type: ['boolean', 'null'] },
      substances: { type: ['boolean', 'null'] },
      titulaires: { type: ['boolean', 'null'] },
      renouvelable: { type: ['boolean', 'null'] },
      exception: { type: ['boolean', 'null'] }
    }
  }

  public static relationMappings = {
    etapesTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'etapes-types'),
      join: {
        from: 'demarchesTypes.id',
        through: {
          from: 'demarchesTypes__etapesTypes.demarcheTypeId',
          to: 'demarchesTypes__etapesTypes.etapeTypeId',
          extra: ['ordre', 'typeId']
        },
        to: 'etapesTypes.id'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }
}

export default DemarchesTypes
