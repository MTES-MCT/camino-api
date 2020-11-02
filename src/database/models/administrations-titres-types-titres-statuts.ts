import { join } from 'path'
import { Model, Modifiers } from 'objection'

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

  public static relationMappings = {
    titreType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres-types'),
      join: {
        from: 'administrations__titresTypes__titresStatuts.titreTypeId',
        to: 'titresTypes.id'
      }
    },

    titreStatut: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres-statuts'),
      join: {
        from: 'administrations__titresTypes__titresStatuts.titreStatutId',
        to: 'titresStatuts.id'
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
        .joinRelated('titreStatut')
        .orderBy('titreStatut.nom')
    }
  }
}

export default AdministrationsTitresTypesTitresStatuts
