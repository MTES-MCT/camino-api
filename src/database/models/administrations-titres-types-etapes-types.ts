import { Model } from 'objection'

import { IAdministrationTitreTypeEtapeType } from '../../types'

interface AdministrationsTitresTypesEtapesTypes
  extends IAdministrationTitreTypeEtapeType {}

class AdministrationsTitresTypesEtapesTypes extends Model {
  public static tableName = 'administrations__titresTypes__etapesTypes'

  public static jsonSchema = {
    type: 'object',
    required: [
      'administrationId',
      'titreTypeId',
      'etapeTypeId',
      'lectureInterdit',
      'creationInterdit',
      'modificationInterdit'
    ],

    properties: {
      administrationId: { type: 'string', maxLength: 64 },
      titreTypeId: { type: 'string', maxLength: 3 },
      etapeTypeId: { type: 'string', maxLength: 3 },
      lectureInterdit: { type: 'boolean' },
      creationInterdit: { type: 'boolean' },
      modificationInterdit: { type: 'boolean' }
    }
  }

  public static idColumn = ['administrationId', 'titreTypeId', 'etapeTypeId']
}

export default AdministrationsTitresTypesEtapesTypes
