import { Model, Modifiers } from 'objection'
import { join } from 'path'

import { ITravauxEtapeType } from '../../types'

interface TravauxEtapesTypes extends ITravauxEtapeType {}

class TravauxEtapesTypes extends Model {
  public static tableName = 'travauxEtapesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: ['string'], maxLength: 128 },
      description: { type: ['string', 'null'] },
      ordre: { type: 'integer' }
    }
  }

  public static relationMappings = {
    etapesStatuts: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'etapes-statuts'),
      join: {
        from: 'travauxEtapesTypes.id',
        through: {
          from: 'travauxEtapesTypes__etapesStatuts.travauxEtapeTypeId',
          to: 'travauxEtapesTypes__etapesStatuts.etapeStatutId',
          extra: ['ordre']
        },
        to: 'etapesStatuts.id'
      }
    },

    documentsTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'documents-types'),
      join: {
        from: 'travauxEtapesTypes.id',
        through: {
          from: 'travauxEtapesTypes__documentsTypes.travauxEtapeTypeId',
          to: 'travauxEtapesTypes__documentsTypes.documentTypeId',
          extra: ['optionnel']
        },
        to: 'documentsTypes.id'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('travauxEtapesTypes.ordre', 'asc')
    }
  }
}

export default TravauxEtapesTypes
