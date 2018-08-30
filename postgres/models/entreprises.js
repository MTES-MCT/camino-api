const { Model } = require('objection')
const Utilisateurs = require('./utilisateurs')

class Entreprises extends Model {
  static get tableName() {
    return 'entreprises'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom'],

      properties: {
        id: { type: 'string', maxLength: 64 },
        nom: { type: 'string' },
        raisonSociale: { type: 'string' },
        paysId: { type: 'string' },
        legalSiren: { type: 'string' },
        legalEtranger: { type: 'string' },
        legalForme: { type: 'string' },
        voieNumero: { type: 'string' },
        voieType: { type: 'string' },
        voieNom: { type: 'string' },
        adresseComplement: { type: 'string' },
        codePostal: { type: 'integer' },
        ville: { type: 'string' },
        cedex: { type: 'integer' },
        email: { type: 'string' },
        telephone: { type: 'string' },
        url: { type: 'string' }
      }
    }
  }

  static get relationMappings() {
    return {
      utilisateurs: {
        relation: Model.HasManyRelation,
        modelClass: Utilisateurs,
        join: {
          from: 'entreprises.id',
          to: 'utilisateurs.entreprise_id'
        }
      }
    }
  }
}

module.exports = Entreprises
