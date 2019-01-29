const titreTravauxRapports = require('../models/titres-travaux-rapports')

const queries = {
  async titresTravauxRapportGet(id) {
    return titreTravauxRapports.query().findById(id)
  },

  async titresTravauxRapportsGet() {
    return titreTravauxRapports.query().skipUndefined()
  },

  async titreTravauxRapportUpdate({ titreTravauxRapport }) {
    return titreTravauxRapports
      .query()
      .upsertGraph(titreTravauxRapport, { insertMissing: true })
      .first()
  }
}

module.exports = queries
