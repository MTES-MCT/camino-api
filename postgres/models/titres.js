const { Model } = require('objection')
const Domaines = require('./titres-domaines')
const Types = require('./titres-types')
const Statuts = require('./titres-statuts')
const Travaux = require('./titres-travaux')

class Titres extends Model {
  static get tableName() {
    return 'titres'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom', 'domaineId', 'typeId', 'statutId', 'travauxId'],

      properties: {
        id: { type: 'string' },
        nom: { type: 'string' },
        domaineId: { type: 'string', maxLength: 1 },
        typeId: { type: 'string', maxLength: 3 },
        statutId: { type: 'string', maxLength: 3 },
        travauxId: { type: 'string', maxLength: 3 }
      }
    }
  }

  static get relationMappings() {
    return {
      domaine: {
        relation: Model.BelongsToOneRelation,
        modelClass: Domaines,
        join: {
          from: 'titres.domaineId',
          to: 'titres_domaines.id'
        }
      },
      type: {
        relation: Model.BelongsToOneRelation,
        modelClass: Types,
        join: {
          from: 'titres.typeId',
          to: 'titres_types.id'
        }
      },
      statut: {
        relation: Model.BelongsToOneRelation,
        modelClass: Statuts,
        join: {
          from: 'titres.statutId',
          to: 'titres_statuts.id'
        }
      },
      travaux: {
        relation: Model.BelongsToOneRelation,
        modelClass: Travaux,
        join: {
          from: 'titres.travauxId',
          to: 'titres_travaux.id'
        }
      },
      substances
    }
  }
}

module.exports = Titres
