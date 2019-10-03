import { Model } from 'objection'
import SubstancesLegales from './substances-legales'

export default class Substances extends Model {
  static tableName = 'substances'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'substanceLegaleId'],

    properties: {
      id: { type: 'string' },
      nom: { type: ['string', 'null'] },
      symbole: { type: ['string', 'null'] },
      gerep: { type: ['integer', 'null'] },
      description: { type: ['string', 'null'], maxLength: 2048 },
      substanceLegaleId: { type: 'string' }
    }
  }

  static relationMappings = {
    legales: {
      relation: Model.ManyToManyRelation,
      modelClass: SubstancesLegales,
      join: {
        from: 'substances.id',
        through: {
          from: 'substances__substancesLegales.substanceId',
          to: 'substances__substancesLegales.substanceLegaleId'
        },
        to: 'substancesLegales.id'
      }
    }
  }

  static modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }
}
