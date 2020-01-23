import { Model } from 'objection'

export default class Globales extends Model {
  public static tableName = 'globales'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'valeur'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      valeur: { type: 'boolean' }
    }
  }

  public id!: string
  public valeur!: boolean
}
