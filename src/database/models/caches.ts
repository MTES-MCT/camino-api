import { Model } from 'objection'

import { ICache } from '../../types'

interface Caches extends ICache {}

class Caches extends Model {
  public static tableName = 'caches'

  public static jsonSchema = {
    type: 'object',
    required: ['id'],

    properties: {
      id: { type: 'string', maxLength: 128 },
      valeur: { type: 'json' }
    }
  }

  public static relationMappings = {}
}

export { Caches }
