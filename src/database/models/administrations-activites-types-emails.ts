import { Model } from 'objection'

import { IAdministrationActiviteTypeEmail } from '../../types'

interface AdministrationsActivitesTypesEmails
  extends IAdministrationActiviteTypeEmail {}

class AdministrationsActivitesTypesEmails extends Model {
  public static tableName = 'administrations__activitesTypes__emails'

  public static jsonSchema = {
    type: 'object',
    required: ['activiteTypeId', 'administrationId'],

    properties: {
      administrationId: { type: 'string', maxLength: 64 },
      activiteTypeId: { type: 'string', maxLength: 3 },
      email: { type: 'string' }
    }
  }

  public static idColumn = ['administrationId', 'activiteTypeId']
}

export default AdministrationsActivitesTypesEmails
