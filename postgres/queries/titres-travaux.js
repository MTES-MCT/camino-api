const titreTravauxRapports = require('../models/titres-travaux-rapports')

const queries = {
  async titreTravauxRapportAdd({ titreTravauxRapport }) {
    return titreTravauxRapports
      .query()
      .insertGraph(titreTravauxRapport, { insertMissing: true })
      .first()
  }
}

module.exports = queries
