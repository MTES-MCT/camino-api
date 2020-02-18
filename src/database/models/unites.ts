import { Model } from 'objection'
import { IUnite } from '../../types'

interface Unites extends IUnite {}

class Unites extends Model {
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
}

export default Unites
