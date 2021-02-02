import { Model, Modifiers } from 'objection'
import { join } from 'path'
import { ITitreType } from '../../types'
import TitresTypesTitresStatuts from './titres-types--titres-statuts'

interface TitresTypes extends ITitreType {}

class TitresTypes extends Model {
  public static tableName = 'titresTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'typeId', 'domaineId'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      typeId: { type: 'string', maxLength: 3 },
      domaineId: { type: 'string', maxLength: 3 },
      archive: { type: ['boolean', 'null'] },
      contenuIds: { type: 'json' }
    }
  }

  public static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres-types-types'),
      join: {
        from: 'titresTypes.typeId',
        to: 'titresTypesTypes.id'
      }
    },

    domaine: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'domaines'),
      join: {
        from: 'titresTypes.domaineId',
        to: 'domaines.id'
      }
    },

    demarchesTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'demarches-types'),
      join: {
        from: 'titresTypes.id',
        through: {
          from: 'titresTypes__demarchesTypes.titreTypeId',
          to: 'titresTypes__demarchesTypes.demarcheTypeId',
          extra: [
            'dureeMax',
            'acceptationImplicite',
            'delaiImplicite',
            'delaiRecours',
            'legalRef',
            'legalLien',
            'dateDebut',
            'dateFin'
          ]
        },
        to: 'demarchesTypes.id'
      }
    },

    autorisationsTitresStatuts: {
      relation: Model.HasManyRelation,
      modelClass: TitresTypesTitresStatuts,
      join: {
        from: 'titresTypes.id',
        to: 'titresTypes__titresStatuts.titreTypeId'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.joinRelated('type').orderBy('type.ordre', 'asc')
    }
  }
}

export default TitresTypes
