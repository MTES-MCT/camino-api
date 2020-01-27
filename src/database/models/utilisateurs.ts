import { Model, Pojo } from 'objection'
import { join } from 'path'
import { IUtilisateurs } from '../../types'

interface Utilisateurs extends IUtilisateurs {}

class Utilisateurs extends Model {
  public static tableName = 'utilisateurs'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'email', 'motDePasse', 'permissionId'],

    properties: {
      id: { type: 'string', minLength: 1, maxLength: 64 },
      email: { type: ['string', 'null'] },
      motDePasse: {
        type: 'string',
        minLength: 8,
        maxLength: 255
      },
      nom: { type: ['string', 'null'] },
      prenom: { type: ['string', 'null'] },
      telephoneFixe: { type: ['string', 'null'] },
      telephoneMobile: { type: ['string', 'null'] },
      permissionId: { type: 'string', maxLength: 12 },
      preferences: { type: ['json', 'null'] }
    }
  }

  public static relationMappings = {
    permission: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'permissions'),
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

  public $parseJson(json: Pojo) {
    json = super.$parseJson(json)

    if (json.entreprisesIds) {
      json.entreprises = json.entreprisesIds.map((id: string) => ({ id }))

      delete json.entreprisesIds
    }

    if (json.administrationsIds) {
      json.administrations = json.administrationsIds.map((id: string) => ({
        id
      }))

      delete json.administrationsIds
    }

    return json
  }
}
export default Utilisateurs

export { IUtilisateurs }
