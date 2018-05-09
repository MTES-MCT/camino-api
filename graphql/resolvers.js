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
    titreAjouter(parent, { titre }) {
      const t = new TitlesModel(titre)
      return t.save().then(t => t, err => err)
    },
    titreModifier(parent, { titre }) {
      return TitlesModel.findByIdAndUpdate(
        titre.id,
        { $set: { nom: titre.nom } },
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
