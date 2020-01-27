import { Model } from 'objection'
import { IActivitesStatuts } from '../../types'

interface ActivitesStatuts extends IActivitesStatuts {}

class ActivitesStatuts extends Model {
  public static tableName = 'activitesStatuts'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'couleur'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      couleur: { type: 'string', maxLength: 8 }
    }
  }
}

export default ActivitesStatuts
