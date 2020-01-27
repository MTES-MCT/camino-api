import { Model, Modifiers } from 'objection'
import { join } from 'path'

import { IEtapesTypes } from '../../types'

interface EtapesTypes extends IEtapesTypes {}

class EtapesTypes extends Model {
  public static tableName = 'etapesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: ['string', 'null'], maxLength: 128 },
      acceptationAuto: { type: ['boolean', 'null'] },
      fondamentale: { type: ['boolean', 'null'] },
      dateDebut: { type: ['date', 'null'] },
      dateFin: { type: ['date', 'null'] },
      sections: { type: 'json' }
    }
  }

  public static relationMappings = {
    etapesStatuts: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'etapes-statuts'),
      join: {
        from: 'etapesTypes.id',
        through: {
          from: 'etapesTypes__etapesStatuts.etapeTypeId',
          to: 'etapesTypes__etapesStatuts.etapeStatutId',
          extra: ['ordre']
        },
        to: 'etapesStatuts.id'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('etapesTypes.ordre', 'asc')
    }
  }
}

export default EtapesTypes
