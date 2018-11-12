const titreTravauxRapports = require('../models/titres-travaux-rapports')

const queries = {
  async titresTravauxRapportsGet() {
    return titreTravauxRapports.query().skipUndefined()
  },

  async titreTravauxRapportAdd({ titreTravauxRapport }) {
    return titreTravauxRapports
      .query()
      .insertGraph(titreTravauxRapport, { insertMissing: true })
      .first()
  }
}

module.exports = queries
