const TitlesModel = require('../mongoose/models/titles')

const resolvers = {
  Query: {
    titre(parent, { id }) {
      return TitlesModel.findById(id, (err, t) => {
        if (err) throw err
        return t
      })
    },
    titres() {
      return TitlesModel.find({})
    }
  },

  Mutation: {
    titreAjouter(parent, { id, nom }) {
      const t = new TitlesModel({ id, nom })
      return t.save().then(t => t, err => err)
    },
    titreModifier(parent, { id, nom }) {
      return TitlesModel.findByIdAndUpdate(
        id,
        { $set: { nom } },
        { new: true },
        (err, t) => {
          if (err) throw err
          return t
        }
      )
    }
  }
}

module.exports = resolvers
