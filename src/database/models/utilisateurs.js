import { Model } from 'objection'
import Permissions from './permissions'
import { join } from 'path'

export default class Utilisateurs extends Model {
  static tableName = 'utilisateurs'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'email', 'motDePasse'],

    properties: {
      id: { type: 'string', minLength: 1, maxLength: 64 },
      email: { type: ['string', 'null'] },
      motDePasse: { type: 'string', minLength: 8, maxLength: 255 },
      nom: { type: ['string', 'null'] },
      prenom: { type: ['string', 'null'] },
      telephone_fixe: { type: ['string', 'null'] },
      telephone_mobile: { type: ['string', 'null'] },
      permissionId: { type: ['string', 'null'], maxLength: 12 },
      preferences: { type: ['json', 'null'] }
    }
  }

  static relationMappings = {
    permission: {
      relation: Model.BelongsToOneRelation,
      modelClass: Permissions,
      join: {
        from: 'utilisateurs.permissionId',
        to: 'permissions.id'
      }
      // modify: builder => builder.select('id')
    },

    entreprises: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'entreprises'),
      join: {
        from: 'utilisateurs.id',
        through: {
          from: 'utilisateurs__entreprises.utilisateurId',
          to: 'utilisateurs__entreprises.entrepriseId'
        },
        to: 'entreprises.id'
      }
    },

    administrations: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'administrations'),
      join: {
        from: 'utilisateurs.id',
        through: {
          from: 'utilisateurs__administrations.utilisateurId',
          to: 'utilisateurs__administrations.administrationId'
        },
        to: 'administrations.id'
      }
    }
  }

  $parseJson(json) {
    json = super.$parseJson(json)

    if (json.entreprisesIds) {
      json.entreprises = json.entreprisesIds.map(id => ({ id }))
      delete json.entreprisesIds
    }

    if (json.administrationsIds) {
      json.administrations = json.administrationsIds.map(id => ({ id }))
      delete json.administrationsIds
    }

    return json
  }
}
