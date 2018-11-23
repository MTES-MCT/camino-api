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
        nom: { type: ['string', 'null'] },
        raisonSociale: { type: ['string', 'null'] },
        paysId: { type: ['string', 'null'] },
        legalSiren: { type: ['string', 'null'] },
        legalEtranger: { type: ['string', 'null'] },
        legalForme: { type: ['string', 'null'] },
        voieNumero: { type: ['string', 'null'] },
        voieType: { type: ['string', 'null'] },
        voieNom: { type: ['string', 'null'] },
        adresseComplement: { type: ['string', 'null'] },
        codePostal: { type: ['integer', 'null'] },
        ville: { type: ['string', 'null'] },
        cedex: { type: ['integer', 'null'] },
        email: { type: ['string', 'null'] },
        telephone: { type: ['string', 'null'] },
        url: { type: ['string', 'null'] }
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
          to: 'utilisateurs.entrepriseId'
        }
      }
    }
  }
}

module.exports = Entreprises
