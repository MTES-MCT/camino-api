import { Model } from 'objection'
import EntreprisesEtablissements from './entreprises-etablissements'

export default class Entreprises extends Model {
  static tableName = 'entreprises'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 64 },
      nom: { type: 'string' },
      paysId: { type: ['string', 'null'] },
      legalSiren: { type: ['string', 'null'] },
      legalEtranger: { type: ['string', 'null'] },
      legalForme: { type: ['string', 'null'] },
      categorie: { type: ['string', 'null'] },
      dateCreation: { type: 'date' },
      adresse: { type: ['string', 'null'] },
      codePostal: { type: ['string', 'null'] },
      commune: { type: ['string', 'null'] },
      cedex: { type: ['string', 'null'] },
      email: { type: ['string', 'null'] },
      telephone: { type: ['string', 'null'] },
      url: { type: ['string', 'null'] }
    }
  }

  static relationMappings = {
    utilisateurs: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/utilisateurs`,
      join: {
        from: 'entreprises.id',
        to: 'utilisateurs.entrepriseId'
      }
    },

    etablissements: {
      relation: Model.HasManyRelation,
      modelClass: EntreprisesEtablissements,
      join: {
        from: 'entreprises.id',
        to: 'entreprisesEtablissements.entrepriseId'
      }
    }
  }

  $parseJson(json) {
    json = super.$parseJson(json)
    if (json.id) {
      json.id = json.id.toLowerCase()
    }
    return json
  }
}
