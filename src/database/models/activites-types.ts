import { Model } from 'objection'
import Administrations from './administrations'
import Frequences from './frequences'
import Pays from './pays'
import Types from './types'

interface IActivitesTypesSectionsElement {
  id: string
  nom: string
  type: string
  description?: string
  // TODO: pour type, utiliser un enum
  dateDebut?: string
  dateFin?: string
}

interface IActivitesTypesSection {
  id: string
  nom: string
  elements: IActivitesTypesSectionsElement[]
}

export default class ActivitesTypes extends Model {
  public static tableName = 'activitesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'sections', 'frequenceId'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      sections: { type: 'json' },
      frequenceId: { type: 'string', maxLength: 3 }
    }
  }

  public static relationMappings = {
    types: {
      relation: Model.ManyToManyRelation,
      modelClass: Types,
      join: {
        from: 'activitesTypes.id',
        through: {
          from: 'activitesTypes__types.activiteTypeId',
          to: 'activitesTypes__types.typeId',
          extra: ['domaineId']
        },
        to: 'types.id'
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
          from: 'activitesTypes__administrations.activiteTypeId',
          to: 'activitesTypes__administrations.administrationId'
        },
        to: 'administrations.id'
      }
    }
  }

  public id!: string
  public nom!: string
  public frequenceId!: string
  public sections!: IActivitesTypesSection[]
  public types?: Types[]
  public pays?: Pays[]
  public frequence!: Frequences
  public administrations?: Administrations
}
