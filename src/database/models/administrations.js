import { Model } from 'objection'
import { join } from 'path'

export default class Administrations extends Model {
  static tableName = 'administrations'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 64 },
      nom: { type: 'string' },
      service: { type: 'string' },
      site: { type: 'string' },
      email: { type: 'string' },
      telephone: { type: 'string' },
      adresse1: { type: 'string' },
      adresse2: { type: 'string' },
      code_postal: { type: 'integer' },
      ville: { type: 'string' },
      cedex: { type: 'integer' }
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
