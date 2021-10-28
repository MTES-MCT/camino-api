import { Model } from 'objection'

import { IJournaux } from '../../types'
import { idGenerate } from './_format/id-create'
import { join } from 'path'

interface Journaux extends IJournaux {}

class Journaux extends Model {
  public static tableName = 'journaux'

  public static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string' },
      utilisateurId: { type: 'string' },
      date: { type: 'date' },
      elementId: { type: 'string' },
      titreId: { type: 'string' },
      operation: { enum: ['create', 'update', 'delete'] },
      differences: { type: 'json' }
    }
  }

  public static relationMappings = {
    utilisateur: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'utilisateurs'),
      join: {
        from: 'journaux.utilisateurId',
        to: 'utilisateurs.id'
      }
    },
    titre: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres'),
      join: {
        from: 'journaux.titreId',
        to: 'titres.id'
      }
    }
  }

  async $beforeInsert(queryContext: any) {
    await super.$beforeInsert(queryContext)

    this.id = idGenerate()
    this.date = new Date()
  }
}

export default Journaux
