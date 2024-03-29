import { Model, Pojo } from 'objection'

import { IUtilisateur } from '../../types'
import Permissions from './permissions'
import Entreprises from './entreprises'
import Administrations from './administrations'

interface Utilisateurs extends IUtilisateur {}

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
      preferences: { type: ['object', 'null'] },
      refreshToken: { type: ['string', 'null'] },
      newsletter: { type: ['boolean', 'null'] }
    }
  }

  static relationMappings = () => ({
    permission: {
      relation: Model.BelongsToOneRelation,
      modelClass: Permissions,
      join: {
        from: 'utilisateurs.permissionId',
        to: 'permissions.id'
      }
    },

    entreprises: {
      relation: Model.ManyToManyRelation,
      modelClass: Entreprises,
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
      modelClass: Administrations,
      join: {
        from: 'utilisateurs.id',
        through: {
          from: 'utilisateurs__administrations.utilisateurId',
          to: 'utilisateurs__administrations.administrationId'
        },
        to: 'administrations.id'
      }
    }
  })

  public $parseJson(json: Pojo) {
    delete json.modification
    delete json.suppression
    delete json.permissionModification
    delete json.entreprisesCreation
    delete json.utilisateursCreation

    json = super.$parseJson(json)

    return json
  }

  public $formatDatabaseJson(json: Pojo) {
    delete json.modification
    delete json.suppression
    delete json.permissionModification
    delete json.entreprisesCreation
    delete json.utilisateursCreation

    json = super.$formatDatabaseJson(json)

    return json
  }
}
export default Utilisateurs
