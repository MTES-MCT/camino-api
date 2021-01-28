import { Model, Modifiers } from 'objection'
import { join } from 'path'
import { IActiviteType } from '../../types'

interface ActivitesTypes extends IActiviteType {}

class ActivitesTypes extends Model {
  public static tableName = 'activitesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'sections', 'frequenceId'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      sections: { type: 'json' },
      frequenceId: { type: 'string', maxLength: 3 },
      dateDebut: { type: 'string' },
      delaiMois: { type: 'integer' },
      satisfactionUrl: { type: 'string' },
      ordre: { type: 'integer' }
    }
  }

  public static relationMappings = {
    titresTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'titres-types'),
      join: {
        from: 'activitesTypes.id',
        through: {
          from: 'titresTypes__activitesTypes.activiteTypeId',
          to: 'titresTypes__activitesTypes.titreTypeId'
        },
        to: 'titresTypes.id'
      }
    },

    pays: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'pays'),
      join: {
        from: 'activitesTypes.id',
        through: {
          from: 'activitesTypes__pays.activiteTypeId',
          to: 'activitesTypes__pays.paysId'
        },
        to: 'pays.id'
      }
    },

    frequence: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'frequences'),
      join: {
        from: 'activitesTypes.frequenceId',
        to: 'frequences.id'
      }
    },

    administrations: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'administrations'),
      join: {
        from: 'activitesTypes.id',
        through: {
          from: 'activitesTypes__administrations.activiteTypeId',
          to: 'activitesTypes__administrations.administrationId',
          extra: ['modification']
        },
        to: 'administrations.id'
      }
    },

    documentsTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'documents-types'),
      join: {
        from: 'activitesTypes.id',
        through: {
          from: 'activitesTypes__documentsTypes.activiteTypeId',
          to: 'activitesTypes__documentsTypes.documentTypeId',
          extra: ['optionnel']
        },
        to: 'documentsTypes.id'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('activitesTypes.ordre', 'asc')
    }
  }
}

export default ActivitesTypes
