import { Model } from 'objection'
import { join } from 'path'

export default class Administrations extends Model {
  static tableName = 'administrations'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 64 },
      administrationTypeId: { type: 'string' },
      nom: { type: 'string' },
      service: { type: 'string' },
      site: { type: 'string' },
      email: { type: ['string', 'null'] },
      telephone: { type: 'string' },
      adresse1: { type: 'string' },
      adresse2: { type: ['string', 'null'] },
      codePostal: { type: 'integer' },
      commune: { type: 'string' },
      cedex: { type: 'integer' },
      departementId: { type: 'string' }
    }
  }

  static relationMappings = {
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
