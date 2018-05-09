const TitlesModel = require('../mongoose/models/titles')

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
    titre_ajouter: (parent, { id }) => {
      const t = new TitlesModel({ _id: id })
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
