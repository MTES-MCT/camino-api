import { Model } from 'objection'

import { IGlobales } from '../../types'

interface Globales extends IGlobales {}

class Globales extends Model {
  public static tableName = 'globales'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'valeur'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      valeur: { type: 'boolean' }
    }
  }
}

export default Globales
