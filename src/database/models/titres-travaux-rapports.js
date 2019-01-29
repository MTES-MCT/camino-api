const { Model } = require('objection')

class TitresTravauxRapports extends Model {
  static get tableName() {
    return 'titresTravauxRapports'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'titreId', 'date', 'contenu'],
      properties: {
        id: { type: 'string' },
        titreId: { type: 'string' },
        date: { type: 'date' },
        confirmation: { type: 'boolean' },
        contenu: { type: 'json' }
      }
    }
  }
}

module.exports = TitresTravauxRapports
