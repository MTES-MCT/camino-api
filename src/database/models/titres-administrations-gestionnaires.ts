import { Model } from 'objection'

import { ITitreAdministrationGestionnaire } from '../../types'

interface TitresAdministrationsGestionnaires
  extends ITitreAdministrationGestionnaire {}

class TitresAdministrationsGestionnaires extends Model {
  public static tableName = 'titresAdministrationsGestionnaires'

  public static jsonSchema = {
    type: 'object',
    required: ['titreId', 'administrationId'],

    properties: {
      administrationId: { type: 'string', maxLength: 64 },
      titreId: { type: 'string', maxLength: 128 },
      associee: { type: ['boolean', 'null'] }
    }
  }

  public static idColumn = ['administrationId', 'titreId']
}

export default TitresAdministrationsGestionnaires
