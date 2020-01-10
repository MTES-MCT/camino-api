import { Model } from 'objection'

export default class ReferencesTypes extends Model {
  public static tableName = 'referencesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxlength: 3 },
      nom: { type: 'string' }
    }
  }

  public id!: string
  public nom!: string
}
