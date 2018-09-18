const { Model } = require('objection')
const PhasesStatuts = require('./phases-statuts')

class TitresPhases extends Model {
  static get tableName() {
    return 'titresPhases'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['titreDemarcheId', 'phaseStatutId'],

      properties: {
        titreDemarcheId: { type: 'string', maxLength: 128 },
        phaseStatutId: { type: 'string', maxLength: 3 },
        dateDebut: { type: 'date' },
        dateFin: { type: 'date' }
      }
    }
  }

  static get relationMappings() {
    return {
      statut: {
        relation: Model.BelongsToOneRelation,
        modelClass: PhasesStatuts,
        join: {
          from: 'titresPhases.phaseStatutId',
          to: 'phasesStatuts.id'
        }
      }
    }
  }

  static get idColumn() {
    return 'titreDemarcheId'
  }
}

module.exports = TitresPhases
