import { Model } from 'objection'

import { IAdministrationTitreTypeTitreStatut } from '../../types'

interface AdministrationsTitresTypesTitresStatuts
  extends IAdministrationTitreTypeTitreStatut {}

class AdministrationsTitresTypesTitresStatuts extends Model {
  public static tableName = 'administrations__titresTypes__titresStatuts'

  public static jsonSchema = {
    type: 'object',
    required: [
      'administrationId',
      'titreTypeId',
      'titreStatutId',
      'titresModificationInterdit',
      'demarchesModificationInterdit',
      'etapesModificationInterdit'
    ],

    properties: {
      administrationId: { type: 'string', maxLength: 64 },
      titreTypeId: { type: 'string', maxLength: 3 },
      titreStatutId: { type: 'string', maxLength: 3 },
      titresModificationInterdit: { type: 'boolean' },
      demarchesModificationInterdit: { type: 'boolean' },
      etapesModificationInterdit: { type: 'boolean' }
    }
  }

  public static idColumn = ['administrationId', 'titreTypeId', 'titreStatutId']
}

export default AdministrationsTitresTypesTitresStatuts
