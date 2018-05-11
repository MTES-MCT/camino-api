const TitlesModel = require('../mongoose/models/titles')

const resolvers = {
  Query: {
    titre(root, { id }) {
      return TitlesModel.findById(id, (err, t) => {
        if (err) throw err
        return t
      })
    },

    titres(root, { type, domaine }) {
      return TitlesModel.find({
        type: { $in: type },
        domaine: { $in: domaine }
      })
    }
  },

  Mutation: {
    titreAjouter(parent, { titre }) {
      const t = new TitlesModel(titre)
      return t.save().then(t => t, err => err)
    },

    titreSupprimer(parent, { id }) {
      return TitlesModel.findByIdAndRemove(id, {}, (err, t) => {
        if (err) throw err
        return t
      })
    },

    titreModifier(parent, { titre }) {
      return TitlesModel.findByIdAndUpdate(
        titre.id,
        { $set: titre },
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
