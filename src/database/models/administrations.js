import { Model } from 'objection'
import { join } from 'path'
import AdministrationsTypes from './administrations-types'
import Domaines from './domaines'

export default class Administrations extends Model {
  static tableName = 'administrations'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'administrationTypeId'],

    properties: {
      id: { type: 'string', maxLength: 64 },
      administrationTypeId: { type: 'string' },
      nom: { type: 'string' },
      service: { type: ['string', 'null'] },
      site: { type: ['string', 'null'] },
      email: { type: ['string', 'null'] },
      telephone: { type: ['string', 'null'] },
      adresse1: { type: ['string', 'null'] },
      adresse2: { type: ['string', 'null'] },
      codePostal: { type: ['string', 'null'] },
      commune: { type: ['string', 'null'] },
      cedex: { type: ['string', 'null'] },
      departementId: { type: ['string', 'null'] }
    }
  }

  static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: AdministrationsTypes,
      join: {
        from: 'administrations.typeId',
        to: 'administrationsTypes.id'
      }
    },

    domaines: {
      relation: Model.ManyToManyRelation,
      modelClass: Domaines,
      join: {
        from: 'administrations.id',
        through: {
          from: 'administrations__domaines.administrationId',
          to: 'administrations__domaines.domaineId'
        },
        to: 'domaines.id'
      }
    },

    // Utilisateurs est requis par Administrations
    // Administrations est requis par Utilisateurs
    // ce qui provoque une require loop
    // solutions to require loops http://vincit.github.io/objection.js/#relations
    utilisateurs: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'utilisateurs'),
      join: {
        from: 'administrations.id',
        to: 'utilisateurs.administrationId'
      }
    }
  }
}
