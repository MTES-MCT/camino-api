const TitlesModel = require('../database/models/titles')

const resolvers = {
  Query: {
    titre({ nom }) {
      return TitlesModel.find({ nom })
    },
    titres() {
      return TitlesModel.find({})
    }
  },

  Mutation: {
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
}

module.exports = resolvers
