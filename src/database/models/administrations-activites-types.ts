import { Model } from 'objection'

import { IAdministrationActiviteType } from '../../types'

interface AdministrationsActivitesTypes extends IAdministrationActiviteType {}

class AdministrationsActivitesTypes extends Model {
  public static tableName = 'administrations__activitesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['activiteTypeId', 'administrationId'],

    properties: {
      administrationId: { type: 'string', maxLength: 64 },
      activiteTypeId: { type: 'string', maxLength: 3 },
      lectureInterdit: { type: 'boolean' },
      modificationInterdit: { type: 'boolean' }
    }
  }

  public static idColumn = ['administrationId', 'ActiviteTypeId']
}

export default AdministrationsActivitesTypes
