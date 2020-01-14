import { Model, Modifiers } from 'objection'

export default class Unites extends Model {
  public static tableName = 'unites'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'symbole'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      symbole: { type: 'string' }
    }
  }

  public id!: string
  public nom!: string
  public symbole!: string
}
