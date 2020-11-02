import { join } from 'path'
import { Model, Modifiers } from 'objection'

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

  public static relationMappings = {
    titreType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres-types'),
      join: {
        from: 'administrations__titresTypes__etapesTypes.titreTypeId',
        to: 'titresTypes.id'
      }
    },

    etapeType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'etapes-types'),
      join: {
        from: 'administrations__titresTypes__etapesTypes.etapeTypeId',
        to: 'etapesTypes.id'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder
        .joinRelated('titreType.domaine')
        .orderBy('titreType:domaine.id')
        .joinRelated('titreType.type')
        .orderBy('titreType:type.nom')
        .joinRelated('etapeType')
        .orderBy('etapeType.nom')
    }
  }
}

export default AdministrationsTitresTypesEtapesTypes
