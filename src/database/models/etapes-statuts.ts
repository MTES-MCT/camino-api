import { Model } from 'objection'

export default class EtapesStatuts extends Model {
  public static tableName = 'etapesStatuts'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'couleur'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: ['string', 'null'] },
      couleur: { type: ['string', 'null'], maxLength: 8 }
    }
  }

  public id!: string
  public nom!: string
  public couleur!: string
}
