import { Model } from 'objection'

import { ILog } from '../../types'
import { idGenerate } from './_format/id-create'
import { join } from 'path'

interface Logs extends ILog {}

class Logs extends Model {
  public static tableName = 'logs'

  public static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string' },
      utilisateurId: { type: 'string' },
      date: { type: 'date' },
      elementId: { type: 'string' },
      operation: { enum: ['create', 'update', 'delete'] },
      differences: { type: 'json' }
    }
  }

  public static relationMappings = {
    utilisateur: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'utilisateurs'),
      join: {
        from: 'logs.utilisateurId',
        to: 'utilisateurs.id'
      }
    }
  }

  async $beforeInsert(queryContext: any) {
    await super.$beforeInsert(queryContext)

    this.id = idGenerate()
    this.date = new Date()
  }
}

export default Logs
