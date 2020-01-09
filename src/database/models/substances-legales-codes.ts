import { Model } from 'objection'

export default class SubstancesLegalesCodes extends Model {
  public static tableName = 'substancesLegalesCodes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'lien'],

    properties: {
      id: { type: 'string' },
      nom: { type: ['string', 'null'] },
      description: { type: ['string', 'null'] },
      lien: { type: ['string', 'null'] }
    }
  }

  public id!: string
  public nom!: string
  public description?: string
  public lien!: string
}
