import { Model } from 'objection'

import { IEntrepriseTitreType } from '../../types'

interface EntreprisesTitresTypes extends IEntrepriseTitreType {}

class EntreprisesTitresTypes extends Model {
  public static tableName = 'entreprises__titresTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['titreTypeId', 'entrepriseId'],

    properties: {
      entrepriseId: { type: 'string', maxLength: 64 },
      titreTypeId: { type: 'string', maxLength: 3 },
      titresCreation: { type: 'boolean' }
    }
  }

  public static idColumn = ['entrepriseId', 'titreTypeId']
}

export default EntreprisesTitresTypes
