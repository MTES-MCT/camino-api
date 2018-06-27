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
      required: ['id', 'nom', 'domaine_id', 'type_id', 'statut_id'],
      properties: {
        id: { type: 'string' },
        nom: { type: 'string' },
        domaine_id: { type: 'string', maxLength: 1 },
        type_id: { type: 'string', maxLength: 3 },
        statut_id: { type: 'string', maxLength: 3 }
      }
    }
  }

  static get relationMappings() {
    return {
      domaine: {
        relation: Model.BelongsToOneRelation,
        modelClass: Domaines,
        join: {
          from: 'titres.domaine_id',
          to: 'domaines.id'
        }
      },
      type: {
        relation: Model.BelongsToOneRelation,
        modelClass: Types,
        join: {
          from: 'titres.type_id',
          to: 'types.id'
        }
      },
      statut: {
        relation: Model.BelongsToOneRelation,
        modelClass: Statuts,
        join: {
          from: 'titres.statut_id',
          to: 'statuts.id'
        }
      },
      demarches: {
        relation: Model.HasManyRelation,
        modelClass: TitresDemarches,
        join: {
          from: 'titres.id',
          to: 'titres_demarches.titre_id'
        }
      }
    }
  }
}

module.exports = Titres
