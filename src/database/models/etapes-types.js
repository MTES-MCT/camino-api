import { Model } from 'objection'
import EtapesStatuts from './etapes-statuts'

export default class EtapesTypes extends Model {
  static tableName = 'etapesTypes'

  static jsonSchema = {
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

  static relationMappings = {
    etapesStatuts: {
      relation: Model.ManyToManyRelation,
      modelClass: EtapesStatuts,
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

  static namedFilters = {
    orderDesc: builder => {
      builder.orderBy('ordre', 'desc')
    }
  }
}
