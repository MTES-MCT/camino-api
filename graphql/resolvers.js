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
    titreAjouter: (parent, { id, nom }) =>
      new Promise((resolve, reject) => {
        const t = new TitlesModel({ id, nom })
        t.save((err, t) => {
          if (err) reject(err)
          else resolve(t)
        })
      }),
    titreModifier: (parent, { id, nom }) =>
      new Promise((resolve, reject) => {
        TitlesModel.findByIdAndUpdate(
          id,
          { $set: { nom } },
          { new: true },
          (err, t) => {
            if (err) reject(err)
            else resolve(t)
          }
        )
      })
  }
}

module.exports = resolvers
