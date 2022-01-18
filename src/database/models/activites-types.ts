import { Model, Modifiers } from 'objection'
import { IActiviteType } from '../../types'
import TitresTypes from './titres-types'
import Pays from './pays'
import Frequences from './frequences'
import Administrations from './administrations'
import DocumentsTypes from './documents-types'

interface ActivitesTypes extends IActiviteType {}

class ActivitesTypes extends Model {
  public static tableName = 'activitesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'sections', 'frequenceId'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      description: { type: ['string', 'null'] },
      sections: {},
      frequenceId: { type: 'string', maxLength: 3 },
      dateDebut: { type: 'string' },
      delaiMois: { type: 'integer' },
      satisfactionUrl: { type: 'string' },
      ordre: { type: 'integer' }
    }
  }

  static relationMappings = () => ({
    titresTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: TitresTypes,
      join: {
        from: 'activitesTypes.id',
        through: {
          from: 'activitesTypes__titresTypes.activiteTypeId',
          to: 'activitesTypes__titresTypes.titreTypeId'
        },
        to: 'titresTypes.id'
      }
    },

    pays: {
      relation: Model.ManyToManyRelation,
      modelClass: Pays,
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
      modelClass: Frequences,
      join: {
        from: 'activitesTypes.frequenceId',
        to: 'frequences.id'
      }
    },

    administrations: {
      relation: Model.ManyToManyRelation,
      modelClass: Administrations,
      join: {
        from: 'activitesTypes.id',
        through: {
          from: 'administrations__activitesTypes.activiteTypeId',
          to: 'administrations__activitesTypes.administrationId',
          extra: ['modificationInterdit', 'lectureInterdit']
        },
        to: 'administrations.id'
      }
    },

    administrationsEmails: {
      relation: Model.ManyToManyRelation,
      modelClass: Administrations,
      join: {
        from: 'activitesTypes.id',
        through: {
          from: 'administrations__activitesTypes__emails.activiteTypeId',
          to: 'administrations__activitesTypes__emails.administrationId',
          extra: ['email']
        },
        to: 'administrations.id'
      }
    },

    documentsTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: DocumentsTypes,
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
  })

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('activitesTypes.ordre', 'asc')
    }
  }
}

export default ActivitesTypes
