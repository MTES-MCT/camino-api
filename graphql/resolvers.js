const TitlesModel = require('../database/models/titles')

const resolvers = {
  titre: ({ nom }) => TitlesModel.find({ nom }),
  titres: () => TitlesModel.find({}),
  titre_ajouter: ({ nom }) => {
    const t = new TitlesModel({ nom })
    return new Promise((resolve, reject) => {
      t.save((err, t) => {
        if (err) reject(err)
        else resolve(t)
      })
    })
  }
}

module.exports = resolvers
