import { Model, Modifiers } from 'objection'
import { IAdministrationTitreTypeTitreStatut } from '../../types'
import TitresTypes from './titres-types'
import TitresStatuts from './titres-statuts'

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

  static relationMappings = () => ({
    titreType: {
      relation: Model.BelongsToOneRelation,
      modelClass: TitresTypes,
      join: {
        from: 'administrations__titresTypes__titresStatuts.titreTypeId',
        to: 'titresTypes.id'
      }
    },

    titreStatut: {
      relation: Model.BelongsToOneRelation,
      modelClass: TitresStatuts,
      join: {
        from: 'administrations__titresTypes__titresStatuts.titreStatutId',
        to: 'titresStatuts.id'
      }
    }
  })

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
