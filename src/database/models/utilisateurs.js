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
      email: { type: 'string' },
      motDePasse: { type: 'string', minLength: 8, maxLength: 255 },
      nom: { type: ['string', 'null'] },
      prenom: { type: ['string', 'null'] },
      telephone_fixe: { type: ['string', 'null'] },
      telephone_mobile: { type: ['string', 'null'] },
      entrepriseId: { type: ['string', 'null'], maxLength: 64 },
      administrationId: { type: ['string', 'null'], maxLength: 64 },
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
    administration: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'administrations'),
      join: {
        from: 'utilisateurs.administrationId',
        to: 'administrations.id'
      }
    },
    entreprise: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'entreprises'),
      join: {
        from: 'utilisateurs.entrepriseId',
        to: 'entreprises.id'
      }
    }
  }
}
