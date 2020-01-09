import { Model } from 'objection'

export default class Statuts extends Model {
  public static tableName = 'statuts'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'couleur'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      couleur: { type: 'string', maxLength: 8 }
    }
  }

  public id!: string
  public nom!: string
  public couleur!: string
}
