import { Model } from 'objection'

import { IAdministrationTitreType } from '../../types'

interface AdministrationsTitresTypes extends IAdministrationTitreType {}

class AdministrationsTitresTypes extends Model {
  public static tableName = 'administrations__titresTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['titreTypeId', 'administrationId'],

    properties: {
      administrationId: { type: 'string', maxLength: 64 },
      titreTypeId: { type: 'string', maxLength: 3 },
      gestionnaire: { type: 'boolean' },
      associee: { type: 'boolean' }
    }
  }

  public static idColumn = ['administrationId', 'titreTypeId']
}

export default AdministrationsTitresTypes
