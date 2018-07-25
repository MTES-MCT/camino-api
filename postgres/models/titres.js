const { Model } = require('objection')
const Domaines = require('./domaines')
const Types = require('./types')
const Statuts = require('./statuts')
const TitresDemarches = require('./titres-demarches')

class Titres extends Model {
  static get tableName() {
    return 'titres'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom', 'domaineId', 'typeId', 'statutId'],
      properties: {
        id: { type: 'string' },
        nom: { type: 'string' },
        domaineId: { type: 'string', maxLength: 1 },
        typeId: { type: 'string', maxLength: 3 },
        statutId: { type: 'string', maxLength: 3 },
        references: { type: 'json' }
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
          to: 'domaines.id'
        }
      },
      type: {
        relation: Model.BelongsToOneRelation,
        modelClass: Types,
        join: {
          from: 'titres.typeId',
          to: 'types.id'
        }
      },
      statut: {
        relation: Model.BelongsToOneRelation,
        modelClass: Statuts,
        join: {
          from: 'titres.statutId',
          to: 'statuts.id'
        }
      },
      demarches: {
        relation: Model.HasManyRelation,
        modelClass: TitresDemarches,
        join: {
          from: 'titres.id',
          to: 'titresDemarches.titreId'
        }
      }
    }
  }
}

module.exports = Titres
