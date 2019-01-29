const { Model } = require('objection')

const DemarchesTypes = require('./demarches-types')

class Types extends Model {
  static get tableName() {
    return 'types'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom'],

      properties: {
        id: { type: 'string', maxLength: 3 },
        nom: { type: 'string' }
      }
    }
  }

  static get relationMappings() {
    return {
      types: {
        relation: Model.ManyToManyRelation,
        modelClass: DemarchesTypes,
        join: {
          from: 'types.id',
          through: {
            from: 'demarchesTypes__types.typeId',
            to: 'demarchesTypes__types.demarcheTypeId',
            extra: [
              'dureeMax',
              'acceptationImplicite',
              'delaiImplicite',
              'delaiRecours',
              'legalRef',
              'legalLien',
              'dateDebut',
              'dateFin'
            ]
          },
          to: 'demarchesTypes.id'
        }
      }
    }
  }
}

module.exports = Types
