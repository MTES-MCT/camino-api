import { Model, Modifiers } from 'objection'
import SubstancesLegales from './substances-legales'

export default class Substances extends Model {
  public static tableName = 'substances'

  public static jsonSchema = {
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

  public static relationMappings = {
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

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }

  public id!: string
  public nom?: string
  public symbole?: string
  public gerep?: number
  public description?: string
  public substanceLegaleId!: string
}
